const AppointmentCard = ({
    appointment,
    onView,
    onDelete
}) => {

    return (
        <div className="card shadow-sm mb-3">

            <div className="card-body">

                <div className="d-flex justify-content-between">

                    <div>

                        <h5>
                            {appointment.doctor?.name ||
                                "Doctor"}
                        </h5>

                        <p className="mb-1">
                            <strong>Date:</strong>{" "}
                            {appointment.appointmentDate}
                        </p>

                        <p className="mb-1">
                            <strong>Time:</strong>{" "}
                            {appointment.appointmentTime}
                        </p>

                        <p className="mb-1">
                            <strong>Type:</strong>{" "}
                            {appointment.appointmentType}
                        </p>

                    </div>

                    <div>

                        <button
                            className="btn btn-outline-primary btn-sm me-2"
                            onClick={() =>
                                onView(appointment)
                            }
                        >
                            View
                        </button>

                        {onDelete && (
                            <button
                                className="btn btn-outline-danger btn-sm"
                                onClick={() =>
                                    onDelete(appointment)
                                }
                            >
                                Cancel
                            </button>
                        )}

                    </div>

                </div>

            </div>

        </div>
    );
};

export default AppointmentCard;