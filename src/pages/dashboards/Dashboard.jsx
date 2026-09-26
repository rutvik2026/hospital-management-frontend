import React from "react";
import { Navigate } from "react-router-dom";

const Dashboard = () => {

    const role = localStorage.getItem("role");

    switch (role) {

        case "ADMIN":
            return <Navigate to="/admin/dashboard" replace />;

        case "DOCTOR":
            return <Navigate to="/doctor/dashboard" replace />;

        case "PATIENT":
            return <Navigate to="/patient/dashboard" replace />;

        case "EMPLOYEE":
            return <Navigate to="/employee/dashboard" replace />;

        default:
            return <Navigate to="/login" replace />;
    }
};

export default Dashboard;