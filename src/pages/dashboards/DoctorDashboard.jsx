import React, {
    useEffect,
    useRef,
    useState,
} from "react";

import { useNavigate } from "react-router-dom";

import {
    getAppointments,
} from "../../services/appointmentService";

import {
    getDiagnosis,
    getMedicines,
} from "../../services/diagnosisService";

import "./DoctorDashboard.css";


/* =========================================================
   ICON
   ========================================================= */

const Icon = ({
    name,
    size = 20,
    strokeWidth = 1.8,
}) => {

    const icons = {

        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
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
            </>
        ),

        appointment: (
            <>
                <rect x="3" y="4" width="18" height="17" rx="2" />
                <path d="M16 2v4" />
                <path d="M8 2v4" />
                <path d="M3 10h18" />
                <path d="M8 14h.01" />
                <path d="M12 14h.01" />
                <path d="M16 14h.01" />
                <path d="M8 18h.01" />
                <path d="M12 18h.01" />
            </>
        ),

        patient: (
            <>
                <circle cx="12" cy="8" r="3.5" />
                <path d="M5 21c.7-4 3-6 7-6s6.3 2 7 6" />
                <path d="M19 7v4" />
                <path d="M17 9h4" />
            </>
        ),

        treatment: (
            <>
                <path d="M5 21V5a2 2 0 0 1 2-2h10a2 2 0 0 1 2 2v16" />
                <path d="M9 8h6" />
                <path d="M9 12h6" />
                <path d="M9 16h3" />
                <path d="M12 4v4" />
            </>
        ),

        medicine: (
            <>
                <rect
                    x="5"
                    y="3"
                    width="14"
                    height="18"
                    rx="2"
                />
                <path d="M8 7h8" />
                <path d="M8 11h8" />
                <path d="M8 15h5" />
            </>
        ),

        profile: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c.8-4.2 3.4-6 8-6s7.2 1.8 8 6" />
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

        arrow: (
            <>
                <path d="M5 12h14" />
                <path d="m13 6 6 6-6 6" />
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

        closeCircle: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="m9 9 6 6" />
                <path d="m15 9-6 6" />
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
        >
            {icons[name]}
        </svg>
    );
};


/* =========================================================
   DOCTOR DASHBOARD
   ========================================================= */

