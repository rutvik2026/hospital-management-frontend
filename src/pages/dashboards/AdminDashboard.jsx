import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getDoctors } from "../../services/userService";
import { getDepartments } from "../../services/departmentService";
import { getAllTasks } from "../../services/taskService";

import "./AdminDashboard.css";


/* =========================================================
   ICON COMPONENT
   ========================================================= */

const Icon = ({ name, size = 20, strokeWidth = 1.8 }) => {

    const icons = {

        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        doctor: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" />
                <path d="M18 5v4" />
                <path d="M16 7h4" />
            </>
        ),

        hospital: (
            <>
                <path d="M3 21h18" />
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                <path d="M9 7h6" />
                <path d="M12 4v6" />
                <path d="M9 16h1" />
                <path d="M14 16h1" />
                <path d="M9 20v-3h6v3" />
            </>
        ),

        tasks: (
            <>
                <rect x="5" y="3" width="14" height="18" rx="2" />
                <path d="M9 7h6" />
                <path d="M9 11h6" />
                <path d="M9 15h3" />
                <path d="M15 15h.01" />
            </>
        ),

        check: (
            <>
                <path d="M20 6 9 17l-5-5" />
            </>
        ),

        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),

        plus: (
            <>
                <path d="M12 5v14" />
                <path d="M5 12h14" />
            </>
        ),

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
            </>
        ),

        refresh: (
            <>
                <path d="M20 11a8.1 8.1 0 0 0-15.5-2" />
                <path d="M4 4v5h5" />
                <path d="M4 13a8.1 8.1 0 0 0 15.5 2" />
                <path d="M20 20v-5h-5" />
            </>
        ),

        logout: (
            <>
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 19V5a2 2 0 0 0-2-2h-6" />
            </>
        ),

        menu: (
            <>
                <path d="M4 6h16" />
                <path d="M4 12h16" />
                <path d="M4 18h16" />
            </>
        ),

        close: (
            <>
                <path d="M6 6l12 12" />
                <path d="M18 6 6 18" />
            </>
        ),

        activity: (
            <>
                <path d="M3 12h4l3-8 4 16 3-8h4" />
            </>
        )
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
        >
            {icons[name]}
        </svg>
    );
};


/* =========================================================
   MAIN DASHBOARD
   ========================================================= */

