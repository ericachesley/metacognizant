class JoinClass extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionId: '',
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
            sectionId: this.state.sectionId,
        }
        fetch('/api/join_class', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                this.props.toggleJoin()
            })
    }

    render() {
        return (
            <div id='add-class'>
                <p></p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        Section ID (get this from your teacher): <input
                            id='sectionId'
                            type='text'
                            value={this.state.sectionId}
                            onChange={this.handleFieldChange}
                        />
                    </p>
                    <p>
                        <input type='submit' />
                    </p>
                </form>
                <p><a href='#' onClick={this.props.toggleJoin}>Cancel</a></p>
            </div>
        )
    }
}