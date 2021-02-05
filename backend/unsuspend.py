from flask import Blueprint # Required, as a blueprint of this module is created in app.py
from app_repo import admin, SCOPES # Importing "admin" api object and project scopes

unsuspend = Blueprint('unsuspend', __name__)

@unsuspend.route('/unsuspend/<email>', methods=['POST'])
def unsuspendAccount(email):
    try:
        admin.users().update(
            userKey=email,
            body={
                "suspended": False
            }
        ).execute()
        return {"success": True}
    except Exception as e:
        print(e)
        return (str(e), 404)