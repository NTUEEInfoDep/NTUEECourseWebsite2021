import os
from pymongo import MongoClient
from flask import Flask

from algorithm import Algorithm, Course, Student

# ========================================

app = Flask(__name__)

PORT = os.environ.get("PORT", 8001)
MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)
MONGO_DBNAME = os.environ.get("MONGO_DBNAME", "ntuee-course")

# ========================================


def genCourse(raw_courses):
    courses = []
    for data in raw_courses.find():
        courseDict = {}

        courseDict["name"] = data["name"]
        courseDict["id"] = data["id"]
        courseDict["type"] = data["type"]
        courseDict["options"] = {}
        for op in data["options"]:
            options = {
                "limit": op["limit"],
            }
            if data["type"] == "Ten-Select-Two":
                options["priority"] = op["priority"]
            elif data["type"] in "1234":
                options["priority"] = -1
            elif data["type"] == "EE-Lab":
                options["priority"] = 0
            else:
                raise ValueError("Invalid type")
            courseDict["options"][op["name"]] = options
        courses.append(Course(courseDict))
    return courses


def getCourseid(raw_courses):
    name = []
    for data in raw_courses.find():
        name.append(data["id"])
    return name


def genStudent(raw_student, raw_selection, course_id):
    students = []
    for data in raw_student.find():  # iterate through all students
        result_selection = {}
        for name in course_id:  # iterate through every course
            result_selection[name] = []
            # all selections made by a student of certain course
            student_selections = raw_selection.find(
                {"userID": data["userID"], "courseID": name})
            for i in range(len(list(student_selections))):
                rank_i_selection = raw_selection.find(
                    {"userID": data["userID"], "courseID": name, "ranking": i + 1})  # the (i+1)th selection
                for ith_option in rank_i_selection:
                    result_selection[name].append(ith_option["name"])

        students.append(
            Student(data["name"], data["userID"], result_selection, data["grade"]))
    return students


def genPreselect(raw_preselects):
    preselects = []
    for data in raw_preselects.find():
        preselects.append(data["userID"])
    return preselects
# ========================================
@app.route("/")
def index():
    return "Distribute server"


@app.route("/distribute", methods=["POST"])
def distribute():
    client = MongoClient(MONGO_HOST, MONGO_PORT)
    db = client[MONGO_DBNAME]
    raw_selection = db["selections"]
    raw_students = db["students"]
    raw_courses = db["courses"]
    raw_preselects = db["preselects"]

    try:
        courses = genCourse(raw_courses)
    except ValueError:
        return "Invalid course type detected", 400

    course_names = getCourseid(raw_courses)
    students = genStudent(raw_students, raw_selection, course_names)

    preselects = genPreselect(raw_preselects)

    results = Algorithm.distribute(courses, students, preselects)
    db.results.insert_many(results)
    client.close()
    return ""

# ========================================


if __name__ == "__main__":
    app.run(port=PORT)
