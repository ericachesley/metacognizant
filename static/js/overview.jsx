class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            addClass: false,
            joinClass: false
        };
        this.toggleAdd = this.toggleAdd.bind(this);
        this.toggleJoin = this.toggleJoin.bind(this);
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

    toggleAdd() {
        if (this.state.addClass) {
            this.setState({ addClass: false });
        } else {
            this.setState({ addClass: true });
        }
    }

    toggleJoin() {
        if (this.state.joinClass) {
            this.setState({ joinClass: false });
        } else {
            this.setState({ joinClass: true });
        }
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
                {this.state.addClass ?
                    <AddClass toggleAdd={this.toggleAdd} /> :
                    <div>
                        <button onClick={this.toggleAdd}>
                            Create a new class
                        </button>
                    </div>
                }
                <h3>Student</h3>
                {studentSections.length > 0 ?
                    <div id='container'>{studentSections}</div> :
                    <p>You are not assigned as a student for any sections.</p>
                }
                {this.state.joinClass ?
                    <JoinClass toggleJoin={this.toggleJoin} /> :
                    <div>
                        <button onClick={this.toggleJoin}>
                            Join a class
                        </button>
                    </div>
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


class AddClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            start: null,
            end: null,
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFieldChange(evt) {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const formData = {
            name: this.state.name,
            start: this.state.start,
            end: this.state.end
        }
        fetch('/api/add_class', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.props.toggleAdd()
            })
    }

    render() {
        return (
            <div id='add-class'>
                <p></p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        Class name: <input
                            id='name'
                            type='text'
                            value={this.state.email}
                            onChange={this.handleFieldChange}
                        />
                    </p>
                    <p>
                        <label>Start date: </label>
                        <input onChange={this.handleFieldChange}
                            id='start'
                            name='start'
                            type='date'
                        />
                    </p>
                    <p>
                        <label>End date (optional): </label>
                        <input onChange={this.handleFieldChange}
                            id='end'
                            name='end'
                            type='date'
                        />
                    </p>
                    <p>
                        <input type='submit' />
                    </p>
                </form>
            </div>
        )
    }
}


class JoinClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionId: '',
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
    }

    handleFieldChange(evt) {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        const formData = {
            sectionId: this.state.sectionId,
        }
        fetch('/api/join_class', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.props.toggleJoin()
            })
    }

    render() {
        return (
            <div id='add-class'>
                <p></p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        Section id (get this from your teacher): <input
                            id='sectionId'
                            type='text'
                            value={this.state.sectionId}
                            onChange={this.handleFieldChange}
                        />
                    </p>
                    <p>
                        <input type='submit' />
                    </p>
                </form>
            </div>
        )
    }
}