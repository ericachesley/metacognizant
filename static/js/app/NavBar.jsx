class NavBar extends React.Component {
    constructor(props) {
      super(props);
      this.handleLogout = this.handleLogout.bind(this);
    }
  
    handleLogout(evt) {
      fetch('/api/logout', {
        credentials: 'same-origin'
      })
        .then(function (response) {
          console.log(response.status);
          if (response.ok) {
            sessionStorage.clear();
          }
        });
    }
  
    render() {
      return (
        <div>
          <img src="/static/images/MetacognizantLogo.png" />
          <h3>Welcome, {sessionStorage.getItem('name')}.</h3>
          <h3>Navigation</h3>
          <p> <Link to='/classes'>Home</Link></p>
          <p><a href='/' onClick={this.handleLogout}>Log out</a></p>
        </div >
      )
    }
  }