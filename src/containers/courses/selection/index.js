import React from "react";
import PropTypes from "prop-types";

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

Selection.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.number.isRequired,
    name: PropTypes.string.isRequired,
    grade: PropTypes.number.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
