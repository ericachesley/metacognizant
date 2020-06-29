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
            links.push(
                {
                    'url': `/classes/${section['section_id']}`,
                    'title': section['name']
                }
            );
        }
        console.log(links);
        return (
            <div className="d-flex align-items-stretch h-100">
                <SideBar nav={links} />
                <main className="main-content w-100">
                    <section className='container pt-2 right' id='overview'>
                        <Link className='back' to='/classes'>
                            <svg id='backicon' width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-arrow-left-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.354 10.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.207 7.5H11a.5.5 0 0 1 0 1H6.207l2.147 2.146z" />
                            </svg>
                        Log out
                        </Link>
                        <div className='row justify-content-center static-height'>
                            <div id='yourclasses' className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded'>
                                <h2>Your Classes</h2>
                            </div>
                        </div>
                        <div className='row justify-content-center static-height'>
                            <div id='teacher' className='col-6 col-xs-6 col-sm-6 col-md-5 col-lg-5 rounded shadow p-3 mb-5 rounded'>
                                <img id='apple' src='/static/images/apple.png' height='40' />
                                {teacherSections.length > 0 ?
                                    <div id='container'>{teacherSections}</div> :
                                    <p>You are not assigned as a teacher for any sections.</p>
                                }
                                <p></p>
                                {this.state.addClass ?
                                    <AddClass toggleAdd={this.toggleAdd} /> :
                                    <div>
                                        <a href='#' onClick={this.toggleAdd}>
                                            Create a new class
                                            </a>
                                    </div>
                                }
                            </div>
                            <div id='student' className='col-5 col-xs-6 col-sm-6 col-md-5 col-lg-5 rounded shadow p-3 mb-5 rounded'>
                                <img src='/static/images/sac_de_cours.png' height='40' />
                                {studentSections.length > 0 ?
                                    <div id='container'>{studentSections}</div> :
                                    <p>You are not assigned as a student for any sections.</p>
                                }
                                <p></p>
                                {this.state.joinClass ?
                                    <JoinClass toggleJoin={this.toggleJoin} /> :
                                    <div>
                                        <a href='#' onClick={this.toggleJoin}>
                                            Join a class
                                            </a>
                                    </div>
                                }
                            </div>
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}