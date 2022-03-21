from datetime import datetime
from connection import usersCollection as users, requestsCollection as req

# Create an access request
def createRequest(agent):
    document = {"agent": agent,
                "request_timestamp": datetime.now(),
                "response_timestamp": "none",
                "admin": "none",
                "responded": False}
    item = req.insert_one(document)
    return item

# Update an access request
def updateAccess(agent, admin):
    requestQuery = {"agent" : agent}
    agentQuery = {"email_address" : agent}
    updateRequest = {"$set": {"admin": admin,
                    "response_timestamp": datetime.now(),
                    "responded": True}}
    requestItem = req.update_one(requestQuery, updateRequest)
    return requestItem

# Update user after authorizing access
def updateUser(agent):
    agentQuery = {"email_address" : agent}
    updateUser = {"$set": {"status": "active"}}   
    userItem = users.update_one(agentQuery, updateUser)
    return userItem

# Create a new user
def createUser(email):
    
    document = {"email_address": email,
                "register_date": datetime.now(),
                "status": "inactive"}
    
    item = users.insert_one(document)
    return item