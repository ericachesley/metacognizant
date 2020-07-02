class SectionButton extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            clicked: false
        };
        this.handleClick = this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();
        sessionStorage.setItem('sectionId', this.props.section['section_id'])
        sessionStorage.setItem('sectionName', this.props.section['name'])
        sessionStorage.setItem('role', this.props.section['role'])
        this.setState({ clicked: true })
    }

    render() {
        return (
            <div className='section_button_holder'>
                <button type='section_button'
                    id={this.props.section['section_id']}
                    className={'btn btn-secondary section-btn'}
                    onClick={this.handleClick}>
                    {this.props.section['name']}
                </button>
                {this.state.clicked ?
                    <Redirect
                        to={`/classes/${this.props.section['section_id']}`}
                    /> :
                    null}
            </div>
        )
    }
}
