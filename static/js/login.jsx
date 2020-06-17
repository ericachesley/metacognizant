class Login extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            email: '',
            password: '',
        };
        this.handleFieldChange = this.handleFieldChange.bind(this);
        this.handleSubmit = this.handleSubmit.bind(this);
        this.authenticate = this.authenticate.bind(this);
        this.loadClient = this.loadClient.bind(this);
        this.getClasses = this.getClasses.bind(this);
        this.getStudents = this.getStudents.bind(this);
        this.getTeachers = this.getTeachers.bind(this);
    }

    componentDidMount() {
        window.gapi.load("client:auth2", function () {
            gapi.auth2.init({ client_id: "43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com" });
        });
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

    authenticate() {
        return window.gapi.auth2.getAuthInstance()
            .signIn({ scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students" })
            .then(function () { console.log("Sign-in successful"); },
                function (err) { console.error("Error signing in", err); });
    }

    loadClient() {
        gapi.client.setApiKey("AIzaSyDjKoEMsGqlRdm57SiupTJjD41HDHP7DgM");
        return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/classroom/v1/rest")
            .then(function () { console.log("GAPI client loaded for API"); },
                function (err) { console.error("Error loading GAPI client for API", err); });
    }

    getTeachers(courseId, teachers) {
        return gapi.client.request({
            'path': `https://classroom.googleapis.com/v1/courses/${courseId}/teachers`,
        })
            //return gapi.client.classroom.courses.{courseId}.teachers.list({})
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                //console.log("Teachers", response.result.teachers);
                for (teacher of response.result.teachers) {
                    teachers.push(teacher);
                }
            },
                function (err) { console.error("Execute error", err); });
    }

    getStudents(courseId, students) {
        return gapi.client.request({
            'path': `https://classroom.googleapis.com/v1/courses/${courseId}/students`,
        })
            //return gapi.client.classroom.courses.{courseId}.teachers.list({})
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                //console.log("Students", response.result.students);
                for (student of response.result.students) {
                    students.push(student);
                }
            },
                function (err) { console.error("Execute error", err); });
    }

    updateDb(course, teachers, students) {
        const formData = {
            course: course,
            teachers: teachers,
            students: students
        };
        fetch('/api/update_from_google', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
            })
    }

    // Make sure the client is loaded and sign-in is complete before calling this method.
    getClasses() {
        return gapi.client.classroom.courses.list({})
            .then(function (response) {
                // Handle the results here (response.result has the parsed body).
                console.log("Response", response.result);
                for (course of response.result.courses) {
                    const teachers = []
                    const students = []
                    this.getTeachers(course.id, teachers);
                    this.getStudents(course.id, students);
                    console.log(teachers, students);
                    this.updateDb(course, teachers, students);
                }
            },
                function (err) { console.error("Execute error", err); });
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
                <button onClick={this.authenticate().then(this.loadClient)}>authorize and load</button>
                <button onClick={this.getClasses()}>execute</button>
            </div>
        )
    }
}