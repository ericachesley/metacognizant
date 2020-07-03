class ShowResponses extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            prevRes: null,
            modal: true
        };
    }


    componentDidMount() {
        if (sessionStorage.getItem('showResponsesModal')) {
            this.setState({ modal: false })
        }
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

    closeModal = () => {
        this.setState({ modal: false });
        sessionStorage.setItem('showResponsesModal', 'seen')
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

                    {this.state.modal ?
                        <div className='modal targeted'>
                            <a href='#' onClick={this.closeModal}>X</a>
                            <div className='modal-content targeted shadow'>
                                Here you have all submitted responses <br></br>
                                for this assignment, along with <br></br>
                                submission date and time.
                                <br></br><br></br>
                                The sentiment column gives you an <br></br>
                                at-a-glance analysis of the tone of <br></br>
                                the given response. Color indicates <br></br>
                                positive, neutral, or negative, <br></br>
                                and the size of the bar conveys the <br></br>
                                level of confidence for that choice.
                                <br></br><br></br>
                                At the top of the page you can assign <br></br>
                                this same prompt for a new date, or <br></br>
                                you can assign a 'revisit' of this <br></br>
                                particular assignment.
                                <br></br><br></br>
                                In a revisit assignment, each student <br></br>
                                will be shown their own response from <br></br>
                                this assignment and be asked to <br></br>
                                reflect on how their thinking and <br></br>
                                perspective may have evolved since the <br></br>
                                initial reflection. This helps students <br></br>
                                see their own growth over time and <br></br>
                                take ownership of their learning.
                    </div>
                        </div> : null}

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