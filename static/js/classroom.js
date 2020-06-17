/**
   * Sample JavaScript code for classroom.courses.list
   * See instructions for running APIs Explorer code samples locally:
   * https://developers.google.com/explorer-help/guides/code_samples#javascript
   */

function authenticate() {
    return gapi.auth2.getAuthInstance()
        .signIn({ scope: "https://www.googleapis.com/auth/classroom.courses https://www.googleapis.com/auth/classroom.rosters https://www.googleapis.com/auth/classroom.coursework.students" })
        .then(function () { console.log("Sign-in successful"); },
            function (err) { console.error("Error signing in", err); });
}
function loadClient() {
    gapi.client.setApiKey("AIzaSyDjKoEMsGqlRdm57SiupTJjD41HDHP7DgM");
    return gapi.client.load("https://content.googleapis.com/discovery/v1/apis/classroom/v1/rest")
        .then(function () { console.log("GAPI client loaded for API"); },
            function (err) { console.error("Error loading GAPI client for API", err); });
}
function getTeachers(courseId, teachers) {
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
function getStudents(courseId, students) {
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
function updateDb(course, teachers, students) {
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
function getClasses() {
    return gapi.client.classroom.courses.list({})
        .then(function (response) {
            // Handle the results here (response.result has the parsed body).
            console.log("Response", response.result);
            for (course of response.result.courses) {
                const teachers = []
                const students = []
                getTeachers(course.id, teachers);
                getStudents(course.id, students);
                console.log(teachers, students);
                updateDb(course, teachers, students);
            }
        },
            function (err) { console.error("Execute error", err); });
}
gapi.load("client:auth2", function () {
    gapi.auth2.init({ client_id: "43951011110-a6h3g2mrqr9cg1r2ipor23gpt10uoadc.apps.googleusercontent.com" });
});


