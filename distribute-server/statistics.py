import csv, io
import pandas as pd
import numpy as np

class Analysis():
    def __init__(self, courses, students, results):
        self._courses = courses
        self._students = students
        self._results = results
        self._analysis_grade_dict = dict()
        self._analysis_selections_grade_dict = dict()
        self._selctions_df = None
        self._result_df = None
        self._analysis_order_df = None  
        self._analysis_order_option_df = dict()
        self.selections_to_df()
        self.result_to_df()

    # Initilize selecions in to a pandas dataframe
    def selections_to_df(self):
        df_index = [i._id for i in self._students]
        df_columns = list()

        for course in self._courses:
            course_id = course._id
            for option_name in course._options:
                option_full_name = "%s_%s" % (course_id, option_name)
                df_columns.append(option_full_name)
        df_columns = df_columns + ["grade"]
        selections_df = pd.DataFrame(0, index=df_index, columns=df_columns)

        for student in self._students:
            student_id = student._id
            options = student._options
            selections_df["grade"][student_id] = student._grade
            
            for course_id in options:
                course = options[course_id]
                for i, option_name in enumerate(course):
                    option_full_name = "%s_%s" % (course_id, option_name)
                    selections_df[option_full_name][student_id] = i + 1

        self._selections_df = selections_df         
    
    # Initilize results in to a pandas dataframe
    def result_to_df(self):
        df_index = [i._id for i in self._students]
        df_columns = list()
        
        for course in self._courses:
            course_id = course._id
            for option_name in course._options:
                option_full_name = "%s_%s" % (course_id, option_name)
                df_columns.append(option_full_name)
        df_columns = df_columns + ["grade"]
        result_df = pd.DataFrame(0, index=df_index, columns=df_columns)
        
        for student in self._students:
            student_id = student._id
            result_df["grade"][student_id] = student._grade
            
        for pick in self._results:
            student_id = pick["studentID"]
            course_id= pick["courseID"]
            option_name = pick["optionName"]
            option_full_name = "%s_%s" % (course_id, option_name)

            result_df[option_full_name][student_id] = 1
        
        self._result_df = result_df         
    
    # Standard Analysis including 中幾個 & 第幾志願
    def analyze(self):
        df_column = ["中%d個" % i for i in range(3)] + [("第%d志願") % (i+1) for i in range(10)]
        df_index = [course._name for course in self._courses]
        analysis_order_df = pd.DataFrame(0, index=df_index, columns=df_column)

        for course in self._courses:
            course_name = course._name
            course_id = course._id
            analysis_list = [0]*10
            selection_matrix = self._selections_df.filter(like=course_id, axis=1).to_numpy()
            result_matrix = self._result_df.filter(like=course_id, axis=1).to_numpy()
            analysis_matrix = np.multiply(selection_matrix, result_matrix)
            
            for order in range(10):
                analysis_list[order] = int(np.sum(analysis_matrix == order+1))
            
            analysis_pick_list = [0]*3
            analysis_pick_matrix = np.sum(analysis_matrix > 0, axis=1)
            analysis_zero_matrix = np.logical_and((np.sum(selection_matrix > 0, axis=1)>0), (np.sum(analysis_matrix>0, axis=1) == 0))

            analysis_pick_list[0] = int(np.sum(analysis_zero_matrix))
            for i in range(1, 3):
                analysis_pick_list[i] = int(np.sum(analysis_pick_matrix == i))
            
            analysis_order_df.loc[course_name, :] = analysis_pick_list + analysis_list
        
        self._analysis_order_df = analysis_order_df

    # Analysis of grade distribution
    def analyze_grade(self):
        analysis_dict = dict()

        for course in self._courses:
            course_name = course._name
            course_id = course._id
            option_analyze_list = [0]*len(course._options)
            analysis_option_dict = dict()

            df_column = [("大%d") % (i+1) for i in range(4)]
            df_index = [option_name for option_name in course._options]
            analysis_option_df = pd.DataFrame(0, index=df_index, columns=df_column)

            result_matrix = self._result_df.filter(like=course_id, axis=1).to_numpy()
            grade_matrix = np.array([self._result_df["grade"].to_numpy() for i in range(len(course._options))]).T
            
            analysis_matrix = np.multiply(result_matrix, grade_matrix)
            

            for i, option_name in enumerate(course._options):
                option_full_name = "%s_%s" % (course_id, option_name)
                grade_analysis_list = [0]*4
                for grade in range(3):
                    grade_analysis_list[grade] = int(np.sum(analysis_matrix[:,i] == grade + 1))
                grade_analysis_list[3] = int(np.sum(analysis_matrix[:,i] >= 4))
                analysis_option_df.loc[option_name, :] = grade_analysis_list
            analysis_dict[course_name] = analysis_option_df
        
        self._analysis_grade_dict = analysis_dict   

    # Analysis of grade distribution
    def analyze_selection_grade(self):
        analysis_dict = dict()
        for course in self._courses:
            course_id = course._id
            analysis_dict[course_id] = dict()
            for option_name in course._options:
                option_full_name = "%s_%s" % (course_id, option_name)
                df_index = [("大%d") % (i+1) for i in range(4)]
                df_column = [("第%d志願") % (i+1) for i in range(len(course._options))]
                df = pd.DataFrame(0, index=df_index, columns=df_column)
                for student in self._students:
                    student_grade = min(student._grade, 4)
                    student_id = student._id
                    rank = self._selections_df[option_full_name][student_id]
                    if rank:
                        df[df_column[rank-1]][df_index[student_grade-1]] += 1
                analysis_dict[course_id][option_name] = df.copy(deep=True)
        
        self._analysis_selections_grade_dict = analysis_dict

    # Analysis of selection order distribution
    def analyze_selection_result(self):
        analysis_dict = dict()
        for course in self._courses:
            course_id = course._id
            num_options = len(course._options)
            df_column = [("第%d志願") % (i+1) for i in range(num_options)]
            df_index = [option_name for option_name in course._options]
            df = pd.DataFrame(0, index=df_index, columns=df_column)
                
            for i, option_name in enumerate(course._options):
                option_full_name = "%s_%s" % (course_id, option_name)

                selection_matrix = self._selections_df.filter(like=option_full_name, axis=1).to_numpy()
                result_matrix = self._result_df.filter(like=option_full_name, axis=1).to_numpy()

                analysis_matrix = np.multiply(selection_matrix, result_matrix)
                
                for order in range(num_options):
                    df["第%d志願" % (order+1)][i] = int(np.sum(analysis_matrix == order+1))
                    
            analysis_dict[course_id] = df.copy(deep=True)
        
        self._analysis_order_option_dict = analysis_dict

    # export the analysis result into csv string
    def to_csv(self):
        csv_string = ""
        
        if type(self._analysis_order_df) != type(None):
            csv_string += "以下為結果與志願分析\n"
            analysis_string = io.StringIO()
            self._analysis_order_df.to_csv(analysis_string)
            csv_string += analysis_string.getvalue()
        
        if len(self._analysis_order_option_dict) > 0:
            csv_string += "\n以下為結果與選填志願分析\n"
            for course_name in self._analysis_order_option_dict:
                new_string = io.StringIO()
                self._analysis_order_option_dict[course_name].to_csv(new_string)
                csv_string += "%s\n" % course_name
                csv_string += new_string.getvalue()
                csv_string += "\n"
        
        if len(self._analysis_grade_dict) > 0:
            csv_string += "\n以下為結果與年級分析\n"
            for course_name in self._analysis_grade_dict:
                new_string = io.StringIO()
                self._analysis_grade_dict[course_name].to_csv(new_string)
                csv_string += "%s\n" % course_name
                csv_string += new_string.getvalue()
                csv_string += "\n"


        if len(self._analysis_selections_grade_dict) > 0:
            csv_string += "\n以下為選填志願與年級分析\n"
            for course_name in self._analysis_selections_grade_dict:
                analysis_course_dict = self._analysis_selections_grade_dict[course_name]
                csv_string += "%s\n" % course_name
                for option_name in analysis_course_dict:
                    analysis_option_dict = analysis_course_dict[option_name]
                    new_string = io.StringIO()
                    analysis_option_dict.to_csv(new_string)
                    csv_string += "%s\n" % option_name
                    csv_string += new_string.getvalue()
                    csv_string += "\n"

        return csv_string