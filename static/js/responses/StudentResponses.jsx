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

                <SideBar
                    back={<Link to={`/classes/${sectionId}`}>
                        Back to class overview
                    </Link>}
                />

                <main className="main-content w-100">
                    <div id='assignment' className='container-fluid'>
                        <row className='row d-flex align-items-start'>
                            <div id='yourclasses' className='col-12'>
                                <h2>{sessionStorage.getItem('studentName')}</h2>
                            </div>
                        </row>
                        <row className='row d-flex align-items-start'>
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
                        </row>
                    </div>
                </main>
            </div >
        )
    }
}
