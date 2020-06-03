import model, crud, server

def get_test_user():
    user = model.User.query.get(1)
    print(user.first_name, user.last_name, user.email, user.password)