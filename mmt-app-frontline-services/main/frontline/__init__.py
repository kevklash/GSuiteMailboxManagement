from flask import Blueprint

####### Blueprinting #######

frontline = Blueprint('frontline', __name__)

from . import user_profile 
from . import unsuspend
from . import reset_cookies
from . import clear_recovery_info
from . import usage
from . import password_info
from . import user_password_info

####### Blueprinting ends #######