# This file contains critical variables and objects required to take certain actions from GCP

# Importing GCP client library and objects
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Importing MySQL connector library
# import mysql.connector

# Importing date libraries for audit reports
from datetime import date

# scopes for service account
SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/admin.reports.usage.readonly',
    'https://www.googleapis.com/auth/admin.reports.audit.readonly'
]

# Authorization
SERVICE_ACCOUNT_FILE = './security/credentials.json' # credentials location
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES, subject="kevin.romero_admin@dev.telus.net") # create credentials object

# api objects, admin is used for actions over users and reports to retrieve usage information
admin = build('admin', 'directory_v1', credentials=credentials)
reports = build('admin', 'reports_v1', credentials=credentials)

# Admin service account that performs password changes
admin_email = "kevin.romero_admin@dev.telus.net"

# setting date variable
today = date.today()
# formatting date to mm/dd/y
fdate = today.strftime("%m/%d/%y")

# Logging function
#def write_log(action = ""):
#    mydb = mysql.connector.connect(
#        host="localhost",
#        user="root",
#        password="",
#        database="google_dev"
#    )
#    mycursor = mydb.cursor()
#    sql = "INSERT INTO audit_logs (date, action) VALUES (%s, %s)"
#    val = (fdate, action)
#    mycursor.execute(sql, val)
#    mydb.commit()
#    return True