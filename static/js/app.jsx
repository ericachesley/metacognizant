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
      headers: {
        'Content-Type': 'application/json'
      },
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


ReactDOM.render(
  <App />,
  document.querySelector('#app')
);


