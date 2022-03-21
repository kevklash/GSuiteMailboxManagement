from flask import request
from .app_repo import admin, SCOPES # Importing "admin" api object and project scopes
from . import frontline # Required, as a blueprint of this module is created in app.py

# Importing sys to reference parent packages
import sys

# Setting sys path
sys.path.append('../main')

# Importing from parent package
# import main.logging_functions as logs

@frontline.route('/clear-recovery-info', methods=['POST'])
def resetRecoveryInformationAccount():
    request_data = request.get_json()
    agent = None
    email = None
    if request_data:
        if 'agent' and 'email' in request_data:
            agent = request_data['agent']
            email = request_data['email']
            googleId = request_data['google_id']
            try:
                admin.users().update(
                    userKey=email,
                    body={
                        "recoveryEmail": "",
                        "recoveryPhone": ""
                    }
                ).execute()
                # logs.createLog(email, googleId, agent, "cleared_recovery_info")
                return {"success": True}
            except Exception as e:
                print(e)
                # logs.createLog(email, googleId, agent, "attempt_failed:cleared_recovery_info")
                return {"success": False, "error": str(e)}