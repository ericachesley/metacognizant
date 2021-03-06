class CreateAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            selectedSections: new Set(),
            selectedPrompt: this.props.promptId,
            date: null,
            sections: [],
            prompts: [],
            newPrompt: false,
            loading: false,
            modal: true
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.convertDate = this.convertDate.bind(this);
    }

    componentDidMount() {
        if (sessionStorage.getItem('createAssignmentModal')) {
            this.setState({ modal: false })
        }
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
        this.state.selectedSections.add(this.props.sectionId);
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

    convertDate(date, region) {
        const year = Number(date.slice(0, 4));
        const month = Number(date.slice(5, 7));
        const day = Number(date.slice(8, 10));
        const dtLocal = luxon.DateTime.local(year, month, day, 23, 59, 59);
        if (region == 'local') {
            return dtLocal;
        }
        const dtUtc = dtLocal.toUTC();
        if (region == 'utc') {
            return dtUtc;
        }
    }

    handleSubmit(evt) {
        evt.preventDefault();
        var now = luxon.DateTime.local();
        const dtLocal = this.convertDate(this.state.date, 'local');

        if (this.state.selectedSections.size == 0 ||
            this.state.selectedPrompt == 'select-one' ||
            this.state.date == null) {
            alert('One or more fields is missing. Please try again.')
        } else if (dtLocal.year <= now.year && dtLocal.ordinal < now.ordinal) {
            alert('An assignment may not be created for a date that has already passed.');
        } else {
            this.setState({ loading: true })
            const formData = {
                'selectedSections': Array.from(this.state.selectedSections),
                'selectedPrompt': this.state.selectedPrompt,
                'date': this.convertDate(this.state.date, 'utc'),
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
                    this.props.toggle();
                })
        }
    }

    closeModal = () => {
        this.setState({ modal: false });
        sessionStorage.setItem('createAssignmentModal', 'seen')
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
                            value={section.section_id}
                            defaultChecked={
                                section.section_id == this.props.sectionId ?
                                    true :
                                    false}
                        >
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
            <div id='assign-prompt' className='modal'>

                {this.state.modal ?
                    <div className='modal targeted'>
                        <a href='#' onClick={this.closeModal}>X</a>
                        <div className='modal-content targeted shadow'>
                            When you create a new assignment you <br></br>
                                can choose from the list of suggested <br></br>
                                prompts, or you can create your own. <br></br>
                                Any prompt that you write yourself <br></br>
                                will be stored in your account and <br></br>
                                available for you to reuse in all <br></br>
                                future assignments.
                                <br></br><br></br>
                                If you have logged in with Google <br></br>
                                and your classes are set up on <br></br>
                                Google Classroom, then all new <br></br>
                                assignments will also show up <br></br>
                                under coursework in Google Classroom <br></br>
                                and be marked completed as students <br></br>
                                submit responses here.
                        </div>
                    </div> : null}

                <div className='modal-content'>
                    <form onSubmit={this.handleSubmit}>
                        <h2>Create new assignment</h2>
                        <p></p>
                        <div style={{ 'textAlign': 'left', 'marginLeft': '45%' }}>
                            <label>Section(s)</label>
                            {sectionOptions}
                        </div>
                        <p></p>
                        <div>
                            <label>Prompt </label><br></br>
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
                            <label>Due date </label><br></br>
                            <input onChange={this.handleFieldChange}
                                id='due-date'
                                name='date'
                                type='date'
                            />
                        </div><br></br>
                        <p>
                            {this.state.loading ? <Loader /> : <input type='submit' />}
                        </p>
                    </form>
                    <p><a href='#' onClick={this.props.toggle}>Cancel</a></p>
                </div>
            </div>
        )
    }
}