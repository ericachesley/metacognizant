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
        <NavBar />
        <Switch>
          <Route path='/admin'>
            <Admin />
          </Route>
          <Route path='/test'>
            <Tester />
          </Route>
          <Route path='/assign'>
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
  render() {
    return (
      <div>
        <Link to='/classes'>Home</Link>
        <span> ~ </span>
        <Link to='/assign'>Create Assignment</Link>
        <span> ~ </span>
        {/* <Link to={this.props.history[-1]}>Back</Link> */}
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

  render() {
    const users = []
    for (const user of this.state.users) {
      const list = [<h3>{user.name}</h3>]
      for (const section of user.sections) {
        list.push(
          <p>{section.name} <a href={`/classes/${section.id}`}>{section.id}</a> {section.role}</p>
        );
        list.push(<p></p>)
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


