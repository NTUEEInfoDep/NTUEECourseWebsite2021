import React from "react";
import PropTypes from "prop-types";

/**
 * This is Main Page
 */
export default function Selection({
  course: { id, name, type, description, options },
}) {
  return (
    <div>
      <h1>This is Course Selection Popup</h1>
      {id} {name} {type} {description}
      {options.map((option) => (
        <div key={option}>{option}</div>
      ))}
    </div>
  );
}

Selection.propTypes = {
  course: PropTypes.shape({
    id: PropTypes.string.isRequired,
    name: PropTypes.string.isRequired,
    type: PropTypes.string.isRequired,
    description: PropTypes.string.isRequired,
    options: PropTypes.arrayOf(PropTypes.string).isRequired,
  }).isRequired,
};
