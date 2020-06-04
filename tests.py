import model, crud, server
from random import randint

def get_test_user():
    user = model.User.query.get(randint(1, model.User.query.count()))
    print(user.first_name, user.last_name, user.email, user.password)