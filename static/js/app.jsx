"use strict";

const Router = window.ReactRouterDOM.BrowserRouter;
const Route = window.ReactRouterDOM.Route;
const Link = window.ReactRouterDOM.Link;
const Prompt = window.ReactRouterDOM.Prompt;
const Switch = window.ReactRouterDOM.Switch;
const Redirect = window.ReactRouterDOM.Redirect;
const useLocation = window.ReactRouterDOM.useLocation;
const useRouteMatch = window.ReactRouterDOM.useRouteMatch;

//import {Overview, SectionButton} from "overview";


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
    $.post('/api/login', formData, (res) => {
      if (typeof res === 'number') {
        this.props.setLoggedIn(res);
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

class Overview extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      sections: []
    };
  }

  componentDidMount() {
    $.get('api/get_sections', { userId: this.props.userId }, (res) => {
      this.setState({ sections: res })
    })
  }

  render() {

    const buttons = [];
    for (const section of this.state.sections) {
      buttons.push(
        <SectionButton section={section}
          setSection={this.props.setSection}
          key={section['section_id']} />
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
    this.state = {
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    evt.preventDefault();
    console.log(evt.target);
    if (evt.target.className === 'teacher') {
      this.props.setSection(evt.target.id);
      this.setState({ clicked: true })
    } else {
      alert('Student view coming soon!')
    }
  }

  render() {
    console.log(this.props.section['section_id'])
    if (this.state.clicked) {
      return (<Redirect to={`/classes/${this.props.section['name']}`} />)
    } else {
      return (
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
}


class Section extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      assignments: []
    };
  }

  componentDidMount() {
    $.get('/api/get_pras', { sectionId: this.props.sectionId }, (res) => {
      this.setState({ assignments: res })
    })
  }

  render() {
    const buttons = [];
    for (const assignment of this.state.assignments) {
      buttons.push(
        <AssignmentButton assignment={assignment}
          setAssignment={this.props.setAssignment}
          key={assignment['pras_id']} />
      )
    }
    return (
      <div id='section'>
        <h2>{<Locator />}</h2>
        <h3>Class assignments {this.props.sectionId}</h3>
        <p></p>
        <div id='container'>{buttons}
          <p></p>
          <Link to='/assign'>
            Create new assignment
          </Link>
        </div>
      </div>
    )
  }
}


class AssignmentButton extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      clicked: false
    };
    this.handleClick = this.handleClick.bind(this);
  }

  handleClick(evt) {
    evt.preventDefault();
    console.log(evt.target);
    this.props.setAssignment(evt.target.id);
    this.setState({ clicked: true })
  }

  render() {
    console.log(this.props.assignment)
    if (this.state.clicked) {
      return (<Redirect
        to={`${<Locator />}/${this.props.assignment['date']}`} />)
    } else {
      return (
        <div className='assignment_button_holder'>
          <button type='assignment_button'
            id={this.props.assignment['pras_id']}
            className={this.props.assignment['date']}
            onClick={this.handleClick}>
            {this.props.assignment['date']}
          </button>
        </div>
      )
    }
  }
}


class Assignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      prompt: '',
      responses: []
    };
  }

  componentDidMount() {
    $.get('/api/get_responses', { assignmentId: this.props.assignmentId },
      (res) => {
        console.log(res);
        this.setState({ prompt: res[0], responses: res[1] })
      })
  }


  render() {
    const responses = [];
    for (const count in this.state.responses) {
      responses.push(
        <tr key={count}>
          <td>{this.state.responses[count].student}</td>
          <td>{this.state.responses[count].content}</td>
          <td>{this.state.responses[count].date}</td>
        </tr>
      )
    }
    return (
      <div id='assignment'>
        <h2>{<Locator />}</h2>
        <h3>Prompt: {this.state.prompt}</h3>
        <table id='response-table'>
          <thead>
            <tr>
              <td><b>Student</b></td>
              <td><b>Response</b></td>
              <td><b>Submitted</b></td>
            </tr>
          </thead>
          <tbody>{responses}</tbody>
        </table>
      </div>
    )
  }
}


