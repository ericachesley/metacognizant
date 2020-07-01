class StudentResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentId: this.props.getSlug(),
            sectionId: sessionStorage.getItem('sectionId'),
            responses: []
        };
    }

    componentDidMount() {
        fetch(`/api/get__student_responses?studentId=${this.state.studentId}&sectionId=${this.state.sectionId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ responses: data })
            })
    }


    render() {
        const sectionId = window.location.pathname.split('/')[2]
        const responses = [];
        for (const count in this.state.responses) {
            const date = this.state.responses[count].date;
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
                .toLocaleString(luxon.DateTime.DATETIME_SHORT);
            responses.push(
                <tr key={count}>
                    <td>{dtLocal}</td>
                    <td>{this.state.responses[count].prompt}</td>
                    <td>{this.state.responses[count].response}</td>
                    <td>{this.state.responses[count].sentiment}</td>
                    <td>{this.state.responses[count].confidence}</td>
                </tr>
            )
        }

        return (
            <div className="d-flex align-items-stretch h-100">

                <aside className="navbar align-items-start w-25">
                    <nav className="nav flex-column position-sticky">
                        <a className="navbar-brand" href="#sidebar-nav">
                            Navigation
					</a>
                        {/* {links} */}
                    </nav>
                </aside>

                <main className="main-content w-100">
                    <div id='assignment' className='container-fluid'>
                        <Link to={`/classes/${sectionId}`}>Back to class overview</Link>
                        <row className='row'>
                            <div className='col-12'>
                            <h1>{sessionStorage.getItem('sectionName')}</h1>
                            <h2>Student: {sessionStorage.getItem('studentName')}</h2>
                            </div>
                        </row>
                        <table className='table table-hover' id='response-table'>
                            <thead>
                                <tr>
                                    <td><b>Date</b></td>
                                    <td><b>Prompt</b></td>
                                    <td><b>Response</b></td>
                                    <td><b>Sentiment</b></td>
                                    <td><b>Confidence</b></td>
                                </tr>
                            </thead>
                            <tbody>{responses}</tbody>
                        </table>
                    </div>
                </main>
            </div>
        )
    }
}
