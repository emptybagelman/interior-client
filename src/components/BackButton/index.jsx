import React from "react";
import { Link } from "react-router-dom";

function BackButton({ backTo, label,styling={} }) {
  return (
    <Link to={backTo} className="back-to-button" style={styling}>
      {label}
    </Link>
  );
}

export default BackButton
