class StudentSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
        };
    }

    componentDidMount() {
        const dt = luxon.DateTime;
        const utcDt = dt.utc().toISO();
        fetch(`/api/get_pras_to_date?sectionId=${this.props.sectionId}&date=${utcDt}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ assignments: data })
            })
    }

    render() {
        const assignmentButtonsComplete = [];
        const assignmentButtonsIncomplete = [];
        for (const assignment of this.state.assignments) {
            const button = <AssignmentButton
                assignment={assignment}
                sectionId={this.props.sectionId}
                key={assignment['pras_id']}
            />
            if (assignment.res) {
                assignmentButtonsComplete.push(button);
            } else {
                assignmentButtonsIncomplete.push(button);
            }
        }
        return (
            <div>
                <h3>View assignments:</h3>
                <p>Already responded</p>
                <div>{assignmentButtonsComplete}</div>
                <p>No response yet</p>
                <div>{assignmentButtonsIncomplete}</div>
                <p></p>
            </div>
        )
    }
}