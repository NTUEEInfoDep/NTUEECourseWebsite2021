import unittest
from algorithm import Algorithm, Course, Student


class Test(unittest.TestCase):
    def test_01_empty(self):
        students = []
        courses = []
        results = []
        self.assertEqual(Algorithm.distribute(courses, students), results)

    def test_02_empty(self): #test required

        student1 = Student("Michael", "B09901186",
        {"course1":["teacher1a","teacher1b"]}, 2)
        student2 = Student("Mecoli", "610736",
        {"course1":["teacher1a","teacher1b"]}, 1)
        students = [student1,student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Required",
            "description": "",
            "options": { 
                "teacher1a": 1 ,
                "teacher1b": 1 }    
        })
        courses = [course1]

        results = [{
            "studentID":"B09901186",
            "courseName": course1,
            "optionName": "teacher1a",
        },
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "teacher1b",
        }
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)
    """
    def test_03_empty(self): #test no priority[4,3]

        student1 = Student("Michael", "B09901186",
        {"course1":["teacher1a","teacher1b"]}, 2)
        student2 = Student("Mecoli", "610736",
        {"course1":["teacher1a","teacher1b"]}, 1)
        students = [student1,student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": { 
                "teacher1a": 1 ,
                "teacher1b": 1 }    
        })
        courses = [course1]

        results = [{
            "studentID":"B09901186",
            "courseName": course1,
            "optionName": "teacher1a",
        },
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "teacher1b",
        }
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)
    """
    def test_04_empty(self): #test  priority[4,3]

        student1 = Student("Michael", "B09901186",
        {"course1":["teacher1a","teacher1b"]}, 3)
        student2 = Student("Mecoli", "610736",
        {"course1":["teacher1a","teacher1b"]}, 1)
        students = [student1,student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": { 
                "teacher1a": 1 ,
                "teacher1b": 1 }    
        })
        courses = [course1]

        results = [{
            "studentID":"B09901186",
            "courseName": course1,
            "optionName": "teacher1a",
        },
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "teacher1b",
        }
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)
    def test_05_empty(self): #test  ten select 2

        student1 = Student("Michael", "B09901186",
        {"course1":["電力電子","自動控制"]}, 3)
        student2 = Student("Mecoli", "610736",
        {"course1":["自動控制","數電實驗"]}, 1)
        students = [student1,student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": { 
                "電力電子": 1 ,
                "自動控制": 1 ,
                "數電實驗": 1 ,}    
        })
        courses = [course1]

        results = [{
            "studentID":"B09901186",
            "courseName": course1,
            "optionName": "電力電子",
        },
        
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "自動控制",
        },
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "數電實驗",
        },
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)
    
    def test_06_empty(self): #test  priority[4,3]

        student1 = Student("Michael", "B09901186",
        {"course1":["電力電子","自動控制"]}, 3)
        student2 = Student("Mecoli", "610736",
        {"course1":["嵌入式系統","數電實驗"]}, 1)
        students = [student1,student2]

        course1 = Course({
            "id": "course1",
            "name": "電路學",
            "type": "Ten-Select-Two",
            "description": "",
            "options": { 
                "電力電子": 1 ,
                "自動控制": 1 ,
                "數電實驗": 1 ,
                "嵌入式系統": 1}    
        })
        courses = [course1]

        results = [{
            "studentID":"B09901186",
            "courseName": course1,
            "optionName": "電力電子",
        },
        {
            "studentID":"B09901186",
            "courseName": course1,
            "optionName": "自動控制",
        },
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "數電實驗",
        },
        {
            "studentID":"610736",
            "courseName": course1,
            "optionName": "嵌入式系統",
        }
        ]

        self.assertEqual(Algorithm.distribute(courses, students), results)
    
if __name__ == "__main__":
    unittest.main()
    print()
