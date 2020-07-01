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
            <div className='row d-flex align-items-start'>
                <div id='prevres' className='col-10 p-3 rounded shadow rounded'>
                    <h2>{this.props.prompt}</h2>
                    <p><b>Your response</b> <br></br> {this.state.res}</p>
                </div>
            </div>
        )
    }
}