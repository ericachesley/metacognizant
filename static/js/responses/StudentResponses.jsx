class StudentResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: this.props.getSlug(),
            sectionId: sessionStorage.getItem('sectionId'),
            responses: [],
            modal: true
        };
    }

    componentDidMount() {
        if (sessionStorage.getItem('studentResponsesModal')) {
            this.setState({ modal: false })
        }
        fetch(`/api/get__student_responses?studentId=${this.state.studentId}&sectionId=${this.state.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ responses: data })
            })
    }

    closeModal = () => {
        this.setState({ modal: false });
        sessionStorage.setItem('studentResponsesModal', 'seen')
    }

    render() {
        const sectionId = window.location.pathname.split('/')[2]
        const responses = [];
        for (const count in this.state.responses) {
            const date = this.state.responses[count].date;
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
                .toLocaleString(luxon.DateTime.DATETIME_SHORT);

            let bg = 'bg-danger';
            if (this.state.responses[count].sentiment == 'Positive') {
                bg = 'bg-success';
            } else if (this.state.responses[count].sentiment == 'Neutral') {
                bg = 'bg-warning';
            }

            const sentimentBar = <div className='progress'>
                <div className={"progress-bar" + ' ' + bg}
                    role="progressbar"
                    style={{ "width": `${this.state.responses[count].confidence * 100}` }}
                    aria-valuenow={this.state.responses[count].confidence * 100}
                    aria-valuemin="0"
                    aria-valuemax="100">
                </div>
            </div>

            responses.push(
                <tr key={count}>
                    <td>{dtLocal}</td>
                    <td>{this.state.responses[count].prompt}</td>
                    <td>{this.state.responses[count].response}</td>
                    <td>{sentimentBar}</td>
                </tr>
            )
        }

        return (
            <div className="d-flex align-items-stretch h-100">

                <SideBar
                    back={<div>
                        <Link className='back' to='/classes'>
                            Back to all classes
                        </Link>
                        <br></br>
                        <Link className='back' to={`/classes/${sectionId}`}>
                            Back to class overview
                        </Link>
                    </div>}
                />

                {this.state.modal ?
                    <div className='modal targeted'>
                        <a href='#' onClick={this.closeModal}>X</a>
                            <div className='modal-content targeted shadow'>
                                Here you have all  of this student's <br></br>
                                reflections for this class, in order <br></br>
                                of submission.
                                <br></br><br></br>
                                As in the by assignment view, the <br></br>
                                sentiment column provides an <br></br>
                                at-a-glance analysis of the tone <br></br>
                                of each response. Color indicates <br></br>
                                positive, neutral, or negative, <br></br>
                                and the size of the bar conveys the <br></br>
                                level of confidence for that choice.
                        </div>
                    </div> : null}


                <main className="main-content w-100">
                    <section className='container-fluid' id='student'>
                        <div className='row d-flex align-items-start'>
                            <div id='assignment' className='container-fluid'>
                                <div className='row d-flex align-items-start'>
                                    <div id='yourclasses' className='col-12'>
                                        <h2>{sessionStorage.getItem('studentName')}</h2>
                                    </div>
                                </div>
                                <div className='row d-flex align-items-start'>
                                    <div id='show-responses' className='col-12'>
                                        <table className='table table-hover' id='response-table'>
                                            <thead>
                                                <tr>
                                                    <td><b>Date</b></td>
                                                    <td><b>Prompt</b></td>
                                                    <td><b>Response</b></td>
                                                    <td><b>Sentiment</b></td>
                                                </tr>
                                            </thead>
                                            <tbody>
                                                {responses}
                                                <tr><td /><td /><td /><td /></tr>
                                            </tbody>
                                        </table>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div >
        )
    }
}
