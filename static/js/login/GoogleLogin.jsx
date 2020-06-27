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
                this.auth2 = gapi.auth2.getAuthInstance({
                    client_id: '43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com',
                    scope: "https://www.googleapis.com/auth/classroom.courses.readonly https://www.googleapis.com/auth/classroom.rosters.readonly https://www.googleapis.com/auth/classroom.coursework.students.readonly https://www.googleapis.com/auth/classroom.coursework.students https://www.googleapis.com/auth/classroom.coursework.me"
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
                <div className="g-signin2" data-theme='dark' data-longtitle="true" id="signinButton" onClick={this.handleClick}></div>
                {/* <button id="signinButton" onClick={this.handleClick}>
                    <span>Sign up / in with Google</span>
                </button> */}
            </div>
        )
    }
}

