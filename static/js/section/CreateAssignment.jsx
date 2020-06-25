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
            //loading: false
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.convertDate = this.convertDate.bind(this);
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

    convertDate(date) {
        console.log(date);
        const year = Number(date.slice(0, 4));
        const month = Number(date.slice(5, 7));
        const day = Number(date.slice(8, 10));
        const dtLocal = luxon.DateTime.local(year, month, day, 23, 59, 59);
        console.log(dtLocal);
        const dtUtc = dtLocal.toUTC();
        console.log(dtUtc);
        return dtUtc
    }


    handleSubmit(evt) {
        evt.preventDefault();
        this.setState({ loading: true })
        const formData = {
            'selectedSections': Array.from(this.state.selectedSections),
            'selectedPrompt': this.state.selectedPrompt,
            'date': this.convertDate(this.state.date),
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
                this.props.toggle();
            })
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
            <div id='assign-prompt' style={{ border: '5px solid black', padding: '5px' }}>
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