import json
from flask import Flask, request, jsonify, Blueprint
from datetime import date, timedelta
from markupsafe import escape
from app_repo import reports, SCOPES # Importing "reports" api objects and project scopes
from app_repo import admin_email # Importing admin service account address for password reports 

# Event differences:
# Password changed for kevin.romero_admin@dev.telus.net -- : This is an admin entry, when the password is reset by an admin
# kevin.romero_admin@dev.telus.net has changed Account password -- : This is NOT an admin entry, user action instead.

password_info = Blueprint('password_info', __name__)

@password_info.route('/password-info/<email>', methods=['GET'])
def getPasswordInfo(email):
    try:
        result = reports.activities().list(userKey=admin_email, applicationName='admin', eventName='CHANGE_PASSWORD',
        maxResults=1000).execute()
        # creating raw data object with json format
        raw_data = json.dumps(result)
        # loading the raw data
        response = json.loads(raw_data)
        # determine the length of the information we need
        length = len(response['items'])
        # creating new empty object to dump the filtered data
        password_changes = []
        # initializing results counter
        found_results = 0
        # looping through the Google API JSON response
        for i in range(length):
           # new_json = json.dumps(response['items'][0])
           # Dumping the results into the new JSON object if the email is found
           if response['items'][i]['events'][0]['parameters'][0]['value'] == email:
               password_changes.append(response['items'][i])
               found_results+=1
        if found_results > 0:
            return jsonify(password_changes)
        else:
            password_changes.append("No results were found")
            return jsonify(password_changes)
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}