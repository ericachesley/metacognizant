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
                {/* <SideBar nav={links} /> */}
                <main className="main-content w-100">
                    <section id='section' className='container pt-2 right'>
                        <div className='row'>
                            <Link className='back' to='/classes'>
                                <svg id='backicon' width="2em" height="2em" viewBox="0 0 16 16" className="bi bi-arrow-left-square-fill" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                                    <path fillRule="evenodd" d="M2 0a2 2 0 0 0-2 2v12a2 2 0 0 0 2 2h12a2 2 0 0 0 2-2V2a2 2 0 0 0-2-2H2zm6.354 10.646a.5.5 0 0 1-.708.708l-3-3a.5.5 0 0 1 0-.708l3-3a.5.5 0 1 1 .708.708L6.207 7.5H11a.5.5 0 0 1 0 1H6.207l2.147 2.146z" />
                                </svg>
                        Back to all classes
                        </Link>
                            <div id='yourclasses' className='col-6 col-xs-6 col-sm-6 col-md-11 col-lg-11 rounded shadow p-3 mb-5 rounded'>
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