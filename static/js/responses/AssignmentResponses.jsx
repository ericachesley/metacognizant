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
            <div className="d-flex align-items-stretch h-100">

                <aside className="navbar align-items-start w-25">
                    <nav className="nav flex-column position-sticky">
                        <a className="navbar-brand" href="#sidebar-nav">
                            Navigation
					</a>
                    <Link to={`/classes/${sectionId}`}>
                                {/* <svg id='backicon' width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-arrow-left-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.354 10.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.207 7.5H11a.5.5 0 0 1 0 1H6.207l2.147 2.146z" />
                                </svg> */}
                                Back to class overview
                            </Link>
                        {/* {links} */}
                    </nav>
                </aside>

                <main className="main-content w-100">
                    <section className='container-fluid' id='assignment'>
                        {/* <div className='row'>
                            <Link to={`/classes/${sectionId}`}>
                                <svg id='backicon' width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-arrow-left-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.354 10.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.207 7.5H11a.5.5 0 0 1 0 1H6.207l2.147 2.146z" />
                                </svg>
                                Back to class overview
                            </Link>
                        </div> */}
                        {/* <div className='row justify-contents-center'>
                            <div id='yourclasses' className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded'>
                                <h1>{sessionStorage.getItem('sectionName')}</h1>
                            </div>
                        </div> */}
                        <div id='yourclasses' className='col-12'>
                            {this.state.isRevisit ?
                                <h2 className='heading'>Prompt revisit from {this.adjustDate(this.state.origDate)}</h2> :
                                null}

                            {role === 'student' && this.state.isRevisit ?
                                <p className='heading'>
                                    <b>Instructions</b> <br></br>
                                    Reread the response you gave to the prompt below when it
                                    was previously assigned. <br></br> Then reflect on how
                                    your perspective has or has not changed since.
                                </p> :
                                <h2>
                                    Prompt: {this.state.prompt}
                                </h2>}

                            <h3>Due: {this.adjustDate(this.state.due_date)}</h3>


                            {role === 'student' && this.state.isRevisit ?
                                <PreviousResponse
                                    prasId={this.state.assignmentId}
                                    prompt={this.state.prompt}
                                /> :
                                null}
                        </div>
                        <div className='row d-flex align-items-start'>
                            <div id='options' className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 my-2'>
                                {role === 'teacher' ?
                                    <div>
                                        {this.state.again ?
                                            <CreateAssignment
                                                promptId={this.state.promptId}
                                                toggle={this.toggleAssignAgain}
                                            /> :
                                            <a href='#' onClick={this.toggleAssignAgain}>
                                                Assign again
                                                </a>
                                        }
                                        <br></br>
                                        {this.state.revisit ?
                                            <CreateRevisitAssignment
                                                assignmentId={this.state.assignmentId}
                                                toggle={this.toggleAssignRevisit}
                                            /> :
                                            <a href='#' onClick={this.toggleAssignRevisit}>
                                                Assign revisit
                                                </a>
                                        }
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
                </main >
            </div >
        )
    }
}

