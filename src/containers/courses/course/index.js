import React from "react";

/**
 * This is Course component, for course card display
 */
export default function Course({ id, name, handleSelectCourse }) {
  return (
    <div>
      <h2 onClick={() => handleSelectCourse(id)}>This is Course {name}</h2>
    </div>
  );
}
