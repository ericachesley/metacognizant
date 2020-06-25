class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
            first: '',
            last: '',
            password2: '',
            signIn: true
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.toggleForm = this.toggleForm.bind(this);
    }

    handleFieldChange(evt) {
        this.setState({ [evt.target.id]: evt.target.value });
    }

    handleSubmit(evt) {
        evt.preventDefault();
        if (this.state.signIn) {
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
                    if (typeof data[0] == 'number') {
                        this.props.setLoggedIn(data);
                    } else {
                        alert(data);
                        if (data == 'It looks like this is your first time logging in. Please create an account to complete your login.') {
                            this.setState({ signIn: false });
                        }
                    }
                })
        } else {
            const formData = {
                email: this.state.email,
                password: this.state.password,
                first: this.state.first,
                last: this.state.last
            }
            if (formData.password != this.state.password2) {
                alert('Passwords must match. Please try again.')
                this.setState({ password: '', password2: '' });
            } else {
                fetch('/api/create_account', {
                    headers: {
                        'Content-Type': 'application/json'
                    },
                    method: 'post',
                    body: JSON.stringify(formData)
                })
                    .then(res => res.json())
                    .then(data => {
                        if (typeof data[0] == 'number') {
                            this.props.setLoggedIn(data);
                        } else {
                            alert(data);
                        }
                    })
            }
        }
    }

    toggleForm() {
        if (this.state.signIn) {
            this.setState({ signIn: false });
        } else {
            this.setState({ signIn: true });
        }
    }

    render() {
        return (
            <div id='login'>
                <img src="/static/images/MetacognizantLogo.png" />
                <p></p>
                <form onSubmit={this.handleSubmit}>
                    {this.state.signIn ?
                        <span><b>Please log in.</b></span> :
                        <span><b>Create an account.</b></span>}
                    {this.state.signIn ?
                        null :
                        <div>
                            <p>
                                First name: <input
                                    id='first'
                                    type='text'
                                    value={this.state.first}
                                    onChange={this.handleFieldChange}
                                />
                            </p>
                            <p>
                                Last name: <input
                                    id='last'
                                    type='text'
                                    value={this.state.last}
                                    onChange={this.handleFieldChange}
                                />
                            </p>
                        </div>}
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
                            type='password'
                            value={this.state.password}
                            onChange={this.handleFieldChange}
                        />
                    </p>
                    {this.state.signIn ?
                        null :
                        <p>
                            Confirm password: <input
                                id='password2'
                                type='password'
                                value={this.state.password2}
                                onChange={this.handleFieldChange}
                            />
                        </p>}
                    <p>
                        <input type='submit' />
                    </p>
                </form>
                <p>Or:</p>
                <GoogleLogin
                    setLoggedIn={this.props.setLoggedIn}
                />
                {this.state.signIn ?
                    <div>
                        <p><b>Don't have an account yet?</b></p>
                        <p><button onClick={this.toggleForm}>Sign up</button></p>
                    </div> :
                    <div>
                        <p><b>Already have an account?</b></p>
                        <p><button onClick={this.toggleForm}>Sign in</button></p>
                    </div>
                }
            </div>
        )
    }
}