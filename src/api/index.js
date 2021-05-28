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
  getCourses: () => {},
};
