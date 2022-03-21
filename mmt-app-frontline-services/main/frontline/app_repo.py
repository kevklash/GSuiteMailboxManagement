# This file contains critical variables and objects required to take certain actions from GCP

# Importing GCP client library and objects
from google.oauth2 import service_account
from googleapiclient.discovery import build

# Importing json
import json

# Importing date libraries for audit reports
from datetime import date

# scopes for service account
SCOPES = [
    'https://www.googleapis.com/auth/admin.directory.user',
    'https://www.googleapis.com/auth/admin.reports.usage.readonly',
    'https://www.googleapis.com/auth/admin.reports.audit.readonly'
]

# Reading the credentials file
import os
THIS_FOLDER = os.path.dirname(os.path.abspath(__file__))
credentials_file = os.path.join(THIS_FOLDER, 'credentials.json')

# Reading config file
try:
    with open('../../mmt-backend-config/backend_config.json', 'r') as config_file:
      data_file = json.load(config_file)
except FileNotFoundError:
    print("The file does not exist, generating a config file with default values...")
except IOError:
    print("Temporary error reading the config file")

# Authorization
SERVICE_ACCOUNT_FILE = credentials_file # credentials location
credentials = service_account.Credentials.from_service_account_file(
    SERVICE_ACCOUNT_FILE, scopes=SCOPES, subject=data_file["authorization_account"]) # create credentials object

# api objects, admin is used for actions over users and reports to retrieve usage information
admin = build('admin', 'directory_v1', credentials=credentials)
reports = build('admin', 'reports_v1', credentials=credentials)

# Admin service account that performs password changes
admin_email_consumer = data_file["consumer_service_account_email"]
admin_email_business = data_file["business_service_account_email"]

# setting date variable
today = date.today()
# formatting date to mm/dd/y
fdate = today.strftime("%m/%d/%y")