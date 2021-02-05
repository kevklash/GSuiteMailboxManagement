USLT tool biult in Python for Google Cloud Platform.

# Endpoint documentation #

-Description-
This information will be updated as the project grows.

The entire application has been separated into different modules to make it easier to
understand and to work with. This also makes it more organized.

Actions on GCP user objects are taken based on the URL related to the action. Said Actions
and URLs are defined each on their own file. The names of the files make it self-explanatory
as they describe actions: clear_recovery_info.py, reset_cookies.py, unsuspend.py, usage.py, 
user_profile.py, etc. Other(and future) files/actions/routes are not mentioned for brevity.

The file app.py wich is the main module, calls all those actions from the different files/modules.
The app_repo.py file contains api objects and required libraries that are imported into the Other
modules so these variables don't have to be written more than once.

This project also contain and HTML and JS file used for unit testing. Their usage is not strictly
required.

-Security-
Service account files are located in the "Security" directory.

-Endpoint communication-
Bellow are described the current actions taken based on the url
(later features will be added as they are ready):
/action/info/user@mail.com --- Displays the user profile information.
/action/clear-recovery-info/user@mail.com --- Removes recovery information from the account.
/action/signin-cookies/user@mail.com --- Resets signin cookies.
/action/unsuspend/user@mail.com --- Unsuspends user.
/action/usage/user@mail.com --- Shows account usage based on G Suite reports.
/action/user-password-info/user@mail.com --- Shows self password changes done by a user
/action/password-info/user@mail.com --- Shows password changes done by an admin(the specified email address)

-Installation-
Install required dependencies to run the Python Backend project:
From CMD type: 
cd uslt2/backend   --- Navigates to the Backend directory
pip install flask   --- Installs Python Flask libraries
pip install flask-cors   --- Installs Python Flask Cors libraries
pip install --upgrade google-api-python-client google-auth-httplib2 google-auth-oauthlib   --- Installs Google Client library

All this information is subject to changes and will be updated accordingly.