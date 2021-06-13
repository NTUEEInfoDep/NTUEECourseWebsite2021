import unittest
from algorithm import Algorithm, Course, Student


class Test(unittest.TestCase):
    def test_01_empty(self):
        students = []
        courses = []
        results = []
        self.assertEqual(Algorithm.distribute(courses, students), results)

    def test_02_empty(self):

        student1 = Student("Michael", "B09901186",
        {"course1":["teacher1a","tescher1b"]}, 2)
        student2 = Student("Mecoli", "610736",
        {"course1":["teacher1a","tescher1b"]}, 1)
        students = [student1,student2]


        courses = []

        results = []

        self.assertEqual(Algorithm.distribute(courses, students), results)


if __name__ == "__main__":
    unittest.main()
