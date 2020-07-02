class GetResponse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            response: '',
            date: null,
            done: false,
            submitted: false
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }


    componentDidMount() {
        fetch(`/api/check_response?assignmentId=${this.props.assignmentId}`, {
            credentials: 'same-origin'
        })
            .then(res => res.json())
            .then(data => {
                if (data) {
                    const date = data.date;
                    const dt = luxon.DateTime.fromHTTP(date);
                    const dtLocal = dt.toLocal().toLocaleString(luxon.DateTime.DATETIME_SHORT);
                    this.setState({ response: data.response, date: dtLocal, done: true });
                }
            })
    }


    handleFieldChange(evt) {
        this.setState({ [evt.target.id]: evt.target.value });
    }


    handleSubmit(evt) {
        const date = luxon.DateTime.utc().toISO();
        const formData = {
            response: this.state.response,
            date: date,
            assignmentId: this.props.assignmentId
        }
        fetch('/api/submit_response', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData),
            credentials: "same-origin"
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ submitted: true });
                this.props.getResponses();
            })
    }


    render() {
        if (this.state.submitted) {
            return (
                <Redirect to={`/classes/${this.props.sectionId}`} />
            )
        } else if (this.state.done) {
            return (
                <div className='row d-flex align-items-start px-5'>
                    <p>You already submitted a response to this prompt.</p>
                    <div className='col-10 rounded shadow p-3 rounded' style={{'background-color': 'white'}}>
                        <p>Response: {this.state.response}</p>
                        <p>Submitted: {this.state.date}</p>
                    </div>
                </div >
            )
        } else {
            return (
                <div className='row d-flex align-items-start px-5'>
                    <div className='col-10 mx-5'>
                        <form onSubmit={this.handleSubmit} action={`/classes/${this.props.sectionId}`}>
                            <textarea
                                className='rounded shadow p-3 rounded'
                                id='response'
                                name='response'
                                rows="15" cols="100"
                                placeholder="Your response"
                                value={this.state.response}
                                onChange={this.handleFieldChange}>
                            </textarea>
                            <p></p>
                            <input type='submit'></input>
                        </form>
                    </div>
                </div>
            )
        }
    }
}