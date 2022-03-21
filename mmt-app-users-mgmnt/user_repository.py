from datetime import datetime
from connection import usersCollection as users

# Create a new user
def createUser(email):
    
    document = {"email_address": email,
                "register_date": datetime.now(),
                "status": "inactive"}
    
    item = users.insert_one(document)
    return item