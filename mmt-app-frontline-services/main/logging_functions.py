from datetime import datetime
from .connection import client as cl, database as db, logsCollections as logs
# Models and schemas:

def createLog(email, google_id, agent, event):
    
    document = {"affected_email": email,
                "google_id": google_id,
                "agent": agent,
                "date": datetime.now(),
                "event": event}
    
    item = logs.insert_one(document)
    return item

