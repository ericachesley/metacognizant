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
            <section className='container-fluid'>
                <div id='about'>
                    <h2>Build students' metacognitive skills and ownership of learning with daily reflection prompts.</h2>
                </div>
                <div
                    className="row justify-content-center static-height">
                    <div
                        id='login'
                        className='col-5 col-xs-6 col-sm-6 col-md-3 col-lg-3 rounded shadow p-3 mb-5 rounded'
                    >
                        <div id='card'>
                            <form onSubmit={this.handleSubmit}>
                                {this.state.signIn ?
                                    <span><h3>Please log in.</h3></span> :
                                    <span><h3>Create an account.</h3></span>}
                                <p></p>
                                {this.state.signIn ?
                                    null :
                                    <div>
                                        <p>
                                            <input
                                                id='first'
                                                type='text'
                                                value={this.state.first}
                                                placeholder='First name'
                                                onChange={this.handleFieldChange}
                                            />
                                        </p>
                                        <p>
                                            <input
                                                id='last'
                                                type='text'
                                                value={this.state.last}
                                                placeholder='Last Name'
                                                onChange={this.handleFieldChange}
                                            />
                                        </p>
                                    </div>}
                                <p>
                                    <input
                                        id='email'
                                        type='text'
                                        value={this.state.email}
                                        placeholder='Email'
                                        onChange={this.handleFieldChange}
                                    />
                                </p>
                                <p>
                                    <input
                                        id='password'
                                        type='password'
                                        value={this.state.password}
                                        placeholder='Password'
                                        onChange={this.handleFieldChange}
                                    />
                                </p>
                                {this.state.signIn ?
                                    null :
                                    <p>
                                        <input
                                            id='password2'
                                            type='password'
                                            value={this.state.password2}
                                            placeholder='Confirm password'
                                            onChange={this.handleFieldChange}
                                        />
                                    </p>}
                                <p>
                                    <input type='submit' />
                                </p>
                            </form>
                        </div>
                        <p></p>
                        {this.state.signIn ?
                            <div>
                                <p><b>Don't have an account yet?</b><br></br>
                                    <a href='#' onClick={this.toggleForm}>Sign up</a></p>
                            </div> :
                            <div>
                                <p><b>Already have an account?</b><br></br>
                                    <a href='#' onClick={this.toggleForm}>Sign in</a></p>
                            </div>
                        }

                        <p>------or------</p>
                        <GoogleLogin
                            setLoggedIn={this.props.setLoggedIn}
                        />
                    </div>
                </div>
            </section>
        )
    }
}
