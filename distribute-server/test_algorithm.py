import unittest
import json
from algorithm import Algorithm, Course, Student

def list_to_set(list1):
    list1 = set([json.dumps(x) for x in list1])
    return list1

class Test(unittest.TestCase):
    def test_01_empty(self):
        students = []
        courses = []
        results = []
        self.assertEqual(Algorithm.distribute(courses, students), results)

    def test_02_required(self): #必修課高年級優先低年級
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"]},
            2
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"]},
            1
        )
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Required",
            "priority": True,
            "description": "",
            "options": {
                "teacher1a": 1,
                "teacher1b": 1,
            }
        })
        courses = [course1]

        results = Algorithm.distribute(courses, students)
        expected = [
            {
                "studentID": "610736",
                "courseName": "電路學",
                "optionName": "teacher1b",
            },
            {
                "studentID": "B09901186",
                "courseName": "電路學",
                "optionName": "teacher1a",
            },
        ]

        results = list_to_set(results)
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    @unittest.skip("maintaining")
    def test_03(self):  #還不確定在測什麼
        student1 = Student("Michael", "B09901186",
                           {"course1": ["teacher1a", "teacher1b"]}, 2)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["teacher1a", "teacher1b"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電力電子",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "teacher1a": 1,
                "teacher1b": 1}
        })
        courses = [course1]

        expected = [{
            "studentID": "B09901186",
            "courseName": "電力電子",
            "optionName": "teacher1a",
        },
            {
            "studentID": "610736",
            "courseName": "電力電子",
            "optionName": "teacher1b",
        }
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_04_priority_4_3(self):  #十選二有三年級優先時

        student1 = Student("Michael", "B09901186",
                           {"course1": ["teacher1a", "teacher1b"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["teacher1a", "teacher1b"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "半導體",
            "type": "Ten-Select-Two",
            "priority": 3,
            "description": "",
            "options": {
                "teacher1a": 1,
                "teacher1b": 1}
        })
        courses = [course1]

        expected = [{
            "studentID": "B09901186",
            "courseName": "半導體",
            "optionName": "teacher1a",
        },
            {
            "studentID": "610736",
            "courseName": "半導體",
            "optionName": "teacher1b",
        }
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    @unittest.skip("preselect not finished")
    def test_05_ten_select_two(self):

        student1 = Student("Michael", "B09901186",
                           {"course1": ["電力電子", "自動控制"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["自動控制", "數電實驗"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": 1,
                "自動控制": 1,
                "數電實驗": 1, }
        })
        courses = [course1]

        expected = [{
            "studentID": "B09901186",
            "courseName": course1,
            "optionName": "電力電子",
        },

            {
            "studentID": "610736",
            "courseName": course1,
            "optionName": "自動控制",
        },
            {
            "studentID": "610736",
            "courseName": course1,
            "optionName": "數電實驗",
        },
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_06_priority_4_3(self):

        student1 = Student("Michael", "B09901186",
                           {"course1": ["電力電子", "自動控制"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["嵌入式系統", "數電實驗"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": 1,
                "自動控制": 1,
                "數電實驗": 1,
                "嵌入式系統": 1}
        })
        courses = [course1]

        expected = [{
            "studentID": "B09901186",
            "courseName": course1,
            "optionName": "電力電子",
        },
            {
            "studentID": "B09901186",
            "courseName": course1,
            "optionName": "自動控制",
        },
            {
            "studentID": "610736",
            "courseName": course1,
            "optionName": "嵌入式系統",
        },
            {
            "studentID": "610736",
            "courseName": course1,
            "optionName": "數電實驗",
        },
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)


if __name__ == "__main__":
    unittest.main()
    print()
