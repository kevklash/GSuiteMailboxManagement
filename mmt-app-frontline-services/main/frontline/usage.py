from . import frontline # Required, as a blueprint of this module is created in app.py
# Other libraries are also imported to make it possible tha manipulation of retrieved data
from flask import Flask, request, jsonify
from datetime import date, timedelta
from markupsafe import escape
from .app_repo import admin, reports, SCOPES # Importing "admin" and "reports" api objects and project scopes

def getDayBefore(daysBack):
    return (date.today() - timedelta(daysBack)).isoformat()


@frontline.route('/usage/<email>', methods=['GET'])
def getAccountUsage(email):
    try:
        daysBack = request.args.get('daysBack', 5, type=int) + 3
        accountUsage = []
        currentDay = 3
        parameters = 'gmail:last_imap_time,gmail:last_pop_time,gmail:last_webmail_time,gmail:num_emails_received,accounts:gmail_used_quota_in_mb,accounts:is_less_secure_apps_access_allowed'
        while(currentDay <= daysBack):
            date = getDayBefore(currentDay)
            result = reports.userUsageReport().get(
                userKey=email,
                date=date,
                parameters=parameters
            ).execute()
            accountUsage.append(result)
            currentDay += 1
        return jsonify(accountUsage)
    except Exception as e:
        print(e)
        return {"success": False, "error": str(e)}

# API Reports reference: https://developers.google.com/admin-sdk/reports/v1/appendix/usage/user/accounts