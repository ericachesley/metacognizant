class AssignmentResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignmentId: this.props.getSlug(),
            prompt: '',
            prmoptId: null,
            due_date: null,
            responses: [],
            again: false,
            revisit: false,
            isRevisit: false,
            origDate: null,
        };
        this.toggleAssignAgain = this.toggleAssignAgain.bind(this);
        this.toggleAssignRevisit = this.toggleAssignRevisit.bind(this);
        this.adjustDate = this.adjustDate.bind(this);
    }

    componentDidMount() {
        fetch(`/api/get_responses?assignmentId=${this.state.assignmentId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    prompt: data[0],
                    promptId: data[1],
                    due_date: data[2],
                    isRevisit: data[3],
                    origDate: data[4],
                    responses: data[5]
                })
            })
    }

    toggleAssignAgain() {
        if (this.state.again) {
            this.setState({ again: false });
        } else {
            this.setState({ again: true });
        }
    }

    toggleAssignRevisit() {
        if (this.state.revisit) {
            this.setState({ revisit: false });
        } else {
            this.setState({ revisit: true });
        }
    }

    adjustDate(date) {
        const dt = luxon.DateTime.fromHTTP(date);
        return dt.toLocal()
            .toLocaleString(luxon.DateTime.DATE_HUGE);
    }

    render() {
        const sectionId = window.location.pathname.split('/')[2]
        return (
            <div id='assignment'>
                <Link to={`/classes/${sectionId}`}>Back to class overview</Link>
                <h1>{sessionStorage.getItem('sectionName')}</h1>
                {this.state.isRevisit ?
                <h2>Prompt revisit from {this.adjustDate(this.state.origDate)}</h2> :
                null}
                <h2>Prompt: {this.state.prompt}</h2>
                <h3>Due: {this.adjustDate(this.state.due_date)}</h3>
                <p>
                    {this.state.again ?
                        <CreateAssignment
                            promptId={this.state.promptId}
                            toggle={this.toggleAssignAgain}
                        /> :
                        <button onClick={this.toggleAssignAgain}>
                            Assign again
                        </button>}
                </p>
                <p>
                    {this.state.revisit ?
                        <CreateRevisitAssignment
                            assignmentId={this.state.assignmentId}
                            toggle={this.toggleAssignRevisit}
                        /> :
                        <button onClick={this.toggleAssignRevisit}>Assign revisit</button>
                    }
                </p>
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


class CreateRevisitAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.convertDate = this.convertDate.bind(this);
    }

    handleFieldChange(evt) {
        let fieldName = evt.target.name;
        this.setState({ [fieldName]: evt.target.value });
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
        if (this.state.date == null) {
            alert('Please provide a date for this revist assignment.')
        } else {
            this.setState({ loading: true })
            const formData = {
                'promptAssignment': this.props.assignmentId,
                'date': this.convertDate(this.state.date)
            }
            fetch('/api/assign_revisit', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify(formData)
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ loading: false });
                    alert('Revisit assignment submitted')
                    this.props.toggle();
                })
        }
    }

    render() {
        return (
            <div id='assign-prompt' style={{ border: '5px solid black', padding: '5px' }}>
                <form onSubmit={this.handleSubmit}>
                    <h2>Assign revisit.</h2>
                    <p></p>
                    <div>
                        <label>Choose a date on which to revisit this assignment: </label>
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
                <p><button onClick={this.props.toggle}>Cancel</button></p>
            </div>
        )
    }
}