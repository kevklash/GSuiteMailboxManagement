from . import frontline # Required, as a blueprint of this module is created in app.py
from .app_repo import admin, SCOPES # Importing "admin" api object and project scopes
from flask import request

# Importing sys to reference parent packages
import sys

# Setting sys path
sys.path.append('../main')

# Importing from parent package
# import main.logging_functions as logs

@frontline.route('/signin-cookies/', methods=['POST'])
def resetSigninCookiesAccount():
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
                # logs.createLog(email, googleId, agent, "reset_sign_in_cookies")
                return {"success": True}
            except Exception as e:
                print(e)
                # logs.createLog(email, googleId, agent, "attempt_failed:reset_sign_in_cookies")
                return {"success": False, "error": str(e)}