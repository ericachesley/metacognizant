"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem('userId'),
      path: '/'
    };
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.getSlug = this.getSlug.bind(this);
  }

  setLoggedIn(data) {
    let userId, name;
    [userId, name] = data;
    sessionStorage.setItem('userId', userId);
    sessionStorage.setItem('name', name);
    this.setState({ userId: userId });
  }

  getSlug() {
    const pathname = window.location.pathname;
    const pathbits = pathname.split('/');
    if (pathbits[pathbits.length - 1]) {
      return pathbits[pathbits.length - 1]
    } else {
      return pathbits[pathbits.length - 2]
    }
  }

  componentDidMount() {
    fetch('/api/get_path')
      .then(res => res.json())
      .then(data => {
        this.setState({ path: data })
      })
  }

  render() {
    const userId = sessionStorage.getItem('userId');
    return (
      <Router>
        {sessionStorage.getItem('userId') ?
          <NavBar /> :
          <span></span>}
        <Switch>
          <Route path='/admin'>
            <Admin />
          </Route>
          <Route path='/test'>
            <Tester />
          </Route>
          <Route path='/classes/:id/assign'>
            {userId ?
              <CreateAssignment /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/student/:id'>
            {userId ?
              <StudentResponses getSlug={this.getSlug} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/assignment/:id'>
            {userId ?
              <AssignmentResponses getSlug={this.getSlug} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id'>
            {userId ?
              <Section getSlug={this.getSlug} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes'>
            {userId ?
              <Overview /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/'>
            {userId ?
              <Redirect to='/classes' /> :
              <Login setLoggedIn={this.setLoggedIn} />
            }
          </Route>
        </Switch>
      </Router>
    )
  }
}


class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(evt) {
    fetch('/api/logout', {
      credentials: 'same-origin'
    })
      .then(function (response) {
        console.log(response.status);
        if (response.ok) {
          sessionStorage.clear();
        }
      });
  }

  render() {
    return (
      <div>
        <img src="/static/images/MetacognizantLogo.png" />
        <h3>Welcome, {sessionStorage.getItem('name')}.</h3>
        <h3>Navigation</h3>
        <p> <Link to='/classes'>Home</Link></p>
        <p><a href='/' onClick={this.handleLogout}>Log out</a></p>
      </div >
    )
  }
}


class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    sessionStorage.clear();
    fetch('/api/get_all_users', {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ users: data })
      })
  }

  handleClick(evt) {
    sessionStorage.clear();
    sessionStorage.setItem('name', evt.target.name);
    sessionStorage.setItem('userId', evt.target.getAttribute('userid'));
    const sectionid = evt.target.getAttribute('sectionid');
    if (sectionid) {
      sessionStorage.setItem('sectionId', sectionid);
      sessionStorage.setItem('sectionName', evt.target.getAttribute('sectionname'))
      sessionStorage.setItem('role', evt.target.getAttribute('role'))
    }
    fetch(`/api/update_logged_in?userId=${sessionStorage.getItem('userId')}`, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }

  render() {
    const users = []
    for (const user of this.state.users) {
      const list = [
        <h3 key={user.name}>
          <a href={'/classes'}
            name={user.name}
            userid={user.id}
            onClick={this.handleClick}>
            {user.name}
          </a>
        </h3>
      ]
      for (const section of user.sections) {
        list.push(
          <p key={user.name, section.id}>
            <a href={`/classes/${section.id}`}
              onClick={this.handleClick}
              sectionid={section.id}
              sectionname={section.name}
              userid={user.id}
              name={user.name}
              role={section.role}>
              {section.name}
            </a>: {section.role}
          </p>
        );
      }
      users.push(list);
    }

    return (
      <div>
        {users}
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


class Loader extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      stage: 0,
      stages: ['Submitting', 'Submitting.', 'Submitting..', 'Submitting...']
    };
    this.updateStage = this.updateStage.bind(this);
  }

  componentDidMount() {
    this.interval = setInterval(() => {this.updateStage()}, 500);
  }

  componentWillUnmount() {
    clearInterval(this.interval);
  }

  updateStage() {
    let stage = this.state.stage;
    stage = (stage + 1) % 4
    this.setState({ stage: stage });
  }

  render() {
    return (
      <span><b><i>{this.state.stages[this.state.stage]}</i></b></span>
    )
  }
}


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


