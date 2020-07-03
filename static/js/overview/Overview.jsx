class Overview extends React.Component {
    constructor(props) {
        super(props);
        this.state = {
            sections: [],
            addClass: false,
            joinClass: false,
            modal: true
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
        if (sessionStorage.getItem('overviewModal')) {
            this.setState({ modal: false })
        }
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

    closeModal = () => {
        this.setState({ modal: false });
        sessionStorage.setItem('overviewModal', 'seen')
    }

    render() {
        const teacherSections = [];
        const studentSections = [];
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
        }

        return (
            <div className="everything-holder d-flex align-items-stretch h-100">

                <SideBar />

                {this.state.modal ?
                    <div className='modal targeted'>
                        <a href='#' onClick={this.closeModal}>X</a>
                        <div className='modal-content targeted shadow'>
                            <b>Hello {sessionStorage.getItem('name').split(' ')[0]}!</b>
                            <br></br>
                            Welcome to your class overview page.
                            <br></br><br></br>
                            Here you can see classes to which you <br></br>
                            are assigned as a teacher (under the <br></br>
                            apple) and classes to which you are <br></br>
                            assigned as a student (the backpack).
                            <br></br><br></br>
                            You can also create new classes to teach, <br></br>
                            or join additional classes as a student!
                        </div>
                    </div> : null}

                <main className="main-content w-100">
                    <section className='container-fluid' id='overview'>
                        <div className='row d-flex align-items-start'>
                            <div id='yourclasses' className='col-12'>
                                <h2 className='heading'>Your Classes</h2>
                            </div>
                        </div>
                        <div className='row d-flex align-items-start p-3'>
                            <div className='card-deck col-12 my-2'>
                                <div id='teacher' className='card rounded shadow p-3 rounded'>
                                    <div className='card-body'>
                                        <img id='apple' src='/static/images/apple.png' height='40' />
                                        {teacherSections.length > 0 ?
                                            <div className="card-text">{teacherSections}</div> :
                                            <p className="card-text">You are not assigned as a teacher for any sections.</p>
                                        }
                                    </div>
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
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
                                    <ul className="list-group list-group-flush">
                                        <li className="list-group-item">
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