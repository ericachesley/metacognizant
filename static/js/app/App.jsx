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
    this.setState({userId: sessionStorage.getItem('userId')})
  }

  // componentDidMount() {
  //   fetch('/api/get_path')
  //     .then(res => res.json())
  //     .then(data => {
  //       this.setState({ path: data })
  //     })
  // }

  render() {
    const userId = sessionStorage.getItem('userId');
    return (
      <Router>
          <NavBar refresh={this.refresh}/>
          {/* <NavBarFooter /> */}
        <Switch>
          <Route path='/admin'>
            <Admin />
          </Route>
          <Route path='/test'>
            <Tester />
          </Route>
          {/* <Route path='/classes/:id/assign'>
            {userId ?
              <CreateAssignment /> :
              <Redirect to='/' />
            }
          </Route> */}
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
            <Landing />
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


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


