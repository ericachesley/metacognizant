class TeacherSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            students: [],
            addStudent: false,
            addAssignment: false
        };
        this.sortAssignments = this.sortAssignments.bind(this);
        this.toggleAddStudent = this.toggleAddStudent.bind(this);
        this.toggleAddAssignment = this.toggleAddAssignment.bind(this);
        this.getPromptAssignments = this.getPromptAssignments.bind(this);
        this.getStudents = this.getStudents.bind(this);
    }

    componentDidMount() {
        this.getPromptAssignments();
        this.getStudents();
    }

    getPromptAssignments() {
        fetch(`/api/get_pras?sectionId=${this.props.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ assignments: data })
            })
    }

    getStudents() {
        fetch(`/api/get_students?sectionId=${this.props.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ students: data })
            })
    }

    sortAssignments() {
        var now = luxon.DateTime.local();
        const assignmentButtonsToday = [];
        const assignmentButtonsPast = [];
        const assignmentButtonsFuture = [];

        for (const assignment of this.state.assignments) {
            const date = assignment.date
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
            if (dtLocal.year == now.year && dtLocal.ordinal == now.ordinal) {
                assignmentButtonsToday.push(
                    <AssignmentButton
                        assignment={assignment}
                        sectionId={this.props.sectionId}
                        key={assignment['pras_id']}
                    />
                )
            } else if (dtLocal < now) {
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
        return [assignmentButtonsToday,
            assignmentButtonsPast,
            assignmentButtonsFuture]
    }

    toggleAddStudent() {
        if (this.state.addStudent) {
            this.setState({ addStudent: false });
            this.getStudents();
        } else {
            this.setState({ addStudent: true });
        }
    }

    toggleAddAssignment() {
        if (this.state.addAssignment) {
            this.setState({ addAssignment: false });
            this.getPromptAssignments();
        } else {
            this.setState({ addAssignment: true });
        }
    }

    render() {
        let assignmentButtonsToday, assignmentButtonsPast, assignmentButtonsFuture
        [assignmentButtonsToday,
            assignmentButtonsPast,
            assignmentButtonsFuture] = this.sortAssignments();

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
                {
                    assignmentButtonsPast[0] == undefined ?
                        <div><p><i>No past assignments</i></p></div> :
                        <div>{assignmentButtonsPast}</div>
                }
                <p>Today's assignment</p>
                {
                    assignmentButtonsToday[0] == undefined ?
                        <div><p><i>Nothing assigned for today</i></p></div> :
                        <div>{assignmentButtonsToday}</div>
                }
                <p>Upcoming assignments</p>
                {
                    assignmentButtonsFuture[0] == undefined ?
                        <div><p><i>No upcoming assignments</i></p></div> :
                        <div>{assignmentButtonsFuture}</div>
                }
                <p></p>
                {this.state.addAssignment ?
                    <CreateAssignment
                        toggleAddAssignment={this.toggleAddAssignment}
                    /> :
                    <div>
                        <button onClick={this.toggleAddAssignment}>
                            Create new assignment
                        </button>
                    </div>
                }
                <h3>View responses by student:</h3>
                {studentButtons[0] == undefined ?
                    <p><i>There are no students assigned to this class yet.</i></p> :
                    <div>{studentButtons}</div>}
                <p></p>
                {this.state.addStudent ?
                    <AddStudent toggleAddStudent={this.toggleAddStudent} /> :
                    <div>
                        <button onClick={this.toggleAddStudent}>
                            Add a student
                        </button>
                    </div>
                }
            </div>
        )
    }
}