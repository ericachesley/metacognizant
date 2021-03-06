"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;
const useEffect = window.React.useEffect;


class App extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      userId: sessionStorage.getItem('userId'),
      //path: '/'
    };
    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.getSlug = this.getSlug.bind(this);
    this.refresh = this.refresh.bind(this);
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

  refresh() {
    this.setState({ userId: sessionStorage.getItem('userId') })
  }

  render() {
    const userId = sessionStorage.getItem('userId');
    return (
      <Router>
        <ScrollToTop />
        <NavBar refresh={this.refresh} />
        <Switch>
          <Route path='/admin'>
            <Admin />
          </Route>
          <Route path='/test'>
            <Tester />
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
          <Route path='/login'>
            {userId ?
              <Redirect to='/classes' /> :
              <Redirect to='/#login-holder' />
            }
          </Route>
          <Route path='/'>
            {userId ?
              (userId == 1 ?
                <Redirect to='/admin' /> :
                <Redirect to='/classes' />) :
              <Landing setLoggedIn={this.setLoggedIn} />
            }
          </Route>
        </Switch>
      </Router>
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

function ScrollToTop() {
  const { pathname } = useLocation();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, [pathname]);

  return null;
}

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


