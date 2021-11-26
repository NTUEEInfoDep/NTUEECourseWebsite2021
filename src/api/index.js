import axios from "axios";
import qs from "qs";

const errorHandling = (error) => {
  if (error.response.status === 403) window.location.reload("/");
};

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
  deleteSession: () => axios.delete(`/api/session`),
};

export const CourseAPI = {
  getCourses: () =>
    axios
      .get(`/api/courses?name&type&description&options`)
      .catch((error) => errorHandling(error)),
  postCourse: (course) =>
    axios.post(`/api/course`, [course]).catch((error) => errorHandling(error)),
  deleteCourse: (id) =>
    axios
      .delete(`/api/course`, { data: [id] })
      .catch((error) => errorHandling(error)),
  putCourse: (course) =>
    axios.put(`/api/course`, [course]).catch((error) => errorHandling(error)),
};

export const StudentDataAPI = {
  getStudentData: () =>
    axios
      .get(`/api/users`, {
        params: {
          name: 1,
          grade: 1,
          authority: 1,
        },
      })
      .catch((error) => errorHandling(error)),
  postStudentData: (users) =>
    axios.post(`/api/users`, users).catch((error) => errorHandling(error)),
  deleteStudentData: (ids) =>
    axios
      .delete(`/api/users`, { data: [...ids] })
      .catch((error) => errorHandling(error)),
  putStudentData: (user) =>
    axios.put(`/api/users`, user).catch((error) => errorHandling(error)),
};

export const PasswordAPI = {
  putPassword: (passwords) =>
    axios
      .put(`/api/password`, passwords)
      .catch((error) => errorHandling(error)),
};

export const SelectAPI = {
  getSelections: (courseID) =>
    axios
      .get(`/api/selections/${courseID}`)
      .catch((error) => errorHandling(error)),
  putSelections: (courseID, data) =>
    axios
      .put(`/api/selections/${courseID}`, [...data])
      .catch((error) => errorHandling(error)), // , [...courseID.data.selected]),
};

export const DistributeAPI = {
  // postDistribute: () => axios.post(`/api/distribute`),
  postDistribute: () => axios.post(`/api/new_distribute`),
  putPreselect: (ids) =>
    axios.put(`/api/preselect`, ids).catch((error) => errorHandling(error)),
  getResult: () => axios.get(`/api/result.csv`),
  getStatistics: () => axios.get(`/api/statistics.csv`),
};

export const OpentimeAPI = {
  getOpentime: () => axios.get(`/api/opentime`),
  putOpentime: (start, end) =>
    axios
      .put(`/api/opentime`, { start, end })
      .catch((error) => errorHandling(error)),
};
