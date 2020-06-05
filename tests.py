import model, crud, server
from random import randint

def get_test_user():
    user = model.User.query.get(randint(1, model.User.query.count()))
    print(user.first_name, user.last_name, user.email, user.password)


def find_test_teacher():
    SectionAssignment = model.SectionAssignment
    teacher_id = (model.db.session.query(SectionAssignment.user_id)
                                .filter(SectionAssignment.role=='teacher')
                                .group_by(SectionAssignment.user_id)
                                .having(model.db.func.count()>1)
                                .first())[0]
    teacher = model.User.query.get(teacher_id)
    print_user_info(teacher)
    

def print_user_info(user):
    print(user.user_id, user.first_name, user.last_name, user.email, user.password)


if __name__ == '__main__':
    from server import app
    model.connect_to_db(app)
