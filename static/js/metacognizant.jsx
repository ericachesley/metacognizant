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
    this.handleFieldChange = this.handleFieldChange.bind(this);
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
        $.get('api/get_sections', {userId: this.props.userId}, (res) => {
            this.setState({sections: res})
        })
    }

    render() {
        
        const buttons = [];
        for (const section of this.state.sections) {
            buttons.push(
                <SectionButton section={section} 
                               setSection={this.props.setSection}
                               key={section['section_id']}/>
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
        this.handleClick=this.handleClick.bind(this);
    }

    handleClick(evt) {
        evt.preventDefault();

        if (evt.target.className === 'teacher') {
            this.props.setSection(evt.target.id);
        } else {
            alert('Student view coming soon!')
        }
    }

    render() {
        return(
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


class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
          assignments: []
        };
    }

    componentDidMount() {
        $.get('/api/get_pras', {sectionId: this.props.sectionId}, (res) => {
            this.setState({assignments: res})
        })
    }

    render() {
        
        const buttons = [];
        for (const assignment of this.state.assignments) {
            buttons.push(
                <AssignmentButton assignment={assignment} 
                                  key={assignment['pras_id']}/>
            )
        }
        
        return (
            <div id='section'>
                <h3>Class assignments {this.props.sectionId}</h3>
                <div id='container'>{buttons}</div>
            </div>
        )
    }
}


class AssignmentButton extends React.Component {
    render() {
        return(
            <div className='assignment_button_holder'>
                <button type='assignment_button' 
                        id={this.props.assignment['pras_id']} 
                        className={this.props.assignment['date']}>
                {this.props.assignment['date']}
                </button>
            </div>
        )
    }
}


class App extends React.Component {
    constructor(props) {
        super(props);

        //FOR TESTING PURPOSES ONLY!
        this.state = {
          loggedIn: true,
          userId: 23,
          sectionId: null
        };

        // this.state = {
        //   loggedIn: false,
        //   userId: null
        // };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.setSection = this.setSection.bind(this);
    }

  setLoggedIn(userId) {
    this.setState({userId: userId, loggedIn:true});
  }

  setSection(sectionId) {
    this.setState({sectionId: sectionId})
  }

  render() {

    return (
      <Router>
        <Switch>
          <Route path='/classes/class'>
            {(this.state.loggedIn && this.state.sectionId) ?
            <Section sectionId={this.state.sectionId} /> :
            <Redirect to='/' />
            }
          </Route>
          <Route path='/classes'>
          {console.log(this.state.sectionId)}
            {(this.state.loggedIn && this.state.sectionId) ?
            <Redirect to='/classes/class' /> :
            this.state.loggedIn ?
            <Overview userId={this.state.userId} setSection={this.setSection} /> :
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


