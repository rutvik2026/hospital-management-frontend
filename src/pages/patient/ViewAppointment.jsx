import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getAppointments } from "../../services/appointmentService";

const ViewAppointment = () => {

    const navigate = useNavigate();
    const { id } = useParams();

    const [appointment, setAppointment] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const userId = user?.userId;

    useEffect(() => {

        const loadAppointment = async () => {

            try {

                setLoading(true);
                setError("");

                const data = await getAppointments(
                    userId,
                    "PATIENT"
                );

                if (!Array.isArray(data)) {
                    throw new Error(
                        "Invalid appointment data"
                    );
                }

                const foundAppointment =
                    data.find(
                        appointment =>
                            Number(appointment.id) ===
                            Number(id)
                    );

                if (!foundAppointment) {

                    setError(
                        "Appointment not found."
                    );

                    return;
                }

                setAppointment(
                    foundAppointment
                );

            } catch (err) {

                console.error(err);

                setError(
                    err?.response?.data?.message ||
                    err?.message ||
                    "Unable to load appointment."
                );

            } finally {

                setLoading(false);
            }
        };

        if (userId && id) {
            loadAppointment();
        }

    }, [userId, id]);

    if (loading) {

        return (
            <div className="container py-4">
                <div className="text-center">
                    Loading appointment...
                </div>
            </div>
        );
    }

    if (error) {

        return (
            <div className="container py-4">

                <div className="alert alert-danger">
                    {error}
                </div>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            "/patient/appointments"
                        )
                    }
                >
                    Back
                </button>

            </div>
        );
    }

    const doctorName =
        appointment?.doctor?.user?.name ||
        appointment?.doctorName ||
        "Doctor";

    const doctorEmail =
        appointment?.doctor?.user?.email ||
        appointment?.doctor?.email ||
        "Not available";

    const doctorSpecialization =
        appointment?.specialization ||
        "Not available";

    const patientName =
        appointment?.patient?.user?.name ||
        appointment?.patientName ||
        "Patient";

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Appointment Details
                </h2>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            "/patient/appointments"
                        )
                    }
                >
                    ← Back
                </button>

            </div>

            <div className="card shadow-sm">

                <div className="card-header">
                    <h5 className="mb-0">
                        Appointment #{appointment.id}
                    </h5>
                </div>

                <div className="card-body">

                    <div className="row">

                        <div className="col-md-6">

                            <h5 className="mb-3">
                                Appointment Information
                            </h5>

                            <p>
                                <strong>
                                    Appointment ID:
                                </strong>{" "}
                                {appointment.id}
                            </p>

                            <p>
                                <strong>
                                    Type:
                                </strong>{" "}
                                {appointment.appointmentType}
                            </p>

                            <p>
                                <strong>
                                    Date:
                                </strong>{" "}
                                {appointment.appointmentDate}
                            </p>

                            <p>
                                <strong>
                                    Time:
                                </strong>{" "}
                                {appointment.appointmentTime}
                            </p>

                        </div>

                        <div className="col-md-6">

                            <h5 className="mb-3">
                                Doctor Information
                            </h5>

                            <p>
                                <strong>
                                    Doctor:
                                </strong>{" "}
                                Dr. {doctorName}
                            </p>

                            <p>
                                <strong>
                                    Specialization:
                                </strong>{" "}
                                {doctorSpecialization}
                            </p>

                            <p>
                                <strong>
                                    Email:
                                </strong>{" "}
                                {doctorEmail}
                            </p>

                        </div>

                    </div>

                    <hr />

                    <h5 className="mb-3">
                        Patient Information
                    </h5>

                    <p>
                        <strong>
                            Patient:
                        </strong>{" "}
                        {patientName}
                    </p>

                    <div className="mt-4 d-flex gap-2">

                        <button
                            className="btn btn-warning"
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
                            Update Appointment
                        </button>

                        <button
                            className="btn btn-secondary"
                            onClick={() =>
                                navigate(
                                    "/patient/appointments"
                                )
                            }
                        >
                            Back to Appointments
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default ViewAppointment;