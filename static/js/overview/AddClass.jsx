class AddClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            name: '',
            start: null,
            end: null,
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
            name: this.state.name,
            start: this.state.start,
            end: this.state.end
        }
        fetch('/api/add_class', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.props.toggleAdd()
            })
    }

    render() {
        return (
            <div id='add-class'>
                <p></p>
                <form onSubmit={this.handleSubmit}>
                        Class name*<br></br>
                        <input
                            id='name'
                            type='text'
                            value={this.state.email}
                            onChange={this.handleFieldChange}
                        />
                        <br></br>Start*<br></br>
                        <input onChange={this.handleFieldChange}
                            id='start'
                            name='start'
                            type='date'
                        />
                        <br></br>End<br></br>
                        <input onChange={this.handleFieldChange}
                            id='end'
                            name='end'
                            type='date'
                        />
                    <p></p>
                    <p>
                        <input type='submit' />
                    </p>
                </form>
                <p><a href='#' onClick={this.props.toggleAdd}>Cancel</a></p>
            </div>
        )
    }
}
