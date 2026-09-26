import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import {
    getAllTasks,
    updateTask,
    deleteTask
} from "../../services/taskService";


const AdminTasks = () => {

    const navigate = useNavigate();


    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [editingTask, setEditingTask] =
        useState(null);

    const [saving, setSaving] =
        useState(false);


    // =====================================================
    // LOAD ALL TASKS
    // =====================================================

    const loadTasks = async () => {

        try {

            setLoading(true);
            setError("");


            const response =
                await getAllTasks();


            console.log(
                "Admin tasks:",
                response
            );


            setTasks(
                Array.isArray(response)
                    ? response
                    : []
            );

        } catch (error) {

            console.error(error);


            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to load tasks."
            );

        } finally {

            setLoading(false);

        }
    };


    useEffect(() => {

        loadTasks();

    }, []);


    // =====================================================
    // DELETE
    // =====================================================

    const handleDelete = async (task) => {

        const confirmed =
            window.confirm(
                `Remove task "${task.taskName}"?`
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteTask(
                task.id,
                task.userId
            );


            alert(
                "Task removed successfully."
            );


            await loadTasks();

        } catch (error) {

            console.error(
                "Delete error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to remove task."
            );
        }
    };


    // =====================================================
    // UPDATE
    // =====================================================

    const handleUpdate = async () => {

        if (!editingTask) {
            return;
        }


        try {

            setSaving(true);


            await updateTask(
                editingTask.id,
                {
                    status:
                        editingTask.status,

                    result:
                        editingTask.result || ""
                }
            );


            alert(
                "Task updated successfully."
            );


            setEditingTask(null);


            await loadTasks();

        } catch (error) {

            console.error(
                "Update error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to update task."
            );

        } finally {

            setSaving(false);

        }
    };


    // =====================================================
    // STATUS
    // =====================================================

    const getStatusBadge = (status) => {

        if (status === "COMPLETED") {

            return (
                <span className="badge bg-success">
                    COMPLETED
                </span>
            );
        }


        if (status === "IN_PROGRESS") {

            return (
                <span className="badge bg-warning text-dark">
                    IN PROGRESS
                </span>
            );
        }


        return (
            <span className="badge bg-secondary">
                PENDING
            </span>
        );
    };


    return (

        <div className="container-fluid py-4">

            {/* =================================================
                HEADER
            ================================================= */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        Task Management
                    </h2>

                    <p className="text-muted mb-0">
                        Manage hospital tasks
                    </p>

                </div>


                <div className="d-flex gap-2">

                    <button
                        className="btn btn-outline-primary"
                        onClick={loadTasks}
                    >
                        ↻ Refresh
                    </button>

                    {/* This is a JSX comment

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                "/admin/add-task"
                            )
                        }
                    >
                        + Create Task
                    </button>
                        */}
                </div>

            </div>


            {/* ERROR */}

            {error && (

                <div className="alert alert-danger">
                    {error}
                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading ? (

                <div className="text-center py-5">

                    <div className="spinner-border text-primary" />

                    <p className="mt-3 text-muted">
                        Loading tasks...
                    </p>

                </div>

            ) : (

                <div className="card shadow-sm">

                    <div className="card-body">

                        <div className="table-responsive">

                            <table className="table table-bordered table-hover align-middle mb-0">

                                <thead className="table-light">

                                    <tr>

                                        <th>
                                            #
                                        </th>

                                        <th>
                                            Task
                                        </th>

                                        <th>
                                            Service
                                        </th>

                                        <th>
                                            Employee
                                        </th>

                                        <th>
                                            Appointment
                                        </th>

                                        <th>
                                            Status
                                        </th>

                                        <th>
                                            Result
                                        </th>

                                        <th>
                                            Action
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {tasks.length === 0 ? (

                                        <tr>

                                            <td
                                                colSpan="8"
                                                className="text-center py-5"
                                            >

                                                <h5>
                                                    No Tasks
                                                </h5>

                                                <p className="text-muted mb-0">
                                                    No tasks have been created yet.
                                                </p>

                                            </td>

                                        </tr>

                                    ) : (

                                        tasks.map(
                                            (task, index) => (

                                                <tr
                                                    key={
                                                        task.id
                                                    }
                                                >

                                                    <td>
                                                        {index + 1}
                                                    </td>


                                                    <td>

                                                        <strong>
                                                            {
                                                                task.taskName
                                                            }
                                                        </strong>

                                                    </td>


                                                    <td>
                                                        {
                                                            task.serviceName ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>
                                                        {
                                                            task.userName ||
                                                            "-"
                                                        }
                                                    </td>


                                                    <td>

                                                        {task.appointmentId
                                                            ? `#${task.appointmentId}`
                                                            : "Direct Task"}

                                                    </td>


                                                    <td>
                                                        {
                                                            getStatusBadge(
                                                                task.status
                                                            )
                                                        }
                                                    </td>


                                                    <td
                                                        style={{
                                                            maxWidth:
                                                                "220px"
                                                        }}
                                                    >

                                                        {
                                                            task.result ||
                                                            "Not completed"
                                                        }

                                                    </td>


                                                    <td>

                                                        <div className="d-flex gap-2">

                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() =>
                                                                    setEditingTask(
                                                                        {
                                                                            ...task
                                                                        }
                                                                    )
                                                                }
                                                            >
                                                                ✏ Edit
                                                            </button>


                                                            <button
                                                                className="btn btn-danger btn-sm"
                                                                onClick={() =>
                                                                    handleDelete(
                                                                        task
                                                                    )
                                                                }
                                                            >
                                                                🗑 Remove
                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )

                                    )}

                                </tbody>

                            </table>

                        </div>

                    </div>

                </div>

            )}


            {/* =================================================
                EDIT MODAL
            ================================================= */}

            {editingTask && (

                <div
                    className="modal d-block"
                    style={{
                        backgroundColor:
                            "rgba(0,0,0,0.5)"
                    }}
                >

                    <div className="modal-dialog">

                        <div className="modal-content">

                            {/* HEADER */}

                            <div className="modal-header">

                                <h5 className="modal-title">
                                    Update Task
                                </h5>


                                <button
                                    className="btn-close"
                                    onClick={() =>
                                        setEditingTask(
                                            null
                                        )
                                    }
                                />

                            </div>


                            {/* BODY */}

                            <div className="modal-body">

                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Task
                                    </label>

                                    <input
                                        className="form-control"
                                        value={
                                            editingTask.taskName ||
                                            ""
                                        }
                                        disabled
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Service
                                    </label>

                                    <input
                                        className="form-control"
                                        value={
                                            editingTask.serviceName ||
                                            ""
                                        }
                                        disabled
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Assigned Employee
                                    </label>

                                    <input
                                        className="form-control"
                                        value={
                                            editingTask.userName ||
                                            ""
                                        }
                                        disabled
                                    />

                                </div>


                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Status
                                    </label>

                                    <select
                                        className="form-select"
                                        value={
                                            editingTask.status ||
                                            "PENDING"
                                        }
                                        onChange={e =>
                                            setEditingTask({
                                                ...editingTask,
                                                status:
                                                    e.target.value
                                            })
                                        }
                                    >

                                        <option value="PENDING">
                                            PENDING
                                        </option>

                                        <option value="IN_PROGRESS">
                                            IN PROGRESS
                                        </option>

                                        <option value="COMPLETED">
                                            COMPLETED
                                        </option>

                                    </select>

                                </div>


                                <div className="mb-3">

                                    <label className="form-label fw-semibold">
                                        Result
                                    </label>

                                    <textarea
                                        className="form-control"
                                        rows="4"
                                        value={
                                            editingTask.result ||
                                            ""
                                        }
                                        onChange={e =>
                                            setEditingTask({
                                                ...editingTask,
                                                result:
                                                    e.target.value
                                            })
                                        }
                                        placeholder="Enter task result..."
                                    />

                                </div>

                            </div>


                            {/* FOOTER */}

                            <div className="modal-footer">

                                <button
                                    className="btn btn-secondary"
                                    onClick={() =>
                                        setEditingTask(
                                            null
                                        )
                                    }
                                >
                                    Cancel
                                </button>


                                <button
                                    className="btn btn-primary"
                                    onClick={
                                        handleUpdate
                                    }
                                    disabled={
                                        saving
                                    }
                                >

                                    {saving
                                        ? "Updating..."
                                        : "Update Task"}

                                </button>

                            </div>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
};


export default AdminTasks;