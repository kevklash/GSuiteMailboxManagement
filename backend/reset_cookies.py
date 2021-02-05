from flask import Blueprint # Required, as a blueprint of this module is created in app.py
from app_repo import admin, SCOPES # Importing "admin" api object and project scopes

reset_cookies = Blueprint('reset_cookies', __name__)

@reset_cookies.route('/signin-cookies/<email>', methods=['POST'])
def resetSigninCookiesAccount(email):
    try:
        admin.users().update(
            userKey=email,
            body={
                "suspended": True
            }
        ).execute()
        admin.users().update(
            userKey=email,
            body={
                "suspended": False
            }
        ).execute()
        return {"success": True}
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}