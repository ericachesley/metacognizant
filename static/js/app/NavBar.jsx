class NavBar extends React.Component {
  constructor(props) {
    super(props);
    this.handleLogout = this.handleLogout.bind(this);
  }

  handleLogout(evt) {
    fetch('/api/logout', {
      credentials: 'same-origin'
    })
      .then((response) => {
        console.log(response.status);
        if (response.ok) {
          sessionStorage.clear();
          this.props.refresh();
        }
      });
  }

  render() {
    return (
      <nav className="navbar navbar-expand-lg sticky-top navbar-dark bg-dark justify-content-between">
        <Link className="navbar-brand" to='/'>
          <img src="/static/images/MetacognizantLogoTiny.png" height="40" className="d-inline-block" alt="" />
            Metacognizant
        </Link>
        <button class="navbar-toggler" type="button" data-toggle="collapse" data-target="#navbarNavDropdown" aria-controls="navbarNavDropdown" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        {sessionStorage.getItem('userId') ?
          <div className="nav-item dropdown">
            <a className="nav-link dropdown-toggle" href="#" id="navbarDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              Welcome, {sessionStorage.getItem('name').split(' ')[0]}!
            </a>
            <div className="dropdown-menu" aria-labelledby="navbarDropdown">
              <a className="dropdown-item" href="#" onClick={this.handleLogout}>Log Out</a>
            </div>
          </div> :
          <a className="nav-link" href="/#login-holder" id="navbarDropdown">
            Log in
        </a>}
      </nav>
    )
  }
}


// class SideBar extends React.Component {
//   constructor(props) {
//     super(props);
//     this.state = {
//       sections: []
//     };
//   }

//   componentDidMount() {
//     fetch('/api/get_sections', {
//       credentials: 'same-origin'
//     })
//       .then(res => res.json())
//       .then(data => {
//         this.setState({ sections: data })
//       })
//   }

//   render() {
//     const curr = sessionStorage.getItem('sectionName');
//     const links = [];
//     for (const section of this.state.sections) {
//       const button = <SectionButton
//         update={this.props.update}
//         isCurr={section['name'] == curr}
//         section={section}
//         key={section['section_id']} />;
//       links.push(button);
//     }

//     return (
//       <aside className="navbar align-items-start w-25">
//         <nav className="nav flex-column position-sticky w-100">
//           <a className="navbar-brand" href="#sidebar-nav" style={{ 'color': '#343B40' }}>
//             Navigation
// 					</a>
//           {this.props.back}
//           <hr />
//           <p></p>
//           {links}
//         </nav>
//       </aside>
//     )
//   }
// }


class NavBarFooter extends React.Component {
  render() {
    return (
      <nav id='footernav' className="navbar fixed-bottom navbar-dark bg-dark">
      </nav>
    )
  }
}

class SideBar extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    this.getSections();
  }

  handleClick(evt) {
    sessionStorage.setItem('sectionId', evt.target.getAttribute('id'))
    sessionStorage.setItem('sectionName', evt.target.getAttribute('name'))
    sessionStorage.setItem('role', evt.target.getAttribute('role'))
  }

  getSections = () => {
    fetch('/api/get_sections', {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ sections: data })
      })
  }

  render() {
    const buttons = [];
    const curr = sessionStorage.getItem('sectionName');
    
    for (const section of this.state.sections) {
      let status = 'not-curr';
      if (section['name'] == curr) {
        status = 'curr';
      }
      buttons.push(
        <a href={`/classes/${section['section_id']}`}
          type='section_button'
          id={section['section_id']}
          name={section['name']}
          role={section['role']}
          className={status + ' ' + 'btn btn-secondary section-btn'}
          onClick={this.handleClick}>
          {section['name']}
        </a>
      )
    }

    return (
      <aside className="navbar align-items-start w-25">
        <nav className="nav flex-column position-sticky w-100">
          <a className="navbar-brand" href="#sidebar-nav" style={{ 'color': '#343B40' }}>
            Navigation
					</a>
          {this.props.back}
          <hr />
          <p></p>
          {buttons}
        </nav>
      </aside>
    )
  }
}

