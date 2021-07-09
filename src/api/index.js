import axios from "axios";
import qs from "qs";

export const SessionAPI = {
  getSession: () => axios.get(`/api/session`),
  postSession: (userID, password) =>
    axios.post(
      `/api/session`,
      qs.stringify({
        userID,
        password,
      }),
      {
        headers: {
          "Content-Type": "application/x-www-form-urlencoded",
        },
      }
    ),
};

export const CourseAPI = {
  getCourses: () => axios.get(`/api/courses?name&type&description&options`),
  postCourse: (course) => axios.post(`/api/course`, [course]),
  deleteCourse: (id) => axios.delete(`/api/course`, { data: [id] }),
  putCourse: (course) => axios.put(`/api/course`, [course]),
};

export const StudentDataAPI = {
  getStudentData: () =>
    axios.get(`/api/users`, {
      params: {
        name: 1,
        grade: 1,
      },
    }),
};
