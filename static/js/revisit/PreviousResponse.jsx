class PreviousResponse extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            res: '',
        };
    }

    componentDidMount() {
        fetch(`/api/get_prev_response?prasId=${this.props.prasId}`, {
            headers: {
                'Content-Type': 'application/json'
            },
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.setState({ res: data });
            })
    }

    render() {
        return (
            <div>
                <h2>Prompt: {this.props.prompt}</h2>
                <p><b>Your previous response</b> <br></br> {this.state.res}</p>
                <p>
                    How has your perspective changed (or not) since you wrote
                    this reflection?
                    </p>
            </div>
        )
    }
}