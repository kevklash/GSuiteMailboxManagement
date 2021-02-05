from flask import Blueprint # Required, as a blueprint of this module is created in app.py
from app_repo import admin, SCOPES # Importing "admin" api object and project scopes

user_profile = Blueprint('user_profile', __name__)

@user_profile.route('/info/<email>', methods=['GET'])
def getAccountInfo(email):
    try:
        print(email)
        result = admin.users().get(
            userKey=email
        ).execute()        
        user = {key: result[key] for key in result.keys()
                & {'aliases', 'id', 'isEnrolledIn2Sv', 'name', 'orgUnitPath', 'primaryEmail', 'suspended', 'suspensionReason', 'recoveryEmail', 'recoveryPhone', 'lastLoginTime'}}
        user['recoveryEmail'] = (user['recoveryEmail'].split("@")[0][:3] + "...") if (user.get('recoveryEmail', None) != None) else ""
        user['recoveryPhone'] = (user['recoveryPhone'][:-5] + "*-****") if (user.get('recoveryPhone', None) != None) else ""
        return (user, 200)
    except Exception as e:
        print(e)
        return (str(e), 404)