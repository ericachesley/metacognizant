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