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
    };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.getSlug = this.getSlug.bind(this);
  }

  setLoggedIn(userId) {
    sessionStorage.setItem('userId', userId);
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

  render() {
    const userId = sessionStorage.getItem('userId');
    return (
      <Router>
        <NavBar />
        <Switch>
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


