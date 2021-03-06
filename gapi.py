import crud
import server
from model import connect_to_db

from apiclient import discovery, errors
import httplib2
from datetime import datetime, timedelta


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

    return courses


def create_google_assignment(credentials, section_id, google_sectionid, prompt_id, due_date):
    http_auth = credentials.authorize(httplib2.Http())
    classroom = discovery.build('classroom', 'v1', http=http_auth)

    content = crud.get_prompt_content(prompt_id)

    courseWork = {
        'title': f'Reflection: {content}',
        'description': 'Follow the link to read and respond to the reflection prompt.',
        'materials': [
            {'link': {'url': f'http://localhost:5000/classes/{section_id}'}},
        ],
        'workType': 'ASSIGNMENT',
        'state': 'PUBLISHED',
        'dueDate': g_dateify(due_date),
        'dueTime': {'hours': 6, 'minutes': 59, 'seconds': 59}
    }

    courseWork = classroom.courses().courseWork().create(
        courseId=f'{google_sectionid}', body=courseWork).execute()

    print('Assignment created with ID {0}'.format(courseWork.get('id')))
    return courseWork.get('id')


def create_google_response(credentials, g_sectionid, g_prasid, g_userid, content, date):
    http_auth = credentials.authorize(httplib2.Http())
    classroom = discovery.build('classroom', 'v1', http=http_auth)

    stu_sub = (classroom.courses()
               .courseWork()
               .studentSubmissions()
               .list(
        courseId=g_sectionid,
        courseWorkId=g_prasid,
        userId=g_userid
    )
        .execute())

    stu_sub = stu_sub.get('studentSubmissions')
    stu_sub.sort(key=lambda i: i['updateTime'])
    stu_sud_id = stu_sub[0].get('id')

    responseData = {
        "addAttachments": [
            {
                "link": {
                    "url": f'http://localhost:5000/',
                }
            }
        ]
    }

    response = (classroom.courses()
                .courseWork()
                .studentSubmissions()
                .modifyAttachments(
                    courseId=g_sectionid,
                    courseWorkId=g_prasid,
                    id=stu_sud_id,
                    body=responseData)
                .execute())

    print('Submission modified - ID {0}'.format(response.get('id')))

    turn_in = (classroom.courses()
              .courseWork()
              .studentSubmissions()
              .turnIn(
                    courseId=g_sectionid,
                    courseWorkId=g_prasid,
                    id=stu_sud_id)
              .execute())

    print('Submission turned in.')
    return stu_sud_id


def g_dateify(date):
    # date = date[:10]
    # adj_date = datetime.strptime(date, '%Y-%m-%d').date()
    # adj_date = adj_date + timedelta(days=1)
    # adj_date = datetime.strftime(adj_date, '%Y-%m-%d')
    year = int(date[:4])
    month = int(date[5:7])
    day = int(date[8:10])
    return {'year': year, 'month': month, 'day': day}


if __name__ == '__main__':
    from server import app
    connect_to_db(app)
