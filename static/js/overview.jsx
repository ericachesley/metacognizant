class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: []
        };
    }

    componentDidMount() {
        sessionStorage.removeItem('sectionId');
        sessionStorage.removeItem('sectionName');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('studentName');
        fetch('/api/get_sections', {
            credentials: 'same-origin'
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ sections: data })
            })
    }

    render() {
        const teacherSections = [];
        const studentSections = [];
        for (const section of this.state.sections) {
            if (section.role === 'teacher') {
                teacherSections.push(
                    <SectionButton
                        section={section}
                        key={section['section_id']}
                    />
                );
            } else {
                studentSections.push(
                    <SectionButton
                        section={section}
                        key={section['section_id']}
                    />
                );
            }
        }
        return (
            <div id='overview'>
                <h2>Your classes</h2>
                <h3>Teacher</h3>
                {teacherSections.length > 0 ?
                    <div id='container'>{teacherSections}</div> :
                    <p>You are not assigned as a teacher for any sections.</p>
                }
                <h3>Student</h3>
                {studentSections.length > 0 ?
                    <div id='container'>{studentSections}</div> :
                    <p>You are not assigned as a student for any sections.</p>
                }
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
        sessionStorage.setItem('sectionId', this.props.section['section_id'])
        sessionStorage.setItem('sectionName', this.props.section['name'])
        sessionStorage.setItem('role', this.props.section['role'])
        this.setState({ clicked: true })
    }

    render() {
        if (this.state.clicked) {
            return (
                <Redirect
                    to={`/classes/${this.props.section['section_id']}`}
                />
            )
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