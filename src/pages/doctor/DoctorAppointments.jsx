import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAppointments
} from "../../services/appointmentService";

const DoctorAppointments = () => {

    const navigate = useNavigate();

    const [appointments, setAppointments] =
        useState([]);

    const [loading, setLoading] =
        useState(true);

    const [error, setError] =
        useState("");

    const user=JSON.parse(localStorage.getItem("user"));
    const doctorId =user.userId;
        
    console.log("doctor id",doctorId);
    const loadAppointments = async () => {

        try {

            setLoading(true);

            const data = await getAppointments(
                doctorId,
                "DOCTOR"
            );

            setAppointments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                "Unable to load appointments."
            );

        } finally {

            setLoading(false);

        }
    };

    useEffect(() => {
        loadAppointments();
    }, []);

    return (
        <div className="container py-4">

            <h2 className="mb-4">
                Doctor Appointments
            </h2>


            {loading && (
                <p>
                    Loading appointments...
                </p>
            )}


            {error && (
                <div className="alert alert-danger">
                    {error}
                </div>
            )}


            {!loading &&
                appointments.length === 0 && (

                    <div className="alert alert-info">
                        No appointments found.
                    </div>

                )}


            <div className="row">

                {appointments.map((appointment) => (

                    <div
                        className="col-md-6 col-lg-4 mb-3"
                        key={appointment.id}
                    >

                        <div className="card h-100 shadow-sm">

                            <div className="card-body">

                                <h5>
                                    {appointment.patient?.name ||
                                        "Patient"}
                                </h5>

                                <hr />

                                <p>
                                    <strong>Date:</strong>{" "}
                                    {appointment.appointmentDate}
                                </p>

                                <p>
                                    <strong>Time:</strong>{" "}
                                    {appointment.appointmentTime}
                                </p>

                                <p>
                                    <strong>Type:</strong>{" "}
                                    {appointment.appointmentType}
                                </p>

                                <button
                                    className="btn btn-primary w-100"
                                    onClick={() =>
                                        navigate(
                                            `/doctor/appointments/${appointment.id}`,
                                            {
                                                state: {
                                                    appointment
                                                }
                                            }
                                        )
                                    }
                                >
                                    Open Appointment
                                </button>

                            </div>

                        </div>

                    </div>

                ))}

            </div>

        </div>
    );
};

export default DoctorAppointments;