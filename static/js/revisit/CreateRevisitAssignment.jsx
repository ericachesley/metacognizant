class CreateRevisitAssignment extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            date: null,
        };
        this.handleSubmit = this.handleSubmit.bind(this);
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.convertDate = this.convertDate.bind(this);
    }

    handleFieldChange(evt) {
        let fieldName = evt.target.name;
        this.setState({ [fieldName]: evt.target.value });
    }

    convertDate(date) {
        const year = Number(date.slice(0, 4));
        const month = Number(date.slice(5, 7));
        const day = Number(date.slice(8, 10));
        const dtLocal = luxon.DateTime.local(year, month, day, 23, 59, 59);
        const dtUtc = dtLocal.toUTC();
        return dtUtc
    }

    handleSubmit(evt) {
        evt.preventDefault();
        if (this.state.date == null) {
            alert('Please provide a date for this revist assignment.')
        } else {
            this.setState({ loading: true })
            const formData = {
                'promptAssignment': this.props.assignmentId,
                'date': this.convertDate(this.state.date)
            }
            fetch('/api/assign_revisit', {
                headers: {
                    'Content-Type': 'application/json'
                },
                method: 'post',
                body: JSON.stringify(formData)
            })
                .then(res => res.json())
                .then(data => {
                    this.setState({ loading: false });
                    alert('Revisit assignment submitted')
                    this.props.toggle();
                })
        }
    }

    render() {
        return (
            <div className='modal-holder'>
                <div id='assign-prompt' className='modal'>
                <div className='modal-content'>
                    <form onSubmit={this.handleSubmit}>
                        <h2>Assign revisit</h2>
                        <p></p>
                        <div>
                            <label>Choose date for revisit </label><br></br>
                            <input onChange={this.handleFieldChange}
                                id='due-date'
                                name='date'
                                type='date'
                            />
                        </div>
                        <p>
                            {this.state.loading ? <Loader /> : <input type='submit' />}
                        </p>
                    </form>
                    <p><a href='#' onClick={this.props.toggle}>Cancel</a></p>
                </div>
            </div>
            </div>
        )
    }
}
