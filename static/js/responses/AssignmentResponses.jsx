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
            loading: true
        };
        this.toggleAssignAgain = this.toggleAssignAgain.bind(this);
        this.toggleAssignRevisit = this.toggleAssignRevisit.bind(this);
        this.adjustDate = this.adjustDate.bind(this);
        this.getResponses = this.getResponses.bind(this);
    }

    componentDidMount() {
        this.getResponses();
    }

    getResponses() {
        this.setState({ loading: true });
        fetch(`/api/get_responses?assignmentId=${this.state.assignmentId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({
                    prompt: data[0],
                    promptId: data[1],
                    due_date: data[2],
                    isRevisit: data[3],
                    origDate: data[4],
                    responses: data[5],
                    loading: false
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
        if (this.state.loading) {
            <Loader />
        }

        const role = sessionStorage.getItem('role')
        const sectionId = window.location.pathname.split('/')[2]

        return (
            <div className="everything-holder d-flex align-items-stretch h-100">

                <SideBar back={<Link to={`/classes/${sectionId}`}>
                    Back to class overview
                    </Link>} />

                <main className="main-content w-100">
                    <section className='container-fluid' id='assignment'>
                        <div className='row d-flex align-items-start'>
                            <div id='yourclasses' className='col-12'>
                                {this.state.isRevisit ?
                                    <h2>Prompt revisit from {this.adjustDate(this.state.origDate)}</h2> :
                                    null}

                                <h3>Due: {this.adjustDate(this.state.due_date)}</h3>

                                {role === 'student' && this.state.isRevisit ?
                                    <div id='revisit-instructions'>
                                        <p className='p-3'>
                                            <b>Instructions</b> <br></br>
                                    Reread the response you gave to the prompt below when it
                                    was previously assigned. <br></br> Then reflect on how
                                    your perspective has (or has not) changed since.
                                </p>
                                        <PreviousResponse
                                            prasId={this.state.assignmentId}
                                            prompt={this.state.prompt}
                                        />
                                    </div> :
                                    <h2>
                                        {this.state.prompt}
                                    </h2>}
                            </div>
                        </div>
                        <div className='row d-flex align-items-start'>
                            <div id='options' className='col-12 my-2'>
                                {role === 'teacher' ?
                                    <div>

                                        <a href='#' onClick={this.toggleAssignAgain}>
                                            Assign again
                                                </a>
                                        <span>  |  </span>
                                        <a href='#' onClick={this.toggleAssignRevisit}>
                                            Assign revisit
                                                </a>
                                    </div> : null
                                }
                            </div>
                        </div>
                        <div className='row d-flex align-items-start'>
                            {role === 'teacher' ?
                                <div>
                                    {this.state.loading ?
                                        <Loader /> :
                                        <ShowResponses
                                            responses={this.state.responses}
                                            prasId={this.state.assignmentId}
                                            isRevisit={this.state.isRevisit}
                                        />}
                                </div> :
                                <GetResponse
                                    assignmentId={this.state.assignmentId}
                                    sectionId={sectionId}
                                    reload={this.getResponses}
                                />
                            }
                        </div>
                    </section>
                    {this.state.again ?
                        <CreateAssignment
                            sectionId={sectionId}
                            promptId={this.state.promptId}
                            toggle={this.toggleAssignAgain}
                        /> : null}
                    {this.state.revisit ?
                        <CreateRevisitAssignment
                            assignmentId={this.state.assignmentId}
                            toggle={this.toggleAssignRevisit}
                        /> : null}
                </main >
            </div >

        )
    }
}

