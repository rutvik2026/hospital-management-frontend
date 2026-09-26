import React from "react";

const AdminDashboard = () => {

    const user = JSON.parse(localStorage.getItem("user"));

    return (
        <div className="container-fluid bg-light min-vh-100 p-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">
                <div>
                    <h2 className="fw-bold">Admin Dashboard</h2>
                    <p className="text-muted mb-0">
                        Hospital Management System
                    </p>
                </div>

                <div className="text-end">
                    <strong>{user?.name || "Admin"}</strong>
                    <br />
                    <small className="text-muted">Administrator</small>
                </div>
            </div>

            {/* Statistics */}
            <div className="row g-4 mb-4">

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Doctors</h6>
                            <h2 className="fw-bold">24</h2>
                            <span className="text-success">
                                Active doctors
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Patients</h6>
                            <h2 className="fw-bold">1,248</h2>
                            <span className="text-success">
                                Registered patients
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Employees</h6>
                            <h2 className="fw-bold">86</h2>
                            <span className="text-primary">
                                Hospital staff
                            </span>
                        </div>
                    </div>
                </div>

                <div className="col-md-3">
                    <div className="card shadow-sm border-0">
                        <div className="card-body">
                            <h6 className="text-muted">Appointments</h6>
                            <h2 className="fw-bold">156</h2>
                            <span className="text-warning">
                                Today
                            </span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Main Content */}
            <div className="row g-4">

                {/* Quick Actions */}
                <div className="col-lg-6">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-white">
                            <h5 className="mb-0 fw-bold">
                                Quick Actions
                            </h5>
                        </div>

                        <div className="card-body">

                            <div className="row g-3">

                                <div className="col-md-6">
                                    <button className="btn btn-primary w-100 py-3">
                                        Manage Doctors
                                    </button>
                                </div>

                                <div className="col-md-6">
                                    <button className="btn btn-success w-100 py-3">
                                        Manage Patients
                                    </button>
                                </div>

                                <div className="col-md-6">
                                    <button className="btn btn-warning w-100 py-3">
                                        Manage Employees
                                    </button>
                                </div>

                                <div className="col-md-6">
                                    <button className="btn btn-info w-100 py-3">
                                        Departments
                                    </button>
                                </div>

                            </div>

                        </div>
                    </div>

                </div>

                {/* Recent Activities */}
                <div className="col-lg-6">

                    <div className="card shadow-sm border-0 h-100">

                        <div className="card-header bg-white">
                            <h5 className="mb-0 fw-bold">
                                Recent Activities
                            </h5>
                        </div>

                        <div className="card-body">

                            <div className="border-bottom pb-3 mb-3">
                                <strong>New doctor registered</strong>
                                <br />
                                <small className="text-muted">
                                    Dr. Amit Patil
                                </small>
                            </div>

                            <div className="border-bottom pb-3 mb-3">
                                <strong>New patient registered</strong>
                                <br />
                                <small className="text-muted">
                                    Patient #10245
                                </small>
                            </div>

                            <div>
                                <strong>Department updated</strong>
                                <br />
                                <small className="text-muted">
                                    Cardiology department
                                </small>
                            </div>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AdminDashboard;