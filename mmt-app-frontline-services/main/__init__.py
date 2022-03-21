
from flask import Flask
from flask_cors import CORS
import json

app = Flask(__name__)
CORS(app)


# import and register Blueprints
from .frontline import frontline
app.register_blueprint(frontline, url_prefix='/frontline')