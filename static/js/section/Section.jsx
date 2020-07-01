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
        const links = [];
        return (
            <div className="d-flex align-items-stretch h-100">

                <aside className="navbar align-items-start w-25">
                    <nav className="nav flex-column position-sticky">
                        <a className="navbar-brand" href="#sidebar-nav">
                            Navigation
					</a>
                    <Link className='back' to='/classes'>
                        Back to all classes
                        </Link>
                        {/* {links} */}
                    </nav>
                </aside>

                <main className="main-content w-100">
                    <section id='section' className='container-fluid'>
                        <div className='row d-flex align-items-start'>
                            <div id='yourclasses' className='col-12'>
                                <h1 className='heading'>{this.state.sectionName}</h1>
                                {this.state.role == 'student' ?
                                    <img src='/static/images/sac_de_cours.png' height='30' /> :
                                    <img id='apple' src='/static/images/apple.png' height='30' />}
                            </div>
                            <p></p>
                            {this.state.role === 'teacher' ?
                                <TeacherSection sectionId={this.state.sectionId} /> :
                                <StudentSection sectionId={this.state.sectionId} />}
                        </div>
                    </section>
                </main>
            </div>
        )
    }
}