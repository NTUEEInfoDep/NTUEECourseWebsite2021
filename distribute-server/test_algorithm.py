import pymongo
import pprint
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
        self._selected = list() # the students been choose
        self._students = dict() # all students
        self._priority_list = list() # the students this option want

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

    def select(self,student_id):
        if len(self._selected) < self._limit:
            index = self._priority_list.index(student_id)
            idx = index
            for i in range(index):
                idx = i
                if i >= len(self._selected):
                    break
                compare = self._priority_list.index(self._selected[i])
                if compare > index:
                    break
            self._selected.insert(idx, student_id)
            return True
        else:
            index = self._priority_list.index(student_id)
            about_to_kick = self._selected.pop()
            if index > self._priority_list.index(about_to_kick):
                return student_id
            else:
                idx = index
                for i in range(index):
                    idx = i
                    if i >= len(self._selected):
                        break
                    compare = self._priority_list.index(self._selected[i])
                    if compare > index:
                        break
                self._selected.insert(idx, student_id)
                return about_to_kick

class Course:
    def __init__(self, course):
        '''
        course:
        {
            "id": string,
            "name": string,
            "options": dict
        }
        '''
        self._id = course["id"]
        self._name = course["name"]
        self._options = dict()
        self.max_select = 1
        self._students = dict()
        self._unselect = list()

        for name, limit in course["options"].items():
            option = Option(name, limit, True)
            self._options[name] = option

    def distribute(self, students, preselect):
        '''
        students:
        [{
            "id": string,
            "grade": int,
            "options": list (ordered of wish start from first)
        }]
        preselect = dict()
        '''
        for student in students:
            self._unselect.append(student["id"])
            self._students[student["id"]] = student["options"]
            data = {"grade": student["grade"], "num": 0}
            for option in student["options"]:
                if option in self._options:
                    self._options[option].add_student(student["id"], data)

        student_num = len(students)

        for option in self._options:
            self._options[option].make_priority_list()

        for time in range(student_num):
            student_id = self._unselect.pop()
            distributed = False
            while not distributed:
                result = student_id
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
                if result == student_id: # poor you
                    distributed = True




def main():
    myclient = pymongo.MongoClient('localhost', 27017)

    db = myclient['ntuee-course']

    courses  = db.courses
    students = db.students
    selections = db.selections

    dblist = myclient.list_database_names()
    # dblist = myclient.database_names()
    pprint.pprint(courses.find_one())


