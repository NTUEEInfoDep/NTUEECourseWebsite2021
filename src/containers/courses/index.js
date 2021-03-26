import React, { useState, useEffect } from "react";

// components
import Course from "./course";
import Selection from "./selection";

/**
 * This is Courses Page
 */
export default function Courses() {
  // get courses
  const [courses, setCourses] = useState([]);
  useEffect(() => {
    //   const courseData = axios.get('/api/courses');
    const courseData = fakeCourseData;
    setCourses(courseData);
  }, []);

  // select course
  const [selectedCourse, setSelectedCourse] = useState(null);
  const handleSelectCourse = (selectedID) => {
    // console.log(`handleSelectedCourse, selectedID: ${selectedID}`);
    setSelectedCourse(courses.find(({ id }) => id === selectedID));
  };

  return (
    <div>
      <h1>This is Courses Page</h1>
      {courses.map(({ id, name }) => (
        <Course
          key={id}
          id={id}
          name={name}
          handleSelectCourse={handleSelectCourse}
        />
      ))}
      {selectedCourse && <Selection course={selectedCourse} />}
    </div>
  );
}

const fakeCourseData = [
  {
    id: 0,
    name: "演算法",
    grade: 3,
    options: ["張耀文", "李建模"],
  },
  {
    id: 1,
    name: "電子學",
    grade: 2,
    options: ["鍾霸好棒", "呂帥"],
  },
];
