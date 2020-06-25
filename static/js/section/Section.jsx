class Section extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sectionId: this.props.getSlug(),
            sectionName: sessionStorage.getItem('sectionName'),
            role: sessionStorage.getItem('role')
        };
    }

    componentDidMount() {
        sessionStorage.removeItem('studentName');
    }

    render() {
        return (
            <div id='section'>
                <Link to='/classes'>Back to all classes</Link>
                <h1>{this.state.sectionName}</h1>
                <h2>Role: {this.state.role}</h2>
                <p></p>
                {this.state.role === 'teacher' ?
                    <TeacherSection sectionId={this.state.sectionId} /> :
                    <StudentSection sectionId={this.state.sectionId} />}
            </div>
        )
    }
}