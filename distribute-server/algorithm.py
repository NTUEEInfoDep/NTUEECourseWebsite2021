import heapq
import random


class Option:
    def __init__(self, name, data):
        '''
        name: string,
        data: dict:
            {
                "limit": int,
                "priority": int
                            0: no priority
                            -1: priority from high grade to low grade
                            1,2,3,4: this grade has higher priority
            }
        '''
        self._name = name
        self._limit = data["limit"]
        self._priority = data["priority"]
        self._full = False
        self._selected = list()  # the students been choose
        self._students = dict()  # all students
        self._priority_list = list()  # the students this option want
        self._fix = 0   # the index of immutable select

    def add_student(self, student_id, student_grade):
        '''
        student_id: string,
        student_grade: int
        '''
        priority = 0
        grade = min(student_grade, 4)
        if self._priority == -1:
            priority += grade
        elif grade == self._priority:
            priority += 1
        self._students[student_id] = -priority

    def make_priority_list(self):
        priority_group = dict()
        for student_id, priority in self._students.items():
            priority_group.setdefault(priority, list()).append(student_id)
        priorities = list(priority_group.keys())
        heapq.heapify(priorities)
        for time in range(len(priority_group)):
            students = priority_group[heapq.heappop(priorities)]
            random.shuffle(students)
            self._priority_list.extend(students)

    def select(self, student_id):
        if student_id in self._selected:
            return student_id

        if len(self._selected) < self._limit:
            index = self._priority_list.index(student_id)
            idx = index
            for i in range(self._fix, self._fix + index):
                idx = i
                if i >= len(self._selected):
                    break
                compare = self._priority_list.index(self._selected[i])
                if compare > index:
                    break
            self._selected.insert(idx, student_id)
            return True
        elif(self._fix < len(self._selected)):
            index = self._priority_list.index(student_id)
            about_to_kick = self._selected.pop()
            if index > self._priority_list.index(about_to_kick):
                self._selected.append(about_to_kick)
                return student_id
            else:
                idx = index
                for i in range(self._fix, index):
                    idx = i
                    if i >= len(self._selected):
                        break
                    compare = self._priority_list.index(self._selected[i])
                    if compare > index:
                        break
                self._selected.insert(idx, student_id)
                return about_to_kick
        else:
            return student_id

    def fix_index(self):
        self._fix = len(self._selected)

    def preselect(self, preselect):
        self._selected.extend(preselect)
        self._priority_list.extend(preselect)
        self.fix_index()


class Course:
    # type has three type: Ten-Select-Two, EE-Lab, Required
    def __init__(self, course):
        '''
        course:
        {
            "id": string,
            "name": string,
            "type": string,
            "options": dict:
                {
                "Option_name":
                    {
                    "limit": int,
                    "priority":
                        1.int
                        2.bool
                        3.list
                    }
                }
        }
        '''
        self._name = course["name"]
        self._id = course["id"]
        self._type = course["type"]
        self._options = dict()
        self.max_select = 1
        self._students = dict()     # candidate list
        self._unselect = list()
        self._distribute_result = dict()

        if self._type == "Ten-Select-Two":
            self.max_select = 2

        for name, data in course["options"].items():
            option = Option(name, data)
            self._options[name] = option

    def __str__(self):
        return f"Course(id={self._id}, name={self._name})"

    def __repr__(self):
        return self.__str__()

    def distribute(self, students, preselect=None):
        if preselect is not None:
            self._options["數電實驗"].preselect(preselect)

        for student in students:

            # check if this student has select any option of a course
            if self._id in student._options:
                self._students[student._id] = student._options[self._id]

                for option in student._options[self._id]:
                    if option in self._options:
                        self._options[option].add_student(student._id,
                                                          student._grade)

        for option in self._options:
            self._options[option].make_priority_list()

        for time in range(self.max_select):
            for name in self._options.keys():
                self._options[name].fix_index()

            if time == 0 and preselect is not None:
                for student in students:
                    if self._id in student._options and student._id not in preselect:
                        self._unselect.append(student._id)
            else:
                for student in students:
                    if self._id in student._options:
                        self._unselect.append(student._id)

            student_num = len(self._unselect)

            for iterate_through_students in range(student_num):
                student_id = self._unselect.pop()
                distributed = False
                while not distributed:
                    initial = student_id
                    result = initial
                    for option in self._students[student_id]:
                        result = self._options[option].select(student_id)
                        '''
                        result return True if students was added,
                        result return an id != student_id then loop again,
                        result return id == student_id then keep going
                        '''
                        if result is True:
                            distributed = True
                            break
                        elif result != student_id:
                            student_id = result
                            break
                    if result == initial:  # poor you
                        distributed = True

        # deal with ten-select-two

        for name in self._options.keys():
            self._distribute_result[name] = self._options[name]._selected

        return self._distribute_result


class Student:
    def __init__(self, name, studentID, options, grade):
        '''
            options:
            {
                "courseId":[1st, 2nd, 3rd, ...]
            }
        '''
        self._name = name
        self._id = studentID
        self._options = options
        self._grade = grade

    def __str__(self):
        return f"Student(id={self._id}, name={self._name}, options={self._options})"

    def __repr__(self):
        return self.__str__()


class Algorithm:
    @staticmethod
    def distribute(courses, students, preselect=None):
        '''
        preselect = [student1_id, student2_id, ...]
        '''
        results = list()
        for course in courses:
            if course._type == "Ten-Select-Two":
                course.distribute(students, preselect)
            else:
                course.distribute(students, None)
            for option in course._distribute_result.keys():
                for student in course._distribute_result[option]:
                    result = {
                        "studentID": student,
                        "courseName": course._name,
                        "optionName": option
                    }
                    results.append(result)
        '''
        result = {
            "studentID": "a",
            "courseName": "b",
            "optionName": "c",
        }
        '''
        return results


if __name__ == "__main__":
    student1 = Student("a", "B00000000", {"course1": [
                       "teacher1a", "teacher1b", "數電實驗"]}, 2)
    student2 = Student("b", "B11111111", {"course1": [
                       "teacher1a", "teacher1b", "數電實驗"]}, 1)
    student3 = Student("c", "B22222222", {"course1": [
                       "teacher1b", "teacher1a", "數電實驗"]}, 8)
    student4 = Student("c", "B22222223", {"course1": [
                       "teacher1b", "teacher1a", "數電實驗"]}, 2)
    student5 = Student("c", "B22222224", {"course1": [
                       "teacher1b", "teacher1a", "數電實驗"]}, 4)
    student6 = Student("c", "B22222225", {"course1": [
                       "teacher1b", "teacher1a", "數電實驗"]}, 3)
    students = [student2, student1, student3, student4, student5, student6]

    course1 = Course({"id": "course1", "name": "course1", "type": "Ten-Select-Two",
                      "options": {"數電實驗": {"limit": 5, "priority": -1}, "teacher1b":
                                  {"limit": 2, "priority": 3}, "teacher1a": {"limit": 2,
                                                                             "priority": 0}}})
    courses = [course1]

    preselect = ["B22222225", "B22222224", "B22222223"]

    print(Algorithm.distribute(courses, students, preselect))
