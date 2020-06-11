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

    sessionStorage.clear();

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
      userId: sessionStorage.getItem('userId'),
      // sectionId: sessionStorage.getItem('sectionId'),
      // assignmentId: sessionStorage.getItem('assignmentId'),
      // studentId: sessionStorage.getItem('studentId'),
      role: sessionStorage.getItem('role')
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    // this.setSection = this.setSection.bind(this);
    // this.setAssignment = this.setAssignment.bind(this);
    // this.setStudent = this.setStudent.bind(this);
    this.setRole = this.setRole.bind(this);
    // this.updateState = this.updateState.bind(this);
    this.getSlug = this.getSlug.bind(this);
  }

  // updateState() {
  //   this.setState({
  //     userId: sessionStorage.getItem('userId'),
  //     sectionId: sessionStorage.getItem('sectionId'),
  //     assignmentId: sessionStorage.getItem('assignmentId'),
  //     studentId: sessionStorage.getItem('studentId'),
  //     role: sessionStorage.getItem('role')
  //   })
  // }

  setLoggedIn(userId) {
    sessionStorage.setItem('userId', userId);
    this.setState({ userId: userId });
  }

  // setSection(sectionId) {
  //   sessionStorage.setItem('sectionId', sectionId);
  //   this.setState({ sectionId: sectionId })
  // }

  // setAssignment(assignmentId) {
  //   sessionStorage.setItem('assignmentId', assignmentId);
  //   this.setState({ assignmentId: assignmentId })
  // }

  // setStudent(studentId) {
  //   sessionStorage.setItem('studentId', studentId);
  //   this.setState({ studentId: studentId })
  // }

  setRole(role) {
    sessionStorage.setItem('role', role);
    this.setState({ role: role })
  }


  getSlug() {
    const pathname = window.location.pathname;
    const pathbits = pathname.split('/');
    return pathbits[pathbits.length - 1]
  }

  render() {
    const userId = sessionStorage.getItem('userId');
    return (
      <Router>
        <Switch>
          <Route path='/test'>
            <Tester />
          </Route>
          <Route path='/assign'>
            {userId ?
              <CreateAssignment userId={this.state.userId} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/student/:id'>
            {userId ?
              <Student
                // studentId={window.location.pathname}
                userId={this.state.userId}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/assignment/:id'>
            {userId ?
              <Assignment
                // assignmentId={window.location.pathname}
                role={this.state.role}
                userId={this.state.userId}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id'>
            {userId ?
              <Section
                // sectionId={getSlug()}
                role={this.state.role}
              // setAssignment={this.setAssignment}
              // setStudent={this.setStudent}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes'>
            {userId ?
              <Overview
                userId={this.state.userId}
                // setSection={this.setSection}
                setRole={this.setRole}
              // updateState={this.updateState}
              /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/'>
            {this.state.userId ?
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


function getSlug() {
  const pathname = window.location.pathname;
    const pathbits = pathname.split('/');
    return pathbits[pathbits.length - 1]
}


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


