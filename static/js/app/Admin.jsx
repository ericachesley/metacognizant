class Admin extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      users: []
    };
    this.handleClick = this.handleClick.bind(this);
  }

  componentDidMount() {
    sessionStorage.clear();
    fetch('/api/get_all_users', {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        this.setState({ users: data })
      })
  }

  handleClick(evt) {
    sessionStorage.clear();
    sessionStorage.setItem('name', evt.target.name);
    sessionStorage.setItem('userId', evt.target.getAttribute('userid'));
    const sectionid = evt.target.getAttribute('sectionid');
    if (sectionid) {
      sessionStorage.setItem('sectionId', sectionid);
      sessionStorage.setItem('sectionName', evt.target.getAttribute('sectionname'))
      sessionStorage.setItem('role', evt.target.getAttribute('role'))
    }
    fetch(`/api/update_logged_in?userId=${sessionStorage.getItem('userId')}`, {
      credentials: 'same-origin'
    })
      .then(res => res.json())
      .then(data => {
        console.log(data);
      })
  }

  render() {
    const users = []
    for (const user of this.state.users) {
      const list = [
        <h3 key={user.name}>
          <a href={'/classes'}
            name={user.name}
            userid={user.id}
            onClick={this.handleClick}>
            {user.name}
          </a>
        </h3>
      ]
      for (const section of user.sections) {
        list.push(
          <p key={user.name, section.id}>
            <a href={`/classes/${section.id}`}
              onClick={this.handleClick}
              sectionid={section.id}
              sectionname={section.name}
              userid={user.id}
              name={user.name}
              role={section.role}>
              {section.name}
            </a>: {section.role}
          </p>
        );
      }
      users.push(list);
    }

    return (
      <div className="d-flex align-items-stretch h-100">
        <main className="main-content w-100">
          <div id='admin'>
            {users}
          </div>
        </main>
      </div>
    )
  }
}