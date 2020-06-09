class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            assignments: []
        };
    }

    componentDidMount() {
        console.log(this.props)
        if (this.props.role === "teacher") {
            fetch(`/api/get_pras?sectionId=${this.props.sectionId}`)
                .then(res => res.json())
                .then(data => {
                    this.setState({ assignments: data })
                })
        } else {
            const dt = luxon.DateTime;
            const utcDt = dt.utc().toISO();
            console.log(utcDt);
            fetch(`/api/get_pras_to_date?sectionId=${this.props.sectionId}&date=${utcDt}`)
                .then(res => res.json())
                .then(data => {
                    this.setState({ assignments: data })
                })
        }
    }

    render() {
        const buttons = [];
        for (const assignment of this.state.assignments) {
            buttons.push(
                <AssignmentButton assignment={assignment}
                    setAssignment={this.props.setAssignment}
                    key={assignment['pras_id']} />
            )
        }
        return (
            <div id='section'>
                <h2>{<Locator />}</h2>
                <h3>Class assignments {this.props.sectionId}</h3>
                <p></p>
                <div id='container'>{buttons}
                    <p></p>
                    {this.props.role == 'teacher' ? <Link to='/assign'>
                        Create new assignment
                    </Link> : <p></p>}
                </div>
            </div>
        )
    }
}


class AssignmentButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        console.log(evt.target);
        this.props.setAssignment(evt.target.id);
        this.setState({ clicked: true })
    }

    render() {
        console.log(this.props.assignment)
        if (this.state.clicked) {
            return (<Redirect
                to={`${<Locator />}/${this.props.assignment['date']}`} />)
        } else {
            const date = this.props.assignment['date'];
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal().toLocaleString(luxon.DateTime.DATE_FULL);
            return (
                <div className='assignment_button_holder'>
                    <button type='assignment_button'
                        id={this.props.assignment['pras_id']}
                        className={this.props.assignment['date']}
                        onClick={this.handleClick}>
                        {dtLocal}
                    </button>
                </div>
            )
        }
    }
}