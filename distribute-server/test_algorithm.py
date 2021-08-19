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

    def test_02_required(self):  # test for priority = -1
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
            "type": "1",
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

    def test_03_priority_0(self):  # test for priority = 0
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

    def test_04_priority_2(self):  # test for priority = 2
        student1 = Student("Michael", "B09901186",
                           {"Ten-Select-Two": ["自動控制"]}, 2)
        student2 = Student("Mecoli", "610736",
                           {"Ten-Select-Two": ["自動控制"]}, 4)
        students = [student1, student2]

        course1 = Course({
            "id": "Ten-Select-Two",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "options": {
                "自動控制": {"limit": 1, "priority": 2},
            }
        })
        courses = [course1]

        expected = [{
            "studentID": "B09901186",
            "courseName": "十選二實驗",
            "optionName": "自動控制",
        }
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_05_priority_3(self):  # test for priority = 3
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

    def test_06_priority_4(self): # test for priority = 4
        student1 = Student("Michael", "B09901186",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 4)
        student2 = Student("Mecoli", "610736",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 3)
        student3 = Student("Michael Jackson", "ABC1234",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 4)
        students = [student1, student2, student3]

        course1 = Course({
            "id": "Ten-Select-Two",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 2, "priority": 4},
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
        },
            {
            "studentID": "ABC1234",
            "courseName": "十選二實驗",
            "optionName": "自動控制",
        }
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_07_priority_5(self): # test for priority = 5
        student4 = Student("Mike", "AAA5678",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 1)
        student5 = Student("Pekoli", "BBB2021",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 2)
        student1 = Student("Michael", "B09901186",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 4)
        student3 = Student("Michael Jackson", "ABC1234",
                           {"Ten-Select-Two": ["自動控制", "電力電子"]}, 4)
        students = [student1, student2, student3, student4, student5]

        course1 = Course({
            "id": "Ten-Select-Two",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "options": {
                "電力電子": {"limit": 2, "priority": 0},
                "自動控制": {"limit": 3, "priority": 5},
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
            "optionName": "自動控制",
        },
            {
            "studentID": "ABC1234",
            "courseName": "十選二實驗",
            "optionName": "自動控制",
        },
            {
            "studentID": "AAA5678",
            "courseName": "十選二實驗",
            "optionName": "電力電子",
        },
            {
            "studentID": "BBB2021",
            "courseName": "十選二實驗",
            "optionName": "電力電子",
        }
        ]

        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_08_ten_select_two(self):  # test for bigger number (100) of students
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

    def test_09_preselect(self):  # test for preselect
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

    def test_10(self): # test for normal situation
        student1 = Student("Michael", "B09901186",
                           {"course1": ["電力電子", "自動控制", "嵌入式系統"]}, 1)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["自動控制", "嵌入式系統", "半導體"]}, 3)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "Ten-Select-Two",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 0},
                "半導體": {"limit": 1, "priority": 0},
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
        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)
        self.assertEqual(results, expected)

    def test_11(self): # test for more courses than students
        student1 = Student("Michael", "B09901186",
                           {"course1": ["電力電子", "自動控制", "嵌入式系統"]}, 3)
        student2 = Student("Mecoli", "610736",
                           {"course1": ["自動控制", "嵌入式系統", "半導體"]}, 1)
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "Ten-Select-Two",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 2, "priority": 0},
                "自動控制": {"limit": 2, "priority": 0},
                "半導體": {"limit": 2, "priority": 0},
                "嵌入式系統": {"limit": 2, "priority": 0}
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
                "optionName": "自動控制",
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
        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)
        self.assertEqual(results, expected)

    def test_12_EElab_1(self): # test for EE-Lab
        student1 = Student("Michael", "B09901186",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1b", "teacher1c"]}, 2)
        student2 = Student("Mecoli", "610736",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1c", "teacher1b"]}, 3)
        student3 = Student("Pekoli", "VIP8888",
                           {"Electronic-Circuits-Experiment": ["teacher1c"]}, 4)
        students = [student1, student2, student3]

        course1 = Course({
            "id": "Electronic-Circuits-Experiment",
            "name": "電路學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": 0},
                "teacher1b": {"limit": 1, "priority": 0},
                "teacher1c": {"limit": 1, "priority": 0}
            }
        })
        courses = [course1]

        results = list_to_set(Algorithm.distribute(courses, students))
        self.assertEqual(len(results), 3)

    def test_13_EElab_2(self): # test for EE-Lab
        student1 = Student("Michael", "B09901186",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1b", "teacher1c"]}, 2)
        student2 = Student("Mecoli", "610736",
                           {"Electronic-Circuits-Experiment": ["teacher1a", "teacher1c", "teacher1b"]}, 3)
        student3 = Student("Pekoli", "VIP888",
                           {"Electronic-Circuits-Experiment": ["teacher1c", "teacher1b", "teacher1a"]}, 4)
        students = [student1, student2, student3]

        course1 = Course({
            "id": "Electronic-Circuits-Experiment",
            "name": "電路學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher1a": {"limit": 2, "priority": 0},
                "teacher1b": {"limit": 2, "priority": 0},
                "teacher1c": {"limit": 2, "priority": 0}
            }
        })
        courses = [course1]
        expected = [
            {
                "studentID": "B09901186",
                "courseName": "電路學實驗",
                "optionName": "teacher1a",
            },
            {
                "studentID": "610736",
                "courseName": "電路學實驗",
                "optionName": "teacher1a",
            },
            {
                "studentID": "VIP888",
                "courseName": "電路學實驗",
                "optionName": "teacher1c",
            },
        ]
        results = list_to_set(Algorithm.distribute(courses, students))
        expected = list_to_set(expected)
        self.assertEqual(results, expected)

    def test_14_2_courses1(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"]
            },
            4
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"]
            },
            2
        )
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電磁學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": -1},
                "teacher1b": {"limit": 1, "priority": -1}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電子學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher2a": {"limit": 1, "priority": -1},
                "teacher2b": {"limit": 1, "priority": -1}
            }
        })
        courses = [course1, course2]

        results = Algorithm.distribute(courses, students)
        expected = [
            {
                "studentID": "610736",
                "courseName": "電子學(一)",
                "optionName": "teacher2b",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學(一)",
                "optionName": "teacher2a",
            },
            {
                "studentID": "610736",
                "courseName": "電磁學(一)",
                "optionName": "teacher1b",
            },
            {
                "studentID": "B09901186",
                "courseName": "電磁學(一)",
                "optionName": "teacher1a",
            },
        ]

        results = list_to_set(results)
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_15_2_courses2(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"]
            },
            2
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"]
            },
            3
        )
        student3 = Student(
            "Pekoli",
            "A123456",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"]
            },
            4
        )
        students = [student1, student2, student3]

        course1 = Course({
            "id": "course1",
            "name": "電路學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher1a": {"limit": 2, "priority": 0},
                "teacher1b": {"limit": 1, "priority": 0}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電子學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher2a": {"limit": 1, "priority": 0},
                "teacher2b": {"limit": 1, "priority": 0}
            }
        })
        courses = [course1, course2]

        results = Algorithm.distribute(courses, students)
        self.assertEqual(len(results), 5)

    def test_16_2_courses3(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2b", "teacher2a"]
            },
            4
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"]
            },
            2
        )
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電子學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": -1},
                "teacher1b": {"limit": 1, "priority": -1}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電子學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher2a": {"limit": 1, "priority": 0},
                "teacher2b": {"limit": 1, "priority": 0}
            }
        })
        courses = [course1, course2]

        results = Algorithm.distribute(courses, students)
        expected = [
            {
                "studentID": "610736",
                "courseName": "電子學(一)",
                "optionName": "teacher1b",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學(一)",
                "optionName": "teacher1a",
            },
            {
                "studentID": "610736",
                "courseName": "電子學實驗",
                "optionName": "teacher2a",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學實驗",
                "optionName": "teacher2b",
            },
        ]

        results = list_to_set(results)
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_17_3_cousres1(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["自動控制", "電力電子"]
            },
            2
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["自動控制", "電力電子"]
            },
            3
        )
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電磁學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": -1},
                "teacher1b": {"limit": 1, "priority": -1}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電子學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher2a": {"limit": 1, "priority": -1},
                "teacher2b": {"limit": 1, "priority": -1}
            }
        })
        course3 = Course({
            "id": "course3",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 3}
            }
        })
        courses = [course1, course2, course3]

        results = Algorithm.distribute(courses, students)
        expected = [
            {
                "studentID": "610736",
                "courseName": "電磁學(一)",
                "optionName": "teacher1a",
            },
            {
                "studentID": "B09901186",
                "courseName": "電磁學(一)",
                "optionName": "teacher1b",
            },
            {
                "studentID": "610736",
                "courseName": "電子學(一)",
                "optionName": "teacher2a",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學(一)",
                "optionName": "teacher2b",
            },
            {
                "studentID": "610736",
                "courseName": "十選二實驗",
                "optionName": "自動控制",
            },
            {
                "studentID": "B09901186",
                "courseName": "十選二實驗",
                "optionName": "電力電子",
            },
        ]

        results = list_to_set(results)
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_18_3_courses2(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["自動控制", "電力電子"]
            },
            2
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["自動控制", "電力電子"]
            },
            3
        )
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電子學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": -1},
                "teacher1b": {"limit": 1, "priority": -1}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電子學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher2a": {"limit": 2, "priority": 0},
                "teacher2b": {"limit": 2, "priority": 0}
            }
        })
        course3 = Course({
            "id": "course3",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 3}
            }
        })
        courses = [course1, course2, course3]

        results = Algorithm.distribute(courses, students)
        expected = [
            {
                "studentID": "610736",
                "courseName": "電子學(一)",
                "optionName": "teacher1a",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學(一)",
                "optionName": "teacher1b",
            },
            {
                "studentID": "610736",
                "courseName": "電子學實驗",
                "optionName": "teacher2a",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學實驗",
                "optionName": "teacher2a",
            },
            {
                "studentID": "610736",
                "courseName": "十選二實驗",
                "optionName": "自動控制",
            },
            {
                "studentID": "B09901186",
                "courseName": "十選二實驗",
                "optionName": "電力電子",
            },
        ]

        results = list_to_set(results)
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_19_4_courses1(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teaher2b"],
             "course4": ["自動控制", "電力電子"]
            },
            2
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course3": ["teacher3a", "teacher3b"],
             "course4": ["自動控制", "電力電子"]
            },
            3
        )
        students = [student1, student2]

        course1 = Course({
            "id": "course1",
            "name": "電子學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher1a": {"limit": 1, "priority": -1},
                "teacher1b": {"limit": 1, "priority": -1}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電磁學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher2a": {"limit": 1, "priority": -1},
                "teacher2b": {"limit": 1, "priority": -1}
            }
        })
        course3 = Course({
            "id": "course3",
            "name": "電子學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher3a": {"limit": 1, "priority": 0},
                "teacher3b": {"limit": 1, "priority": 0}
            }
        })
        course4 = Course({
            "id": "course4",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 3}
            }
        })
        courses = [course1, course2, course3, course4]

        results = Algorithm.distribute(courses, students)
        expected = [
            {
                "studentID": "610736",
                "courseName": "電子學(一)",
                "optionName": "teacher1a",
            },
            {
                "studentID": "B09901186",
                "courseName": "電子學(一)",
                "optionName": "teacher1b",
            },
            {
                "studentID": "B09901186",
                "courseName": "電磁學(一)",
                "optionName": "teacher2a",
            },
            {
                "studentID": "610736",
                "courseName": "電子學實驗",
                "optionName": "teacher3a",
            },
            {
                "studentID": "610736",
                "courseName": "十選二實驗",
                "optionName": "自動控制",
            },
            {
                "studentID": "B09901186",
                "courseName": "十選二實驗",
                "optionName": "電力電子",
            },
        ]

        results = list_to_set(results)
        expected = list_to_set(expected)

        self.assertEqual(results, expected)

    def test_20_4_courses2(self): # test for multiple courses
        student1 = Student(
            "Michael",
            "B09901186",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["teacher3a", "teacher3b"],
             "course4": ["自動控制", "嵌入式系統", "電力電子"]
            },
            2
        )
        student2 = Student(
            "Mecoli",
            "610736",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["teacher3a", "teacher3b"],
             "course4": ["自動控制", "電力電子", "嵌入式系統"]
            },
            3
        )
        student3 = Student(
            "Pekoli",
            "VIP8888",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["teacher3a", "teacher3b"],
             "course4": ["電力電子", "嵌入式系統", "自動控制"]
            },
            3
        )
        student4 = Student(
            "Mike",
            "A123456",
            {"course1": ["teacher1a", "teacher1b"],
             "course2": ["teacher2a", "teacher2b"],
             "course3": ["teacher3a", "teacher3b"],
             "course4": ["嵌入式系統", "自動控制", "電力電子"]
            },
            4
        )
        students = [student1, student2, student3, student4]

        course1 = Course({
            "id": "course1",
            "name": "電子學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher1a": {"limit": 10, "priority": -1},
                "teacher1b": {"limit": 10, "priority": -1}
            }
        })
        course2 = Course({
            "id": "course2",
            "name": "電磁學(一)",
            "type": "2",
            "description": "",
            "options": {
                "teacher2a": {"limit": 1, "priority": -1},
                "teacher2b": {"limit": 1, "priority": -1}
            }
        })
        course3 = Course({
            "id": "course3",
            "name": "電子學實驗",
            "type": "EE-Lab",
            "description": "",
            "options": {
                "teacher3a": {"limit": 1, "priority": 0},
                "teacher3b": {"limit": 2, "priority": 0}
            }
        })
        course4 = Course({
            "id": "course4",
            "name": "十選二實驗",
            "type": "Ten-Select-Two",
            "description": "",
            "options": {
                "電力電子": {"limit": 1, "priority": 0},
                "自動控制": {"limit": 1, "priority": 3},
                "嵌入式系統": {"limit": 1, "priority": 0}
            }
        })
        courses = [course1, course2, course3, course4]

        results = Algorithm.distribute(courses, students)
        
        results = list_to_set(results)
        self.assertEqual(len(results), 12)

if __name__ == "__main__":
    unittest.main()
    print()
