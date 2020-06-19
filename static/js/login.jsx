class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
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
                <img src="/static/images/MetacognizantLogo.png" />
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
                <p>Or:</p>
                <GoogleLogin setLoggedIn={this.props.setLoggedIn} />
            </div>
        )
    }
}

class GoogleLogin extends React.Component {
    constructor(props) {
        super(props);
    }

    componentDidMount() {
        const loader = document.createElement('script');
        loader.src = 'https://apis.google.com/js/client:platform.js';
        window.document.body.appendChild(loader);

        loader.addEventListener('load', () => {
            gapi.load('auth2', () => {
                this.auth2 = gapi.auth2.init({
                    client_id: '43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com',
                    scope: "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly"
                });
            });
        })
    }

    signInCallback = (authResult) => {
        if (authResult['code']) {

            fetch('/api/login_with_google', {
                method: 'POST',
                headers: {
                    'X-Requested-With': 'XMLHttpRequest',
                    'Content-Type': 'application/octet-stream; charset=utf-8',
                },
                body: authResult['code']
            })
                .then(res => res.json())
                .then(data => {
                    this.props.setLoggedIn(data);
                })
        }
    }

    handleClick = () => {
        this.auth2.grantOfflineAccess()
            .then(this.signInCallback)
    }

    render() {
        return (
            <div id='google-login'>
                <button id="signinButton" onClick={this.handleClick}>
                    Sign in with Google
                </button>
            </div>
        )
    }
}

