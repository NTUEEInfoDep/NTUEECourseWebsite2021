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
            courseDict["options"][op["name"]] = op["limit"]
        courses.append(Course(courseDict))
    return courses

def getCourseid(raw_courses):
    name = []
    for data in raw_courses.find():
        name.append(data["id"])
    return name

def genStudent(raw_student, raw_selection, course_id):
    students = []
    for data in raw_student.find(): # iterate through all students
        result_selection = {}
        for name in course_id: # iterate through every course
            result_selection[name] = []
            student_selections = raw_selection.find({"userID":data["userID"], "courseID" : name}) # all selections made by a student of certain course
            for i in range(len(list(student_selections))):
                rank_i_selection = raw_selection.find({"userID":data["userID"], "courseID" : name, "ranking" : i + 1}) #the (i+1)th selection
                for ith_option in rank_i_selection:
                    result_selection[name].append(ith_option["name"])

        students.append(Student(data["name"], data["userID"], result_selection, data["grade"]))
    return students
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

    courses = genCourse(raw_courses)
    course_names = getCourseid(raw_courses)

    students = genStudent(raw_students, raw_selection, course_names)



    # read db
    # student1 = Student("alice")

    results = Algorithm.distribute(courses, students)
    db.results.insert_many(results)
    client.close()
    return ""

# ========================================


if __name__ == "__main__":
    app.run(port=PORT)
