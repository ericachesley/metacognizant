class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionId: this.props.getSlug(),
            sectionName: '',
            assignments: [],
            students: []
        };
    }

    componentDidMount() {
        fetch(`/api/get_section_name?sectionId=${this.state.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ sectionName: data })
            })
    }

    render() {
        return (
            <div id='section'>
                <Link to='/classes'>Back to all classes</Link>
                <h2>{this.state.sectionName}</h2>
                <p></p>
                {sessionStorage.getItem('role') === 'teacher' ?
                    <TeacherSection sectionId={this.state.sectionId} /> :
                    <StudentSection sectionId={this.state.sectionId} />}
            </div>
        )
    }
}

class TeacherSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            students: []
        };
        this.sortAssignments = this.sortAssignments.bind(this);
    }

    componentDidMount() {
        fetch(`/api/get_pras?sectionId=${this.props.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ assignments: data })
            })
        fetch(`/api/get_students?sectionId=${this.props.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ students: data })
            })
    }

    sortAssignments() {
        var now = luxon.DateTime.local();
        const assignmentButtonsPast = [];
        const assignmentButtonsFuture = [];

        for (const assignment of this.state.assignments) {
            const date = assignment.date
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
            if (dtLocal < now) {
                assignmentButtonsPast.push(
                    <AssignmentButton
                        assignment={assignment}
                        sectionId={this.props.sectionId}
                        key={assignment['pras_id']}
                    />
                )
            } else {
                assignmentButtonsFuture.push(
                    <AssignmentButton
                        assignment={assignment}
                        sectionId={this.props.sectionId}
                        key={assignment['pras_id']}
                    />
                )
            }
        }
        return [assignmentButtonsPast, assignmentButtonsFuture]
    }

    render() {
        let assignmentButtonsPast, assignmentButtonsFuture
        [assignmentButtonsPast, assignmentButtonsFuture] = this.sortAssignments();

        const studentButtons = [];
        for (const student of this.state.students) {
            studentButtons.push(
                <StudentButton
                    student={student}
                    sectionId={this.props.sectionId}
                    key={student['user_id']}
                />
            )
        }
        return (
            <div>
                <h3>View responses by assignment:</h3>
                <p>Past assignments</p>
                <div>{assignmentButtonsPast}</div>
                <p>Current and upcoming assignments</p>
                <div>{assignmentButtonsFuture}</div>
                <p></p>
                <Link to={`/classes/${this.props.sectionId}/assign`}>
                    Create new assignment
                </Link>
                <h3>View responses by student:</h3>
                <div>{studentButtons}</div>
            </div>
        )
    }
}

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