from flask import Flask
from flask_cors import CORS
from user_profile import user_profile 
from unsuspend import unsuspend
from reset_cookies import reset_cookies
from clear_recovery_info import clear_recovery_info
from usage import usage
from password_info import password_info
from user_password_info import user_password_info

# Above imported all the defined routes to take actions on GCP
# Each action and route is called from a different file

app = Flask(__name__)
CORS(app)


# Registering blueprints for each file and route
app.register_blueprint(user_profile, url_prefix='/action')
app.register_blueprint(unsuspend, url_prefix='/action')
app.register_blueprint(reset_cookies, url_prefix='/action')
app.register_blueprint(clear_recovery_info, url_prefix='/action')
app.register_blueprint(usage, url_prefix='/action')
app.register_blueprint(password_info, url_prefix='/action')
app.register_blueprint(user_password_info, url_prefix='/action')