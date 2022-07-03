import os
from pymongo import MongoClient

import pandas as pd

# ========================================

MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)
MONGO_DBNAME = os.environ.get("MONGO_DBNAME", "ntuee-course")
MONGO_USERNAME = os.environ.get("MONGO_USERNAME")
MONGO_PASSWORD = os.environ.get("MONGO_PASSWORD")

url = "mongodb://%s:%s@%s:%s/%s" % (MONGO_USERNAME, MONGO_PASSWORD, MONGO_HOST, MONGO_PORT, MONGO_DBNAME)
client = MongoClient(url)
# ========================================

to_clean = ['B08901099', 'B08901022', 'B08901073', 'B08901108', 'B08901111', 'B08901159', 'B08901189', 'B08901199', 'B09901009', 'B09901011', 'B09901013', 'B09901061', 'B09901104', 'B09901106', 'B09901044', 'B09901018', 'B07901016', 'B07901108', 'B07901025', 'B08901093', 'B08901158', 'B09901069', 'B08901058', 'B09901162', 'B09901035', 'B09901084', 'B09901075', 'B09901062', 'B09901046', 'B08901211', 'B09901175', 'B09901176', 'B09901017', 'B07901069', 'B09901020', 'B09901186', 'B08901006', 'B08901049', 'B08901054', 'B08901065', 'B08901088', 'B08901090', 'B08901097', 'B08901104', 'B08901106', 'B08901136', 'B08901046', 'B08901048', 'B08901152', 'B08401079', 'B08901094', 'B08901181', 'B08901205', 'B10901091', 'B10901098', 'B10901164', 'B10901061', 'B10901052', 'B10901099', 'B10901035', 'B10901142', 'B10901158', 'B10901081', 'B10901025', 'B10901002', 'B10901179', 'B10901013', 'B09901061', 'B09901180', 'B09504013', 'B09504006', 'B09901089', 'B09502075', 'B09901156', 'B09901159', 'B09901015', 'b10901077', 'b10901080', 'b10901154', 'B08901207', 'B10901166', 'B10901180', 'b10901021', 'b10901058', 'b10901038', 'B10901129', 'B10901183', 'b10901059', 'B09901171', 'B09502138', 'B08901169']

def clean():
    print("To clean: %s" % to_clean)
    print("Total #: %d" % len(to_clean))
    db = client[MONGO_DBNAME]
    raw_selections = db["selections"]
    
    count = 0

    for selection in raw_selections.find():
        if selection['userID'] in to_clean:
            raw_selections.delete_one(selection)
            print("Deleted: %s " % selection)
            count += 1

    print("Total delete #: %d" % count)

    client.close()

if __name__ == "__main__":
    clean()
