class Loader extends React.Component {
    constructor(props) {
      super(props);
      this.state = {
        stage: 0,
        stages: ['Submitting', 'Submitting.', 'Submitting..', 'Submitting...']
      };
      this.updateStage = this.updateStage.bind(this);
    }
  
    componentDidMount() {
      this.interval = setInterval(() => {this.updateStage()}, 500);
    }
  
    componentWillUnmount() {
      clearInterval(this.interval);
    }
  
    updateStage() {
      let stage = this.state.stage;
      stage = (stage + 1) % 4
      this.setState({ stage: stage });
    }
  
    render() {
      return (
        <span><b><i>{this.state.stages[this.state.stage]}</i></b></span>
      )
    }
  }
  