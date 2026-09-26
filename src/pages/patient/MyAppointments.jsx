import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAppointments,
    deleteAppointment
} from "../../services/appointmentService";

const MyAppointments = () => {

    const navigate = useNavigate();

    const [appointments, setAppointments] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const userId = user?.userId;

    const loadAppointments = async () => {

        try {

            setLoading(true);
            setError("");

            if (!userId) {
                setError(
                    "User information not found. Please login again."
                );
                return;
            }

            console.log("Logged-in user:", user);
            console.log("User ID:", userId);

            const data = await getAppointments(
                userId,
                "PATIENT"
            );

            console.log("Appointments received:", data);

            if (Array.isArray(data)) {
                setAppointments(data);
            } else {

                console.error(
                    "Expected appointment array but received:",
                    data
                );

                setAppointments([]);
                setError(
                    "Invalid appointment data received from server."
                );
            }

        } catch (err) {

            console.error(
                "Error loading appointments:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to load appointments."
            );

            setAppointments([]);

        } finally {

            setLoading(false);
        }
    };

    useEffect(() => {
        loadAppointments();
    }, [userId]);

    const handleDelete = async (appointment) => {

        const confirmDelete = window.confirm(
            "Are you sure you want to cancel this appointment?"
        );

        if (!confirmDelete) {
            return;
        }

        try {

            await deleteAppointment(
                appointment.id
            );

            await loadAppointments();

        } catch (err) {

            console.error(
                "Error deleting appointment:",
                err
            );

            alert(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to cancel appointment."
            );
        }
    };

    return (
        <div className="container py-4">

            {/* Header */}
            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    My Appointments
                </h2>

                <button
                    className="btn btn-primary"
                    onClick={() =>
                        navigate(
                            "/patient/book-appointment"
                        )
                    }
                >
                    + Book Appointment
                </button>

            </div>

            {/* Loading */}
            {loading && (
                <div className="text-center">
                    Loading appointments...
                </div>
            )}

            {/* Error */}
            {!loading && error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}

            {/* Empty */}
            {!loading &&
                !error &&
                appointments.length === 0 && (

                    <div className="alert alert-info">
                        No appointments found.
                    </div>
                )}

            {/* Appointment List */}
            {!loading &&
                !error &&
                appointments.length > 0 && (

                    <div className="row">

                        {appointments.map((appointment) => {

                            const doctorName =
                                appointment?.doctor?.user?.name ||
                                appointment?.doctorName ||
                                "Doctor";

                            return (

                                <div
                                    className="col-md-6 col-lg-4 mb-4"
                                    key={appointment.id}
                                >

                                    <div className="card shadow-sm h-100">

                                        <div className="card-body">

                                            <h5 className="card-title mb-3">
                                                Dr. {doctorName}
                                            </h5>

                                            <p className="mb-2">
                                                <strong>
                                                    Appointment ID:
                                                </strong>{" "}
                                                {appointment.id}
                                            </p>

                                            <p className="mb-2">
                                                <strong>
                                                    Type:
                                                </strong>{" "}
                                                {appointment.appointmentType}
                                            </p>

                                            <p className="mb-2">
                                                <strong>
                                                    Date:
                                                </strong>{" "}
                                                {appointment.appointmentDate}
                                            </p>

                                            <p className="mb-3">
                                                <strong>
                                                    Time:
                                                </strong>{" "}
                                                {appointment.appointmentTime}
                                            </p>

                                            <div className="d-flex gap-2 flex-wrap">

                                                {/* View */}
                                                <button
                                                    className="btn btn-info btn-sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/patient/appointments/${appointment.id}`
                                                        )
                                                    }
                                                >
                                                    View
                                                </button>

                                                {/* Update */}
                                                <button
                                                    className="btn btn-warning btn-sm"
                                                    onClick={() =>
                                                        navigate(
                                                            `/patient/appointments/${appointment.id}/update`,
                                                            {
                                                                state: {
                                                                    appointment
                                                                }
                                                            }
                                                        )
                                                    }
                                                >
                                                    Update
                                                </button>

                                                {/* Delete */}
                                                <button
                                                    className="btn btn-danger btn-sm"
                                                    onClick={() =>
                                                        handleDelete(
                                                            appointment
                                                        )
                                                    }
                                                >
                                                    Cancel
                                                </button>

                                            </div>

                                        </div>

                                    </div>

                                </div>
                            );
                        })}

                    </div>
                )}

        </div>
    );
};

export default MyAppointments;