const DoctorDashboard = () => {

    const navigate = useNavigate();

    const [appointments, setAppointments] =
        useState([]);

    const [selectedAppointment, setSelectedAppointment] =
        useState(null);

    const [diagnosis, setDiagnosis] =
        useState(null);

    const [medicines, setMedicines] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [diagnosisLoading, setDiagnosisLoading] =
        useState(false);

    const [diagnosisAppointmentId, setDiagnosisAppointmentId] =
        useState(null);

    const [error, setError] =
        useState("");

    const [sidebarOpen, setSidebarOpen] =
        useState(false);

    const diagnosisSectionRef =
        useRef(null);


    /* =========================================================
       USER ID
       ========================================================= */

    const getUserId = () => {

        try {

            const user =
                JSON.parse(
                    localStorage.getItem("user")
                );

            if (!user) {
                return null;
            }

            const id =
                user.userId ??
                user.id ??
                user.userID;

            return id
                ? Number(id)
                : null;

        } catch (err) {

            console.error(
                "Unable to read logged-in user:",
                err
            );

            return null;
        }
    };


    /* =========================================================
       APPOINTMENT ID
       ========================================================= */

    const getAppointmentId = (
        appointment
    ) => {

        if (!appointment) {
            return null;
        }

        return (
            appointment.id ??
            appointment.appointmentId ??
            appointment.appointId ??
            appointment.appointmentID
        );
    };


    /* =========================================================
       DIAGNOSIS ID
       ========================================================= */

    const getDiagnosisId = (
        dia
    ) => {

        if (!dia) {
            return null;
        }

        return (
            dia.id ??
            dia.diagnosisId ??
            dia.diaId
        );
    };


    /* =========================================================
       LOAD APPOINTMENTS
       ========================================================= */

    useEffect(() => {

        loadDashboard();

    }, []);


    const loadDashboard = async () => {

        try {

            setLoading(true);

            setError("");

            const userId =
                getUserId();

            if (!userId) {

                throw new Error(
                    "Doctor user ID not found. Please login again."
                );
            }


            const response =
                await getAppointments(
                    userId,
                    "DOCTOR"
                );


            let appointmentData = [];


            if (
                Array.isArray(response)
            ) {

                appointmentData =
                    response;

            } else if (
                Array.isArray(
                    response?.appointments
                )
            ) {

                appointmentData =
                    response.appointments;

            } else if (
                Array.isArray(
                    response?.data
                )
            ) {

                appointmentData =
                    response.data;
            }


            setAppointments(
                appointmentData
            );

        } catch (err) {

            console.error(
                "Appointment loading error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Unable to load appointments"
            );

        } finally {

            setLoading(false);
        }
    };


    /* =========================================================
       VIEW APPOINTMENT
       ========================================================= */

    const handleViewAppointment = (
        appointment
    ) => {

        const appointmentId =
            getAppointmentId(
                appointment
            );

        if (!appointmentId) {

            setError(
                "Appointment ID not found."
            );

            return;
        }


        navigate(
            `/doctor/appointments/${appointmentId}`,
            {
                state: {
                    appointment
                }
            }
        );
    };


    /* =========================================================
       LOAD DIAGNOSIS
       ========================================================= */

    const handleDiagnosis = async (
        appointment
    ) => {

        try {

            setDiagnosisLoading(true);

            setError("");

            setDiagnosis(null);

            setMedicines([]);


            const appointmentId =
                getAppointmentId(
                    appointment
                );


            if (!appointmentId) {

                setError(
                    "Appointment ID not found."
                );

                return;
            }


            setDiagnosisAppointmentId(
                appointmentId
            );

            setSelectedAppointment(
                appointment
            );


            /* =================================================
               DIAGNOSIS
               ================================================= */

            const diagnosisResponse =
                await getDiagnosis(
                    appointmentId
                );


            let diagnosisData =
                null;


            if (
                Array.isArray(
                    diagnosisResponse
                )
            ) {

                diagnosisData =
                    diagnosisResponse.length
                        ? diagnosisResponse[0]
                        : null;

            } else if (
                diagnosisResponse?.data
            ) {

                diagnosisData =
                    diagnosisResponse.data;

            } else {

                diagnosisData =
                    diagnosisResponse;
            }


            setDiagnosis(
                diagnosisData
            );


            if (!diagnosisData) {

                setMedicines([]);

                setTimeout(() => {

                    diagnosisSectionRef
                        .current
                        ?.scrollIntoView({
                            behavior: "smooth",
                            block: "start"
                        });

                }, 100);

                return;
            }


            /* =================================================
               MEDICINES
               ================================================= */

            const diagnosisId =
                getDiagnosisId(
                    diagnosisData
                );


            if (!diagnosisId) {

                setMedicines([]);

                return;
            }


            const medicineResponse =
                await getMedicines(
                    diagnosisId
                );


            let medicineData =
                [];


            if (
                Array.isArray(
                    medicineResponse
                )
            ) {

                medicineData =
                    medicineResponse;

            } else if (
                Array.isArray(
                    medicineResponse?.medicines
                )
            ) {

                medicineData =
                    medicineResponse.medicines;

            } else if (
                Array.isArray(
                    medicineResponse?.data
                )
            ) {

                medicineData =
                    medicineResponse.data;

            } else if (
                medicineResponse
            ) {

                medicineData =
                    [medicineResponse];
            }


            setMedicines(
                medicineData
            );


            setTimeout(() => {

                diagnosisSectionRef
                    .current
                    ?.scrollIntoView({
                        behavior: "smooth",
                        block: "start"
                    });

            }, 100);


        } catch (err) {

            console.error(
                "Diagnosis loading error:",
                err
            );

            setDiagnosis(null);

            setMedicines([]);

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                err?.message ||
                "Unable to load diagnosis"
            );

        } finally {

            setDiagnosisLoading(false);

            setDiagnosisAppointmentId(
                null
            );
        }
    };


    /* =========================================================
       LOGOUT
       ========================================================= */

    const handleLogout = () => {

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        sessionStorage.clear();

        navigate(
            "/login",
            {
                replace: true
            }
        );
    };


    /* =========================================================
       CLOSE SIDEBAR
       ========================================================= */

    const closeSidebar = () => {
        setSidebarOpen(false);
    };


    /* =========================================================
       TODAY
       ========================================================= */

    const today =
        new Date()
            .toISOString()
            .split("T")[0];


    const todayAppointments =
        appointments.filter(
            appointment =>
                appointment?.date === today
        );


    const completedAppointments =
        appointments.filter(
            appointment =>
                String(
                    appointment?.status
                ).toUpperCase() ===
                "COMPLETED"
        );


    const pendingAppointments =
        appointments.filter(
            appointment =>
                String(
                    appointment?.status
                ).toUpperCase() ===
                "PENDING"
        );


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="doctor-loading">

                <div className="doctor-loader"></div>

                <h5>
                    Loading doctor dashboard
                </h5>

                <p>
                    Please wait while we load your appointments...
                </p>

            </div>
        );
    }


    /* =========================================================
       MAIN UI
       ========================================================= */

    return (

        <div className="doctor-layout">


            {/* =================================================
                MOBILE OVERLAY
               ================================================= */}

            {sidebarOpen && (

                <div
                    className="doctor-sidebar-overlay"
                    onClick={closeSidebar}
                ></div>

            )}


            {/* =================================================
                SIDEBAR
               ================================================= */}

            <aside
                className={`doctor-sidebar ${
                    sidebarOpen
                        ? "doctor-sidebar-open"
                        : ""
                }`}
            >


                {/* LOGO */}

                <div className="doctor-logo-area">

                    <div className="doctor-logo-icon">

                        <Icon
                            name="hospital"
                            size={25}
                            strokeWidth={2}
                        />

                    </div>


                    <div className="doctor-logo-text">

                        <strong>
                            MediCare
                        </strong>

                        <span>
                            Hospital Portal
                        </span>

                    </div>


                    <button
                        type="button"
                        className="doctor-mobile-close"
                        onClick={closeSidebar}
                    >

                        <Icon
                            name="close"
                            size={21}
                        />

                    </button>

                </div>


                {/* MAIN MENU */}

                <div className="doctor-nav-section">

                    <span className="doctor-nav-title">
                        MAIN MENU
                    </span>


                    <button
                        type="button"
                        className="doctor-nav-item doctor-nav-active"
                        onClick={closeSidebar}
                    >

                        <Icon
                            name="dashboard"
                            size={19}
                        />

                        <span>
                            Dashboard
                        </span>

                    </button>


                    <button
                        type="button"
                        className="doctor-nav-item"
                        onClick={() => {

                            navigate(
                                "/doctor/appointments"
                            );

                            closeSidebar();

                        }}
                    >

                        <Icon
                            name="appointment"
                            size={19}
                        />

                        <span>
                            My Appointments
                        </span>

                        <span className="doctor-nav-count">
                            {appointments.length}
                        </span>

                    </button>


                    <button
                        type="button"
                        className="doctor-nav-item"
                        onClick={() => {

                            navigate(
                                "/doctor/appointments"
                            );

                            closeSidebar();

                        }}
                    >

                        <Icon
                            name="patient"
                            size={19}
                        />

                        <span>
                            Patients
                        </span>

                    </button>


                    <button
                        type="button"
                        className="doctor-nav-item"
                        onClick={() => {

                            navigate(
                                "/doctor/appointments"
                            );

                            closeSidebar();

                        }}
                    >

                        <Icon
                            name="treatment"
                            size={19}
                        />

                        <span>
                            Treatment
                        </span>

                    </button>

                </div>


                {/* ACCOUNT */}

               


                {/* LOGOUT */}

                <div className="doctor-sidebar-bottom">

                    <button
                        type="button"
                        className="doctor-nav-item doctor-logout"
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
                MAIN
               ================================================= */}

            <main className="doctor-main">


                {/* TOPBAR */}

                <header className="doctor-topbar">

                    <div className="doctor-topbar-left">

                        <button
                            type="button"
                            className="doctor-mobile-menu"
                            onClick={() =>
                                setSidebarOpen(true)
                            }
                        >

                            <Icon
                                name="menu"
                                size={22}
                            />

                        </button>


                        <div>

                            <div className="doctor-breadcrumb">

                                <span>
                                    Doctor Portal
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


                    {/* PROFILE */}

                    <button
                        type="button"
                        className="doctor-top-profile"
                        onClick={() =>
                            navigate("/profile")
                        }
                    >

                        <div className="doctor-top-avatar">
                            D
                        </div>

                        <div className="doctor-top-info">

                            <strong>
                                Doctor
                            </strong>

                            <span>
                                Medical Professional
                            </span>

                        </div>

                    </button>

                </header>


                {/* =================================================
                    CONTENT
                   ================================================= */}

                <div className="doctor-content">


                    {/* ERROR */}

                    {error && (

                        <div className="doctor-error">

                            <strong>
                                Something went wrong
                            </strong>

                            <span>
                                {typeof error === "string"
                                    ? error
                                    : "Unable to process request."}
                            </span>

                            <button
                                type="button"
                                onClick={() =>
                                    setError("")
                                }
                            >
                                ×
                            </button>

                        </div>

                    )}


                    {/* WELCOME */}

                    <section className="doctor-welcome">

                        <div>

                            <span className="doctor-welcome-label">
                                Medical Dashboard
                            </span>

                            <h1>
                                Welcome back, Doctor
                            </h1>

                            <p>
                                Manage your appointments,
                                patients and treatment records.
                            </p>

                        </div>


                        <div className="doctor-welcome-icon">

                            <Icon
                                name="hospital"
                                size={43}
                                strokeWidth={1.5}
                            />

                        </div>

                    </section>


                    {/* =================================================
                        STATISTICS
                       ================================================= */}

                    <section className="doctor-stat-grid">


                        <DoctorStat
                            title="Total Appointments"
                            value={
                                appointments.length
                            }
                            description="All assigned appointments"
                            icon="appointment"
                            type="blue"
                        />


                        <DoctorStat
                            title="Today's Appointments"
                            value={
                                todayAppointments.length
                            }
                            description="Scheduled for today"
                            icon="clock"
                            type="teal"
                        />


                        <DoctorStat
                            title="Completed"
                            value={
                                completedAppointments.length
                            }
                            description="Completed appointments"
                            icon="check"
                            type="green"
                        />


                        <DoctorStat
                            title="Pending"
                            value={
                                pendingAppointments.length
                            }
                            description="Awaiting treatment"
                            icon="patient"
                            type="purple"
                        />

                    </section>


                    {/* =================================================
                        QUICK ACTIONS
                       ================================================= */}

                    <section className="doctor-section">

                        <div className="doctor-section-header">

                            <div>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Frequently used doctor tools
                                </p>

                            </div>

                        </div>


                        <div className="doctor-action-grid">


                            <DoctorAction
                                title="My Appointments"
                                description="View all your appointments"
                                icon="appointment"
                                type="blue"
                                onClick={() =>
                                    navigate(
                                        "/doctor/appointments"
                                    )
                                }
                            />


                            <DoctorAction
                                title="Patient Treatment"
                                description="Review patient treatment"
                                icon="treatment"
                                type="teal"
                                onClick={() =>
                                    navigate(
                                        "/doctor/appointments"
                                    )
                                }
                            />


                            <DoctorAction
                                title="My Profile"
                                description="View your account details"
                                icon="profile"
                                type="purple"
                                onClick={() =>
                                    navigate(
                                        "/profile"
                                    )
                                }
                            />

                        </div>

                    </section>


                    {/* =================================================
                        APPOINTMENTS
                       ================================================= */}

                    <section className="doctor-panel">

                        <div className="doctor-panel-header">

                            <div>

                                <h2>
                                    My Appointments
                                </h2>

                                <span>
                                    {appointments.length}
                                    {" "}
                                    appointments assigned
                                </span>

                            </div>


                            <button
                                type="button"
                                className="doctor-link-button"
                                onClick={() =>
                                    navigate(
                                        "/doctor/appointments"
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


                        {appointments.length === 0 ? (

                            <EmptyState
                                text="No appointments found."
                                icon="appointment"
                            />

                        ) : (

                            <div className="doctor-table-wrapper">

                                <table className="doctor-table">

                                    <thead>

                                        <tr>

                                            <th>
                                                APPOINTMENT
                                            </th>

                                            <th>
                                                DATE
                                            </th>

                                            <th>
                                                TIME
                                            </th>

                                            <th>
                                                STATUS
                                            </th>

                                            <th>
                                                ACTION
                                            </th>

                                        </tr>

                                    </thead>


                                    <tbody>

                                        {appointments
                                            .slice(0, 10)
                                            .map(
                                                (
                                                    appointment,
                                                    index
                                                ) => {

                                                    const appointmentId =
                                                        getAppointmentId(
                                                            appointment
                                                        );


                                                    const isLoading =
                                                        diagnosisLoading &&
                                                        diagnosisAppointmentId ===
                                                            appointmentId;


                                                    return (

                                                        <tr
                                                            key={
                                                                appointmentId ||
                                                                index
                                                            }
                                                        >

                                                            <td>

                                                                <div className="doctor-appointment-name">

                                                                    <div className="doctor-appointment-icon">

                                                                        <Icon
                                                                            name="appointment"
                                                                            size={16}
                                                                        />

                                                                    </div>


                                                                    <div>

                                                                        <strong>
                                                                            Appointment #
                                                                            {
                                                                                appointmentId ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                        <span>
                                                                            Patient appointment
                                                                        </span>

                                                                    </div>

                                                                </div>

                                                            </td>


                                                            <td>

                                                                {
                                                                    appointment?.date ||
                                                                    appointment?.appointmentDate ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            <td>

                                                                {
                                                                    appointment?.time ||
                                                                    appointment?.appointmentTime ||
                                                                    "-"
                                                                }

                                                            </td>


                                                            <td>

                                                                <StatusBadge
                                                                    status={
                                                                        appointment?.status
                                                                    }
                                                                />

                                                            </td>


                                                            <td>

                                                                <div className="doctor-table-actions">

                                                                    <button
                                                                        type="button"
                                                                        className="doctor-view-button"
                                                                        onClick={() =>
                                                                            handleViewAppointment(
                                                                                appointment
                                                                            )
                                                                        }
                                                                    >

                                                                        View

                                                                        <Icon
                                                                            name="arrow"
                                                                            size={14}
                                                                        />

                                                                    </button>


                                                                    <button
                                                                        type="button"
                                                                        className="doctor-treatment-button"
                                                                        disabled={
                                                                            isLoading
                                                                        }
                                                                        onClick={() =>
                                                                            handleDiagnosis(
                                                                                appointment
                                                                            )
                                                                        }
                                                                    >

                                                                        {isLoading
                                                                            ? "Loading..."
                                                                            : "Treatment"}

                                                                    </button>

                                                                </div>

                                                            </td>

                                                        </tr>

                                                    );
                                                }
                                            )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                    </section>


                    {/* =================================================
                        TREATMENT
                       ================================================= */}

                    {selectedAppointment && (

                        <section
                            ref={diagnosisSectionRef}
                            className="doctor-treatment-panel"
                        >

                            <div className="doctor-panel-header">

                                <div>

                                    <h2>
                                        Treatment Information
                                    </h2>

                                    <span>
                                        Appointment #
                                        {" "}
                                        {
                                            getAppointmentId(
                                                selectedAppointment
                                            ) || "-"
                                        }
                                    </span>

                                </div>


                                <button
                                    type="button"
                                    className="doctor-close-button"
                                    onClick={() => {

                                        setSelectedAppointment(
                                            null
                                        );

                                        setDiagnosis(
                                            null
                                        );

                                        setMedicines(
                                            []
                                        );

                                    }}
                                >

                                    Close

                                </button>

                            </div>


                            <div className="doctor-treatment-body">


                                {/* APPOINTMENT INFO */}

                                <div className="doctor-info-grid">

                                    <InfoBox
                                        title="Appointment ID"
                                        value={
                                            getAppointmentId(
                                                selectedAppointment
                                            ) || "-"
                                        }
                                    />


                                    <InfoBox
                                        title="Date"
                                        value={
                                            selectedAppointment?.date ||
                                            selectedAppointment?.appointmentDate ||
                                            "-"
                                        }
                                    />


                                    <InfoBox
                                        title="Time"
                                        value={
                                            selectedAppointment?.time ||
                                            selectedAppointment?.appointmentTime ||
                                            "-"
                                        }
                                    />


                                    <InfoBox
                                        title="Status"
                                        value={
                                            selectedAppointment?.status ||
                                            "SCHEDULED"
                                        }
                                        badge
                                    />

                                </div>


                                {/* DIAGNOSIS */}

                                {diagnosisLoading ? (

                                    <div className="doctor-treatment-loading">

                                        <div className="doctor-loader small"></div>

                                        <span>
                                            Loading diagnosis and medicines...
                                        </span>

                                    </div>

                                ) : (

                                    <>

                                        {!diagnosis ? (

                                            <div className="doctor-no-data">

                                                <div>
                                                    <Icon
                                                        name="treatment"
                                                        size={23}
                                                    />
                                                </div>

                                                <strong>
                                                    No diagnosis available
                                                </strong>

                                                <span>
                                                    No diagnosis has been added
                                                    for this appointment yet.
                                                </span>

                                            </div>

                                        ) : (

                                            <>

                                                <div className="doctor-treatment-section">

                                                    <div className="doctor-treatment-title">

                                                        <div className="doctor-treatment-title-icon">

                                                            <Icon
                                                                name="treatment"
                                                                size={18}
                                                            />

                                                        </div>

                                                        <h3>
                                                            Diagnosis
                                                        </h3>

                                                    </div>


                                                    <div className="doctor-diagnosis-card">

                                                        <strong>
                                                            {
                                                                diagnosis?.diagnosis ||
                                                                diagnosis?.description ||
                                                                diagnosis?.diagnosisName ||
                                                                diagnosis?.name ||
                                                                "Diagnosis available"
                                                            }
                                                        </strong>


                                                        {diagnosis?.notes && (

                                                            <p>
                                                                <span>
                                                                    Notes:
                                                                </span>

                                                                {diagnosis.notes}
                                                            </p>

                                                        )}

                                                    </div>

                                                </div>


                                                {/* PRESCRIPTION */}

                                                {diagnosis?.prescription && (

                                                    <div className="doctor-treatment-section">

                                                        <div className="doctor-treatment-title">

                                                            <div className="doctor-treatment-title-icon orange">

                                                                <Icon
                                                                    name="medicine"
                                                                    size={18}
                                                                />

                                                            </div>

                                                            <h3>
                                                                Prescription
                                                            </h3>

                                                        </div>


                                                        <div className="doctor-prescription">

                                                            {diagnosis.prescription}

                                                        </div>

                                                    </div>

                                                )}


                                                {/* MEDICINES */}

                                                <div className="doctor-treatment-section">

                                                    <div className="doctor-treatment-title">

                                                        <div className="doctor-treatment-title-icon green">

                                                            <Icon
                                                                name="medicine"
                                                                size={18}
                                                            />

                                                        </div>

                                                        <h3>
                                                            Medicines
                                                        </h3>

                                                    </div>


                                                    {medicines.length === 0 ? (

                                                        <div className="doctor-no-medicine">

                                                            No medicines added
                                                            for this diagnosis.

                                                        </div>

                                                    ) : (

                                                        <div className="doctor-medicine-grid">

                                                            {medicines.map(
                                                                (
                                                                    medicine,
                                                                    index
                                                                ) => (

                                                                    <div
                                                                        className="doctor-medicine-card"
                                                                        key={
                                                                            medicine?.id ||
                                                                            medicine?.medicineId ||
                                                                            index
                                                                        }
                                                                    >

                                                                        <div className="doctor-medicine-icon">

                                                                            <Icon
                                                                                name="medicine"
                                                                                size={19}
                                                                            />

                                                                        </div>


                                                                        <div>

                                                                            <strong>

                                                                                {
                                                                                    medicine?.name ||
                                                                                    medicine?.medicineName ||
                                                                                    medicine?.medicine ||
                                                                                    "Medicine"
                                                                                }

                                                                            </strong>


                                                                            {medicine?.dosage && (

                                                                                <span>

                                                                                    Dosage:
                                                                                    {" "}
                                                                                    {
                                                                                        medicine.dosage
                                                                                    }

                                                                                </span>

                                                                            )}


                                                                            {medicine?.frequency && (

                                                                                <span>

                                                                                    Frequency:
                                                                                    {" "}
                                                                                    {
                                                                                        medicine.frequency
                                                                                    }

                                                                                </span>

                                                                            )}


                                                                            {medicine?.duration && (

                                                                                <span>

                                                                                    Duration:
                                                                                    {" "}
                                                                                    {
                                                                                        medicine.duration
                                                                                    }

                                                                                </span>

                                                                            )}


                                                                            {medicine?.instructions && (

                                                                                <span>

                                                                                    Instructions:
                                                                                    {" "}
                                                                                    {
                                                                                        medicine.instructions
                                                                                    }

                                                                                </span>

                                                                            )}

                                                                        </div>

                                                                    </div>

                                                                )
                                                            )}

                                                        </div>

                                                    )}

                                                </div>

                                            </>

                                        )}

                                    </>

                                )}

                            </div>

                        </section>

                    )}


                    {/* FOOTER */}

                    <footer className="doctor-footer">

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

const DoctorStat = ({
    title,
    value,
    description,
    icon,
    type
}) => {

    return (

        <div className="doctor-stat-card">

            <div className="doctor-stat-top">

                <div>

                    <span>
                        {title}
                    </span>

                    <h3>
                        {value}
                    </h3>

                </div>


                <div
                    className={`doctor-stat-icon ${type}`}
                >

                    <Icon
                        name={icon}
                        size={22}
                    />

                </div>

            </div>


            <p>
                {description}
            </p>

        </div>
    );
};


/* =========================================================
   ACTION CARD
   ========================================================= */

const DoctorAction = ({
    title,
    description,
    icon,
    type,
    onClick
}) => {

    return (

        <button
            type="button"
            className="doctor-action-card"
            onClick={onClick}
        >

            <div
                className={`doctor-action-icon ${type}`}
            >

                <Icon
                    name={icon}
                    size={22}
                />

            </div>


            <div className="doctor-action-content">

                <strong>
                    {title}
                </strong>

                <span>
                    {description}
                </span>

            </div>


            <Icon
                name="arrow"
                size={17}
            />

        </button>
    );
};


/* =========================================================
   STATUS
   ========================================================= */

const StatusBadge = ({
    status
}) => {

    const value =
        String(
            status || "SCHEDULED"
        ).toUpperCase();


    let type = "scheduled";

    let label =
        value.replace(
            "_",
            " "
        );


    if (
        value === "COMPLETED"
    ) {

        type = "completed";

    } else if (
        value === "PENDING"
    ) {

        type = "pending";

    } else if (
        value === "CANCELLED" ||
        value === "CANCELED"
    ) {

        type = "cancelled";

    } else if (
        value === "IN_PROGRESS" ||
        value === "IN PROGRESS"
    ) {

        type = "progress";
    }


    return (

        <span
            className={`doctor-status ${type}`}
        >

            <span></span>

            {label}

        </span>
    );
};


/* =========================================================
   INFO BOX
   ========================================================= */

const InfoBox = ({
    title,
    value,
    badge = false
}) => {

    return (

        <div className="doctor-info-box">

            <span>
                {title}
            </span>


            {badge ? (

                <StatusBadge
                    status={value}
                />

            ) : (

                <strong>
                    {value}
                </strong>

            )}

        </div>
    );
};


/* =========================================================
   EMPTY
   ========================================================= */

const EmptyState = ({
    text,
    icon
}) => {

    return (

        <div className="doctor-empty">

            <div className="doctor-empty-icon">

                <Icon
                    name={icon}
                    size={24}
                />

            </div>

            <strong>
                {text}
            </strong>

            <span>
                New appointments will appear here.
            </span>

        </div>
    );
};


export default DoctorDashboard;