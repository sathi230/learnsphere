import React from "react";
import { Navigate } from "react-router-dom";

function ProtectedRoute({ children, allowedRole }) {

  const userRole = localStorage.getItem("userRole");

  console.log("Stored Role:", userRole);
  console.log("Allowed Role:", allowedRole);

  if (!userRole) {
    return <Navigate to="/login" replace />;
  }

  if (userRole !== allowedRole) {
    return <Navigate to="/login" replace />;
  }

  return children;
}

export default ProtectedRoute;
