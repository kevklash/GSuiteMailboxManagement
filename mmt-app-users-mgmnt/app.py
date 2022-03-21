from logging_functions import createLog
from flask import Flask, jsonify, make_response
from flask_cors import CORS
from user_repository import createUser

# Importing from parent package
from connection import client as cl, database as db, usersCollection as users, suspensionsCollection as suspensions

# Append results reusable functions
def appendUserResults(results, output):
    for item in results:
        output.append({'id' : str(item['_id']),
                    'email_address' : item['email_address'],
                    'register_date' : item['register_date'],
                    'status' : item['status']})
    return output

def appendSuspensionLogs(suspensionResults, suspensionLogs):
    for item in suspensionResults:
        suspensionLogs.append({'date' : item['date'],
                    'agent' : item['email_address'],
                    'reason' : item['reason'],
                    'admin' : item['admin']})
    return suspensionLogs


app = Flask(__name__)
CORS(app)


##### Users #####
#################
# Get all users
@app.route('/admin/get_all_users', methods=['GET'])
def getAllUsers():
    results = users.find().sort("email_address")
    output = []
    if results.count() == 0:
        output.append({'data' : 'Still no users in the database'})
    else:
        output = appendUserResults(results, output)
    return jsonify(output)

# Get active users
@app.route('/admin/get_active_users', methods=['GET'])
def getActiveUsers():
    dbquery = {"status" : "active"}
    results = users.find(dbquery).sort("email_address")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No active users were found'})
    else:
        output = appendUserResults(results, output)
    return jsonify(output)

# Get inactive users
@app.route('/admin/get_inactive_users', methods=['GET'])
def getInactiveUsers():
    dbquery = {"status" : "inactive"}
    results = users.find(dbquery).sort("email_address")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No inactive users were found'})
    else:
        output = appendUserResults(results, output)
    return jsonify(output)

# Get suspended users
@app.route('/admin/get_suspended_users', methods=['GET'])
def getSuspendedUsers():
    dbquery = {"status" : "suspended"}
    results = users.find(dbquery).sort("email_address")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No suspended users were found'})
    else:
        output = appendUserResults(results, output)
    return jsonify(output)

# Lookup a specific user
@app.route('/admin/user_lookup/<user>', methods=['GET'])
def lookupUser(user):
    dbquery = {"email_address" : user}
    suspensionsQuery = {"email_address" : user}
    results = users.find(dbquery)
    suspensionResults = suspensions.find(suspensionsQuery).sort("date")
    output = []
    suspensionLogs = []
    if results.count() == 0:
        output.append({'data' : 'The user was not found'})
        if suspensionResults.count() == 0:
            suspensionLogs.append({'suspension_history' : 'No suspension records were found'})
        else:
            suspensionLogs = appendSuspensionLogs(suspensionResults, suspensionLogs)
    else:
        output = appendUserResults(results, output)
        if suspensionResults.count() == 0:
            suspensionLogs.append({'suspension_history' : 'No suspension records were found'})
        else:
            suspensionLogs = appendSuspensionLogs(suspensionResults, suspensionLogs)    
    return jsonify({'user' : appendUserResults(results, output), 'suspension_history' : suspensionLogs})

# Suspend user