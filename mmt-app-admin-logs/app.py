from flask import Flask, jsonify
from flask_cors import CORS

# Importing from parent package
from connection import client as cl, database as db, logsCollection as logs

# Append results reusable function
def appendLogResults(results, output):
    for item in results:
            output.append({'id' : str(item['_id']),
                       'affected_email' : item['affected_email'],
                       'google_id' : item['google_id'],
                       'agent' : item['agent'],
                       'date' : item['date'],
                       'event' : item['event']})
    return output

app = Flask(__name__)
CORS(app)

# Get all logs
@app.route('/admin/get_all_logs', methods=['GET'])
def getAllLogs():
    results = logs.find().sort("date")
    output = []
    if results.count() == 0:
        output.append({'data' : 'Still no data in the database'})
    else:
        output = appendLogResults(results, output)
    return jsonify(output)

# Get logs by date
@app.route('/admin/get_logs_by_date/<date>', methods=['GET'])
def getLogsByDate(date):
    dbquery = {"date": date}
    results = logs.find(dbquery).sort("date")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No results were found'})
    else:
        output = appendLogResults(results, output)
    return jsonify(output)

# Get logs by agent
@app.route('/admin/get_logs_by_agent/<agent>', methods=['GET'])
def getLogsByAgent(agent):
    dbquery = {"agent": agent}
    results = logs.find(dbquery).sort("date")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No results were found'})
    else:
        output = appendLogResults(results, output)
    return jsonify(output)

# Get logs by event type
@app.route('/admin/get_logs_by_event/<event>', methods=['GET'])
def getLogsByEvent(event):
    dbquery = {"event": event}
    results = logs.find(dbquery).sort("date")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No results were found'})
    else:
        output = appendLogResults(results, output)
    return jsonify(output)

# Get logs by affected email
@app.route('/admin/get_logs_by_email/<email>', methods=['GET'])
def getLogsByEmail(email):
    dbquery = {"affected_email": email}
    results = logs.find(dbquery).sort("date")
    output = []
    if results.count() == 0:
        output.append({'data' : 'No results were found'})
    else:
        output = appendLogResults(results, output)
    return jsonify(output)
