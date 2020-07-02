class ShowResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prevRes: null,
        };
    }


    componentDidMount() {
        if (this.props.isRevisit) {
            fetch(`/api/get_all_prev_responses?prasId=${this.props.prasId}`, {
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: "same-origin"
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ prevRes: data });
                })
        }
    }

    render() {
        if (this.props.isRevisit && this.state.prevRes == null) {
            return (<Loader />)
        } else if (this.props.responses.length == 0) {
            return (
                    <div className='col-12'>
                        <p>No responses yet.</p>
                    </div>
            )
        } else {
            const responses = [];
            for (const count in this.props.responses) {
                const date = this.props.responses[count].date;
                const dt = luxon.DateTime.fromHTTP(date);
                const dtLocal = dt.toLocal()
                    .toLocaleString(luxon.DateTime.DATETIME_SHORT);

                let bg = 'bg-danger';
                if (this.props.responses[count].sentiment == 'Positive') {
                    bg = 'bg-success';
                } else if (this.props.responses[count].sentiment == 'Neutral') {
                    bg = 'bg-warning';
                }

                const sentimentBar = <div className='progress'>
                    <div className={"progress-bar" + ' ' + bg}
                        role="progressbar"
                        style={{ "width": `${this.props.responses[count].confidence * 100}` }}
                        aria-valuenow={this.props.responses[count].confidence * 100}
                        aria-valuemin="0"
                        aria-valuemax="100">
                    </div>
                </div>

                if (this.props.isRevisit) {
                    const last = this.props.responses[count].last_name;
                    responses.push(
                        <tr key={count}>
                            <td>{this.props.responses[count].student}</td>
                            <td>{this.state.prevRes[last]}</td>
                            <td>{this.props.responses[count].content}</td>
                            <td>{sentimentBar}</td>
                            <td>{date ? dtLocal : ''}</td>
                        </tr>
                    )
                } else {
                    responses.push(
                        <tr key={count}>
                            <td>{this.props.responses[count].student}</td>
                            <td>{this.props.responses[count].content}</td>
                            <td>{sentimentBar}</td>

                            <td>{date ? dtLocal : ''}</td>
                        </tr>
                    )
                }
            }

            return (
                <div id='show-responses' className='col-12'>
                    <table id='response-table' className="table table-hover">
                        <thead>
                            <tr>
                                <td><b>Student</b></td>
                                {this.props.isRevisit ?
                                    <td><b>Original Response</b></td> :
                                    null
                                }
                                {this.props.isRevisit ?
                                    <td><b>Revisit Response</b></td> :
                                    <td><b>Response</b></td>
                                }
                                <td><b>Sentiment</b></td>
                                <td><b>Submitted</b></td>
                            </tr>
                        </thead>
                        <tbody>{responses}</tbody>
                    </table>
                </div>
            )
        }
    }
}