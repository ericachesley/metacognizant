class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionId: getSlug(),
            assignments: [],
            students: []
        };
    }

    componentDidMount() {
        console.log(this.props)
        if (this.props.role === "teacher") {
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
            console.log(utcDt);
            fetch(`/api/get_pras_to_date
                  ?sectionId=${this.props.sectionId}&date=${utcDt}`)
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
                <AssignmentButton assignment={assignment}
                    // setAssignment={this.props.setAssignment}
                    key={assignment['pras_id']} />
            )
        }
        const studentButtons = [];
        for (const student of this.state.students) {
            studentButtons.push(
                <StudentButton student={student}
                    // setStudent={this.props.setStudent}
                    key={student['user_id']} />
            )
        }
        return (
            <div id='section'>
                <h2>{getSlug()}</h2>
                <h3>Class assignments {this.props.sectionId}</h3>
                <p></p>
                <h3>View by assignment:</h3>
                <div>{assignmentButtons}
                    <p></p>
                    {this.props.role == 'teacher' ? <Link to='/assign'>
                        Create new assignment
                    </Link> : <p></p>}
                </div>
                <h3>View by student:</h3>
                <div>{studentButtons}</div>
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
        console.log(evt.target);
        // this.props.setAssignment(evt.target.id);
        sessionStorage.setItem('assignmentId', evt.target.id);
        this.setState({ clicked: true })
    }

    render() {
        console.log(this.props.assignment)
        if (this.state.clicked) {
            //return (<Redirect to={`${<Locator />}/${this.props.assignment['date']}`} />)
            return (<Redirect to={`/classes/${getSlug()}/assignment/${this.props.assignment['pras_id']}`} />)
        } else {
            const date = this.props.assignment['date'];
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal().toLocaleString(luxon.DateTime.DATE_FULL);
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
        console.log(evt.target);
        //this.props.setStudent(evt.target.id);
        sessionStorage.setItem('studentId', evt.target.id);
        this.setState({ clicked: true })
    }

    render() {
        console.log(this.props.student)
        if (this.state.clicked) {
            //return (<Redirect to={`${<Locator />}/${this.props.student['name']}`} />)
            return (<Redirect to={`/classes/${getSlug()}/student/${this.props.student['user_id']}`} />)
            // return (<Redirect to='/classes/section/student' />)
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