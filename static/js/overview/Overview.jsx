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
        const links = [];
        for (const section of this.state.sections) {
            const button = <SectionButton
                section={section}
                key={section['section_id']}
            />
            if (section.role === 'teacher') {
                teacherSections.push(button);
            } else {
                studentSections.push(button);
            }
            links.push(button);
        }
        console.log(links);
        return (
            <div className="d-flex align-items-stretch h-100">

                <aside className="navbar align-items-start w-25">
                    <nav className="nav flex-column position-sticky">
                        <a className="navbar-brand" href="#sidebar-nav">
                            Navigation
					</a>
                        {links}
                    </nav>
                </aside>

                <main className="main-content w-100">
                    <section className='container pt-2 right' id='overview'>
                        <div className='row d-flex align-items-start'>
                            <div id='yourclasses' className='col-12 mb-2'>
                                <h2 className='heading'>Your Classes</h2>
                            </div>
                        </div>
                        <div className='row d-flex align-items-start'>
                            <div className='card-deck col-12 my-2'>
                                <div id='teacher' className='card rounded shadow p-3 rounded'>
                                    <div className='card-body'>
                                        <img id='apple' src='/static/images/apple.png' height='40' />
                                        {teacherSections.length > 0 ?
                                            <div className="card-text">{teacherSections}</div> :
                                            <p className="card-text">You are not assigned as a teacher for any sections.</p>
                                        }
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            {this.state.addClass ?
                                                <AddClass toggleAdd={this.toggleAdd} /> :
                                                <div>
                                                    <a href='#' onClick={this.toggleAdd}>
                                                        Create a new class
                                                    </a>
                                                </div>
                                            }
                                        </li>
                                    </ul>
                                </div>
                                <div id='student' className='card rounded shadow p-3 rounded'>
                                    <div className='card-body'>
                                        <img src='/static/images/sac_de_cours.png' height='40' />
                                        {studentSections.length > 0 ?
                                            <div className="card-text">{studentSections}</div> :
                                            <p className="card-text">You are not assigned as a student for any sections.</p>
                                        }
                                    </div>
                                    <ul class="list-group list-group-flush">
                                        <li class="list-group-item">
                                            {this.state.joinClass ?
                                                <JoinClass toggleJoin={this.toggleJoin} /> :
                                                <div>
                                                    <a href='#' onClick={this.toggleJoin}>
                                                        Join a class
                                                    </a>
                                                </div>
                                            }
                                        </li>
                                    </ul>
                                </div>
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}