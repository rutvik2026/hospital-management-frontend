import {
    BrowserRouter,
    Routes,
    Route,
    Navigate,
} from "react-router-dom";

import Login from "../pages/auth/Login";
import Signup from "../pages/auth/SignUp";


import ProtectedRoute
    from "../components/ProtectedRoute";
import Profile from "../pages/Profile/Profile";
import Departments from "../pages/departments/Departments";
import DepartmentDetails from "../pages/departments/DepartmentDetails";
import AddDepartment from "../pages/departments/AddDepartment";
import EditDepartment from "../pages/departments/EditDepartment";
import AddService from "../pages/departments/AddService";
import UpdateService from "../pages/departments/UpdateService";
import ServiceDetails from "../pages/services/ServiceDetails";
import DoctorAppointmentDetails from "../pages/doctor/DoctorAppointmentDetails";
import DoctorAppointments from "../pages/doctor/DoctorAppointments";
import MyAppointments from "../pages/patient/MyAppointments";
import BookAppointment from "../pages/patient/BookAppointment";
import UpdateAppointment from "../pages/patient/UpdateAppointment";
import ViewAppointment from "../pages/patient/ViewAppointment";
import AddTask from "../pages/tasks/AddTask";
import EmployeeTasks from "../pages/tasks/EmployeeTasks";
import AdminTasks from "../pages/admin/AdminTasks";

import AdminDashboard from "../pages/dashboards/AdminDashboard";
import DoctorDashboard from "../pages/dashboards/DoctorDashboard";
import PatientDashboard from "../pages/dashboards/PatientDashboard";
import EmployeeDashboard from "../pages/dashboards/EmployeeDashboard";
import Dashboard from "../pages/dashboards/Dashboard";


const AppRoutes = () => {

    return (
        <BrowserRouter>

            <Routes>

                {/* Public Routes */}

                <Route
                    path="/login"
                    element={<Login />}
                />

                <Route
                    path="/signup"
                    element={<Signup />}
                />


                <Route
                    path="/admin/departments"
                    element={<Departments />}
                />

                <Route
                    path="/admin/departments/:departmentId"
                    element={<DepartmentDetails />}
                />

                <Route
                    path="/admin/departments/add"
                    element={<AddDepartment />}
                />

                <Route
                    path="/admin/departments/edit/:departmentId"
                    element={<EditDepartment />}
                />
                <Route
                    path="/admin/departments/:departmentId/services/add"
                    element={<AddService />}
                />

                <Route
                    path="/admin/departments/:departmentId/services/edit/:serviceId"
                    element={<UpdateService />}
                />

                <Route
                    path="/admin/departments/:departmentId/services/:serviceId"
                    element={<ServiceDetails />}
                />


                <Route
                    path="/patient/book-appointment"
                    element={<BookAppointment />}
                />

                <Route
                    path="/patient/appointments"
                    element={<MyAppointments />}
                />

                <Route
                    path="/doctor/appointments"
                    element={<DoctorAppointments />}
                />

                <Route
                    path="/doctor/appointments/:appointmentId"
                    element={<DoctorAppointmentDetails />}
                />

                <Route
                    path="/patient/appointments/:id"
                    element={<ViewAppointment />}
                />

                <Route
                    path="/patient/appointments/:id/update"
                    element={<UpdateAppointment />}
                />

                <Route
                    path="/doctor/appointments/:appointmentId/add-task"
                    element={<AddTask />}
                />

                <Route
                    path="/doctor/appointments/:appointmentId/edit-task/:taskId"
                    element={<AddTask />}
                />


                <Route
                    path="/employee/tasks"
                    element={<EmployeeTasks />}
                />

                <Route
                    path="/admin/tasks"
                    element={<AdminTasks />}
                />

                <Route
                    path="/admin/add-task"
                    element={<AddTask />}
                />

                 <Route
                    path="/dashboard"
                    element={<Dashboard />}
                />

                {/* Role-specific dashboard routes */}
                <Route
                    path="/admin"
                    element={<AdminDashboard />}
                />

                <Route
                    path="/doctor"
                    element={<DoctorDashboard />}
                />

                <Route
                    path="/patient"
                    element={<PatientDashboard />}
                />

                <Route
                    path="/employee"
                    element={<EmployeeDashboard />}
                />

                <Route
                    path="/profile"
                    element={
                        <ProtectedRoute
                            allowedRoles={[
                                "ADMIN",
                                "DOCTOR",
                                "PATIENT",
                                "EMPLOYEE",
                            ]}
                        >
                            <Profile />
                        </ProtectedRoute>
                    }
                />







                {/* Unauthorized */}

                <Route
                    path="/unauthorized"
                    element={
                        <h1>
                            Unauthorized Access
                        </h1>
                    }
                />


                {/* Default */}

                <Route
                    path="/"
                    element={
                        <Navigate
                            to="/login"
                            replace
                        />
                    }
                />

            </Routes>

        </BrowserRouter>
    );
};

export default AppRoutes;
