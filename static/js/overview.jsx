export class Overview extends React.Component {
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
  
  
export class SectionButton extends React.Component {
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
  