import json
from flask import Flask, request, jsonify
from . import frontline # Required, as a blueprint of this module is created in app.py
from datetime import date, timedelta
from markupsafe import escape
from .app_repo import admin, reports, SCOPES # Importing "reports" api objects and project scopes
from .app_repo import admin_email_consumer, admin_email_business # Importing admin service account address for password reports

# Event differences:
# Password changed for kevin.romero_admin@dev.telus.net -- : This is an admin entry, when the password is reset by an admin
# kevin.romero_admin@dev.telus.net has changed Account password -- : This is NOT an admin entry, user action instead.

# Importing sys to reference parent packages
import sys

# Setting sys path
sys.path.append('../main')

# Importing from parent package
# import main.logging_functions as logs

# Determine the service account email to search password changes logs with, based on the service level/org unit
def getServiceLevel(email):
    try:
        result = admin.users().get(
            userKey=email
        ).execute()        
        user = {key: result[key] for key in result.keys()
                & {'orgUnitPath'}}
        if user['orgUnitPath'] == "/Users/Consumer":
            admin_email = admin_email_consumer
        elif user['orgUnitPath'] == "/Users/Business":
            admin_email = admin_email_business
        else:
            admin_email = admin_email_consumer
        return admin_email
    except Exception as e:
        print(e)
        return (str(e), 404)
# End function

@frontline.route('/password-info', methods=['POST'])
def getPasswordInfo():
    request_data = request.get_json()
    agent = None
    email = None
    if request_data:
        if 'agent' and 'email' in request_data:
            agent = request_data['agent']
            email = request_data['email']
            googleId = request_data['google_id']
            provisioning_email = getServiceLevel(email)
            # Start the operation
            try:
                result = reports.activities().list(userKey=provisioning_email, applicationName='admin', eventName='CHANGE_PASSWORD',
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
                # logs.createLog(email, googleId, agent, "password_history")
            except Exception as e:
                print(e)
                # logs.createLog(email, googleId, agent, "attempt_failed:admin_password_history")
                return {"success": False, "error": str(e)}