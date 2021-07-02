import unittest
import json
from algorithm import Algorithm, Course, Student


class Test(unittest.TestCase):
    def test_01_empty(self):
        students = []
        courses = []
        results = []
        self.assertEqual(Algorithm.distribute(courses, students), results)

    def test_02_required(self):
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

        results = set([json.dumps(x) for x in results])
        expected = set([json.dumps(x) for x in expected])

        self.assertEqual(results, expected)

    @unittest.skip("maintaining")
    def test_03(self):
        student1 = Student("Michael", "B09901186",
                           {"course1": ["teacher1a", "teacher1b"]}, 2)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["teacher1a", "teacher1b"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "teacher1a": 1,
                "teacher1b": 1}
        })
        courses = [course1]

        results = [{
            "studentID": "B09901186",
            "courseName": course1,
            "optionName": "teacher1a",
        },
            {
            "studentID": "610736",
            "courseName": course1,
            "optionName": "teacher1b",
        }
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)

    def test_04_priority_4_3(self):

        student1 = Student("Michael", "B09901186",
                           {"course1": ["teacher1a", "teacher1b"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["teacher1a", "teacher1b"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "teacher1a": 1,
                "teacher1b": 1}
        })
        courses = [course1]

        results = [{
            "studentID": "B09901186",
            "courseName": course1,
            "optionName": "teacher1a",
        },
            {
            "studentID": "610736",
            "courseName": course1,
            "optionName": "teacher1b",
        }
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)

    @unittest.skip("")
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

        results = [{
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

        self.assertEqual(Algorithm.distribute(courses, students), results)

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

        results = [{
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

        self.assertEqual(set(Algorithm.distribute(
            courses, students)), set(results))


if __name__ == "__main__":
    unittest.main()
    print()
