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

    //FOR TESTING PURPOSES ONLY!
    // this.state = {
    //   userId: 3,
    // };

    //REAL VERSION - DON'T DELETE!
    this.state = {
      userId: sessionStorage.getItem('userId'),
      path: '/'
    };
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.getSlug = this.getSlug.bind(this);
    //this.updateHistory = this.updateHistory.bind(this);
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

  // componentWillUnmount() {
  //   fetch('/api/store_history', {
  //     headers: {
  //       'Content-Type': 'application/json'
  //     },
  //     method: 'post',
  //     body: sessionStorage.getItem('history')
  //   })
  //     .then(res => res.json())
  //     .then(data => {
  //       console.log(data);
  //     })
  // }

  // updateHistory() {
  //   if (sessionStorage.getItem('history')) {
  //     const history = sessionStorage.getItem('history')
  //     history.concat(' ', window.location.pathname);
  //     sessionStorage.setItem('history', history)
  //   } else {
  //     sessionStorage.setItem('history', window.location.pathname)
  //   }
  // }

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
              <Student getSlug={this.getSlug} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/assignment/:id'>
            {userId ?
              <Assignment getSlug={this.getSlug} /> :
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
    sessionStorage.clear();
  }

  render() {
    return (
      <div>
        <img src="/static/images/MetacognizantLogo.png" />
        <h3>Welcome, {sessionStorage.getItem('name')}.</h3>
        <h3>Navigation</h3>
        <p> <Link to='/classes'>Home</Link></p>
        <p><a href='/' onClick={this.handleLogout}>Log out</a></p>
      </div>
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
    fetch('/api/get_all_users', {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ users: data })
      })
  }

  handleClick(evt) {
    sessionStorage.setItem('name', evt.target.name);
    sessionStorage.setItem('userId', evt.target.getAttribute('userid'));
    const role = evt.target.getAttribute('role');
    if (role) {
      sessionStorage.setItem('role', role);
    } else {
      sessionStorage.removeItem('role');
    }
    fetch(`/api/update_logged_in?userId=${sessionStorage.getItem('userId')}`, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        console.log("User updated")
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
              id={section.id}
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


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


