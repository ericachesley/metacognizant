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
            <div className="d-flex align-items-stretch h-100">
                <SideBar nav={[{ 'url': '/login', 'title': 'Login' }]} />
                <main className="main-content w-100" id='login-holder'>
                    <section className='container pt-2 right'>
                        <div className='row justify-content-center static-height'>
                            <div id='yourclasses' className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 my-20 rounded shadow p-3 rounded'>
                                <h2>Welcome to Metacognizant</h2>
                            </div>
                        </div>
                        <div className='row align-items-start justify-content-center static-height'>
                            <div
                                id='login'
                                className='col-5 col-xs-6 col-sm-6 col-md-6 col-lg-6 rounded shadow p-3 right'
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
                </main>
            </div >
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
            <div className="d-flex align-items-stretch h-100">
                <SideBar nav={[{ 'url': '#', 'title': 'Login' }]} />
                <main className="main-content w-100" id='landing'>
                    <section className='container pt-2 right'>
                        <div className='row justify-content-center static-height'>
                            <div id='yourclasses' className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded'>
                                <h2>Welcome to Metacognizant</h2>
                            </div>
                        </div>
                        <div className='row align-items-start justify-content-center static-height'>
                            <div id='about' className="col-5 col-xs-6 col-sm-6 col-md-11 col-lg-11 left">
                                <p className='lead'>
                                    Metacognizant helps teachers help students
                                    own their learning journey.</p>
                                <p>
                                    Through daily reflections, students develop
                                    their identities as active participants in
                                    their own education. By regularly thinking about
                                    their learning process, students can begin to
                                    notice what does and does not work for them
                                    as learners, and adapt their approach accordingly.
                                </p>
                                <p>
                                    Teachers easily select from a bank of proven,
                                    research-based prompts, or add their own. With
                                    a few clicks, teachers can schedule assignments
                                    and review responses, or even have students
                                    revist and reflect on their own past
                                    reflections, encouraging them to see (and
                                    celebrate) their growth and evolution over time.
                                </p>
                                <Link to='/login'>Get started</Link>
                            </div>
                        </div>
                    </section>
                </main>
            </div >
        )
    }
}

