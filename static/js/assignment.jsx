class AssignmentResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentId: this.props.getSlug(),
            prompt: '',
            due_date: null,
            responses: []
        };
    }

    componentDidMount() {
        fetch(`/api/get_responses?assignmentId=${this.state.assignmentId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    prompt: data[0],
                    due_date: data[1],
                    responses: data[2]
                })
            })
    }


    render() {
        const sectionId = window.location.pathname.split('/')[2]
        const date = this.state.due_date;
        const dt = luxon.DateTime.fromHTTP(date);
        const dtLocal = dt.toLocal()
            .toLocaleString(luxon.DateTime.DATE_HUGE);
        return (
            <div id='assignment'>
                <Link to={`/classes/${sectionId}`}>Back to class overview</Link>
                <h1>{sessionStorage.getItem('sectionName')}</h1>
                <h2>Prompt: {this.state.prompt}</h2>
                <h3>Due: {dtLocal}</h3>
                {sessionStorage.getItem('role') === 'teacher' ?
                    <ShowResponses responses={this.state.responses} /> :
                    <GetResponse
                        assignmentId={this.state.assignmentId}
                        sectionId={sectionId}
                    />
                }
            </div>
        )
    }
}


class StudentResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: this.props.getSlug(),
            sectionId: sessionStorage.getItem('sectionId'),
            responses: []
        };
    }

    componentDidMount() {
        fetch(`/api/get__student_responses?studentId=${this.state.studentId}&sectionId=${this.state.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ responses: data })
            })
    }


    render() {
        const sectionId = window.location.pathname.split('/')[2]
        const responses = [];
        for (const count in this.state.responses) {
            const date = this.state.responses[count].date;
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
                .toLocaleString(luxon.DateTime.DATETIME_SHORT);
            responses.push(
                <tr key={count}>
                    <td>{dtLocal}</td>
                    <td>{this.state.responses[count].prompt}</td>
                    <td>{this.state.responses[count].response}</td>
                </tr>
            )
        }

        return (
            <div id='assignment'>
                <Link to={`/classes/${sectionId}`}>Back to class overview</Link>
                <h1>{sessionStorage.getItem('sectionName')}</h1>
                <h2>Student: {sessionStorage.getItem('studentName')}</h2>
                <table id='response-table'>
                    <thead>
                        <tr>
                            <td><b>Date</b></td>
                            <td><b>Prompt</b></td>
                            <td><b>Response</b></td>
                        </tr>
                    </thead>
                    <tbody>{responses}</tbody>
                </table>
            </div>
        )
    }
}



class ShowResponses extends React.Component {
    render() {
        if (this.props.responses.length == 0) {
            return (
                <p>No responses yet.</p>
            )
        } else {
            const responses = [];
            for (const count in this.props.responses) {
                const date = this.props.responses[count].date;
                const dt = luxon.DateTime.fromHTTP(date);
                const dtLocal = dt.toLocal()
                    .toLocaleString(luxon.DateTime.DATETIME_SHORT);
                responses.push(
                    <tr key={count}>
                        <td>{this.props.responses[count].student}</td>
                        <td>{this.props.responses[count].content}</td>
                        <td>{date ? dtLocal : ''}</td>
                    </tr>
                )
            }
            return (
                <table id='response-table'>
                    <thead>
                        <tr>
                            <td><b>Student</b></td>
                            <td><b>Response</b></td>
                            <td><b>Submitted</b></td>
                        </tr>
                    </thead>
                    <tbody>{responses}</tbody>
                </table>
            )
        }
    }
}


class GetResponse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            date: null,
            done: false,
            submitted: false
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        fetch(`/api/check_response?assignmentId=${this.props.assignmentId}`, {
            credentials: 'same-origin'
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    const date = data.date;
                    const dt = luxon.DateTime.fromHTTP(date);
                    const dtLocal = dt.toLocal().toLocaleString(luxon.DateTime.DATETIME_SHORT);
                    this.setState({ response: data.response, date: dtLocal, done: true });
                }
            })
    }


    handleFieldChange(evt) {
        this.setState({ [evt.target.id]: evt.target.value });
    }


    handleSubmit(evt) {
        const date = luxon.DateTime.utc().toISO();
        const formData = {
            response: this.state.response,
            date: date,
            assignmentId: this.props.assignmentId
        }
        fetch('/api/submit_response', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData),
            credentials: "same-origin"
        })
            .then(res => res.json())
            .then(data => {
                alert('Response submitted')
            })
        this.setState({ submitted: true });
    }


    render() {
        if (this.state.submitted) {
            return (
                <Redirect to={`/classes/${this.props.sectionId}`} />
            )
        } else if (this.state.done) {
            return (
                <div>
                    <p>You already submitted a response to this prompt.</p>
                    <p>Response: {this.state.response}</p>
                    <p>Submitted: {this.state.date}</p>
                </div>
            )
        } else {
            return (
                <div>
                    <form onSubmit={this.handleSubmit} action={`/classes/${this.props.sectionId}`}>
                        <textarea
                            id='response'
                            name='response'
                            rows="15" cols="50"
                            placeholder="Your response"
                            value={this.state.response}
                            onChange={this.handleFieldChange}>
                        </textarea>
                        <p></p>
                        <input type='submit'></input>
                    </form>
                </div>
            )
        }
    }
}


class CreateAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSections: new Set(),
            selectedPrompt: 'select-one',
            date: null,
            sections: [],
            prompts: [],
            newPrompt: false,
            loading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
    }


    componentDidMount() {
        fetch('/api/get_sections', {
            credentials: 'same-origin'
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ sections: data })
            })
        fetch('/api/get_prompts', {
            credentials: 'same-origin'
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ prompts: data })
            })
    }


    handleFieldChange(evt) {
        let fieldName = evt.target.name;
        if (evt.target.type === "checkbox") {
            if (evt.target.checked) {
                this.state.selectedSections.add(evt.target.value);
            } else {
                this.state.selectedSections.delete(evt.target.value);
            }
        } else {
            this.setState({ [fieldName]: evt.target.value });
            if (evt.target.value === 'add-new') {
                this.setState({ newPrompt: true, selectedPrompt: '' })
            } else if (this.state.newPrompt) {
                if (evt.target.type === "select-one"
                    && evt.target.value != 'add-new') {
                    this.setState({ newPrompt: false });
                }
            }
        }
    }


    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({ loading: true });
        const formData = {
            'selectedSections': Array.from(this.state.selectedSections),
            'selectedPrompt': this.state.selectedPrompt,
            'date': this.state.date,
            'newPrompt': this.state.newPrompt
        }
        fetch('/api/assign_prompt', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ loading: false });
                alert('Prompt assignment submitted')
            })
        this.props.toggleAddAssignment();
    }


    render() {
        const sectionOptions = [];
        for (const section of this.state.sections) {
            if (section.role === 'teacher') {
                sectionOptions.push(
                    <div className='checkbox' key={section.section_id}>
                        <input onClick={this.handleFieldChange}
                            type='checkbox'
                            name='selectedSections'
                            value={section.section_id}>
                        </input>
                        <label>{section.name}</label>
                    </div>
                )
            }
        }

        const promptOptions = [];
        for (const prmpt of this.state.prompts) {
            promptOptions.push(
                <option
                    key={prmpt.prompt_id}
                    name='prompts'
                    value={prmpt.prompt_id}>
                    {prmpt.content}
                </option>
            )
        }
        const sectionId = window.location.pathname.split('/')[2]

        return (
            <div id='assign-prompt' style={{border:'5px solid black', padding:'5px'}}>
                <form onSubmit={this.handleSubmit}>
                    <h2>Create new assignment.</h2>
                    <p></p>
                    <div>
                        <label>Choose section(s) to assign prompt to: </label>
                        {sectionOptions}
                    </div>
                    <p></p>
                    <div>
                        <label>Choose prompt to assign: </label>
                        <select
                            name="selectedPrompt"
                            value={this.state.selectedPrompt}
                            onChange={this.handleFieldChange}>
                            <option name='prompts' value='select-one'>
                                --Select a prompt--
                            </option>
                            {promptOptions}
                            <option name='prompts' value='add-new'>
                                --Add a new prompt--
                            </option>
                        </select>
                    </div>
                    <div>
                        <p></p>
                        {this.state.newPrompt ?
                            <textarea
                                onChange={this.handleFieldChange}
                                name='selectedPrompt'
                                rows="10" cols="50"
                                placeholder='Your prompt'
                                value={this.state.selectedPrompt}>
                            </textarea> :
                            <span></span>}
                    </div>
                    <p></p>
                    <div>
                        <label>Choose due date: </label>
                        <input onChange={this.handleFieldChange}
                            id='due-date'
                            name='date'
                            type='date'
                        />
                    </div>
                    <p>
                        {this.state.loading ? <Loader /> : <input type='submit' />}
                    </p>
                </form>
            </div>
        )
    }
}