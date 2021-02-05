from flask import Flask, request, jsonify, Blueprint
from datetime import date, timedelta
from markupsafe import escape
from app_repo import reports, SCOPES # Importing "reports" api objects and project scopes

# Event differences:
# Password changed for kevin.romero_admin@dev.telus.net -- : This is an admin entry, when the password is reset by an admin
# kevin.romero_admin@dev.telus.net has changed Account password -- : This is NOT an admin entry, user action instead.

user_password_info = Blueprint('user_password_info', __name__)

@user_password_info.route('/user-password-info/<email>', methods=['GET'])
def getUserPasswordInfo(email):
    try:
        passwordInfo = []
        result = reports.activities().list(userKey=email, applicationName='user_accounts', eventName='password_edit',
        maxResults=10).execute()
        passwordInfo.append(result)
        return jsonify(passwordInfo)
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}

# For admin event:
# result = reports.activities().list(userKey=email, applicationName='admin', eventName='CHANGE_PASSWORD',
# maxResults=10).execute()
# This only retrieves events for one specific admin who is performing password changes