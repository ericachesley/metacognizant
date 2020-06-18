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
                <GoogleLogin />
            </div>
        )
    }
}

class GoogleLogin extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            gapi: false
        };
        //this.signInCallback = this.signInCallback.bind(this);
    }

    componentDidMount() {
        const loader = document.createElement('script');
        loader.src = 'https://apis.google.com/js/client:platform.js';
        window.document.body.appendChild(loader);

        loader.addEventListener('load', () => {
            gapi.load('auth2', () => {
                this.auth2 = gapi.auth2.init({
                    client_id: '43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com',
                    scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students"
                });
                //this.setState({gapi: true})
            });
        })
    }

    signInCallback = (authResult) => {
        if (authResult['code']) {

            // Hide the sign-in button now that the user is authorized, for example:
            $('#signinButton').attr('style', 'display: none');

            // Send the code to the server
            $.ajax({
                type: 'POST',
                url: '/google',
                // Always include an `X-Requested-With` header in every AJAX request,
                // to protect against CSRF attacks.
                headers: {
                    'X-Requested-With': 'XMLHttpRequest'
                },
                contentType: 'application/octet-stream; charset=utf-8',
                success: function (result) {
                    // Handle or verify the server response.
                },
                processData: false,
                data: authResult['code']
            });
        } else {
            // There was an error.
        }
    }

    handleClick = () => {
        this.auth2.grantOfflineAccess()
            .then(this.signInCallback)
    }

    render() {
        //if (window.auth2) {
            return (
                <div id='google-login'>
                    <button id="signinButton" onClick={this.handleClick}>
                        Sign in with Google
                    </button>
                    {/* <button onClick={this.authenticate().then(this.loadClient)}>authorize and load</button> */}
                    {/* <button onClick={this.getClasses()}>execute</button> */}
                    <div id="my-signIn" />
                </div>
            )
        //} else {
            return (
                <p>GAPI loading</p>
            )
        //}
    }
}


// start() {
    //     // 2. Initialize the JavaScript client library.
    //     gapi.client.init({
    //         'apiKey': 'AIzaSyDjKoEMsGqlRdm57SiupTJjD41HDHP7DgM',
    //         // clientId and scope are optional if auth is not required.
    //         'clientId': '43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com',
    //         'scope': 'https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students',
    //     }).then(function () {
    //         // 3. Initialize and make the API request.
    //         return gapi.client.request({
    //             'path': 'https://content.googleapis.com/discovery/v1/apis/classroom/v1/rest',
    //         })
    //     }).then(function (response) {
    //         console.log(response.result);
    //     }, function (reason) {
    //         console.log('Error: ' + reason.result.error.message);
    //     }).then(
    //         this.getClasses()
    //     );
    // }

    //componentDidMount() {
    // window.gapi.load("client:auth2", function () {
    //     gapi.auth2.init({ client_id: "43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com" });
    // });

    // window.gapi.load("client:auth2", () => {
    //     window.gapi.client.init({
    //         clientId:
    //             "43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com",
    //     })
    //         .then(() => {
    //             this.auth = window.gapi.auth2.getAuthInstance()

    //                 .signIn({ scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students" })
    //                 .then(function () { console.log("Sign-in successful"); },
    //                     function (err) { console.error("Error signing in", err); });
    //         });
    // });


    //window.gapi.load('client', this.start);

    // window.gapi.load('client:auth2', () => {
    //     window.gapi.auth2.init({
    //         client_id: "43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com",
    //         scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students"
    //     }).then(() => {
    //         window.gapi.signin2.render('my-signIn', {
    //             'scope': 'profile email',
    //             'width': 250,
    //             'height': 50,
    //             'longtitle': false,
    //             'theme': 'dark',
    //             'onsuccess': this.onSuccess,
    //             'onfailure': this.onFailure
    //         })
    //     }).then(() => {
    //         this.authenticate()
    //     }).then(() => {
    //         this.loadClient()
    //     }).then(() => {
    //         this.getClasses()
    //     })
    // })
    //}

    // authenticate() {
    //     return gapi.auth2.getAuthInstance()
    //         .signIn({ scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students" })
    //         .then(function () { console.log("Sign-in successful"); },
    //             function (err) { console.error("Error signing in", err); });
    // }

    // loadClient() {
    //     gapi.client.setApiKey("AIzaSyDjKoEMsGqlRdm57SiupTJjD41HDHP7DgM");
    //     return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/classroom/v1/rest")
    //         .then(function () { console.log("GAPI client loaded for API"); },
    //             function (err) { console.error("Error loading GAPI client for API", err); });
    // }

    // getTeachers(courseId, teachers) {
    //     return gapi.client.request({
    //         'path': `https://classroom.googleapis.com/v1/courses/${courseId}/teachers`,
    //     })
    //         //return gapi.client.classroom.courses.{courseId}.teachers.list({})
    //         .then(function (response) {
    //             // Handle the results here (response.result has the parsed body).
    //             //console.log("Teachers", response.result.teachers);
    //             for (teacher of response.result.teachers) {
    //                 teachers.push(teacher);
    //             }
    //         },
    //             function (err) { console.error("Execute error", err); });
    // }

    // getStudents(courseId, students) {
    //     return gapi.client.request({
    //         'path': `https://classroom.googleapis.com/v1/courses/${courseId}/students`,
    //     })
    //         //return gapi.client.classroom.courses.{courseId}.teachers.list({})
    //         .then(function (response) {
    //             // Handle the results here (response.result has the parsed body).
    //             //console.log("Students", response.result.students);
    //             for (student of response.result.students) {
    //                 students.push(student);
    //             }
    //         },
    //             function (err) { console.error("Execute error", err); });
    // }

    // updateDb(course, teachers, students) {
    //     const formData = {
    //         course: course,
    //         teachers: teachers,
    //         students: students
    //     };
    //     fetch('/api/update_from_google', {
    //         headers: {
    //             'Content-Type': 'application/json'
    //         },
    //         method: 'post',
    //         body: JSON.stringify(formData)
    //     })
    //         .then(res => res.json())
    //         .then(data => {
    //             console.log(data);
    //         })
    // }

    // // Make sure the client is loaded and sign-in is complete before calling this method.
    // getClasses() {
    //     return gapi.client.classroom.courses.list({})
    //         .then(function (response) {
    //             // Handle the results here (response.result has the parsed body).
    //             console.log("Response", response.result);
    //             for (course of response.result.courses) {
    //                 const teachers = []
    //                 const students = []
    //                 this.getTeachers(course.id, teachers);
    //                 this.getStudents(course.id, students);
    //                 console.log(teachers, students);
    //                 this.updateDb(course, teachers, students);
    //             }
    //         },
    //             function (err) { console.error("Execute error", err); });
    // }
