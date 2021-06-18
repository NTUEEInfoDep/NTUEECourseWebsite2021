import heapq
import random

class Option:
    def __init__(self, name, limit, priority):
        '''
        name: string,
        limit: int,
        priority: 1.int, 2.bool, 3.list
        '''
        self._name = name
        self._limit = limit
        self._priority = priority
        self._full = False
        self._selected = list()  # the students been choose
        self._students = dict()  # all students
        self._priority_list = list()  # the students this option want
        self._fix = 0   # the index of immutable select

    def add_student(self, student_id, student_data):
        '''
        student_id: string,
        student_data:
        {
            "grade": int
            "num": int
        }
        '''
        priority = 0
        grade = min(student_data["grade"], 4)
        if self._priority is True:
            priority += grade
        if type(self._priority) == int and grade == self._priority:
            priority += 1
        if type(self._priority) == list and grade in self._priority:
            priority += (len(self._priority) - self._priority.index(grade))
        priority -= 10 * student_data["num"]
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
            for i in range(self._fix, index):
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


class Course:
    def __init__(self, course):
        '''
        course:
        {
            "id": string,
            "name": string,
            "type": string,
            "options": dict
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

        for name, limit in course["options"].items():
            priority = None
            if self._type == "Required":
                priority = True
            elif self._type == "EE-Lab":
                priority = False
            elif self._type == "Ten-Select-Two":
                if name == "數電實驗":
                    priority = [4,3]
                else:
                    priority = [4,3]
            option = Option(name, limit, priority)
            self._options[name] = option


    def distribute(self, students, preselect):
        '''
        preselect = dict()
        '''
        for student in students:

            # check if this student has select any option of a course
            if self._id in student._options:
                self._students[student._id] = student._options[self._id]

                data = {"grade": student._grade, "num": 0}
                for option in student._options[self._id]:
                    if option in self._options:
                        self._options[option].add_student(student._id, data)

        for option in self._options:
            self._options[option].make_priority_list()


        for time in range(self.max_select):
            for student in students:
                if self._id in student._options:
                    self._unselect.append(student._id)

            for name in self._options.keys():
                self._options[name].fix_index()

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
            for name in self._options.keys():
                self._options[name].fix_index()


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



class Algorithm:
    @staticmethod
    def distribute(courses, students):
        results = list()
        for course in courses:
            course.distribute(students, None)
            for option in course._distribute_result.keys():
                for student in course._distribute_result[option]:
                    result = {
                            "studentID": student,
                            "courseName": course,
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
