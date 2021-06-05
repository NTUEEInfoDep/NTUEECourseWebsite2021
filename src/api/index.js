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
  getCourses: () => axios.get(`/api/courses`),
  postCourse: (course) =>
    axios.post(`/api/course`, qs.stringify(course), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
  deleteCourse: (id) =>
    axios.delete(`/api/course`, {
      data: qs.stringify({ id }),
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
  putCourse: (course) =>
    axios.put(`/api/course`, qs.stringify(course), {
      headers: {
        "Content-Type": "application/x-www-form-urlencoded",
      },
    }),
};
