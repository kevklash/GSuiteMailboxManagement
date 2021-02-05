from flask import Blueprint # Required, as a blueprint of this module is created in app.py
from app_repo import admin, SCOPES # Importing "admin" api object and project scopes

clear_recovery_info = Blueprint('clear_recovery_info', __name__)

@clear_recovery_info.route('/clear-recovery-info/<email>', methods=['POST'])
def resetRecoveryInformationAccount(email):
    try:
        admin.users().update(
            userKey=email,
            body={
                "recoveryEmail": "",
                "recoveryPhone": ""
            }
        ).execute()
        return {"success": True}
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}