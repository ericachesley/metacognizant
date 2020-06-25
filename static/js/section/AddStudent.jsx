class AddStudent extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            studentEmail: '',
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
            studentEmail: this.state.studentEmail,
            sectionId: sessionStorage.getItem('sectionId')
        }
        fetch('/api/add_student', {
            headers: {
                'Content-Type': 'application/json'
            },
            method: 'post',
            body: JSON.stringify(formData)
        })
            .then(res => res.json())
            .then(data => {
                console.log(data);
                if (data[1]) {
                    alert("That student does not yet have an account. They will need to add their details the first time they log in.")
                }
                this.props.toggleAddStudent()
            })
    }

    render() {
        return (
            <div id='add-student'>
                <p></p>
                <form onSubmit={this.handleSubmit}>
                    <p>
                        Student email: <input
                            id='studentEmail'
                            type='text'
                            value={this.state.studentEmail}
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