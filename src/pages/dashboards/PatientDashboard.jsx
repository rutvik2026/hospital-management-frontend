import React, { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

import { getAppointments } from "../../services/appointmentService";
import {
    getDiagnosis,
    getMedicines,
} from "../../services/diagnosisService";

import "./PatientDashboard.css";

const PatientDashboard = () => {
    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [selectedAppointment, setSelectedAppointment] =
        useState(null);
    const [diagnosis, setDiagnosis] = useState(null);
    const [medicines, setMedicines] = useState([]);

    const [loading, setLoading] = useState(true);
    const [medicalLoading, setMedicalLoading] = useState(false);
    const [error, setError] = useState("");

    const [sidebarOpen, setSidebarOpen] = useState(false);
    const [activeMenu, setActiveMenu] = useState("dashboard");

    /* =========================
       USER
    ========================= */

    const getUser = () => {
        try {
            return JSON.parse(
                localStorage.getItem("user") || "{}"
            );
        } catch {
            return {};
        }
    };

    const user = getUser();

    const userId =
        user?.userId ||
        user?.id ||
        user?.userID;

    const patientName =
        user?.name ||
        user?.username ||
        user?.userName ||
        "Patient";

    const patientInitial =
        patientName.charAt(0).toUpperCase();

    /* =========================
       LOAD DASHBOARD
    ========================= */

    useEffect(() => {
        loadDashboard();
    }, []);

    const loadDashboard = async () => {
        try {
            setLoading(true);
            setError("");

            if (!userId) {
                throw new Error(
                    "Patient user ID not found. Please login again."
                );
            }

            const response = await getAppointments(
                Number(userId),
                "PATIENT"
            );

            let data = [];

            if (Array.isArray(response)) {
                data = response;
            } else if (Array.isArray(response?.data)) {
                data = response.data;
            } else if (
                Array.isArray(response?.appointments)
            ) {
                data = response.appointments;
            }

            setAppointments(data);
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                    err?.response?.data ||
                    err?.message ||
                    "Unable to load patient dashboard."
            );
        } finally {
            setLoading(false);
        }
    };

    /* =========================
       MEDICAL RECORD
    ========================= */

    const loadMedicalRecord = async (appointment) => {
        try {
            setMedicalLoading(true);

            setSelectedAppointment(appointment);
            setDiagnosis(null);
            setMedicines([]);

            const appointmentId =
                appointment?.id ||
                appointment?.appointmentId;

            if (!appointmentId) {
                return;
            }

            const data =
                await getDiagnosis(appointmentId);

            setDiagnosis(data);

            if (data?.id) {
                const medicineData =
                    await getMedicines(data.id);

                setMedicines(
                    Array.isArray(medicineData)
                        ? medicineData
                        : Array.isArray(
                              medicineData?.data
                          )
                        ? medicineData.data
                        : []
                );
            }
        } catch (err) {
            console.error(
                "Medical record error:",
                err
            );

            setDiagnosis(null);
            setMedicines([]);
        } finally {
            setMedicalLoading(false);
        }
    };

    /* =========================
       STATISTICS
    ========================= */

    const statistics = useMemo(() => {
        const completed = appointments.filter(
            (appointment) =>
                String(
                    appointment?.status || ""
                ).toUpperCase() === "COMPLETED"
        ).length;

        const upcoming = appointments.filter(
            (appointment) =>
                String(
                    appointment?.status || ""
                ).toUpperCase() !== "COMPLETED"
        ).length;

        const records = appointments.filter(
            (appointment) =>
                appointment?.diagnosis ||
                appointment?.diagnosisId
        ).length;

        return {
            total: appointments.length,
            upcoming,
            completed,
            records,
        };
    }, [appointments]);

    /* =========================
       NAVIGATION
    ========================= */

    const scrollToSection = (
        section,
        menu
    ) => {
        setActiveMenu(menu);

        const element =
            document.getElementById(section);

        if (element) {
            element.scrollIntoView({
                behavior: "smooth",
                block: "start",
            });
        }

        setSidebarOpen(false);
    };

    const logout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        sessionStorage.clear();

        navigate("/login", {
            replace: true,
        });
    };

    /* =========================
       STATUS
    ========================= */

    const getStatusClass = (status) => {
        const value = String(
            status || "SCHEDULED"
        ).toUpperCase();

        if (value === "COMPLETED") {
            return "patient-status completed";
        }

        if (
            value === "CANCELLED" ||
            value === "CANCELED"
        ) {
            return "patient-status cancelled";
        }

        if (value === "IN_PROGRESS") {
            return "patient-status progress";
        }

        return "patient-status scheduled";
    };

    /* =========================
       LOADING
    ========================= */

    if (loading) {
        return (
            <div className="patient-loading">
                <div className="text-center">
                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <h5 className="mt-3 fw-semibold">
                        Loading your healthcare dashboard...
                    </h5>

                    <p className="text-muted">
                        Please wait a moment
                    </p>
                </div>
            </div>
        );
    }

    return (
        <div className="patient-dashboard">

            {/* MOBILE OVERLAY */}
            {sidebarOpen && (
                <div
                    className="patient-sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            {/* ================= SIDEBAR ================= */}

            <aside
                className={`patient-sidebar ${
                    sidebarOpen
                        ? "patient-sidebar-open"
                        : ""
                }`}
            >
                {/* LOGO */}

                <div className="patient-brand">

                    <div className="patient-brand-icon">
                        <i className="bi bi-heart-pulse-fill"></i>
                    </div>

                    <div>
                        <h4>MediCare</h4>
                        <span>
                            Healthcare System
                        </span>
                    </div>

                    <button
                        className="patient-close-sidebar"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >
                        <i className="bi bi-x-lg"></i>
                    </button>
                </div>

                <div className="patient-menu-label">
                    MAIN MENU
                </div>

                <nav className="patient-navigation">

                    <button
                        className={`patient-nav-item ${
                            activeMenu === "dashboard"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setActiveMenu(
                                "dashboard"
                            );

                            window.scrollTo({
                                top: 0,
                                behavior: "smooth",
                            });

                            setSidebarOpen(false);
                        }}
                    >
                        <i className="bi bi-grid-1x2-fill"></i>
                        <span>Dashboard</span>
                    </button>

                    <button
                        className={`patient-nav-item ${
                            activeMenu === "appointments"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            scrollToSection(
                                "appointments-section",
                                "appointments"
                            )
                        }
                    >
                        <i className="bi bi-calendar2-week"></i>
                        <span>My Appointments</span>

                        <span className="patient-nav-count">
                            {appointments.length}
                        </span>
                    </button>

                    <button
                        className={`patient-nav-item ${
                            activeMenu === "medical"
                                ? "active"
                                : ""
                        }`}
                        onClick={() =>
                            scrollToSection(
                                "medical-section",
                                "medical"
                            )
                        }
                    >
                        <i className="bi bi-file-medical"></i>
                        <span>Medical Records</span>
                    </button>

                    <button
                        className={`patient-nav-item ${
                            activeMenu === "profile"
                                ? "active"
                                : ""
                        }`}
                        onClick={() => {
                            setActiveMenu("profile");
                            setSidebarOpen(false);
                            navigate("/profile");
                        }}
                    >
                        <i className="bi bi-person-circle"></i>
                        <span>My Profile</span>
                    </button>

                </nav>

                {/* SIDEBAR BOTTOM */}

                <div className="patient-sidebar-bottom">

                    <div className="patient-mini-profile">

                        <div className="patient-avatar">
                            {patientInitial}
                        </div>

                        <div className="patient-mini-info">
                            <strong>
                                {patientName}
                            </strong>

                            <span>
                                Patient
                            </span>
                        </div>

                    </div>

                    <button
                        className="patient-logout"
                        onClick={logout}
                    >
                        <i className="bi bi-box-arrow-right"></i>
                        Logout
                    </button>

                </div>
            </aside>

            {/* ================= MAIN ================= */}

            <main className="patient-main">

                {/* TOPBAR */}

                <header className="patient-topbar">

                    <button
                        className="patient-menu-button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >
                        <i className="bi bi-list"></i>
                    </button>

                    <div className="patient-page-title">
                        Patient Dashboard
                    </div>

                    <div className="patient-top-profile">

                        <div className="patient-avatar">
                            {patientInitial}
                        </div>

                        <div className="patient-top-profile-info">
                            <strong>
                                {patientName}
                            </strong>

                            <span>
                                Patient
                            </span>
                        </div>

                    </div>

                </header>

                <div className="patient-content">

                    {/* ================= HERO ================= */}

                    <section className="patient-hero">

                        <div className="patient-hero-content">

                            <span className="patient-hero-label">
                                YOUR HEALTHCARE, SIMPLIFIED
                            </span>

                            <h1>
                                Good to see you,
                                <br />
                                <span>
                                    {patientName}
                                </span>
                            </h1>

                            <p>
                                Manage your appointments,
                                medical records and
                                healthcare information
                                from one secure place.
                            </p>

                            <div className="patient-hero-actions">

                                <button
                                    className="btn patient-primary-btn"
                                    onClick={() =>
                                        navigate(
                                            "/patient/book-appointment"
                                        )
                                    }
                                >
                                    <i className="bi bi-calendar-plus me-2"></i>
                                    Book Appointment
                                </button>

                                <button
                                    className="btn patient-white-btn"
                                    onClick={loadDashboard}
                                >
                                    <i className="bi bi-arrow-clockwise me-2"></i>
                                    Refresh
                                </button>

                            </div>

                        </div>

                        <div className="patient-hero-image">
                            <img
                                src="https://images.unsplash.com/photo-1576091160399-112ba8d25d1d?auto=format&fit=crop&w=900&q=85"
                                alt="Healthcare professional"
                            />

                            <div className="patient-hero-floating-card">
                                <div className="floating-icon">
                                    <i className="bi bi-shield-check"></i>
                                </div>

                                <div>
                                    <strong>
                                        Your health matters
                                    </strong>

                                    <span>
                                        Secure healthcare access
                                    </span>
                                </div>
                            </div>
                        </div>

                    </section>

                    {/* ERROR */}

                    {error && (
                        <div className="alert alert-danger mt-4">
                            <i className="bi bi-exclamation-triangle me-2"></i>
                            {error}
                        </div>
                    )}

                    {/* ================= STATS ================= */}

                    <section className="patient-stats">

                        <div className="patient-stat-card">

                            <div className="patient-stat-icon blue">
                                <i className="bi bi-calendar-check"></i>
                            </div>

                            <div>
                                <span>
                                    Total Appointments
                                </span>

                                <h2>
                                    {statistics.total}
                                </h2>

                                <small>
                                    All appointments
                                </small>
                            </div>

                        </div>

                        <div className="patient-stat-card">

                            <div className="patient-stat-icon orange">
                                <i className="bi bi-clock-history"></i>
                            </div>

                            <div>
                                <span>
                                    Upcoming
                                </span>

                                <h2>
                                    {statistics.upcoming}
                                </h2>

                                <small>
                                    Scheduled visits
                                </small>
                            </div>

                        </div>

                        <div className="patient-stat-card">

                            <div className="patient-stat-icon green">
                                <i className="bi bi-check-circle"></i>
                            </div>

                            <div>
                                <span>
                                    Completed
                                </span>

                                <h2>
                                    {statistics.completed}
                                </h2>

                                <small>
                                    Completed visits
                                </small>
                            </div>

                        </div>

                        <div className="patient-stat-card">

                            <div className="patient-stat-icon purple">
                                <i className="bi bi-file-earmark-medical"></i>
                            </div>

                            <div>
                                <span>
                                    Medical Records
                                </span>

                                <h2>
                                    {statistics.records}
                                </h2>

                                <small>
                                    Available records
                                </small>
                            </div>

                        </div>

                    </section>

                    {/* ================= QUICK ACTIONS ================= */}

                    <section className="patient-section">

                        <div className="patient-section-heading">
                            <div>
                                <span className="patient-small-label">
                                    SERVICES
                                </span>

                                <h2>
                                    Quick Actions
                                </h2>

                                <p>
                                    Access your healthcare
                                    services quickly.
                                </p>
                            </div>
                        </div>

                        <div className="row g-4">

                            <div className="col-lg-4">

                                <button
                                    className="patient-action-card"
                                    onClick={() =>
                                        navigate(
                                            "/patient/book-appointment"
                                        )
                                    }
                                >
                                    <div className="patient-action-icon blue">
                                        <i className="bi bi-calendar-plus"></i>
                                    </div>

                                    <div>
                                        <h5>
                                            Book Appointment
                                        </h5>

                                        <p>
                                            Schedule a consultation
                                            with a doctor.
                                        </p>

                                        <span>
                                            Book now
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </span>
                                    </div>
                                </button>

                            </div>

                            <div className="col-lg-4">

                                <button
                                    className="patient-action-card"
                                    onClick={() =>
                                        scrollToSection(
                                            "appointments-section",
                                            "appointments"
                                        )
                                    }
                                >
                                    <div className="patient-action-icon green">
                                        <i className="bi bi-calendar2-check"></i>
                                    </div>

                                    <div>
                                        <h5>
                                            My Appointments
                                        </h5>

                                        <p>
                                            View and manage your
                                            scheduled appointments.
                                        </p>

                                        <span>
                                            View appointments
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </span>
                                    </div>
                                </button>

                            </div>

                            <div className="col-lg-4">

                                <button
                                    className="patient-action-card"
                                    onClick={() =>
                                        scrollToSection(
                                            "medical-section",
                                            "medical"
                                        )
                                    }
                                >
                                    <div className="patient-action-icon purple">
                                        <i className="bi bi-file-medical"></i>
                                    </div>

                                    <div>
                                        <h5>
                                            Medical Records
                                        </h5>

                                        <p>
                                            Review your diagnosis
                                            and prescriptions.
                                        </p>

                                        <span>
                                            View records
                                            <i className="bi bi-arrow-right ms-2"></i>
                                        </span>
                                    </div>
                                </button>

                            </div>

                        </div>

                    </section>

                    {/* ================= APPOINTMENTS ================= */}

                    <section
                        id="appointments-section"
                        className="patient-section"
                    >

                        <div className="patient-section-heading d-flex justify-content-between align-items-end">

                            <div>
                                <span className="patient-small-label">
                                    HEALTHCARE
                                </span>

                                <h2>
                                    My Appointments
                                </h2>

                                <p>
                                    Keep track of your
                                    upcoming and previous visits.
                                </p>
                            </div>

                            <button
                                className="btn patient-outline-btn"
                                onClick={() =>
                                    navigate(
                                        "/patient/appointments"
                                    )
                                }
                            >
                                View All
                                <i className="bi bi-arrow-right ms-2"></i>
                            </button>

                        </div>

                        <div className="patient-card">

                            {appointments.length === 0 ? (

                                <div className="patient-empty">

                                    <div className="patient-empty-icon">
                                        <i className="bi bi-calendar-x"></i>
                                    </div>

                                    <h4>
                                        No Appointments Yet
                                    </h4>

                                    <p>
                                        You don't have any
                                        appointments scheduled.
                                    </p>

                                    <button
                                        className="btn patient-primary-btn"
                                        onClick={() =>
                                            navigate(
                                                "/patient/book-appointment"
                                            )
                                        }
                                    >
                                        <i className="bi bi-calendar-plus me-2"></i>
                                        Book Appointment
                                    </button>

                                </div>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table patient-table align-middle mb-0">

                                        <thead>
                                            <tr>
                                                <th>
                                                    Appointment
                                                </th>

                                                <th>
                                                    Date
                                                </th>

                                                <th>
                                                    Time
                                                </th>

                                                <th>
                                                    Status
                                                </th>

                                                <th className="text-end">
                                                    Action
                                                </th>
                                            </tr>
                                        </thead>

                                        <tbody>

                                            {appointments.map(
                                                (
                                                    appointment,
                                                    index
                                                ) => {

                                                    const appointmentId =
                                                        appointment?.id ||
                                                        appointment?.appointmentId;

                                                    return (
                                                        <tr
                                                            key={
                                                                appointmentId ||
                                                                index
                                                            }
                                                        >

                                                            <td>

                                                                <div className="appointment-id">

                                                                    <div className="appointment-icon">
                                                                        <i className="bi bi-calendar-event"></i>
                                                                    </div>

                                                                    <div>
                                                                        <strong>
                                                                            Appointment #
                                                                            {
                                                                                appointmentId ||
                                                                                "-"
                                                                            }
                                                                        </strong>

                                                                        <small>
                                                                            Healthcare visit
                                                                        </small>
                                                                    </div>

                                                                </div>

                                                            </td>

                                                            <td>
                                                                <strong>
                                                                    {
                                                                        appointment?.appointmentDate ||
                                                                        "-"
                                                                    }
                                                                </strong>
                                                            </td>

                                                            <td>
                                                                {
                                                                    appointment?.time ||
                                                                    appointment?.appointmentTime ||
                                                                    "-"
                                                                }
                                                            </td>

                                                            <td>
                                                                <span
                                                                    className={getStatusClass(
                                                                        appointment?.status
                                                                    )}
                                                                >
                                                                    <span></span>
                                                                    {
                                                                        appointment?.status ||
                                                                        "SCHEDULED"
                                                                    }
                                                                </span>
                                                            </td>

                                                            <td className="text-end">

                                                                <button
                                                                    className="btn patient-view-btn me-2"
                                                                    onClick={() =>
                                                                        navigate(
                                                                            `/patient/appointments/${appointmentId}`
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-eye me-1"></i>
                                                                    View
                                                                </button>

                                                                <button
                                                                    className="btn patient-record-btn"
                                                                    onClick={() =>
                                                                        loadMedicalRecord(
                                                                            appointment
                                                                        )
                                                                    }
                                                                >
                                                                    <i className="bi bi-file-medical me-1"></i>
                                                                    Record
                                                                </button>

                                                            </td>

                                                        </tr>
                                                    );
                                                }
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </section>

                    {/* ================= MEDICAL RECORD ================= */}

                    <section
                        id="medical-section"
                        className="patient-section"
                    >

                        <div className="patient-section-heading">

                            <span className="patient-small-label">
                                HEALTH INFORMATION
                            </span>

                            <h2>
                                Medical Records
                            </h2>

                            <p>
                                Your diagnosis and prescribed
                                medicines are displayed securely.
                            </p>

                        </div>

                        {!selectedAppointment ? (

                            <div className="patient-medical-placeholder">

                                <div className="medical-placeholder-image">
                                    <img
                                        src="https://images.unsplash.com/photo-1584982751601-97dcc096659c?auto=format&fit=crop&w=700&q=80"
                                        alt="Medical records"
                                    />
                                </div>

                                <div>
                                    <div className="medical-placeholder-icon">
                                        <i className="bi bi-file-earmark-medical"></i>
                                    </div>

                                    <h3>
                                        Select an appointment
                                    </h3>

                                    <p>
                                        Select “Record” from an
                                        appointment above to view
                                        the diagnosis and prescribed
                                        medicines.
                                    </p>

                                    <button
                                        className="btn patient-outline-btn"
                                        onClick={() =>
                                            scrollToSection(
                                                "appointments-section",
                                                "appointments"
                                            )
                                        }
                                    >
                                        View Appointments
                                    </button>
                                </div>

                            </div>

                        ) : (

                            <div className="patient-medical-card">

                                <div className="medical-header">

                                    <div>

                                        <span>
                                            APPOINTMENT #
                                            {
                                                selectedAppointment?.id ||
                                                selectedAppointment?.appointmentId ||
                                                "-"
                                            }
                                        </span>

                                        <h3>
                                            Medical Record
                                        </h3>

                                    </div>

                                    <button
                                        className="btn btn-light"
                                        onClick={() => {
                                            setSelectedAppointment(
                                                null
                                            );
                                            setDiagnosis(null);
                                            setMedicines([]);
                                        }}
                                    >
                                        <i className="bi bi-x-lg"></i>
                                    </button>

                                </div>

                                {medicalLoading ? (

                                    <div className="medical-loading">
                                        <div className="spinner-border text-primary"></div>
                                        <p>
                                            Loading medical record...
                                        </p>
                                    </div>

                                ) : !diagnosis ? (

                                    <div className="medical-no-record">

                                        <i className="bi bi-file-earmark-x"></i>

                                        <h5>
                                            No Diagnosis Available
                                        </h5>

                                        <p>
                                            No diagnosis has been
                                            added for this appointment
                                            yet.
                                        </p>

                                    </div>

                                ) : (

                                    <div className="medical-body">

                                        {/* Diagnosis */}

                                        <div className="diagnosis-box">

                                            <div className="diagnosis-icon">
                                                <i className="bi bi-clipboard2-pulse"></i>
                                            </div>

                                            <div>

                                                <span>
                                                    DIAGNOSIS
                                                </span>

                                                <h5>
                                                    {
                                                        diagnosis?.diagnosis ||
                                                        diagnosis?.description ||
                                                        "Diagnosis available"
                                                    }
                                                </h5>

                                            </div>

                                        </div>

                                        {/* Medicines */}

                                        <div className="medicine-section">

                                            <div className="medicine-heading">

                                                <div>
                                                    <span>
                                                        PRESCRIPTION
                                                    </span>

                                                    <h4>
                                                        Prescribed Medicines
                                                    </h4>
                                                </div>

                                                <div className="medicine-count">
                                                    {medicines.length}
                                                </div>

                                            </div>

                                            {medicines.length ===
                                            0 ? (

                                                <div className="no-medicine">
                                                    <i className="bi bi-capsule"></i>

                                                    <span>
                                                        No medicines prescribed
                                                    </span>
                                                </div>

                                            ) : (

                                                <div className="row g-3">

                                                    {medicines.map(
                                                        (
                                                            medicine,
                                                            index
                                                        ) => (

                                                            <div
                                                                className="col-md-6"
                                                                key={
                                                                    medicine?.id ||
                                                                    index
                                                                }
                                                            >

                                                                <div className="medicine-card">

                                                                    <div className="medicine-icon">
                                                                        <i className="bi bi-capsule-pill"></i>
                                                                    </div>

                                                                    <div>

                                                                        <strong>
                                                                            {
                                                                                medicine?.name ||
                                                                                medicine?.medicineName ||
                                                                                "Medicine"
                                                                            }
                                                                        </strong>

                                                                        <p>
                                                                            {medicine?.dosage ||
                                                                                "Dosage not specified"}
                                                                        </p>

                                                                    </div>

                                                                </div>

                                                            </div>

                                                        )
                                                    )}

                                                </div>

                                            )}

                                        </div>

                                    </div>

                                )}

                            </div>

                        )}

                    </section>

                    {/* ================= FOOTER ================= */}

                    <footer className="patient-footer">

                        <div>
                            <strong>
                                <i className="bi bi-heart-pulse-fill me-2"></i>
                                MediCare
                            </strong>

                            <span>
                                Your trusted digital healthcare
                                companion.
                            </span>
                        </div>

                        <div>
                            © {new Date().getFullYear()}
                            {" "}MediCare Hospital Management System
                        </div>

                    </footer>

                </div>

            </main>

        </div>
    );
};

export default PatientDashboard;