import unittest
from algorithm import Algorithm, Course, Student


class Test(unittest.TestCase):
    def test_01_empty(self):
        students = []
        courses = []
        results = []
        self.assertEqual(Algorithm.distribute(courses, students), results)


if __name__ == "__main__":
    unittest.main()
