from algorithm import Algorithm, Course, Student


student1 = Student("a", "B00000000",
        {"course1":["teacher1a","teacher1b"]}, 2)
student2 = Student("b", "B11111111", {"course1":["teacher1a","teacher1b"]}, 1)
student3 = Student("c", "B22222222",
        {"course1":["teacher1b","teacher1a"]}, 8)
students = [student2,student1,student3]

course1 = Course({"id":"course1", "name": "course1", "type": "Ten-Select-Two",
    "options":{"teacher1a": 2, "teacher1b": 2}})
courses = [course1]

print(Algorithm.distribute(courses, students))



