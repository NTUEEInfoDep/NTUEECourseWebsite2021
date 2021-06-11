import os
from pymongo import MongoClient
from flask import Flask

# ========================================

app = Flask(__name__)

PORT = os.environ.get("PORT", 8001)
MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)
MONGO_DBNAME = os.environ.get("MONGO_DBNAME", "ntuee-course")
# ========================================


@app.route("/")
def index():
    return "Distribute server"


@app.route("/distribute", methods=["POST"])
def distribute():
    client = MongoClient(MONGO_HOST, MONGO_PORT)
    db = client[MONGO_DBNAME]
    result = {
        "studentID": "a",
        "courseName": "b",
        "optionName": "c",
    }
    db.results.insert_one(result)
    client.close()
    return ""

# ========================================


if __name__ == "__main__":
    app.run(port=PORT)
