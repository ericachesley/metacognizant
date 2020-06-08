class Assignment extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        prompt: '',
        responses: []
      };
    }
  
    componentDidMount() {
      fetch(`/api/get_responses?assignmentId=${this.props.assignmentId}`)
        .then(res => res.json())
        .then(data => {
          this.setState({ prompt: data[0], responses: data[1] })
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
      fetch(`/api/get_sections?userId=${this.props.userId}`)
        .then(res => res.json())
        .then(data => {
          this.setState({ sections: data })
        })
      fetch(`/api/get_prompts?userId=${this.props.userId}`)
        .then(res => res.json())
        .then(data => {
          this.setState({ prompts: data })
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
        'selectedSections': Array.from(this.state.selectedSections),
        'selectedPrompt': this.state.selectedPrompt,
        'date': this.state.date
      }
      console.log(formData)
      fetch('/api/assign_prompt', {
        method: 'post',
        body: JSON.stringify(formData)
      })
        .then(res => res.json())
        .then(data => {
          console.log(data)
          alert('Prompt assignment submitted')
        })
      this.setState({
        selectedSections: new Set(),
        selectedPrompt: null,
        date: null,
      });
      evt.target.reset();
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
                <select defaultValue='select-one' 
                        name="selectedPrompt" 
                        onChange={this.handleFieldChange}>
                  <option name='prompts' value='select-one'>
                    --Select a prompt--
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