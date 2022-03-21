from flask import Flask, request, jsonify
from . import frontline # Required, as a blueprint of this module is created in app.py
from datetime import date, timedelta
from markupsafe import escape
from .app_repo import reports, SCOPES # Importing "reports" api objects and project scopes

# Event differences:
# Password changed for kevin.romero_admin@dev.telus.net -- : This is an admin entry, when the password is reset by an admin
# kevin.romero_admin@dev.telus.net has changed Account password -- : This is NOT an admin entry, user action instead.

# Importing sys to reference parent packages
import sys

# Setting sys path
sys.path.append('../main')

# Importing from parent package
# import main.logging_functions as logs

@frontline.route('/user-password-info', methods=['POST'])
def getUserPasswordInfo():
    request_data = request.get_json()
    agent = None
    email = None
    if request_data:
        if 'agent' and 'email' in request_data:
            agent = request_data['agent']
            email = request_data['email']
            googleId = request_data['google_id']
            # Start the operation
            try:
                passwordInfo = []
                result = reports.activities().list(userKey=email, applicationName='user_accounts', eventName='password_edit',
                maxResults=10).execute()
                passwordInfo.append(result)
                # logs.createLog(email, googleId, agent, "password_history")
                return jsonify(passwordInfo)
            except Exception as e:
                print(e)
                # logs.createLog(email, googleId, agent, "attempt_failed:password_history")
                return {"success": False, "error": str(e)}

# For admin event:
# result = reports.activities().list(userKey=email, applicationName='admin', eventName='CHANGE_PASSWORD',
# maxResults=10).execute()
# This only retrieves events for one specific admin who is performing password changes