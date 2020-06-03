"use strict";

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

class App extends React.Component {
  render() {
    return (
      <Login />
    )
  }
}

ReactDOM.render(
  <App />,
  document.querySelector('#app')
);