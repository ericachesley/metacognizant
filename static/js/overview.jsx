class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: ''
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
            email: this.state.email,
            password: this.state.password
        }
        fetch('/api/login', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (typeof data[0] == 'number') {
                    this.props.setLoggedIn(data);
                } else {
                    alert(data);
                }
            })
        this.setState({ email: '', password: '' });
    }

    render() {
        return (
            <div id='login'>
                <p></p>
                <form onSubmit={this.handleSubmit}>Please log in.
            <p>
                        Email: <input
                            id='email'
                            type='text'
                            value={this.state.email}
                            onChange={this.handleFieldChange}
                        />
                    </p>
                    <p>
                        Password: <input
                            id='password'
                            type='text'
                            value={this.state.password}
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


class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: []
        };
    }

    componentDidMount() {
        sessionStorage.removeItem('role');
        fetch('/api/get_sections', {
            credentials: 'same-origin'
        })
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
                    setRole={this.props.setRole}
                    key={section['section_id']} />
            )
        }

        return (
            <div id='overview'>
                <h3>Welcome, {sessionStorage.getItem('name')}.</h3>
                <h3>Your classes</h3>
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