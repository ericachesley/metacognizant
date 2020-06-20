import crud
import server
from model import connect_to_db

from apiclient import discovery, errors
import httplib2


def add_google_user(credentials):
    first = credentials.id_token['given_name']
    last = credentials.id_token['family_name']
    email = credentials.id_token['email']
    password = None
    g_id = credentials.id_token['sub']

    return crud.create_user(first, last, email, password, g_id, credentials)


def check_google_courses(user, credentials):
    google_userid = credentials.id_token['sub']
    http_auth = credentials.authorize(httplib2.Http())
    classroom = discovery.build('classroom', 'v1', http=http_auth)

    courses = get_google_courses(classroom)

    for g_course in courses:
        google_courseid = g_course.get('id')
        teachers = get_google_course_teachers(google_courseid, classroom)
        if google_userid in teachers:
            print('teacher')
            role = 'teacher'
        else:
            print('student')
            role = 'student'

        if crud.get_course_by_gid(google_courseid):
            m_course = crud.get_course_by_gid(google_courseid)
            print('yup')

            if not crud.get_seas(user, m_course):
                seas = crud.create_section_assignment(user, m_course, role)
                print(seas)

        else:
            print('nope')
            g_name = g_course.get('name')
            g_section = g_course.get('section')
            if g_section:
                g_name = g_name + f' ({g_section})'
            start = g_course.get('creationTime')
            end = None
            g_id = google_courseid
            m_course = crud.create_section(g_name, start, end, g_id)
            print(m_course)

            seas = crud.create_section_assignment(user, m_course, role)
            print(seas)


def get_google_course_teachers(google_courseid, classroom):
    teachers = []
    response = (classroom.courses()
                         .teachers()
                         .list(courseId=f'{google_courseid}')
                         .execute()
                         .get('teachers', []))
    for res in response:
        teachers.append(res['userId'])

    return teachers


def get_google_courses(classroom):
    courses = []
    page_token = None
    while True:
        response = classroom.courses().list(pageToken=page_token,
                                            pageSize=100).execute()
        courses.extend(response.get('courses', []))
        page_token = response.get('nextPageToken', None)
        if not page_token:
            break

    # if not courses:
    #     print ('No courses found.')
    # else:
    #     print ('Courses:')
    #     for course in courses:
    #         courseId = course.get('id')
    #         print (u'{0} ({1})'.format(course.get('name'), course.get('id')))

    return courses


def create_google_assignment(credentials, google_sectionid, prompt_id, due_date):
    http_auth = credentials.authorize(httplib2.Http())
    classroom = discovery.build('classroom', 'v1', http=http_auth)

    courseWork = {
        'title': 'Reflection',
        'description': f'{prompt_id}: Follow the link to read and respond to the reflection prompt.',
        'materials': [
            {'link': {'url': 'metacognizant.org/classes'}},
        ],
        'workType': 'ASSIGNMENT',
        'state': 'PUBLISHED',
        'dueDate': due_date,
        'dueTime': {'hours':11, 'minutes':59, 'seconds':59}
    }

    courseWork = classroom.courses().courseWork().create(
    courseId=f'{google_sectionid}', body=courseWork).execute()
    
    print('Assignment created with ID {0}'.format(courseWork.get('id')))
    return courseWork.get('id')


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
