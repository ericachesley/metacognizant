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
                <p>No responses yet.</p>
            )
        } else {
            const responses = [];
            for (const count in this.props.responses) {
                const date = this.props.responses[count].date;
                const dt = luxon.DateTime.fromHTTP(date);
                const dtLocal = dt.toLocal()
                    .toLocaleString(luxon.DateTime.DATETIME_SHORT);

                if (this.props.isRevisit) {
                    const last = this.props.responses[count].last_name;
                    responses.push(
                        <tr key={count}>
                            <td>{this.props.responses[count].student}</td>
                            <td>{this.state.prevRes[last]}</td>
                            <td>{this.props.responses[count].content}</td>
                            <td>{this.props.responses[count].sentiment}</td>
                            <td>{this.props.responses[count].confidence}</td>
                            <td>{date ? dtLocal : ''}</td>
                        </tr>
                    )
                } else {
                    responses.push(
                        <tr key={count}>
                            <td>{this.props.responses[count].student}</td>
                            <td>{this.props.responses[count].content}</td>
                            <td>{this.props.responses[count].sentiment}</td>
                            <td>{this.props.responses[count].confidence}</td>
                            <td>{date ? dtLocal : ''}</td>
                        </tr>
                    )
                }
            }
            return (
                <table id='response-table' className="table table-striped table-hover">
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
                            <td><b>Confidence</b></td>
                            <td><b>Submitted</b></td>
                        </tr>
                    </thead>
                    <tbody>{responses}</tbody>
                </table>
            )
        }
    }
}