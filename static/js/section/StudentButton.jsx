class StudentButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        sessionStorage.setItem('studentName', this.props.student['name'])
        this.setState({ clicked: true })
    }

    render() {
        if (this.state.clicked) {
            return (
                <Redirect to=
                    {`/classes/${this.props.sectionId}/student/${this.props.student['user_id']}`}
                />
            )
        } else {
            return (
                <div className='student_button_holder'>
                    <button type='student_button'
                    className='btn btn-secondary'
                        id={this.props.student['user_id']}
                        onClick={this.handleClick}>
                        {this.props.student['name']}
                    </button>
                </div>
            )
        }
    }
}