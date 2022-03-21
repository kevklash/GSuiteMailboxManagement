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

The file __init__.py within "frontline", creates blueprints to calls all those actions from the 
different files/modules. The app_repo.py file contains api objects and required libraries that 
are imported into the Other modules so these variables don't have to be written more than once.

-Endpoint communication-

**Frontline**
Bellow are described the current actions taken based on the url
(later features will be added as they are ready):
/frontline/info/user@mail.com --- Displays the user profile information.
/frontline/clear-recovery-info/user@mail.com --- Removes recovery information from the account.
/frontline/signin-cookies/user@mail.com --- Resets signin cookies.
/frontline/unsuspend/user@mail.com --- Unsuspends user.
/frontline/usage/user@mail.com --- Shows account usage based on G Suite reports.
/frontline/user-password-info/user@mail.com --- Shows self password changes done by a user
/frontline/password-info/user@mail.com --- Shows password changes done by an admin(the specified email address)

All this information is subject to changes and will be updated accordingly.

-Database for admin logs-
The project includes a script to automatically create the required tables within the ulst2 mysql database.
To create all the tables execute:
python # This opens an interactive python shell
from models import db # Import the required mysql instructions already defined
db.create_all() # Creates all the tables declared in the module

-Run the project-
from uslt2/backend/main execute: 
flask run

-Backend Dependencies-
Flask
Flask-cors
google-api-python-client google-auth-httplib2 google-auth-oauthlib (Use the command pip install --upgrade followed by the libs to install)
Flask-sqlalchemy
flask-marshmallow
marshmallow-sqlalchemy
mysql-connector-python
*This dependencies were exported into a file to be used by a setup script*