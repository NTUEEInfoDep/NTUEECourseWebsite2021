import heapq
import random


class Option:
    ''' Option with the functions supporting course distribution.

    Attributions:
        _name: (string)
            The name of this option, which could be the teacher's name or options in Ten-Select-Two

        _limit: (int)
            The maximun number of the students that this options can have.

        _priority: (int)
            The type of this priority.
                0:          Priority is not associate with the grade.
                -1:         The higher grade students will have higher priority.
                1,2,3,4:    Students in this grade will have higher priority.
                5:          Students with grade 3 and 4 have higher priority.

        _selected: (list)
            Store the students who have been selected by this option.

        _students: (dict)
            Store data of the students who has select this option.

        _priority_list: (list)
            All students arrange according to the preference of this option, which was based on priority and random.

        _fix: (int)
            The student in _selected whose index is smaller than this integer is immutable.
    '''

    def __init__(self, name, data):
        ''' Init of this option.

        Args:
            name: (string)
                The name of this option.

            data: (dict)
                Data of this option.
                {
                    "limit": int
                        The maximun number of the students that this options can have.

                    "priority": int
                        The type of this priority.
                            0:          Priority is not associate with the grade.
                            -1:         The higher grade students will have higher priority.
                            1,2,3,4:    Students in this grade will have higher priority.
                            5:          Students with grade 3 and 4 have higher priority.
                }
        '''

        self._name = name
        self._limit = data["limit"]
        self._priority = data["priority"]
        self._selected = list()
        self._students = dict()
        self._priority_list = list()
        self._fix = 0

    def add_student(self, student_id, student_grade):
        ''' Add student and count his/her priority.

        Count priority bases on self._priority, and add these information into self._students.
        The lower a student's priority is, the more possibility that this student will be selected by this option.

        Args:
            student_id: (string)
            student_grade: (int)
        '''

        # student with grade higher than 4 will be seen as 4 grade
        grade = min(student_grade, 4)

        # count priority
        priority = 0
        if self._priority == -1:
            priority -= grade
        elif self._priority == 5:
            if grade == 3 or grade == 4:
                priority -= 1
        elif grade == self._priority:
            priority -= 1

        # store information
        self._students[student_id] = priority

    def make_priority_list(self):
        ''' Make priority list.

        Sort students with different priority and put these data in priority_group.
        Use heapq to deal with students starting from low priority to high priority.
        (Remember that low priority will have high possibility to be selected)
        Random the students with same priority and append to self._priority_list.

        Args:
            None
        '''

        # sort students
        priority_group = dict()
        for student_id, priority in self._students.items():
            priority_group.setdefault(priority, list()).append(student_id)

        # number of different kinds priority
        priorities = list(priority_group.keys())

        # order from least to greatest
        heapq.heapify(priorities)

        # random and extend to self._priority_list
        for time in range(len(priority_group)):
            students = priority_group[heapq.heappop(priorities)]
            random.shuffle(students)
            self._priority_list.extend(students)

    def select(self, student_id):
        ''' Deal with this student based on self._priority_list and modify data in self._selected.

        If self._selected is not full, add this student.
        If self._selected is full, compare the priority of this student and
        the last student in self._selected and determine who can stay.
        (The one who failed will be returned)
        (The index smaller than self._fix in immutable)

        Args:
            student_id: (string)

        Returns:
            Two type of return.
            1. None: successfully add.
            2. a student's id: (string)
                the student that failed to select this option
        '''

        # check that whether this student has been selected already
        if student_id in self._selected:
            return student_id

        # self._selected is not full
        if len(self._selected) < self._limit:

            # determine the rank of this student's priority
            index = self._priority_list.index(student_id)
            idx = index

            # find the proper index for this student to insert
            for i in range(self._fix, self._fix + index):
                idx = i
                if i >= len(self._selected):
                    break
                compare = self._priority_list.index(self._selected[i])
                if compare > index:
                    break

            # add this student to the corresponding index
            self._selected.insert(idx, student_id)
            return True

        # self._selected is full and partial mutable
        elif(self._fix < len(self._selected)):

            # determine the rank of this student's priority
            index = self._priority_list.index(student_id)

            # pop out the last one in self._selected
            about_to_kick = self._selected.pop()

            # compare the priority to determine who can stay
            if index > self._priority_list.index(about_to_kick):
                self._selected.append(about_to_kick)
                return student_id
            else:
                idx = index

                # find the proper index for this student to insert
                for i in range(self._fix, index):
                    idx = i
                    if i >= len(self._selected):
                        break
                    compare = self._priority_list.index(self._selected[i])
                    if compare > index:
                        break

                # add this student to the corresponding index
                self._selected.insert(idx, student_id)
                return about_to_kick

        # self._selected is full and completely immutable
        else:
            return student_id

    def fix_index(self):
        ''' Fix the data of self._selected.

        Args:
            None
        '''

        self._fix = len(self._selected)

    def preselect(self, preselect):
        ''' Add preselect data to self._selected and fix it.

        Args:
            preselect: (string)
                Students who have already got this options(數電實驗).

        '''

        self._selected.extend(preselect)
        self._priority_list.extend(preselect)
        self.fix_index()


