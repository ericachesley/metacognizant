"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;
//const DateTime = window.DateTime;


class App extends React.Component {
  constructor(props) {
    super(props);

    //FOR TESTING PURPOSES ONLY!
    // this.state = {
    //   loggedIn: true,
    //   userId: 3,
    //   sectionId: 5,
    //   assignmentId: 8,
    //   studentId: null,
    //   role: 'student'
    // };

    //REAL VERSION - DON'T DELETE!
    this.state = {
      loggedIn: false,
      userId: null,
      sectionId: null,
      assignmentId: null,
      studentId: null,
      role: null
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.setSection = this.setSection.bind(this);
    this.setAssignment = this.setAssignment.bind(this);
    this.setStudent = this.setStudent.bind(this);
    this.setRole = this.setRole.bind(this);
  }

  setLoggedIn(userId) {
    this.setState({ userId: userId, loggedIn: true });
  }

  setSection(sectionId) {
    this.setState({ sectionId: sectionId })
  }

  setAssignment(assignmentId) {
    this.setState({ assignmentId: assignmentId })
  }

  setStudent(studentId) {
    this.setState({ studentId: studentId })
  }

  setRole(role) {
    this.setState({ role: role })
  }

  render() {

    return (
      <Router>
        <Switch>
          <Route path='/test'>
            <Tester />
          </Route>
          <Route path='/assign'>
            {this.state.loggedIn ?
              <CreateAssignment userId={this.state.userId} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/:str'>
            {this.state.loggedIn ?
              <Student
                studentId={this.state.studentId}
                userId={this.state.userId}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/:int'>
            {this.state.loggedIn ?
              <Assignment
                assignmentId={this.state.assignmentId}
                role={this.state.role}
                userId={this.state.userId}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id'>
            {this.state.loggedIn ?
              <Section
                sectionId={this.state.sectionId}
                role={this.state.role}
                setAssignment={this.setAssignment}
                setStudent={this.setStudent}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes'>
            {this.state.loggedIn ?
              <Overview
                userId={this.state.userId}
                setSection={this.setSection}
                setRole={this.setRole}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/'>
            {this.state.loggedIn ?
              <Redirect to='/classes' /> :
              <Login setLoggedIn={this.setLoggedIn} />
            }
          </Route>
        </Switch>
      </Router>
    )
  }
}


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
      method: 'post',
      body: JSON.stringify(formData)
    })
      .then(res => res.json())
      .then(data => {
        if (typeof data === 'number') {
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


class Tester extends React.Component {
  render() {
    return (
      <div id='tester'>
        <p>Hello, world!</p>
      </div>
    )
  }
}


function Locator() {
  let location = useLocation();
  console.log(location)
  const path_bits = location.pathname.split('/')
  return (<p>{path_bits[path_bits.length - 1]}</p>)
}


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


