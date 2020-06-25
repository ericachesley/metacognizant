class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            addClass: false,
            joinClass: false
        };
        this.toggleAdd = this.toggleAdd.bind(this);
        this.toggleJoin = this.toggleJoin.bind(this);
        this.getSections = this.getSections.bind(this);
    }

    componentDidMount() {
        sessionStorage.removeItem('sectionId');
        sessionStorage.removeItem('sectionName');
        sessionStorage.removeItem('role');
        sessionStorage.removeItem('studentName');
        this.getSections();
    }

    getSections() {
        fetch('/api/get_sections', {
            credentials: 'same-origin'
        })
            .then(res => res.json())
            .then(data => {
                this.setState({ sections: data })
            })
    }

    toggleAdd() {
        if (this.state.addClass) {
            this.setState({ addClass: false });
            this.getSections();
        } else {
            this.setState({ addClass: true });
        }
    }

    toggleJoin() {
        if (this.state.joinClass) {
            this.setState({ joinClass: false });
            this.getSections();
        } else {
            this.setState({ joinClass: true });
        }
    }

    render() {
        const teacherSections = [];
        const studentSections = [];
        for (const section of this.state.sections) {
            if (section.role === 'teacher') {
                teacherSections.push(
                    <SectionButton
                        section={section}
                        key={section['section_id']}
                    />
                );
            } else {
                studentSections.push(
                    <SectionButton
                        section={section}
                        key={section['section_id']}
                    />
                );
            }
        }
        return (
            <div id='overview'>
                <h2>Your classes</h2>
                <h3>Teacher</h3>
                {teacherSections.length > 0 ?
                    <div id='container'>{teacherSections}</div> :
                    <p>You are not assigned as a teacher for any sections.</p>
                }
                <p></p>
                {this.state.addClass ?
                    <AddClass toggleAdd={this.toggleAdd} /> :
                    <div>
                        <button onClick={this.toggleAdd}>
                            Create a new class
                        </button>
                    </div>
                }
                <h3>Student</h3>
                {studentSections.length > 0 ?
                    <div id='container'>{studentSections}</div> :
                    <p>You are not assigned as a student for any sections.</p>
                }
                <p></p>
                {this.state.joinClass ?
                    <JoinClass toggleJoin={this.toggleJoin} /> :
                    <div>
                        <button onClick={this.toggleJoin}>
                            Join a class
                        </button>
                    </div>
                }
            </div>
        )
    }
}