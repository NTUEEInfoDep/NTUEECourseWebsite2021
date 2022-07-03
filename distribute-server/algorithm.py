import heapq
import random

# random.seed(0)


class Option:
    ''' Option with the functions supporting course distribution.

    Attributions:
        _name: (string)
            The name of this option, which could be the teacher's name or options in Ten-Select-Two

        _limit: (int)
            The maximun number of the students that this options can have.

        _priority_type: (string)
            The type of this priority.
                "higher-grade-first":       The higher grade students will have higher priority.
                "grades":                   Students in specific grades will have higher priority.
                "guarantee-third-grade":    Guarantee grade 3rd students to some degree
                "guarantee-fourth-grade":   Guarantee grade 4th students to some degree
                "none", "":                 Priority is not associate with the grade.
                "preselect":                The result is preselected

        _priority_value: (int, list(int), list(string), none)
            The value based on _priority_type
                int:            guarantee number of "guarantee-third-grade", "guarantee-fourth-grade"
                list(int):      the grade(s) of "grades"
                list(string):   the selected studentID of "preselect"
                none:           others

        _selected: (list)
            Store the students who have been selected by this option.

        _students: (dict)
            Store data of the students who has select this option.

        _grade: (dict)
            Store grade of the students

        _priority_list: (list)
            All students arrange according to the preference of this option, which was based on priority and random.

        _fix: (int)
            The student in _selected whose index is smaller than this integer is immutable.
    
        guarantee_num: (int)
            the number of students of guarantee grade being selected in this option.

        guarantee_grade: (int)
            the grade that being guaranteed

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

                    "priority_type": (string)
                        The type of this priority.
                            "higher-grade-first":       The higher grade students will have higher priority.
                            "grades":                   Students in specific grades will have higher priority.
                            "guarantee-third-grade":    Guarantee grade 3rd students to some degree
                            "guarantee-fourth-grade":   Guarantee grade 4th students to some degree
                            "none", "":                 Priority is not associate with the grade.
                            "preselect":                The result is preselected

                    "priority_value": (int, list(int), list(string), none)
                        The value based on _priority_type
                            int:            guarantee number of "guarantee-third-grade", "guarantee-fourth-grade"
                            list(int):      the grade(s) of "grades"
                            list(string):   the selected studentID of "preselect"
                            none:           others
                }
        '''

        self._name = name
        self._priority_type = data["priority_type"]
        self._priority_value = data["priority_value"]
        self._limit = data["limit"]
        self._selected = list()
        self._students = dict()
        self._grade = dict()
        self._priority_list = list()
        self._fix = 0
        self.guarantee_num = 0
        self.guarantee_grade = None
        if self._priority_type == "guarantee-third-grade":
            self.guarantee_grade = 3
        elif self._priority_type == "guarantee-fourth-grade":
            self.guarantee_grade = 4

        # adding the students of preselect into already select
        if self._priority_type == "preselect":
            self._selected = self._priority_value 

    def add_student(self, student_id, student_grade, ranking):
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
        priority = ranking
        if self._priority_type == "higher-grade-first":
            priority -= grade*20
        elif self._priority_type == "grades":
            if (str(grade) in self._priority_value) or (grade in self._priority_value):
                priority -= 1*20

        # store information
        self._students[student_id] = priority
        self._grade[student_id] = grade

    def make_priority_list(self):
        ''' Make priority list.

        Sort students with different priority and put these data in priority_group.
        Use heapq to deal with students starting from low priority to high priority.
        (Remember that low priority will have high possibility to be selected)
        Random the students with same priority and append to self._priority_list.

        Args:
            None
        '''
        
        # pass preselect
        if self._priority_type == "preselect":
            return

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

        # pass preselect
        if self._priority_type == "preselect":
            return student_id

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

            # add guarantee number
            if self.guarantee_grade is not None:
                if self._grade[student_id] == self.guarantee_grade:
                    self.guarantee_num += 1

            return True

        # self._selected is full and partial mutable
        elif(self._fix < len(self._selected)):

            # deal with guarantee
            if self.guarantee_grade is not None:
                if self._grade[student_id] == self.guarantee_grade:
                    if self.guarantee_num < self._priority_value:

                        # determine the rank of this student's priority
                        index = self._priority_list.index(student_id)

                        # kick out the last one whose grade is not guaranteed in _selected
                        find_kick = False
                        kick_index = -1
                        while not find_kick:
                            about_to_kick = self._selected[kick_index]
                            if self._grade[about_to_kick] != self.guarantee_grade:
                                find_kick = True
                                del self._selected[kick_index]
                            else:
                                kick_index -= 1


                        idx = self._fix + index

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

                        # modify guarantee number
                        self.guarantee_num += 1
                        return about_to_kick

                    else:

                        # determine the rank of this student's priority
                        index = self._priority_list.index(student_id)

                        # pop out the last one in self._selected
                        about_to_kick = self._selected.pop()

                        # compare the priority to determine who can stay
                        if index > self._priority_list.index(about_to_kick):
                            self._selected.append(about_to_kick)
                            return student_id
                        else:
                            idx = self._fix + index

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

                            # modify guarantee number
                            if self._grade[about_to_kick] != self.guarantee_grade:
                                self.guarantee_num += 1
                            return about_to_kick

                else:

                    if self.guarantee_num > self._priority_value:

                        # determine the rank of this student's priority
                        index = self._priority_list.index(student_id)

                        # pop out the last one in self._selected
                        about_to_kick = self._selected.pop()

                        # compare the priority to determine who can stay
                        if index > self._priority_list.index(about_to_kick):
                            self._selected.append(about_to_kick)
                            return student_id
                        else:
                            idx = self._fix + index

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

                            # modify guarantee number
                            if self._grade[about_to_kick] == self.guarantee_grade:
                                self.guarantee_num -= 1
                            return about_to_kick
                    else:

                        # determine the rank of this student's priority
                        index = self._priority_list.index(student_id)

                        # kick out the last one whose grade is not guaranteed in _selected
                        find_kick = False
                        kick_index = -1
                        while not find_kick:
                            about_to_kick = self._selected[kick_index]
                            if self._grade[about_to_kick] != self.guarantee_grade:
                                find_kick = True
                                del self._selected[kick_index]
                            else:
                                kick_index -= 1

                        # compare the priority to determine who can stay
                        if index > self._priority_list.index(about_to_kick):
                            self._selected.append(about_to_kick)
                            return student_id
                        else:
                            idx = self._fix + index

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
                            return about_to_kick

            else:

                # determine the rank of this student's priority
                index = self._priority_list.index(student_id)

                # pop out the last one in self._selected
                about_to_kick = self._selected.pop()

                # compare the priority to determine who can stay
                if index > self._priority_list.index(about_to_kick):
                    self._selected.append(about_to_kick)
                    return student_id
                else:
                    idx = self._fix + index

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


