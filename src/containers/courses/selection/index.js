import React from "react";

/**
 * This is Main Page
 */
export default function Selection({ course: { id, name, grade, options } }) {
  return (
    <div>
      <h1>This is Course Selection Popup</h1>
      {id} {name} {grade}
      {options.map((option) => (
        <div key={option}>{option}</div>
      ))}
    </div>
  );
}
