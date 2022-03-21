from datetime import datetime
from connection import logsCollection as logs

def createLog(email, google_id, agent, event):
    
    document = {"affected_email": email,
                "google_id": google_id,
                "agent": agent,
                "date": datetime.now(),
                "event": event}
    
    item = logs.insert_one(document)
    return item