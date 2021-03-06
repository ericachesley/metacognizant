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
        this.setState({ clicked: true })
    }

    render() {
        if (this.state.clicked) {
            return (
                <Redirect to=
                    {`/classes/${this.props.sectionId}/assignment/${this.props.assignment['pras_id']}`}
                />)
        } else {
            const date = this.props.assignment['date'];
            const dt = luxon.DateTime.fromHTTP(date);
            const dtLocal = dt.toLocal()
                .toLocaleString(luxon.DateTime.DATE_FULL);

            let status = 'not-late';
            if (this.props.late) {
                status = 'late';
            }

            if (this.props.assignment.res) {
                status += ' res'
            } else {
                status += ' no-res'
            }

            if (this.props.assignment['is_revisit']) {
                status += ' revisit'
            } else {
                status += ' original'
            }

            return (
                <div className='assignment_button_holder'>
                    <button type='assignment_button'
                        id={this.props.assignment['pras_id']}
                        className={status+' '+'btn btn-secondary assignment-btn'}
                        onClick={this.handleClick}
                        style={{'textAlign':'left'}}>
                        <b>{this.props.weekDay}, {dtLocal}</b>: {this.props.assignment.prompt}
                    </button>
                </div>
            )
        }
    }
}