from . import frontline # Required, as a blueprint of this module is created in app.py
from .app_repo import admin, SCOPES # Importing "admin" api object and project scopes
from flask import request
service_level = ""

# Importing sys to reference parent packages
import sys

# Setting sys path
sys.path.append('../main')

# Importing from parent package
# import main.logging_functions as logs

@frontline.route('/info/', methods=['POST'])
def getAccountInfo():
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
                print(email)
                result = admin.users().get(
                    userKey=email
                ).execute()        
                user = {key: result[key] for key in result.keys()
                        & {'aliases', 'id', 'isEnrolledIn2Sv', 'name', 'orgUnitPath', 'primaryEmail', 'suspended', 'suspensionReason', 'recoveryEmail', 'recoveryPhone', 'lastLoginTime'}}
                user['recoveryEmail'] = (user['recoveryEmail'].split()[0][:3] + "...@" + user['recoveryEmail'].split("@")[1]) if (user.get('recoveryEmail', None) != None) else ""
                # user['recoveryEmail'] = (user['recoveryEmail'].split("@")[0][:3] + "...") if (user.get('recoveryEmail', None) != None) else ""
                user['recoveryPhone'] = (user['recoveryPhone'][:-6] + "-****") if (user.get('recoveryPhone', None) != None) else ""
                # logs.createLog(email, googleId, agent, "initial_search")
                return (user, 200)
            except Exception as e:
                print(e)
                # logs.createLog(email, googleId, agent, "attempt_failed:initial_search")
                return (str(e), 404)