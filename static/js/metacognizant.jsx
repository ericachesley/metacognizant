"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route =  window.ReactRouterDOM.Route;
const Link =  window.ReactRouterDOM.Link;
const Prompt =  window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;


class Login extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      email: '',
      password: ''
    };
    this.handleFieldChange = this.handleFieldChange.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this);
  }

  handleFieldChange(evt) {
    let field_name = evt.target.id;
    if (field_name == 'email') {
      this.setState({email: evt.target.value});
    } else {
      this.setState({password: evt.target.value});
    }
  }

  handleSubmit(evt) {
    evt.preventDefault();
    const formData = {
      email: this.state.email,
      password: this.state.password
    }
    $.post('/api/login', formData, (res) => {
      alert(res);
      if (res == 'Login successful.') {
        this.props.setLoggedIn();
      }
    })
    this.setState({email: '', password: ''});
  }

  render() {
    return (
      <div>
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
    render() {
        return (
            <p>You made it!</p>
        )
    }
}

class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loggedIn: false,
          // redirect: null
        };
    this.setLoggedIn = this.setLoggedIn.bind(this);
    }

  setLoggedIn() {
    this.setState({loggedIn: true});
    // this.setState({redirect: '/classes'});
  }

  render() {

    return (
      <Router>
        <Switch>
          <Route path={'/classes'}>
            {this.state.loggedIn ?
            <Overview /> :
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