const AdminDashboard = () => {

    const navigate = useNavigate();

    const [doctors, setDoctors] = useState([]);
    const [departments, setDepartments] = useState([]);
    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);


    /* =====================================================
       LOAD DASHBOARD
       ===================================================== */

    useEffect(() => {
        loadDashboard();
    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);
            setError("");

            const [
                doctorsData,
                departmentsData,
                tasksData
            ] = await Promise.all([
                getDoctors(),
                getDepartments(),
                getAllTasks()
            ]);


            setDoctors(
                Array.isArray(doctorsData)
                    ? doctorsData
                    : []
            );


            setDepartments(
                Array.isArray(departmentsData)
                    ? departmentsData
                    : []
            );


            setTasks(
                Array.isArray(tasksData)
                    ? tasksData
                    : []
            );

        } catch (err) {

            console.error(
                "Admin dashboard error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load dashboard data"
            );

        } finally {

            setLoading(false);

        }
    };


    /* =====================================================
       TASK STATUS COUNTS
       ===================================================== */

    const pendingTasks = tasks.filter(
        task =>
            String(task.status).toUpperCase() === "PENDING"
    );


    const inProgressTasks = tasks.filter(
        task =>
            String(task.status).toUpperCase() === "IN_PROGRESS" ||
            String(task.status).toUpperCase() === "IN PROGRESS"
    );


    const completedTasks = tasks.filter(
        task =>
            String(task.status).toUpperCase() === "COMPLETED"
    );


    /* =====================================================
       CLOSE SIDEBAR
       ===================================================== */

    const closeSidebar = () => {
        setSidebarOpen(false);
    };


    /* =====================================================
       LOGOUT
       ===================================================== */

    const handleLogout = () => {

        // Remove authentication information
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        // Clear session storage as well
        sessionStorage.clear();

        // Close sidebar
        setSidebarOpen(false);

        // Go back to login
        navigate("/login", {
            replace: true
        });
    };


    /* =====================================================
       LOADING
       ===================================================== */

    if (loading) {

        return (
            <div className="hms-loading">

                <div className="hms-loader"></div>

                <h5>
                    Loading dashboard
                </h5>

                <p>
                    Please wait while we load hospital data...
                </p>

            </div>
        );
    }


    /* =====================================================
       DASHBOARD
       ===================================================== */

    return (

        <div className="hms-layout">


            {/* =================================================
                MOBILE OVERLAY
               ================================================= */}

            {sidebarOpen && (
                <div
                    className="hms-sidebar-overlay"
                    onClick={closeSidebar}
                ></div>
            )}


            {/* =================================================
                SIDEBAR
               ================================================= */}

            <aside
                className={`hms-sidebar ${sidebarOpen
                        ? "hms-sidebar-open"
                        : ""
                    }`}
            >


                {/* =================================================
                    LOGO
                   ================================================= */}

                <div className="hms-logo-area">

                    <div className="hms-logo-icon">

                        <Icon
                            name="hospital"
                            size={25}
                            strokeWidth={2}
                        />

                    </div>


                    <div className="hms-logo-text">

                        <strong>
                            MediCare
                        </strong>

                        <span>
                            Hospital Portal
                        </span>

                    </div>


                    <button
                        type="button"
                        className="hms-mobile-close"
                        onClick={closeSidebar}
                        aria-label="Close menu"
                    >

                        <Icon
                            name="close"
                            size={21}
                        />

                    </button>

                </div>


                {/* =================================================
                    MAIN MENU

                    Dashboard is intentionally NOT included here
                    because this page itself IS the dashboard.
                   ================================================= */}

                <div className="hms-nav-section">

                    <span className="hms-nav-title">
                        MAIN MENU
                    </span>


                    {/* Departments */}

                    <button
                        type="button"
                        className="hms-nav-item"
                        onClick={() => {

                            navigate(
                                "/admin/departments"
                            );

                            closeSidebar();

                        }}
                    >

                        <Icon
                            name="hospital"
                            size={19}
                        />

                        <span>
                            Departments
                        </span>

                    </button>


                    {/* Add Department */}

                    <button
                        type="button"
                        className="hms-nav-item"
                        onClick={() => {

                            navigate(
                                "/admin/departments/add"
                            );

                            closeSidebar();

                        }}
                    >

                        <Icon
                            name="plus"
                            size={19}
                        />

                        <span>
                            Add Department
                        </span>

                    </button>


                    {/* Manage Tasks */}

                    <button
                        type="button"
                        className="hms-nav-item"
                        onClick={() => {

                            navigate(
                                "/admin/tasks"
                            );

                            closeSidebar();

                        }}
                    >

                        <Icon
                            name="tasks"
                            size={19}
                        />

                        <span>
                            Manage Tasks
                        </span>

                    </button>

                </div>


                {/* =================================================
                    MANAGEMENT
                   ================================================= */}

                <div className="hms-nav-section">

                    <span className="hms-nav-title">
                        MANAGEMENT
                    </span>


                    {/* Doctors - information item */}

                    <div className="hms-nav-item hms-nav-disabled">

                        <Icon
                            name="doctor"
                            size={19}
                        />

                        <span>
                            Doctors
                        </span>

                        <span className="hms-nav-count">
                            {doctors.length}
                        </span>

                    </div>


                    {/* Tasks - information item */}

                    <div className="hms-nav-item hms-nav-disabled">

                        <Icon
                            name="tasks"
                            size={19}
                        />

                        <span>
                            Tasks
                        </span>

                        <span className="hms-nav-count">
                            {tasks.length}
                        </span>

                    </div>

                </div>


                {/* =================================================
                    SIDEBAR BOTTOM
                   ================================================= */}

                <div className="hms-sidebar-bottom">


                    {/* Logout */}

                    <button
                        type="button"
                        className="hms-nav-item hms-logout"
                        onClick={handleLogout}
                    >

                        <Icon
                            name="logout"
                            size={19}
                        />

                        <span>
                            Logout
                        </span>

                    </button>

                </div>

            </aside>


            {/* =================================================
                MAIN CONTENT
               ================================================= */}

            <main className="hms-main">


                {/* =================================================
                    TOPBAR
                   ================================================= */}

                <header className="hms-topbar">


                    <div className="hms-topbar-left">


                        {/* Mobile Menu */}

                        <button
                            type="button"
                            className="hms-mobile-menu"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                            aria-label="Open menu"
                        >

                            <Icon
                                name="menu"
                                size={22}
                            />

                        </button>


                        {/* Breadcrumb */}

                        <div>

                            <div className="hms-breadcrumb">

                                <span>
                                    Admin Portal
                                </span>

                                <span>
                                    /
                                </span>

                                <strong>
                                    Overview
                                </strong>

                            </div>

                        </div>

                    </div>


                    {/* =================================================
                        TOPBAR RIGHT
                       ================================================= */}

                    <div className="hms-topbar-right">


                        {/* Refresh */}

                        <button
                            type="button"
                            className="hms-refresh-button"
                            onClick={loadDashboard}
                            title="Refresh dashboard"
                        >

                            <Icon
                                name="refresh"
                                size={18}
                            />

                            <span>
                                Refresh
                            </span>

                        </button>


                        {/* Administrator Profile */}

                        <div className="hms-admin-profile">

                            <div className="hms-admin-avatar">
                                A
                            </div>

                            <button
                                type="button"
                                className="hms-admin-profile"
                                onClick={() => navigate("/profile")}
                                title="Open profile"
                            >
                                <div className="hms-admin-avatar">
                                    A
                                </div>

                                <div className="hms-admin-info">

                                    <strong>
                                        Administrator
                                    </strong>

                                    <span>
                                        Hospital Administrator
                                    </span>

                                </div>
                            </button>

                        </div>

                    </div>

                </header>


                {/* =================================================
                    PAGE CONTENT
                   ================================================= */}

                <div className="hms-content">


                    {/* =================================================
                        ERROR
                       ================================================= */}

                    {error && (

                        <div className="hms-error">

                            <strong>
                                Something went wrong
                            </strong>

                            <span>
                                {error}
                            </span>

                        </div>

                    )}


                    {/* =================================================
                        WELCOME
                       ================================================= */}

                    <section className="hms-welcome">

                        <div>

                            <span className="hms-welcome-label">
                                Hospital Management
                            </span>

                            <h1>
                                Welcome back, Admin
                            </h1>

                            <p>
                                Here's an overview of your
                                hospital operations and
                                activities.
                            </p>

                        </div>


                        <div className="hms-welcome-icon">

                            <Icon
                                name="activity"
                                size={44}
                                strokeWidth={1.5}
                            />

                        </div>

                    </section>


                    {/* =================================================
                        STATISTICS
                       ================================================= */}

                    <section className="hms-stat-grid">


                        <StatCard
                            title="Total Doctors"
                            value={doctors.length}
                            description="Registered doctors"
                            icon="doctor"
                            type="blue"
                        />


                        <StatCard
                            title="Departments"
                            value={departments.length}
                            description="Active departments"
                            icon="hospital"
                            type="teal"
                        />


                        <StatCard
                            title="Total Tasks"
                            value={tasks.length}
                            description="Hospital tasks"
                            icon="tasks"
                            type="purple"
                        />


                        <StatCard
                            title="Completed Tasks"
                            value={completedTasks.length}
                            description="Successfully completed"
                            icon="check"
                            type="green"
                        />

                    </section>


                    {/* =================================================
                        TASK OVERVIEW
                       ================================================= */}

                    <section className="hms-section">


                        <div className="hms-section-header">

                            <div>

                                <h2>
                                    Task Overview
                                </h2>

                                <p>
                                    Current hospital task status
                                </p>

                            </div>


                            <button
                                type="button"
                                className="hms-link-button"
                                onClick={() =>
                                    navigate(
                                        "/admin/tasks"
                                    )
                                }
                            >

                                View all

                                <Icon
                                    name="arrow"
                                    size={16}
                                />

                            </button>

                        </div>


                        <div className="hms-task-grid">


                            <TaskOverviewCard
                                title="Pending"
                                value={pendingTasks.length}
                                icon="clock"
                                type="red"
                            />


                            <TaskOverviewCard
                                title="In Progress"
                                value={inProgressTasks.length}
                                icon="activity"
                                type="orange"
                            />


                            <TaskOverviewCard
                                title="Completed"
                                value={completedTasks.length}
                                icon="check"
                                type="green"
                            />

                        </div>

                    </section>


                    {/* =================================================
                        QUICK ACTIONS
                       ================================================= */}

                    <section className="hms-section">


                        <div className="hms-section-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Frequently used administration tools
                                </p>

                            </div>

                        </div>


                        <div className="hms-actions-grid">


                            <ActionCard
                                title="Departments"
                                description="View and manage departments"
                                icon="hospital"
                                type="blue"
                                onClick={() =>
                                    navigate(
                                        "/admin/departments"
                                    )
                                }
                            />


                            <ActionCard
                                title="Add Department"
                                description="Create a new department"
                                icon="plus"
                                type="teal"
                                onClick={() =>
                                    navigate(
                                        "/admin/departments/add"
                                    )
                                }
                            />


                            <ActionCard
                                title="Manage Tasks"
                                description="Monitor and manage tasks"
                                icon="tasks"
                                type="purple"
                                onClick={() =>
                                    navigate(
                                        "/admin/tasks"
                                    )
                                }
                            />

                        </div>

                    </section>


                    {/* =================================================
                        DOCTORS + DEPARTMENTS
                       ================================================= */}

                    <div className="hms-two-column">


                        {/* =================================================
                            DOCTORS
                           ================================================= */}

                        <section className="hms-panel">


                            <div className="hms-panel-header">

                                <div>

                                    <h2>
                                        Doctors
                                    </h2>

                                    <span>
                                        {doctors.length} registered
                                    </span>

                                </div>


                                <div className="hms-panel-icon blue">

                                    <Icon
                                        name="doctor"
                                        size={20}
                                    />

                                </div>

                            </div>


                            <div className="hms-list">

                                {doctors.length === 0 ? (

                                    <EmptyState
                                        text="No doctors found."
                                    />

                                ) : (

                                    doctors
                                        .slice(0, 8)
                                        .map(
                                            (
                                                doctor,
                                                index
                                            ) => (

                                                <div
                                                    className="hms-list-item"
                                                    key={
                                                        doctor.id ||
                                                        doctor.userId ||
                                                        index
                                                    }
                                                >

                                                    <div className="hms-person-avatar">

                                                        {(
                                                            doctor.name ||
                                                            doctor.fullName ||
                                                            `D${index + 1}`
                                                        )
                                                            .charAt(0)
                                                            .toUpperCase()}

                                                    </div>


                                                    <div className="hms-person-info">

                                                        <strong>

                                                            {
                                                                doctor.name ||
                                                                doctor.fullName ||
                                                                `Doctor ${index + 1}`
                                                            }

                                                        </strong>

                                                        <span>

                                                            {
                                                                doctor.email ||
                                                                "Medical professional"
                                                            }

                                                        </span>

                                                    </div>


                                                    <span className="hms-role-badge">
                                                        Doctor
                                                    </span>

                                                </div>

                                            )
                                        )

                                )}

                            </div>

                        </section>


                        {/* =================================================
                            DEPARTMENTS
                           ================================================= */}

                        <section className="hms-panel">


                            <div className="hms-panel-header">

                                <div>

                                    <h2>
                                        Departments
                                    </h2>

                                    <span>
                                        {departments.length} active
                                    </span>

                                </div>


                                <div className="hms-panel-icon teal">

                                    <Icon
                                        name="hospital"
                                        size={20}
                                    />

                                </div>

                            </div>


                            <div className="hms-list">

                                {departments.length === 0 ? (

                                    <EmptyState
                                        text="No departments found."
                                    />

                                ) : (

                                    departments
                                        .slice(0, 8)
                                        .map(
                                            (
                                                department,
                                                index
                                            ) => (

                                                <div
                                                    className="hms-list-item"
                                                    key={
                                                        department.id ||
                                                        index
                                                    }
                                                >

                                                    <div className="hms-department-icon">

                                                        <Icon
                                                            name="hospital"
                                                            size={18}
                                                        />

                                                    </div>


                                                    <div className="hms-person-info">

                                                        <strong>

                                                            {
                                                                department.deptName ||
                                                                department.name ||
                                                                `Department ${index + 1}`
                                                            }

                                                        </strong>

                                                        <span>
                                                            Hospital department
                                                        </span>

                                                    </div>


                                                    <button
                                                        type="button"
                                                        className="hms-view-button"
                                                        onClick={() =>
                                                            navigate(
                                                                `/admin/departments/${department.id}`
                                                            )
                                                        }
                                                    >

                                                        View

                                                        <Icon
                                                            name="arrow"
                                                            size={14}
                                                        />

                                                    </button>

                                                </div>

                                            )
                                        )

                                )}

                            </div>

                        </section>

                    </div>


                    {/* =================================================
                        RECENT TASKS
                       ================================================= */}

                    <section className="hms-panel hms-recent-panel">


                        <div className="hms-panel-header">

                            <div>

                                <h2>
                                    Recent Tasks
                                </h2>

                                <span>
                                    Latest hospital activities
                                </span>

                            </div>


                            <button
                                type="button"
                                className="hms-link-button"
                                onClick={() =>
                                    navigate(
                                        "/admin/tasks"
                                    )
                                }
                            >

                                View all

                                <Icon
                                    name="arrow"
                                    size={16}
                                />

                            </button>

                        </div>


                        {tasks.length === 0 ? (

                            <EmptyState
                                text="No tasks found."
                            />

                        ) : (

                            <div className="hms-table-wrapper">

                                <table className="hms-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                TASK
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {tasks
                                            .slice(0, 10)
                                            .map(
                                                (
                                                    task,
                                                    index
                                                ) => (

                                                    <tr
                                                        key={
                                                            task.id ||
                                                            index
                                                        }
                                                    >

                                                        <td>

                                                            <div className="hms-task-name">

                                                                <div className="hms-task-icon">

                                                                    <Icon
                                                                        name="tasks"
                                                                        size={16}
                                                                    />

                                                                </div>

                                                                <span>

                                                                    {
                                                                        task.taskName ||
                                                                        task.name ||
                                                                        "-"
                                                                    }

                                                                </span>

                                                            </div>

                                                        </td>


                                                        <td>

                                                            <StatusBadge
                                                                status={
                                                                    task.status
                                                                }
                                                            />

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        FOOTER
                       ================================================= */}

                    <footer className="hms-footer">

                        <span>
                            © 2026 Hospital Management System
                        </span>

                        <span>
                            Secure Healthcare Administration Portal
                        </span>

                    </footer>

                </div>

            </main>

        </div>
    );
};


/* =========================================================
   STAT CARD
   ========================================================= */

const StatCard = ({
    title,
    value,
    description,
    icon,
    type
}) => {

    return (

        <div className="hms-stat-card">

            <div className="hms-stat-top">

                <div>

                    <span className="hms-stat-title">
                        {title}
                    </span>

                    <h3>
                        {value}
                    </h3>

                </div>


                <div
                    className={`hms-stat-icon ${type}`}
                >

                    <Icon
                        name={icon}
                        size={22}
                    />

                </div>

            </div>


            <div className="hms-stat-description">

                {description}

            </div>

        </div>
    );
};


/* =========================================================
   TASK OVERVIEW CARD
   ========================================================= */

const TaskOverviewCard = ({
    title,
    value,
    icon,
    type
}) => {

    return (

        <div
            className={`hms-task-overview ${type}`}
        >

            <div className="hms-task-overview-icon">

                <Icon
                    name={icon}
                    size={20}
                />

            </div>


            <div>

                <span>
                    {title}
                </span>

                <strong>
                    {value}
                </strong>

            </div>

        </div>
    );
};


/* =========================================================
   ACTION CARD
   ========================================================= */

const ActionCard = ({
    title,
    description,
    icon,
    type,
    onClick
}) => {

    return (

        <button
            type="button"
            className="hms-action-card"
            onClick={onClick}
        >

            <div
                className={`hms-action-icon ${type}`}
            >

                <Icon
                    name={icon}
                    size={23}
                />

            </div>


            <div className="hms-action-content">

                <strong>
                    {title}
                </strong>

                <span>
                    {description}
                </span>

            </div>


            <div className="hms-action-arrow">

                <Icon
                    name="arrow"
                    size={18}
                />

            </div>

        </button>
    );
};


/* =========================================================
   STATUS BADGE
   ========================================================= */

const StatusBadge = ({ status }) => {

    const value =
        String(status || "UNKNOWN")
            .toUpperCase();


    let type = "unknown";

    let label =
        status || "Unknown";


    if (value === "COMPLETED") {

        type = "completed";
        label = "Completed";

    }


    if (
        value === "IN_PROGRESS" ||
        value === "IN PROGRESS"
    ) {

        type = "progress";
        label = "In Progress";

    }


    if (value === "PENDING") {

        type = "pending";
        label = "Pending";

    }


    return (

        <span
            className={`hms-status ${type}`}
        >

            <span className="hms-status-dot"></span>

            {label}

        </span>
    );
};


/* =========================================================
   EMPTY STATE
   ========================================================= */

const EmptyState = ({ text }) => {

    return (

        <div className="hms-empty">

            <div className="hms-empty-icon">

                <Icon
                    name="hospital"
                    size={22}
                />

            </div>

            <span>
                {text}
            </span>

        </div>
    );
};


export default AdminDashboard;