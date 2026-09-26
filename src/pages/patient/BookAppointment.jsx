import { useEffect, useState } from "react";
import { createAppointment } from "../../services/appointmentService";
import api from "../../services/api";

const BookAppointment = () => {

    const [doctors, setDoctors] = useState([]);

    const [form, setForm] = useState({
        appointmentType: "",
        appointmentDate: "",
        appointmentTime: "",
        doctorId: ""
    });

    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState("");
    const [error, setError] = useState("");

    useEffect(() => {
        loadDoctors();
    }, []);

    const loadDoctors = async () => {
        try {
            /*
             * Replace this endpoint with your existing
             * doctor GET endpoint if its path is different.
             */
            const response = await api.get("/any/get/doctors");

            setDoctors(
                Array.isArray(response.data)
                    ? response.data
                    : []
            );

        } catch (err) {
            console.error(err);
            setError("Unable to load doctors.");
        }
    };

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setMessage("");
        setError("");

        try {

            const user =
                JSON.parse(localStorage.getItem("user"));
            const patientId=user.userId;
            console.log("user",user);
            console.log("patient id",patientId);
            const selectedDoctor =
                doctors.find(
                    doctor =>
                        Number(doctor.id) ===
                        Number(form.doctorId)
                );

            if (!selectedDoctor) {
                throw new Error("Doctor not found");
            }

            const data = {
                appointmentType: form.appointmentType,
                appointmentDate: form.appointmentDate,
                appointmentTime: form.appointmentTime,

                doctor: {
                    id: Number(form.doctorId)
                },

                patient: {
                    id: Number(patientId)
                }
            };

            await createAppointment(data);

            setMessage(
                "Appointment booked successfully."
            );

            setForm({
                appointmentType: "",
                appointmentDate: "",
                appointmentTime: "",
                doctorId: ""
            });

        } catch (err) {

            console.error(err);

            setError(
                err?.response?.data?.message ||
                err.message ||
                "Unable to book appointment."
            );

        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="container py-4">

            <div className="row justify-content-center">

                <div className="col-md-8 col-lg-6">

                    <div className="card shadow-sm">

                        <div className="card-body">

                            <h3 className="mb-4">
                                Book Appointment
                            </h3>

                            {message && (
                                <div className="alert alert-success">
                                    {message}
                                </div>
                            )}

                            {error && (
                                <div className="alert alert-danger">
                                    {error}
                                </div>
                            )}

                            <form onSubmit={handleSubmit}>

                                <div className="mb-3">

                                    <label className="form-label">
                                        Doctor
                                    </label>

                                    <select
                                        name="doctorId"
                                        value={form.doctorId}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >

                                        <option value="">
                                            Select Doctor
                                        </option>

                                        {doctors.map((doctor) => (

                                            <option
                                                key={doctor.id}
                                                value={doctor.id}
                                            >
                                                {doctor.name ||
                                                    doctor.user?.name ||
                                                    `Doctor ${doctor.id}`}
                                            </option>

                                        ))}

                                    </select>

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Appointment Type
                                    </label>

                                    <select
                                        name="appointmentType"
                                        value={form.appointmentType}
                                        onChange={handleChange}
                                        className="form-select"
                                        required
                                    >

                                        <option value="">
                                            Select Type
                                        </option>

                                        <option value="FOLLOW_UP">
                                            Follow Up
                                        </option>
                                        <option value="INITIAL">
                                            Initial
                                        </option>
                                    </select>

                                </div>


                                <div className="mb-3">

                                    <label className="form-label">
                                        Date
                                    </label>

                                    <input
                                        type="date"
                                        name="appointmentDate"
                                        value={form.appointmentDate}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />

                                </div>


                                <div className="mb-4">

                                    <label className="form-label">
                                        Time
                                    </label>

                                    <input
                                        type="time"
                                        name="appointmentTime"
                                        value={form.appointmentTime}
                                        onChange={handleChange}
                                        className="form-control"
                                        required
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-primary w-100"
                                    disabled={loading}
                                >

                                    {loading
                                        ? "Booking..."
                                        : "Book Appointment"}

                                </button>

                            </form>

                        </div>

                    </div>

                </div>

            </div>

        </div>
    );
};

export default BookAppointment;