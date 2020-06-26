class ShowResponses extends React.Component {
    render() {
        if (this.props.responses.length == 0) {
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
            return (
                <table id='response-table'>
                    <thead>
                        <tr>
                            <td><b>Student</b></td>
                            <td><b>Response</b></td>
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