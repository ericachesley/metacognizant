class StudentSection extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: [],
            modal: true
        };
    }

    componentDidMount() {
        if (sessionStorage.getItem('studentSectionModal')) {
            this.setState({ modal: false })
        }
        this.getPras();
    }

    getPras = () => {
        fetch(`/api/get_pras?sectionId=${this.props.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ assignments: data })
            })
    }

    sortAssignments = () => {
        var now = luxon.DateTime.local();
        const assignmentButtonsToday = [];
        const assignmentButtonsPast = [];
        const assignmentButtonsFuture = [];

        for (const assignment of this.state.assignments) {
            const date = assignment.date
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()

            const button = <AssignmentButton
                getPras={this.getPras}
                res={assignment.res}
                late={dtLocal < now && assignment.res == false}
                assignment={assignment}
                sectionId={this.props.sectionId}
                key={assignment['pras_id']}
            />;

            if (dtLocal.year == now.year && dtLocal.ordinal == now.ordinal) {
                assignmentButtonsToday.push(button);
            } else if (dtLocal < now) {
                assignmentButtonsPast.push(button);
            } else {
                assignmentButtonsFuture.push(button);
            }
        }
        return [assignmentButtonsToday,
            assignmentButtonsPast,
            assignmentButtonsFuture]
    }

    closeModal = () => {
        this.setState({ modal: false });
        sessionStorage.setItem('studentSectionModal', 'seen')
    }

    render() {
        let assignmentButtonsToday, assignmentButtonsPast, assignmentButtonsFuture
        [assignmentButtonsToday,
            assignmentButtonsPast,
            assignmentButtonsFuture] = this.sortAssignments();

        return (
            <div className='container-fluid'>

                {this.state.modal ?
                    <div className='modal targeted '>
                        <a href='#' onClick={this.closeModal}>X</a>
                        <div className='modal-content targeted shadow'>
                            On this page, you can see and respond <br></br>
                            to reflection questions assigned <br></br>
                            by your teacher.
                            <br></br><br></br>
                            Completed assignments are highlighted <br></br>
                            in green. Special assignments called <br></br>
                            revisits are highlighted in yellow.
                            <br></br><br></br>
                            In a revisit assignment, you will <br></br>
                            see a response that you wrote for a <br></br>
                            previous reflection and be asked to <br></br>
                            reflect on how your thinking and <br></br>
                            perspective may have evolved since <br></br>
                            you wrote it.
                        </div>
                    </div> : null}

                <div className='row d-flex align-items-start'>
                    <div className='col-12 m-3'>
                        <h3>View assignments</h3>
                        <div className='card-deck'>
                            <div className='card rounded shadow p-3 rounded'>
                                <p>Past assignments</p>
                                {
                                    assignmentButtonsPast[0] == undefined ?
                                        <div><p><i>No past assignments</i></p></div> :
                                        <div>{assignmentButtonsPast}</div>
                                }
                            </div>
                            <div className='card rounded shadow p-3 rounded'>
                                <p>Today's assignment</p>
                                {
                                    assignmentButtonsToday[0] == undefined ?
                                        <div><p><i>Nothing assigned for today</i></p></div> :
                                        <div>{assignmentButtonsToday}</div>
                                }
                            </div>
                            <div className='card rounded shadow p-3 rounded'>
                                <p>Upcoming assignments</p>
                                {
                                    assignmentButtonsFuture[0] == undefined ?
                                        <div><p><i>No upcoming assignments</i></p></div> :
                                        <div>{assignmentButtonsFuture}</div>
                                }
                            </div>
                        </div>
                    </div>
                </div>
            </div>
        )
    }
}