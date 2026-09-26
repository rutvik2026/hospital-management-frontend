import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    updateAppointment
} from "../../services/appointmentService";

const UpdateAppointment = () => {

    const navigate = useNavigate();
    const location = useLocation();
    const { id } = useParams();

    const appointment =
        location.state?.appointment;

    const [appointmentType, setAppointmentType] =
        useState("");

    const [appointmentDate, setAppointmentDate] =
        useState("");

    const [appointmentTime, setAppointmentTime] =
        useState("");

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");

    const [success, setSuccess] =
        useState("");

    useEffect(() => {

        if (!appointment) {
            return;
        }

        setAppointmentType(
            appointment.appointmentType || ""
        );

        setAppointmentDate(
            appointment.appointmentDate || ""
        );

        setAppointmentTime(
            appointment.appointmentTime
                ? appointment.appointmentTime.substring(0, 5)
                : ""
        );

    }, [appointment]);

    if (!appointment) {

        return (
            <div className="container py-4">

                <div className="alert alert-danger">
                    Appointment information not found.
                </div>

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
        );
    }

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");
        setSuccess("");

        if (!appointmentType) {

            setError(
                "Please select appointment type."
            );

            return;
        }

        if (!appointmentDate) {

            setError(
                "Please select appointment date."
            );

            return;
        }

        if (!appointmentTime) {

            setError(
                "Please select appointment time."
            );

            return;
        }

        try {

            setLoading(true);

            const updateData = {

                appointmentType:
                    appointmentType,

                appointmentDate:
                    appointmentDate,

                appointmentTime:
                    appointmentTime + ":00"
            };

            console.log(
                "Updating appointment:",
                id
            );

            console.log(
                "Update data:",
                updateData
            );

            await updateAppointment(
                id,
                updateData
            );

            setSuccess(
                "Appointment updated successfully."
            );

            setTimeout(() => {

                navigate(
                    `/patient/appointments/${id}`
                );

            }, 1000);

        } catch (err) {

            console.error(
                "Update appointment error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to update appointment."
            );

        } finally {

            setLoading(false);
        }
    };

    return (
        <div className="container py-4">

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Update Appointment
                </h2>

                <button
                    className="btn btn-secondary"
                    onClick={() =>
                        navigate(
                            `/patient/appointments/${id}`
                        )
                    }
                >
                    ← Back
                </button>

            </div>

            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}

            {success && (

                <div className="alert alert-success">
                    {success}
                </div>

            )}

            <div className="card shadow-sm">

                <div className="card-body">

                    <form
                        onSubmit={handleSubmit}
                    >

                        {/* Appointment ID */}

                        <div className="mb-3">

                            <label className="form-label">
                                Appointment ID
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={appointment.id}
                                disabled
                            />

                        </div>


                        {/* Doctor */}

                        <div className="mb-3">

                            <label className="form-label">
                                Doctor
                            </label>

                            <input
                                type="text"
                                className="form-control"
                                value={
                                    appointment?.doctor?.user?.name ||
                                    appointment?.doctor?.name ||
                                    "Doctor"
                                }
                                disabled
                            />

                        </div>


                        {/* Appointment Type */}

                        <div className="mb-3">

                            <label className="form-label">
                                Appointment Type
                            </label>

                            <select
                                className="form-select"
                                value={appointmentType}
                                onChange={(e) =>
                                    setAppointmentType(
                                        e.target.value
                                    )
                                }
                            >

                                <option value="">
                                    Select Type
                                </option>

                                <option value="INITIAL">
                                    Initial
                                </option>

                                <option value="FOLLOW_UP">
                                    Follow Up
                                </option>

                            </select>

                        </div>


                        {/* Date */}

                        <div className="mb-3">

                            <label className="form-label">
                                Appointment Date
                            </label>

                            <input
                                type="date"
                                className="form-control"
                                value={appointmentDate}
                                onChange={(e) =>
                                    setAppointmentDate(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Time */}

                        <div className="mb-4">

                            <label className="form-label">
                                Appointment Time
                            </label>

                            <input
                                type="time"
                                className="form-control"
                                value={appointmentTime}
                                onChange={(e) =>
                                    setAppointmentTime(
                                        e.target.value
                                    )
                                }
                            />

                        </div>


                        {/* Buttons */}

                        <div className="d-flex gap-2">

                            <button
                                type="submit"
                                className="btn btn-primary"
                                disabled={loading}
                            >

                                {loading
                                    ? "Updating..."
                                    : "Update Appointment"}

                            </button>

                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() =>
                                    navigate(
                                        `/patient/appointments/${id}`
                                    )
                                }
                            >
                                Cancel
                            </button>

                        </div>

                    </form>

                </div>

            </div>

        </div>
    );
};

export default UpdateAppointment;