class CreateAssignment extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedSections: new Set(),
      selectedPrompt: null,
      date: null,
      sections: [],
      prompts: []
    };
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleFieldChange = this.handleFieldChange.bind(this);
  }


  componentDidMount() {
    $.get('api/get_sections', { userId: this.props.userId }, (res) => {
      this.setState({ sections: res })
    })
    $.get('api/get_prompts', { userId: this.props.userId }, (res) => {
      this.setState({ prompts: res })
    })
  }


  handleFieldChange(evt) {
    let fieldName = evt.target.name;
    console.log('Before:', fieldName, evt.target.value);
    if (evt.target.type === "checkbox") {
      if (evt.target.checked) {
        this.state.selectedSections.add(evt.target.value);
      } else {
        this.state.selectedSections.delete(evt.target.value);
      }
    } else {
      this.setState({ [fieldName]: evt.target.value });
    }
    console.log('After:', this.state);
  }


  handleSubmit(evt) {
    evt.preventDefault();
    const formData = {
      selectedSections: Array.from(this.state.selectedSections),
      selectedPrompt: this.state.selectedPrompt,
      date: this.state.date
    }
    console.log(formData)
    $.post('/api/assign_prompt', formData, (res) => {
      console.log(res)
      alert('Prompt assignment submitted')
    })
    this.setState({
      selectedSections: new Set(),
      selectedPrompt: null,
      date: null,
    });
  }


  render() {
    const sectionOptions = [];
    for (const section of this.state.sections) {
      if (section.role === 'teacher') {
        sectionOptions.push(
          <div className='checkbox' key={section.section_id}>
            <input onClick={this.handleFieldChange}
              type='checkbox'
              name='selectedSections'
              value={section.section_id}>
            </input>
            <label>{section.name}</label>
          </div>
        )
      }
    }

    const promptOptions = [];
    for (const prmpt of this.state.prompts) {
      promptOptions.push(
        <option key={prmpt.prompt_id} name='prompts' value={prmpt.prompt_id}>
          {prmpt.content}
        </option>
      )
    }

    return (
      <div id='assign-prompt'>
        <form onSubmit={this.handleSubmit}>Create new assignment.
          <p></p>
          <div>
            <label>Choose section(s) to assign prompt to: </label>
            {sectionOptions}
          </div>
          <p></p>
          <div>
            <label>Choose prompt to assign: </label>
            <select name="selectedPrompt" onChange={this.handleFieldChange}>
              <option name='prompts' value='select-one'>
                Select a prompt
              </option>
              {promptOptions}
            </select>
          </div>
          <p></p>
          <div>
            <label>Choose due date: </label>
            <input onChange={this.handleFieldChange}
              id='due-date'
              name='date'
              type='date'
            />
          </div>
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


function Locator() {
  let location = useLocation();
  console.log(location)
  const path_bits = location.pathname.split('/')
  return (<p>{path_bits[path_bits.length - 1]}</p>)
}


class App extends React.Component {
  constructor(props) {
    super(props);

    //FOR TESTING PURPOSES ONLY!
    this.state = {
      loggedIn: true,
      userId: 3,
      sectionId: 5,
      assignmentId: 8
    };

    //REAL VERSION - DON'T DELETE!
    // this.state = {
    //   loggedIn: false,
    //   userId: null,
    //   sectionId: null
    // };

    this.setLoggedIn = this.setLoggedIn.bind(this);
    this.setSection = this.setSection.bind(this);
    this.setAssignment = this.setAssignment.bind(this);
  }

  setLoggedIn(userId) {
    this.setState({ userId: userId, loggedIn: true });
  }

  setSection(sectionId) {
    this.setState({ sectionId: sectionId })
  }

  setAssignment(assignmentId) {
    this.setState({ assignmentId: assignmentId })
  }

  render() {

    return (
      <Router>
        <Switch>
          <Route path='/test'>
            <Tester />
          </Route>
          <Route path='/assign'>
            {this.state.loggedIn ?
              <CreateAssignment userId={this.state.userId} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id/:id'>
            {this.state.loggedIn ?
              <Assignment assignmentId={this.state.assignmentId} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes/:id'>
            {this.state.loggedIn ?
              <Section sectionId={this.state.sectionId}
                setAssignment={this.setAssignment} /> :
              <Redirect to='/' />
            }
          </Route>
          <Route path='/classes'>
            {this.state.loggedIn ?
              <Overview userId={this.state.userId}
                setSection={this.setSection} /> :
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


