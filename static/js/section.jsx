class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionId: this.props.getSlug(),
            assignments: [],
            students: []
        };
    }

    componentDidMount() {
        if (sessionStorage.getItem('role') === "teacher") {
            fetch(`/api/get_pras?sectionId=${this.state.sectionId}`)
                .then(res => res.json())
                .then(data => {
                    this.setState({ assignments: data })
                })
            fetch(`/api/get_students?sectionId=${this.state.sectionId}`)
                .then(res => res.json())
                .then(data => {
                    this.setState({ students: data })
                })
        } else {
            const dt = luxon.DateTime;
            const utcDt = dt.utc().toISO();
            fetch(`/api/get_pras_to_date?sectionId=${this.state.sectionId}&date=${utcDt}`)
                .then(res => res.json())
                .then(data => {
                    this.setState({ assignments: data })
                })
        }
    }

    render() {
        const assignmentButtons = [];
        for (const assignment of this.state.assignments) {
            assignmentButtons.push(
                <AssignmentButton
                    assignment={assignment}
                    sectionId={this.state.sectionId}
                    key={assignment['pras_id']}
                />
            )
        }
        const studentButtons = [];
        for (const student of this.state.students) {
            studentButtons.push(
                <StudentButton
                    student={student}
                    sectionId={this.state.sectionId}
                    key={student['user_id']}
                />
            )
        }
        return (
            <div id='section'>
                <h2>{this.state.sectionId}</h2>
                <h3>Class assignments {this.props.sectionId}</h3>
                <p></p>
                <h3>View by assignment:</h3>
                <div>{assignmentButtons}</div>
                <p></p>
                {sessionStorage.getItem('role') == 'teacher' ?
                    <div>
                        <Link to='/assign'> Create new assignment </Link>
                        <h3>View by student:</h3>
                        <div>{studentButtons}</div>
                    </div> :
                    <p></p>}
            </div>
        )
    }
}


class AssignmentButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        this.setState({ clicked: true })
    }

    render() {
        if (this.state.clicked) {
            return (
                <Redirect to=
                    {`/classes/${this.props.sectionId}/assignment/${this.props.assignment['pras_id']}`}
                />)
        } else {
            const date = this.props.assignment['date'];
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
                .toLocaleString(luxon.DateTime.DATE_FULL);
            return (
                <div className='assignment_button_holder'>
                    <button type='assignment_button'
                        id={this.props.assignment['pras_id']}
                        className={this.props.assignment['date']}
                        onClick={this.handleClick}>
                        {dtLocal}
                    </button>
                </div>
            )
        }
    }
}


class StudentButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        this.setState({ clicked: true })
    }

    render() {
        if (this.state.clicked) {
            return (
                <Redirect to=
                    {`/classes/${this.props.sectionId}/student/${this.props.student['user_id']}`}
                />
            )
        } else {
            return (
                <div className='student_button_holder'>
                    <button type='student_button'
                        id={this.props.student['user_id']}
                        onClick={this.handleClick}>
                        {this.props.student['name']}
                    </button>
                </div>
            )
        }
    }
}