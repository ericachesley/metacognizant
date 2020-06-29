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

            <div className='row align-items-start justify-content-center static-height'>
                <div
                    id='login'
                    className='col-5 col-xs-6 col-sm-6 col-md-8 col-lg-8'
                >
                    <div id='card'>
                        <form onSubmit={this.handleSubmit}>
                            {this.state.signIn ?
                                <span><h1>Please log in.</h1></span> :
                                <span><h1>Create an account.</h1></span>}
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
                    <p></p>
                    {this.state.signIn ?
                        <div>
                            <p><b>Don't have an account yet?</b><br></br>
                                <a href='/#login-holder' onClick={this.toggleForm}>Sign up</a></p>
                        </div> :
                        <div>
                            <p><b>Already have an account?</b><br></br>
                                <a href='/#login-holder' onClick={this.toggleForm}>Sign in</a></p>
                        </div>
                    }
                    <p></p>
                    <p>------or------</p>
                    <p></p>
                    <GoogleLogin
                        setLoggedIn={this.props.setLoggedIn}
                    />
                </div>
            </div>
        )
    }
}

class Landing extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            signIn: true
        };
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
            <div id='front-page'>
                <section className='container-fluid' id='landing'>
                    <div className='row'>
                        <div id='intro' className="col-5 col-xs-6 col-sm-6 col-md-11 col-lg-11">
                            <h1>Metacognizant helps teachers help students
                                    own their learning journey.</h1>
                            <br></br>
                            <h2><Link to='/login'>Get started</Link></h2>
                        </div>
                    </div>
                </section>
                <section className='container-fluid' id='about-holder'>
                    <div className='row justify-content-center static-height'>
                        <a href='#about-holder'>
                            <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-chevron-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ 'fill': 'white' }}>
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </a>
                    </div>
                    <div className='row align-items-start static-height'>
                        <div id='about1' className=" about col-5 col-xs-6 col-sm-6 col-md-11 col-lg-11">
                            <p>
                                Through daily reflections, students develop
                                their identities as active participants in
                                their own education. By regularly thinking about
                                their learning process, students can begin to
                                notice what does and does not work for them
                                as learners, and adapt their approach accordingly.
                                </p>
                        </div>
                    </div>
                    <div className='row align-items-start static-height'>
                        <div id='about2' className="about col-5 col-xs-6 col-sm-6 col-md-11 col-lg-11">
                            <p>
                                Teachers easily select from a bank of proven,
                                research-based prompts, or add their own. With
                                a few clicks, teachers can schedule assignments
                                and review responses, or even have students
                                revist and reflect on their own past
                                reflections, encouraging them to see (and
                                celebrate) their growth and evolution over time.
                                </p>
                        </div>
                    </div>
                </section>
                <section className='container-fluid' id='login-holder'>
                <div className='row justify-content-center static-height'>
                        <a href='#login-holder'>
                            <svg width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-chevron-down" fill="currentColor" xmlns="http://www.w3.org/2000/svg" style={{ 'fill': 'white' }}>
                                <path fillRule="evenodd" d="M1.646 4.646a.5.5 0 0 1 .708 0L8 10.293l5.646-5.647a.5.5 0 0 1 .708.708l-6 6a.5.5 0 0 1-.708 0l-6-6a.5.5 0 0 1 0-.708z" />
                            </svg>
                        </a>
                    </div>
                    <Login setLoggedIn={this.setLoggedIn} />
                </section>
            </div>
        )
    }
}

