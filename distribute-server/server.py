import os
from pymongo import MongoClient
from flask import Flask, request, Response

from algorithm import Algorithm, Course, Student
from statistics import Analysis
# ========================================

app = Flask(__name__)

PORT = os.environ.get("PORT", 8001)
MONGO_HOST = os.environ.get("MONGO_HOST", "localhost")
MONGO_PORT = os.environ.get("MONGO_PORT", 27017)
MONGO_DBNAME = os.environ.get("MONGO_DBNAME", "ntuee-course")

# ========================================


def genCourse(raw_courses, course_name = None):
    courses = []
    if course_name is None:
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
    else:
        courseDict = {}
        if 0 == 0:
            data = raw_courses.find_one({"id": course_name})
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
        else:
            print("course %s not found" % course_name)
    return courses


def getCourseid(raw_courses):
    name = []
    for data in raw_courses.find():
        name.append(data["id"])
    return name


def genStudent(raw_student, raw_selections, course_id, student_in_course_data =
        {}):
    students = []
    for data in raw_student.find():  # iterate through all students
        result_selection = {}
        for name in course_id:  # iterate through every course
            if name in student_in_course_data:
                if data["userID"] not in student_in_course_data[name]:
                    continue
            result_selection[name] = []
            # all selections made by a student of certain course
            student_selections = raw_selections.find(
                {"userID": data["userID"], "courseID": name})
            for i in range(len(list(student_selections))):
                rank_i_selection = raw_selections.find(
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
    raw_selections = db["selections"]
    raw_students = db["students"]
    raw_courses = db["courses"]
    raw_preselects = db["preselects"]

    try:
        courses = genCourse(raw_courses)
    except ValueError:
        return "Invalid course type detected", 400

    course_names = getCourseid(raw_courses)
    students = genStudent(raw_students, raw_selections, course_names)

    preselects = genPreselect(raw_preselects)

    results = Algorithm.distribute(courses, students, preselects)
    db.results.delete_many({})
    db.results.insert_many(results)
    client.close()
    return ""


@app.route("/specific_distribute", methods=["POST"])
def specific_distribute():
    client = MongoClient(MONGO_HOST, MONGO_PORT)
    db = client[MONGO_DBNAME]
    raw_selections = db["selections"]
    raw_students = db["students"]
    raw_courses = db["courses"]
    raw_preselects = db["preselects"]
    student_in_course_data = {}
    for data in request.get_json():
        student_in_course_data[data["course_id"]] = data["students"]

    db.results.delete_many({})

    course_names = getCourseid(raw_courses)

    if len(student_in_course_data) == 0:

        try:
            courses = genCourse(raw_courses)
        except ValueError:
            return "Invalid course type detected", 400

        students = genStudent(raw_students, raw_selections, course_names)

        preselects = genPreselect(raw_preselects)

        results = Algorithm.distribute(courses, students, preselects)
        db.results.insert_many(results)
    else:
        results = []
        for course_name in course_names:

            try:
                courses = genCourse(raw_courses, course_name = course_name)
            except ValueError:
                return "Invalid course type detected", 400

            students = genStudent(raw_students, raw_selections, course_names,
                    student_in_course_data)

            preselects = genPreselect(raw_preselects)

            result = Algorithm.distribute(courses, students, preselects)
            results.extend(result)
        db.results.insert_many(results)

    client.close()
    return ""


@app.route("/statistics", methods=["GET"])
def statistics():
    client = MongoClient(MONGO_HOST, MONGO_PORT)
    db = client[MONGO_DBNAME]
    raw_selections = db["selections"]
    raw_students = db["students"]
    raw_courses = db["courses"]
    raw_results = db["results"]

    try:
        courses = genCourse(raw_courses)
    except ValueError:
        return "Invalid course type detected", 400

    course_names = getCourseid(raw_courses)
    students = genStudent(raw_students, raw_selections, course_names)
    results = [result for result in raw_results.find()]
    
    analysis = Analysis(courses, students, results)
    analysis.analyze()
    analysis.analyze_grade()
    csv_string = analysis.to_csv()
    return Response(csv_string, mimetype='text/plain')
# ========================================


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=PORT)
