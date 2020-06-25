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
            revisit: false
        };
        this.toggleAssignAgain = this.toggleAssignAgain.bind(this);
        this.toggleAssignRevisit = this.toggleAssignRevisit.bind(this);
    }

    componentDidMount() {
        fetch(`/api/get_responses?assignmentId=${this.state.assignmentId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    prompt: data[0],
                    promptId: data[1],
                    due_date: data[2],
                    responses: data[3]
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

                {this.state.again ?
                <CreateAssignment 
                promptId={this.state.promptId}
                toggle={this.toggleAssignAgain}
                /> :
                <button onClick={this.toggleAssignAgain}>Assign again</button>}

                {/* <button>Assign revisit</button>
                <CreateRevisitAssignment /> */}
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