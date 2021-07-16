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

    def test_02_required(self):  # 必修課高年級優先低年級
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
                "teacher1a": {"limit": 1, "priority": -1},
                "teacher1b": {"limit": 1, "priority": -1}
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

    # @unittest.skip("maintaining")
    def test_03(self):  # 測隨機
        student1 = Student("Michael", "B09901186",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1b"]}, 2)
        student2 = Student("Mecoli", "610736",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1b"]}, 1)
        student3 = Student("Mecoli", "610736",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1b"]}, 1)
        students = [student1, student2, student3]

        course1 = Course({
            "id": "Electronic-Circuits-Experiment",
            "name": "電路學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": 0},
                "teacher1b": {"limit": 1, "priority": 0}
            }
        })
        courses = [course1]

        results = list_to_set(Algorithm.distribute(courses, students))

        self.assertEqual(len(results), 2)

    def test_04_priority_4_3(self):  # 十選二有三年級優先時

        student1 = Student("Michael", "B09901186",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 4)
        students = [student1, student2]

        course1 = Course({
            "id": "Ten-Select-Two",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 3},
            }
        })
        courses = [course1]

        expected = [{
            "studentID": "B09901186",
            "courseName": "十選二實驗",
            "optionName": "自動控制",
        },
            {
            "studentID": "610736",
            "courseName": "十選二實驗",
            "optionName": "電力電子",
        }
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_05_ten_select_two(self):  # 測多測資

        students = []
        for i in range(100):
            students.append(Student("Michael", "B09901186"+str(i),
                                    {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1b"]}, 2))
        course1 = Course({
            "id": "Electronic-Circuits-Experiment",
            "name": "電路學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher1a": {"limit": 25, "priority": 0},
                "teacher1b": {"limit": 25, "priority": 0}
            }
        })
        courses = [course1]

        results = list_to_set(Algorithm.distribute(courses, students))

        self.assertEqual(len(results), 50)

    def test_06_priority_4_3(self):  # 測preselect

        student1 = Student("Michael", "B09901186",
                           {"course1": ["電力電子", "自動控制", "數電實驗"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["嵌入式系統", "數電實驗", "自動控制"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "Ten-Select-Two",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 0},
                "數電實驗": {"limit": 1, "priority": 0},
                "嵌入式系統": {"limit": 1, "priority": 0}
            }
        })
        courses = [course1]

        expected = [
            {
                "studentID": "B09901186",
                "courseName": "Ten-Select-Two",
                "optionName": "電力電子",
            },
            {
                "studentID": "B09901186",
                "courseName": "Ten-Select-Two",
                "optionName": "數電實驗",
            },
            {
                "studentID": "610736",
                "courseName": "Ten-Select-Two",
                "optionName": "嵌入式系統",
            },
            {
                "studentID": "610736",
                "courseName": "Ten-Select-Two",
                "optionName": "自動控制",
            },
        ]
        preselect = ["B09901186"]
        results = list_to_set(Algorithm.distribute(
            courses, students, preselect))
        expected = list_to_set(expected)
        self.assertEqual(results, expected)


if __name__ == "__main__":
    unittest.main()
    print()
