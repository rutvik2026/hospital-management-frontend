import { useState } from "react";

import {
    updateTask
} from "../../services/taskService";

const EmployeeTaskCard = ({
    task,
    onUpdated
}) => {

    const [status, setStatus] =
        useState(task.status);

    const [result, setResult] =
        useState(task.result || "");

    const [loading, setLoading] =
        useState(false);


    const handleUpdate = async () => {

        try {

            setLoading(true);

            const updated =
                await updateTask(
                    task.id,
                    {
                        status,
                        result
                    }
                );

            onUpdated(updated);

        } catch (error) {

            console.error(error);

            alert(
                error?.response?.data?.message ||
                "Unable to update task."
            );

        } finally {

            setLoading(false);
        }
    };


    return (

        <div className="card shadow-sm mb-3">

            <div className="card-body">

                <h5>
                    {task.taskName}
                </h5>

                <p className="mb-1">

                    <strong>
                        Service:
                    </strong>{" "}

                    {task.serviceName}

                </p>

                <p className="mb-3">

                    <strong>
                        Appointment:
                    </strong>{" "}

                    #{task.appointmentId}

                </p>


                <label className="form-label">
                    Status
                </label>

                <select
                    className="form-select mb-3"
                    value={status}
                    onChange={(e) =>
                        setStatus(e.target.value)
                    }
                >

                    <option value="PENDING">
                        Pending
                    </option>

                    <option value="IN_PROGRESS">
                        In Progress
                    </option>

                    <option value="COMPLETED">
                        Completed
                    </option>

                </select>


                <label className="form-label">
                    Result
                </label>

                <textarea
                    className="form-control mb-3"
                    rows="4"
                    value={result}
                    onChange={(e) =>
                        setResult(e.target.value)
                    }
                    placeholder="Enter test/service result..."
                />


                <button
                    className="btn btn-primary"
                    onClick={handleUpdate}
                    disabled={loading}
                >

                    {loading
                        ? "Saving..."
                        : "Save Result"}

                </button>

            </div>

        </div>
    );
};

export default EmployeeTaskCard;