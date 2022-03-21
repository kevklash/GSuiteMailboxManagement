from flask_pymongo import pymongo
import json

# certifi package
import certifi
ca = certifi.where()

# Reading config file
try:
    with open('../mmt-backend-config/backend_config.json', 'r') as config_file:
      data_file = json.load(config_file)
except FileNotFoundError:
    print("The file does not exist, generating a config file with default values...")
except IOError:
    print("Temporary error reading the config file")

client = pymongo.MongoClient("mongodb+srv://" + data_file["db_username"] + ":" + data_file["db_password"] + data_file["con_string"], tlsCAFile=ca)
database = client[data_file["db_name"]]
logsCollection = database["logs"]
requestsCollection = database["request"]
usersCollection = database["agents"]
suspensionsCollection = database["suspensions"]