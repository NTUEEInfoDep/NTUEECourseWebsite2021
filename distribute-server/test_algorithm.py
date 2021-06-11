import unittest
from algorithm import Algorithm


class Test(unittest.TestCase):
    def setUp(self):
        self.algorithm = Algorithm()

    def test_01_sample(self):
        self.assertEqual(self.algorithm.add(1, 1), 2)


if __name__ == "__main__":
    unittest.main()
