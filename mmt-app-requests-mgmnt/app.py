from datetime import datetime
from flask import Flask, jsonify, request, make_response
from flask_cors import CORS
from logging_functions import createLog
from requests_repository import createRequest, updateAccess, updateUser, createUser

# Importing from parent package
from connection import requestsCollection as req, usersCollection as users

# Append results reusable functions
def appendRequestResults(results, output):
    for item in results:
        output.append({'id' : str(item['_id']),
                    'agent' : item['agent'],
                    'request_timestamp' : item['request_timestamp'],
                    'response_timestamp' : item['response_timestamp'],
                    'admin' : item['admin'],
                    'responded' : item['responded']})
    return output

def appendUserResults(results, output):
    for item in results:
        output.append({'id' : str(item['_id']),
                    'email_address' : item['email_address'],
                    'register_date' : item['register_date'],
                    'active' : item['active']})
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
   
##### Request #####
###################
# Get all requests by date
@app.route('/admin/get_all_requests', methods=['GET'])
def getAllRequests():
    results = req.find().sort("request_timestamp")
    output = []
    if results.count() == 0:
        output.append({'data' : 'Still no requests in the database'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)

# Get pending requests
@app.route('/admin/pending_requests', methods=['GET'])
def getPending():
    dbquery = {"responded": False}
    results = req.find(dbquery).sort("request_timestamp")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No requests were found'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)

# Get pending requests by specific date
@app.route('/admin/pending_requests_by_date/<date>', methods=['GET'])
def getPendingByDate(date):
    dbquery = {"responded": False, "request_timestamp" : date}
    results = req.find(dbquery).sort("request_timestamp")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No requests were found'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)

# Get completed requests
@app.route('/admin/complete_requests', methods=['GET'])
def getResponded():
    dbquery = {"responded": True}
    results = req.find(dbquery).sort("response_timestamp")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No requests were found'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)

# Get completed requests by specific date
@app.route('/admin/complete_requests_by_date/<date>', methods=['GET'])
def getRespondedByDate(date):
    dbquery = {"responded": True, "response_timestamp" : date}
    results = req.find(dbquery).sort("response_timestamp")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No requests were found'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)

# Get completed requests by specific admin
@app.route('/admin/complete_requests_by_admin/<admin>', methods=['GET'])
def getRespondedByAdmin(admin):
    dbquery = {"responded": True, "admin" : admin}
    results = req.find(dbquery).sort("response_timestamp")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No requests were found'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)

# Lookup a request submitted by a specific agent
@app.route('/admin/lookup_by_agent/<agent>', methods=['GET'])
def getRequestByAgent(agent):
    dbquery = {"agent" : agent}
    results = req.find(dbquery)
    output = []
    if results.count() == 0:
        output.append({'result' : 'No requests were found'})
    else:
        output = appendRequestResults(results, output)
    return jsonify(output)


##### Access' #####
###################

# Authorize an access request
@app.route('/admin/authorize_access', methods=['PUT'])
def authorizeAccess():
    request_data = request.get_json()
    agent = None
    admin = None
    
    if request_data:
        if 'agent' and 'admin' in request_data:
            agent = request_data['agent']
            admin = request_data['admin']
            updateAccess(agent, admin)
            updateUser(agent)            
            message = {'response': 'success', 'result': 'The access request has been approved'}
            createLog(agent, "none", admin, "access_request_authorized")
            return make_response(jsonify(message), 200)

# User access workflow initialization for MMT Access
# Check if the user exists, if not, create the user and submit an access request
# If it exists, chekc the access level(active, inactive, suspended)
@app.route('/mmt_frontline/accessWorkflow', methods=['POST'])
def accessWorkflow():
    request_data = request.get_json()
    agent = None
    if request_data:
        if 'agent' in request_data:
            agent = request_data['agent']
            # Check if the user exists
            dbquery = {"email_address" : agent}
            results = users.find(dbquery)
            if results.count() == 0: # The user does not exist
                createUser(agent) # Create the user
                createRequest(agent) # submit the request
                createLog("none", "none", agent, "agent_requested_access")
                message = {'result': 'user created', 'reason': 'the user did not exist', 'result': 'The user was created and an access request to MMT has been submitted. It is now pending admin authorization'}
                return make_response(jsonify(message), 201)
            else: # The user exists
                # Check the access level by lookiing up the status
                if results[0]['status'] == "active":
                    return jsonify({'user' : results[0]['email_address'], 'user_status' : "active"})
                else:
                    return jsonify({'user' : results[0]['email_address'], 'user_status' : results[0]['status']})
            


if __name__ == '__main__':
    # Running in debug mode
    app.run(host="localhost", port=5001, debug=True)