class Course:
    ''' Class that stores data of a course and distribute function.

    Attributions:
        _name: (string)
            Course's name.

        _id: (string)
            Course's id.

        _type: (string)
            Course's type.(Required, EE-Lab, Ten-Select-Two)

        _options: (dict)
            key: (string):
                Option's name.
            value: (class Option)

        max_select: (int)
            the maximun number of options of this course that a student can be selected.

        _students: (dict)
            key: (string)
                Id of students who have selected this course.
            value: (list)
                The options that this student has selected, base on aspiration

        _distribute_result: (dict)
            key: (string)
                Options' name.
            value: (list)
                Id of students who has successfully selected this option
    '''

    def __init__(self, course):
        ''' Init of this course.

        Args:
            course: (dict)
                Data of this course.
                {
                    "id": (string)
                    "name": (string)
                    "type": (string)
                    "options": (dict)
                        key: (string)
                            options' name
                        value: (dict)
                            {
                                "limit": (int)
                                "priority": (int)
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
        self._distribute_result = dict()

        # students can select 2 options in Ten-Select-Two
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
        ''' Distribute this course and store result in self._distribute_result.

        Args:
            students: (list)
                List of class Student

            preselect: (list or None)
                List of students who have already got 數電實驗.

        Returns:
            A dictionary contains the result of distribution.
        '''

        # deal with preselect
        if preselect is not None:
            self._options["數電實驗"].preselect(preselect)

        for student in students:

            # check if this student has select any option of this course
            if self._id in student._options:
                self._students[student._id] = student._options[self._id]

                for option in student._options[self._id]:
                    if option in self._options:
                        self._options[option].add_student(student._id,
                                                          student._grade)
        # make priority list of each option
        for option in self._options:
            self._options[option].make_priority_list()

        # every student select one option in an iteration
        for time in range(self.max_select):

            # fix the result of previous iterations or preselect data
            for name in self._options.keys():
                self._options[name].fix_index()

            # construct a list of students who hasn't been distributed yet
            unselect = list()

            # In the first round, the students in preselect won't be added to preselect.
            if time == 0 and preselect is not None:
                for student in students:
                    if self._id in student._options and student._id not in preselect:
                        unselect.append(student._id)

            # add students who has select this course to unselect
            else:
                for student in students:
                    if self._id in student._options:
                        unselect.append(student._id)

            # iterate through all the students in unselect
            for iterate_through_students in range(len(unselect)):
                student_id = unselect.pop()
                distributed = False

                # the iteration will be done iff a student is distributed or failed
                while not distributed:
                    initial = student_id
                    result = initial

                    # iterate through the options this student has selected
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

                    # this student fails to get this course
                    if result == initial:
                        distributed = True

        # store result to self._distribute_result
        for name in self._options.keys():
            self._distribute_result[name] = self._options[name]._selected

        return self._distribute_result


class Student:
    ''' Class that store student's data.

    Attributions:
        _name: (string)
            Student's name.

        _id: (string)
            Student's id.

        _options: (dict)
            key: (string)
                The courses that this student has selected.
            value: (list)
                The options that this student has selected, base on aspiration

        _grade: (int)
            Student's grade.
    '''

    def __init__(self, name, studentID, options, grade):
        ''' Init of this student.

        Args:
            name: (string)
                Student's name.

            studentID: (string)
                Student's id.

            options: (dict)
                key: (string)
                    The courses that this student has selected.
                value: (list)
                    The options that this student has selected, base on aspiration

            grade: (int)
                Student's grade.
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
        ''' Run distribution of all courses

        Args:
            students: (list)
                List of class Student.

            preselect: (list or None)
                List of students who have already got 數電實驗.

        Returns:
            A list of result (below is the result example).
            result = {
                "studentID": "a",
                "courseName": "b",
                "optionName": "c",
            }
        '''

        results = list()

        # iterate through all courses
        for course in courses:

            # deal with Ten-Select-Two
            if course._type == "Ten-Select-Two":
                course.distribute(students, preselect)

            # deal with others
            else:
                course.distribute(students, None)

            # manage data type and store data
            for option in course._distribute_result.keys():
                for student in course._distribute_result[option]:
                    result = {
                        "studentID": student,
                        "courseName": course._name,
                        "optionName": option
                    }
                    results.append(result)

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
