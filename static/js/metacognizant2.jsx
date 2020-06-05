"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;


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
    let field_name = evt.target.id;
    if (field_name == 'email') {
      this.setState({ email: evt.target.value });
    } else {
      this.setState({ password: evt.target.value });
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const formData = {
      email: this.state.email,
      password: this.state.password
    }
    $.post('/api/login', formData, (res) => {
      if (typeof res === 'number') {
        this.props.setLoggedIn(res);
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

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentDidMount() {
    $.get('api/get_sections', { userId: this.props.userId }, (res) => {
      this.setState({ sections: res })
    })
  }

  render() {

    const buttons = [];
    for (const section of this.state.sections) {
      buttons.push(
        <SectionButton section={section}
          setSection={this.props.setSection}
          key={section['section_id']} />
      )
    }

    return (
      <div id='overview'>
        <h3>Your classes {this.props.userId}</h3>
        <div id='container'>{buttons}</div>
      </div>

    )
  }
}


class SectionButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    evt.preventDefault();
    console.log(evt.target);
    if (evt.target.className === 'teacher') {
      this.props.setSection(evt.target.id);
      this.setState({ clicked: true })
    } else {
      alert('Student view coming soon!')
    }
  }

  render() {
    console.log(this.props.section['section_id'])
    if (this.state.clicked) {
      return (<Redirect to={`/classes/${this.props.section['name']}`} />)
    } else {
      return (
        <div className='section_button_holder'>
          <button type='section_button'
            id={this.props.section['section_id']}
            className={this.props.section['role']}
            onClick={this.handleClick}>
            {this.props.section['name']}
          </button>
        </div>
      )
    }
  }
}


class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: []
    };
  }

  componentDidMount() {
    $.get('/api/get_pras', { sectionId: this.props.sectionId }, (res) => {
      this.setState({ assignments: res })
    })
  }


  render() {
    const buttons = [];
    for (const assignment of this.state.assignments) {
      buttons.push(
        <AssignmentButton assignment={assignment}
          setAssignment={this.props.setAssignment}
          key={assignment['pras_id']} />
      )
    }
    return (
      <div id='section'>
        <h2>{<Locator />}</h2>
        <h3>Class assignments {this.props.sectionId}</h3>
        <div id='container'>{buttons}</div>
      </div>
    )
  }
}


class AssignmentButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    evt.preventDefault();
    console.log(evt.target);
    this.props.setAssignment(evt.target.id);
    this.setState({ clicked: true })
  }

  render() {
    console.log(this.props.assignment)
    if (this.state.clicked) {
      return (<Redirect to={`${<Locator />}/${this.props.assignment['date']}`} />)
    } else {
      return (
        <div className='assignment_button_holder'>
          <button type='assignment_button'
            id={this.props.assignment['pras_id']}
            className={this.props.assignment['date']}
            onClick={this.handleClick}>
            {this.props.assignment['date']}
          </button>
        </div>
      )
    }
  }
}


class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prompt: '',
      responses: []
    };
  }

  componentDidMount() {
    $.get('/api/get_responses', { assignmentId: this.props.assignmentId },
      (res) => {
        console.log(res);
        this.setState({prompt:res[0], responses: res[1] })
      })
  }


  render() {
    const responses = [];
    for (const count in this.state.responses) {
      responses.push(
        <p key={count}>
          {this.state.responses[count].student}
          {this.state.responses[count].content}
          {this.state.responses[count].date}</p>
      )
    }
    return (
      <div id='assignment'>
        <h2>{<Locator />}</h2>
        <h3>Prompt: {this.state.prompt}</h3>
        <h3>Responses {this.props.assignmentId}</h3>
        <div id='container'>{responses}</div>
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
  return (<p>{location.pathname}</p>)
}


class App extends React.Component {
  constructor(props) {
    super(props);

    //FOR TESTING PURPOSES ONLY!
    this.state = {
      loggedIn: true,
      userId: 3,
      sectionId: 5,
      assignmentId: 8
    };

    //REAL VERSION - DON'T DELETE!
    // this.state = {
    //   loggedIn: false,
    //   userId: null,
    //   sectionId: null
    // };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.setSection = this.setSection.bind(this);
    this.setAssignment = this.setAssignment.bind(this);
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

  render() {

    return (
      <Router>
        <Switch>
          <Route path='/test'>
            <Tester />
          </Route>
          <Route path='/classes/:id/:id'>
            {this.state.loggedIn ?
              <Assignment assignmentId={this.state.assignmentId} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id'>
            {this.state.loggedIn ?
              <Section sectionId={this.state.sectionId}
                setAssignment={this.setAssignment} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes'>
            {this.state.loggedIn ?
              <Overview userId={this.state.userId}
                setSection={this.setSection} /> :
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

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