class Course:
    ''' Class that stores data of a course and distribute function.

    Attributions:
        _name: (string)
            Course's name.

        _id: (string)
            Course's id.

        _type: (string)
            Course's type.(Required, EE-Lab, Ten-Select-Two)

        limit_student: (list)
            item: (string)
                the student who can be distributed in this course.

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

        _preselect_list: (list)
            item: (string)
                the option that is preselected.

        _distribute_result: (dict)
            key: (string)
                Options' name.
            value: (list)
                Id of students who has successfully selected this option

        _has_selected_num_list: (dict):
            key: (string)
                Student's id
            value: (int)
                Number of student's preselect course
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
                    "number": (int)
                    "students": list(string)
                    "options": (dict)
                        key: (string)
                            options' name
                        value: (dict)
                            {
                                "limit": (int)
                                "priority_type": (string)
                                "priority_value": (int, list(int), list(string), none)
                            }
                    }
            }
        '''
        self._name = course["name"]
        self._id = course["id"]
        self._type = course["type"]
        self.limit_students = course["students"]
        self._options = dict()
        self._students = dict()     # candidate list
        self._has_selected_num_list = dict()
        self.max_select = course["number"]
        self._distribute_result = dict()
        self._preselect_list = list()

        for name, data in course["options"].items():
            if self._type in "1234":
                data["priority_type"] = "higher-grade-first"
            if self._type == "EE-Lab":
                data["priority_type"] = "none"
            option = Option(name, data)
            self._options[name] = option
            if data["priority_type"] == "preselect":
                self._preselect_list.append(name)

    def __str__(self):
        return f"Course(id={self._id}, name={self._name})"

    def __repr__(self):
        return self.__str__()

    def distribute(self, students):
        ''' Distribute this course and store result in self._distribute_result.

        Args:
            students: (list)
                List of class Student

        Returns:
            A dictionary contains the result of distribution.
        '''

        # generate students list who are going to be distributed in this course
        for student in students:
            
            # exclude student who shouldn't select this course
            if len(self.limit_students) > 0 and student._id not in self.limit_students:
                continue

            # initial select_num
            self._has_selected_num_list[student._id] = 0

            # check if this student has select any option of this course
            if self._id in student._options:
                self._students[student._id] = student._options[self._id]

                for i, option in enumerate(student._options[self._id]):
                    if option in self._options:
                        self._options[option].add_student(student._id,
                                                          student._grade,
                                                          i + 1)

        # deal with preselect
        for name, option in self._options.items():
            if option._priority_type == "preselect":
                check = []
                for student in option._priority_value:
                    if student in check:
                        continue
                    check.append(student)
                    if student in self._has_selected_num_list:
                        self._has_selected_num_list[student] += 1
                    else:
                        self._has_selected_num_list[student] = 1

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

            # the students who have already on some option will be excluded.
            for student in students:
                # exclude student who shouldn't select this course
                if len(self.limit_students) > 0 and student._id not in self.limit_students:
                    continue

                has_select = self._has_selected_num_list[student._id]
                if self._id in student._options and has_select <= time:
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
    def distribute(courses, students):
        ''' Run distribution of all courses

        Args:
            students: (list)
                List of class Student.

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

            # distribute
            course.distribute(students)

            # manage data type and store data
            for option in course._distribute_result.keys():
                for student in course._distribute_result[option]:
                    result = {
                        "studentID": student,
                        "courseName": course._name,
                        "courseID": course._id,
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

    course1 = Course({"id": "course1", "name": "course1", "type": "Ten-Select-Two", "number": 2, "students": ["B22222224"],
                      "options": {"數電實驗": {"limit": 5, "priority_type": "guarantee-third-grade", "priority_value": 2}, "teacher1b":
                                  {"limit": 2, "priority_type": "none", "priority_value": 0}, "teacher1a": {"limit": 2,
                                                                             "priority_type": "grades", "priority_value": [3]}}})
    courses = [course1]

    preselect = ["B22222225", "B22222224", "B22222223"]

    results = Algorithm.distribute(courses, students)
    print(results)
