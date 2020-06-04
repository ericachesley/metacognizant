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
      if (typeof res === 'number') {
        this.props.setLoggedIn(res);
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
    constructor(props) {
        super(props);
        this.state = {
          sections: []
        };
    }

    componentDidMount() {
        $.get('api/get_sections', {userId: this.props.userId}, (res) => {
            this.setState({sections: res})
        })
    }

    render() {
        
        const buttons = [];
        for (const section of this.state.sections) {
            buttons.push(
                <SectionButton section={section} key={section['section_id']}/>
            )
        }
        
        return (
            <div>
                <h3>Your classes {this.props.userId}</h3>
                <div id='container'>{buttons}</div>
            </div>

        )
    }
}


class SectionButton extends React.Component {
    render() {
        return(
            <div>
                <button type='button' 
                        id={this.props.section['section_id']} 
                        className={this.props.section['role']}>
                {this.props.section['name']}
                </button>
            </div>
        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          loggedIn: false,
          userId: null
        };
    this.setLoggedIn = this.setLoggedIn.bind(this);
    }

  setLoggedIn(userId) {
    this.setState({userId: userId, loggedIn:true});
  }

  render() {

    return (
      <Router>
        <Switch>
          <Route path={'/classes'}>
            {this.state.loggedIn ?
            <Overview userId={this.state.userId} /> :
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


