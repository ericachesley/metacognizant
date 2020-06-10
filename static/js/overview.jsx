class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: []
        };
    }

    componentDidMount() {
        //this.props.setSection(null);
        fetch(`/api/get_sections?userId=${this.props.userId}`)
            .then(res => res.json())
            .then(data => {
                this.setState({ sections: data })
            })
    }

    render() {

        const buttons = [];
        for (const section of this.state.sections) {
            buttons.push(
                <SectionButton section={section}
                    setSection={this.props.setSection}
                    setRole={this.props.setRole}
                    key={section['section_id']} />
            )
        }

        return (
            <div id='overview'>
                <h3>Your classes {this.props.userId}</h3>
                <div id='container'>{buttons}</div>
            </div>

        )
    }
}


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
        console.log(evt.target);
        this.props.setSection(evt.target.id);
        this.props.setRole(this.props.section['role'])
        this.setState({ clicked: true })
    }

    render() {
        console.log(this.props.section['section_id'])
        if (this.state.clicked) {
            return (<Redirect to={`/classes/${this.props.section['name']}`} />)
        } else {
            return (
                <div className='section_button_holder'>
                    <button type='section_button'
                        id={this.props.section['section_id']}
                        className={this.props.section['role']}
                        onClick={this.handleClick}>
                        {this.props.section['name']}
                    </button>
                </div>
            )
        }
    }
}