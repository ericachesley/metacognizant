class TeacherSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            students: [],
            addStudent: false,
            addAssignment: false,
            view: 0
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

    toggleView = () => {
        if (this.state.view == 0) {
            this.setState({ view: 1 });
        } else {
            this.setState({ view: 0 })
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
            );
        }
        if (this.state.view == 0) {
            return (
                <div className='container-fluid'>
                    <div className='row d-flex align-items-start'>
                        <div className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded' id='assignments'>
                            <h3>Responses by assignment</h3>
                            <a href='#' onClick={this.toggleView}>
                                View by student
                            </a>
                            {this.state.addAssignment ?
                                <CreateAssignment
                                    promptId='select-one'
                                    sectionId={this.props.sectionId}
                                    toggle={this.toggleAddAssignment}
                                /> :
                                <div>
                                    <a href='#' onClick={this.toggleAddAssignment}>
                                        Create new assignment
                                        </a>
                                </div>
                            }
                        </div>
                    </div>
                    <div className='row d-flex align-items-start'>
                        <div className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded' id='assignments'>
                            <p>Today's assignment</p>
                            {
                                assignmentButtonsToday[0] == undefined ?
                                    <div><p><i>Nothing assigned for today</i></p></div> :
                                    <div>{assignmentButtonsToday}</div>
                            }
                        </div>
                    </div>
                    <div className='row d-flex' id='by-assignment'>
                        <div className='col-6 col-xs-6 col-sm-6 col-md-5 col-lg-5 rounded shadow p-3 mb-5 rounded' id='past'>
                            <p>Past assignments</p>
                            {
                                assignmentButtonsPast[0] == undefined ?
                                    <div><p><i>No past assignments</i></p></div> :
                                    <div>{assignmentButtonsPast}</div>
                            }
                        </div>
                        <div className='col-6 col-xs-6 col-sm-6 col-md-5 col-lg-5 rounded shadow p-3 mb-5 rounded' id='future'>
                            <p>Upcoming assignments</p>
                            {
                                assignmentButtonsFuture[0] == undefined ?
                                    <div><p><i>No upcoming assignments</i></p></div> :
                                    <div>{assignmentButtonsFuture}</div>
                            }
                        </div>
                    </div>
                </div>
            )
        } else {
            return (
                <div className='container-fluid'>
                    <div className='row d-flex align-items-start'>
                        <div className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded' id='students'>
                            <h3>Responses by student</h3>
                            <a href='#' onClick={this.toggleView}>
                                View by assignment
                            </a>
                            {this.state.addStudent ?
                                <AddStudent toggleAddStudent={this.toggleAddStudent} /> :
                                <div>
                                    <a href='#' onClick={this.toggleAddStudent}>
                                        Add a student
                            </a>
                                </div>
                            }
                        </div>
                    </div>
                    {studentButtons[0] == undefined ?
                        <div className='row d-flex align-items-start'>
                            <div className='col-11 rounded shadow p-3 mb-5 rounded' id='students'>
                                <p><i>There are no students assigned to this class yet.</i></p>
                            </div>
                        </div> :
                        <div className='row justify-content-around rounded shadow p-3 mb-5 rounded' id='student-buttons'>
                            <div className='col-11 col-xs-11 col-sm-11 col-md-11 col-lg-3'>
                                <div>{studentButtons.slice(0, Math.ceil(studentButtons.length / 3))}</div>
                            </div>
                            <div className='col-11 col-xs-11 col-sm-11 col-md-11 col-lg-3'>
                                <div>{studentButtons.slice(Math.ceil(studentButtons.length / 3), Math.ceil(studentButtons.length / 3) * 2)}</div>
                            </div>
                            <div className='col-11 col-xs-11 col-sm-11 col-md-11 col-lg-3'>
                                <div>{studentButtons.slice(Math.ceil(studentButtons.length / 3) * 2, studentButtons.length)}</div>
                            </div>
                        </div>}
                </div>
            )
        }
    }
}