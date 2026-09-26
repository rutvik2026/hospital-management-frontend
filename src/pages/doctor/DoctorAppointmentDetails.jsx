import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import {
    getDiagnosis,
    getMedicines,
    addDiagnosis,
    addMedicine,
    updateDiagnosis,
    updateMedicine
} from "../../services/diagnosisService";

import {
    getAppointmentTasks,
    updateTask,
    deleteTask
} from "../../services/taskService";


const DoctorAppointmentDetails = () => {

    const location = useLocation();
    const navigate = useNavigate();

    const appointment =
        location.state?.appointment;


    // ========================================
    // STATE
    // ========================================

    const [diagnosis, setDiagnosis] =
        useState(null);

    const [medicines, setMedicines] =
        useState([]);

    const [loadingDiagnosis, setLoadingDiagnosis] =
        useState(true);

    const [diagnosisError, setDiagnosisError] =
        useState("");


    // ========================================
    // TASK STATE
    // ========================================

    const [tasks, setTasks] =
        useState([]);

    const [loadingTasks, setLoadingTasks] =
        useState(true);

    const [taskError, setTaskError] =
        useState("");


    // ========================================
    // TASK UPDATE STATE
    // ========================================

    const [editingTask, setEditingTask] =
        useState(null);

    const [taskUpdateForm, setTaskUpdateForm] =
        useState({
            status: "PENDING",
            result: ""
        });

    const [updatingTask, setUpdatingTask] =
        useState(false);

    const [deletingTaskId, setDeletingTaskId] =
        useState(null);


    // ========================================
    // DIAGNOSIS / MEDICINE FORM STATE
    // ========================================

    const [showDiagnosisForm, setShowDiagnosisForm] =
        useState(false);

    const [showMedicineForm, setShowMedicineForm] =
        useState(false);

    const [editingDiagnosis, setEditingDiagnosis] =
        useState(false);

    const [editingMedicineId, setEditingMedicineId] =
        useState(null);


    // ========================================
    // DIAGNOSIS FORM
    // ========================================

    const [diagnosisForm, setDiagnosisForm] =
        useState({
            discription: "",
            prescription: ""
        });


    // ========================================
    // MEDICINE FORM
    // ========================================

    const [medicineForm, setMedicineForm] =
        useState({
            medicineName: "",
            dosage: "",
            frequency: "",
            instructions: "",
            durationDays: ""
        });


    const [savingDiagnosis, setSavingDiagnosis] =
        useState(false);

    const [savingMedicine, setSavingMedicine] =
        useState(false);


    // ========================================
    // APPOINTMENT CHECK
    // ========================================

    if (!appointment) {

        return (
            <div className="container py-4">

                <div className="alert alert-danger">
                    Appointment data not found.
                </div>

            </div>
        );
    }


    // ========================================
    // LOAD DIAGNOSIS + MEDICINES
    // ========================================

    const loadDiagnosis = async () => {

        try {

            setLoadingDiagnosis(true);
            setDiagnosisError("");

            console.log(
                "Loading diagnosis for appointment:",
                appointment.id
            );


            const diagnosisData =
                await getDiagnosis(
                    appointment.id
                );


            console.log(
                "Diagnosis received:",
                diagnosisData
            );


            if (
                diagnosisData &&
                diagnosisData.id
            ) {

                setDiagnosis(
                    diagnosisData
                );


                // ========================================
                // LOAD MEDICINES
                // ========================================

                try {

                    const medicineData =
                        await getMedicines(
                            diagnosisData.id
                        );


                    console.log(
                        "Medicines received:",
                        medicineData
                    );


                    setMedicines(
                        Array.isArray(medicineData)
                            ? medicineData
                            : []
                    );

                } catch (medicineError) {

                    console.error(
                        "Error loading medicines:",
                        medicineError
                    );

                    setMedicines([]);
                }

            } else {

                setDiagnosis(null);
                setMedicines([]);
            }

        } catch (error) {

            console.error(
                "Error loading diagnosis:",
                error
            );


            if (
                error?.response?.status === 404
            ) {

                setDiagnosis(null);
                setMedicines([]);

            } else {

                setDiagnosisError(
                    error?.response?.data?.message ||
                    error?.response?.data ||
                    "Unable to load diagnosis."
                );
            }

        } finally {

            setLoadingDiagnosis(false);
        }
    };


    // ========================================
    // LOAD TASKS
    // ========================================

    const loadTasks = async () => {

        try {

            setLoadingTasks(true);
            setTaskError("");

            console.log(
                "Loading tasks for appointment:",
                appointment.id
            );


            const taskData =
                await getAppointmentTasks(
                    appointment.id
                );


            console.log(
                "Tasks received:",
                taskData
            );


            setTasks(
                Array.isArray(taskData)
                    ? taskData
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading tasks:",
                error
            );


            setTaskError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to load tasks."
            );

            setTasks([]);

        } finally {

            setLoadingTasks(false);
        }
    };


    // ========================================
    // LOAD WHEN PAGE OPENS
    // ========================================

    useEffect(() => {

        loadDiagnosis();
        loadTasks();

    }, [appointment.id]);


    // ========================================
    // DIAGNOSIS FORM CHANGE
    // ========================================

    const handleDiagnosisChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setDiagnosisForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ========================================
    // ADD DIAGNOSIS
    // ========================================

    const handleAddDiagnosis = async (e) => {

        e.preventDefault();

        try {

            setSavingDiagnosis(true);


            const data = {

                discription:
                    diagnosisForm.discription,

                prescription:
                    diagnosisForm.prescription
            };


            await addDiagnosis(
                appointment.id,
                data
            );


            alert(
                "Diagnosis added successfully."
            );


            setDiagnosisForm({
                discription: "",
                prescription: ""
            });


            setShowDiagnosisForm(false);


            await loadDiagnosis();

        } catch (error) {

            console.error(
                "Error adding diagnosis:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to add diagnosis."
            );

        } finally {

            setSavingDiagnosis(false);
        }
    };


    // ========================================
    // START UPDATE DIAGNOSIS
    // ========================================

    const handleStartUpdateDiagnosis = () => {

        setDiagnosisForm({

            discription:
                diagnosis?.discription || "",

            prescription:
                diagnosis?.prescription || ""
        });


        setEditingDiagnosis(true);

        setShowDiagnosisForm(false);
    };


    // ========================================
    // UPDATE DIAGNOSIS
    // ========================================

    const handleUpdateDiagnosis = async (e) => {

        e.preventDefault();


        if (!diagnosis?.id) {

            alert(
                "Diagnosis ID not found."
            );

            return;
        }


        try {

            setSavingDiagnosis(true);


            const data = {

                discription:
                    diagnosisForm.discription,

                prescription:
                    diagnosisForm.prescription
            };


            await updateDiagnosis(
                diagnosis.id,
                data
            );


            alert(
                "Diagnosis updated successfully."
            );


            setEditingDiagnosis(false);


            setDiagnosisForm({
                discription: "",
                prescription: ""
            });


            await loadDiagnosis();

        } catch (error) {

            console.error(
                "Error updating diagnosis:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to update diagnosis."
            );

        } finally {

            setSavingDiagnosis(false);
        }
    };


    // ========================================
    // MEDICINE FORM CHANGE
    // ========================================

    const handleMedicineChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setMedicineForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ========================================
    // ADD MEDICINE
    // ========================================

    const handleAddMedicine = async (e) => {

        e.preventDefault();


        if (!diagnosis?.id) {

            alert(
                "Please add diagnosis first."
            );

            return;
        }


        try {

            setSavingMedicine(true);


            const data = {

                medicineName:
                    medicineForm.medicineName,

                dosage:
                    medicineForm.dosage,

                frequency:
                    medicineForm.frequency,

                instructions:
                    medicineForm.instructions,

                durationDays:
                    medicineForm.durationDays
                        ? Number(
                            medicineForm.durationDays
                        )
                        : null
            };


            await addMedicine(
                diagnosis.id,
                data
            );


            alert(
                "Medicine added successfully."
            );


            setMedicineForm({
                medicineName: "",
                dosage: "",
                frequency: "",
                instructions: "",
                durationDays: ""
            });


            setShowMedicineForm(false);


            await loadDiagnosis();

        } catch (error) {

            console.error(
                "Error adding medicine:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to add medicine."
            );

        } finally {

            setSavingMedicine(false);
        }
    };


    // ========================================
    // START UPDATE MEDICINE
    // ========================================

    const handleStartUpdateMedicine = (medicine) => {

        setMedicineForm({

            medicineName:
                medicine.medicineName || "",

            dosage:
                medicine.dosage || "",

            frequency:
                medicine.frequency || "",

            instructions:
                medicine.instructions || "",

            durationDays:
                medicine.durationDays || ""
        });


        setEditingMedicineId(
            medicine.id
        );

        setShowMedicineForm(false);
    };


    // ========================================
    // UPDATE MEDICINE
    // ========================================

    const handleUpdateMedicine = async (e) => {

        e.preventDefault();


        if (!editingMedicineId) {

            alert(
                "Medicine ID not found."
            );

            return;
        }


        try {

            setSavingMedicine(true);


            const data = {

                medicineName:
                    medicineForm.medicineName,

                dosage:
                    medicineForm.dosage,

                frequency:
                    medicineForm.frequency,

                instructions:
                    medicineForm.instructions,

                durationDays:
                    medicineForm.durationDays
                        ? Number(
                            medicineForm.durationDays
                        )
                        : null
            };


            await updateMedicine(
                editingMedicineId,
                data
            );


            alert(
                "Medicine updated successfully."
            );


            setEditingMedicineId(null);


            setMedicineForm({
                medicineName: "",
                dosage: "",
                frequency: "",
                instructions: "",
                durationDays: ""
            });


            await loadDiagnosis();

        } catch (error) {

            console.error(
                "Error updating medicine:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to update medicine."
            );

        } finally {

            setSavingMedicine(false);
        }
    };


    // ========================================
    // CANCEL FORMS
    // ========================================

    const cancelDiagnosisForm = () => {

        setShowDiagnosisForm(false);
        setEditingDiagnosis(false);

        setDiagnosisForm({
            discription: "",
            prescription: ""
        });
    };


    const cancelMedicineForm = () => {

        setShowMedicineForm(false);
        setEditingMedicineId(null);

        setMedicineForm({
            medicineName: "",
            dosage: "",
            frequency: "",
            instructions: "",
            durationDays: ""
        });
    };


    // ========================================
    // START EDIT TASK
    // ========================================

    const handleStartEditTask = (task) => {

        console.log(
            "Editing task:",
            task
        );


        setEditingTask(task);


        setTaskUpdateForm({

            status:
                task.status || "PENDING",

            result:
                task.result || ""
        });
    };


    // ========================================
    // TASK UPDATE FORM CHANGE
    // ========================================

    const handleTaskUpdateChange = (e) => {

        const {
            name,
            value
        } = e.target;


        setTaskUpdateForm(
            previous => ({
                ...previous,
                [name]: value
            })
        );
    };


    // ========================================
    // UPDATE TASK
    // ========================================

    const handleUpdateTask = async (e) => {

        e.preventDefault();


        if (!editingTask?.id) {

            alert(
                "Task ID not found."
            );

            return;
        }


        try {

            setUpdatingTask(true);


            const data = {

                status:
                    taskUpdateForm.status,

                result:
                    taskUpdateForm.result
            };


            console.log(
                "Updating task:",
                editingTask.id,
                data
            );


            const response =
                await updateTask(
                    editingTask.id,
                    data
                );


            console.log(
                "Task updated:",
                response
            );


            alert(
                "Task updated successfully."
            );


            setEditingTask(null);


            setTaskUpdateForm({
                status: "PENDING",
                result: ""
            });


            await loadTasks();

        } catch (error) {

            console.error(
                "Error updating task:",
                error
            );


            console.error(
                "Backend response:",
                error?.response?.data
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to update task."
            );

        } finally {

            setUpdatingTask(false);
        }
    };


    // ========================================
    // CANCEL TASK EDIT
    // ========================================

    const handleCancelTaskEdit = () => {

        setEditingTask(null);


        setTaskUpdateForm({
            status: "PENDING",
            result: ""
        });
    };


    // ========================================
    // DELETE TASK
    // ========================================

    const handleDeleteTask = async (task) => {

        console.log(
            "Task selected for deletion:",
            task
        );


        if (!task?.id) {

            alert(
                "Task ID not found."
            );

            return;
        }


        /*
         * Your backend response is:
         *
         * {
         *     id: 3,
         *     userId: 6,
         *     userName: "RSB",
         *     ...
         * }
         */

        const userId =
            task.userId ||
            task.user?.id;


        if (!userId) {

            alert(
                "User ID is missing for this task."
            );

            console.error(
                "Task does not contain userId:",
                task
            );

            return;
        }


        const confirmDelete =
            window.confirm(
                `Are you sure you want to remove "${task.taskName}"?`
            );


        if (!confirmDelete) {
            return;
        }


        try {

            setDeletingTaskId(
                task.id
            );


            console.log(
                "Deleting task:",
                {
                    taskId: task.id,
                    userId: userId
                }
            );


            await deleteTask(
                task.id,
                userId
            );


            alert(
                "Task removed successfully."
            );


            await loadTasks();

        } catch (error) {

            console.error(
                "Error deleting task:",
                error
            );


            console.error(
                "Delete backend response:",
                error?.response?.data
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to remove task."
            );

        } finally {

            setDeletingTaskId(null);
        }
    };


    // ========================================
    // TASK STATUS BADGE
    // ========================================

    const getTaskStatusBadge = (status) => {

        switch (status) {

            case "COMPLETED":

                return (
                    <span className="badge bg-success">
                        COMPLETED
                    </span>
                );


            case "IN_PROGRESS":

                return (
                    <span className="badge bg-warning text-dark">
                        IN PROGRESS
                    </span>
                );


            case "PENDING":

                return (
                    <span className="badge bg-secondary">
                        PENDING
                    </span>
                );


            default:

                return (
                    <span className="badge bg-dark">
                        {status || "UNKNOWN"}
                    </span>
                );
        }
    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="container py-4">


            {/* ========================================
                HEADER
            ======================================== */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <h2>
                    Appointment Details
                </h2>


                <div className="d-flex gap-2">

                    <button
                        className="btn btn-primary"
                        onClick={() =>
                            navigate(
                                `/doctor/appointments/${appointment.id}/add-task`,
                                {
                                    state: {
                                        appointment
                                    }
                                }
                            )
                        }
                    >
                        + Add Task
                    </button>


                    <button
                        className="btn btn-secondary"
                        onClick={() => navigate(-1)}
                    >
                        ← Back
                    </button>

                </div>

            </div>


            {/* ========================================
                PATIENT INFORMATION
            ======================================== */}

            <div className="card shadow-sm mb-4">

                <div className="card-header">

                    <h5 className="mb-0">
                        Patient Information
                    </h5>

                </div>


                <div className="card-body">

                    <p>

                        <strong>
                            Patient:
                        </strong>{" "}

                        {
                            appointment?.patient?.user?.name ||
                            appointment?.patientName ||
                            "-"
                        }

                    </p>


                    <p>

                        <strong>
                            Email:
                        </strong>{" "}

                        {
                            appointment?.patient?.user?.email ||
                            appointment?.email ||
                            "-"
                        }

                    </p>

                </div>

            </div>


            {/* ========================================
                APPOINTMENT
            ======================================== */}

            <div className="card shadow-sm mb-4">

                <div className="card-header">

                    <h5 className="mb-0">
                        Appointment
                    </h5>

                </div>


                <div className="card-body">

                    <p>

                        <strong>
                            Appointment ID:
                        </strong>{" "}

                        {appointment.id}

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


                    <p>

                        <strong>
                            Type:
                        </strong>{" "}

                        {appointment.appointmentType}

                    </p>

                </div>

            </div>


            {/* ========================================
                TASKS
            ======================================== */}

            <div className="card shadow-sm mb-4">

                <div className="card-header d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">
                        Tasks
                    </h5>


                    <div className="d-flex gap-2">

                        <button
                            className="btn btn-outline-secondary btn-sm"
                            onClick={loadTasks}
                            disabled={loadingTasks}
                        >

                            {loadingTasks
                                ? "Refreshing..."
                                : "↻ Refresh"}

                        </button>


                        <button
                            className="btn btn-primary btn-sm"
                            onClick={() =>
                                navigate(
                                    `/doctor/appointments/${appointment.id}/add-task`,
                                    {
                                        state: {
                                            appointment
                                        }
                                    }
                                )
                            }
                        >
                            + Add Task
                        </button>

                    </div>

                </div>


                <div className="card-body">

                    {loadingTasks && (

                        <div className="text-muted">
                            Loading tasks...
                        </div>

                    )}


                    {!loadingTasks &&
                        taskError && (

                            <div className="alert alert-danger">

                                {taskError}

                            </div>

                        )}


                    {!loadingTasks &&
                        !taskError &&
                        tasks.length === 0 && (

                            <div className="text-center py-4">

                                <p className="text-muted mb-3">

                                    No tasks have been created
                                    for this appointment.

                                </p>


                                <button
                                    className="btn btn-primary"
                                    onClick={() =>
                                        navigate(
                                            `/doctor/appointments/${appointment.id}/add-task`,
                                            {
                                                state: {
                                                    appointment
                                                }
                                            }
                                        )
                                    }
                                >
                                    + Create First Task
                                </button>

                            </div>

                        )}


                    {!loadingTasks &&
                        !taskError &&
                        tasks.length > 0 && (

                            <div className="table-responsive">

                                <table className="table table-bordered table-hover align-middle">

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
                                                Assigned Employee
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

                                        {tasks.map(
                                            (task, index) => (

                                                <tr
                                                    key={task.id}
                                                >

                                                    {/* NUMBER */}

                                                    <td>
                                                        {index + 1}
                                                    </td>


                                                    {/* TASK */}

                                                    <td>

                                                        <strong>
                                                            {
                                                                task.taskName ||
                                                                "-"
                                                            }
                                                        </strong>

                                                    </td>


                                                    {/* SERVICE */}

                                                    <td>

                                                        {
                                                            task.serviceName ||
                                                            task.services?.serviceName ||
                                                            task.services?.name ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* EMPLOYEE */}

                                                    <td>

                                                        {
                                                            task.userName ||
                                                            task.assignedUserName ||
                                                            task.user?.name ||
                                                            "-"
                                                        }

                                                    </td>


                                                    {/* STATUS */}

                                                    <td>

                                                        {getTaskStatusBadge(
                                                            task.status
                                                        )}

                                                    </td>


                                                    {/* RESULT */}

                                                    <td>

                                                        {task.result

                                                            ? (
                                                                <span>
                                                                    {task.result}
                                                                </span>
                                                            )

                                                            : (
                                                                <span className="text-muted">
                                                                    Not completed yet
                                                                </span>
                                                            )}

                                                    </td>


                                                    {/* ACTION */}

                                                    <td>

                                                        <div className="d-flex gap-2">

                                                            {/* EDIT */}

                                                            <button
                                                                type="button"
                                                                className="btn btn-warning btn-sm"
                                                                title="Update Task"
                                                                onClick={() =>
                                                                    handleStartEditTask(
                                                                        task
                                                                    )
                                                                }
                                                            >
                                                                ✏ Edit
                                                            </button>


                                                            {/* DELETE */}

                                                            <button
                                                                type="button"
                                                                className="btn btn-danger btn-sm"
                                                                title="Remove Task"
                                                                disabled={
                                                                    deletingTaskId ===
                                                                    task.id
                                                                }
                                                                onClick={() =>
                                                                    handleDeleteTask(
                                                                        task
                                                                    )
                                                                }
                                                            >

                                                                {deletingTaskId ===
                                                                    task.id

                                                                    ? (
                                                                        <>
                                                                            <span
                                                                                className="spinner-border spinner-border-sm me-1"
                                                                            />

                                                                            Removing...
                                                                        </>
                                                                    )

                                                                    : (
                                                                        <>
                                                                            🗑 Remove
                                                                        </>
                                                                    )}

                                                            </button>

                                                        </div>

                                                    </td>

                                                </tr>

                                            )
                                        )}

                                    </tbody>

                                </table>

                            </div>

                        )}

                </div>

            </div>


            {/* ========================================
                UPDATE TASK FORM
            ======================================== */}

            {editingTask && (

                <div className="card shadow-sm mb-4 border-warning">

                    <div className="card-header bg-warning">

                        <h5 className="mb-0">

                            Update Task

                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="row mb-3">

                            <div className="col-md-6">

                                <label className="form-label">
                                    Task Name
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        editingTask.taskName || ""
                                    }
                                    disabled
                                />

                            </div>


                            <div className="col-md-6">

                                <label className="form-label">
                                    Service
                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        editingTask.serviceName ||
                                        "-"
                                    }
                                    disabled
                                />

                            </div>

                        </div>


                        <div className="row mb-3">

                            <div className="col-md-6">

                                <label className="form-label">

                                    Assigned Employee

                                </label>

                                <input
                                    type="text"
                                    className="form-control"
                                    value={
                                        editingTask.userName ||
                                        editingTask.assignedUserName ||
                                        "-"
                                    }
                                    disabled
                                />

                            </div>


                            <div className="col-md-6">

                                <label className="form-label">

                                    Status

                                </label>


                                <select
                                    className="form-select"
                                    name="status"
                                    value={
                                        taskUpdateForm.status
                                    }
                                    onChange={
                                        handleTaskUpdateChange
                                    }
                                    disabled={
                                        updatingTask
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

                        </div>


                        <div className="mb-3">

                            <label className="form-label">

                                Result

                            </label>


                            <textarea
                                className="form-control"
                                name="result"
                                rows="4"
                                value={
                                    taskUpdateForm.result
                                }
                                onChange={
                                    handleTaskUpdateChange
                                }
                                placeholder="Enter task result"
                                disabled={
                                    updatingTask
                                }
                            />

                        </div>


                        <div className="alert alert-info">

                            <strong>
                                Note:
                            </strong>{" "}

                            The current backend task-update
                            API updates the task's
                            <strong> status </strong>
                            and
                            <strong> result</strong>.
                            Task name and service are
                            displayed as read-only.

                        </div>


                        <button
                            type="button"
                            className="btn btn-primary me-2"
                            onClick={
                                handleUpdateTask
                            }
                            disabled={
                                updatingTask
                            }
                        >

                            {updatingTask

                                ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        />

                                        Updating...
                                    </>
                                )

                                : "Update Task"}

                        </button>


                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={
                                handleCancelTaskEdit
                            }
                            disabled={
                                updatingTask
                            }
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            )}


            {/* ========================================
                DIAGNOSIS
            ======================================== */}

            <div className="card shadow-sm mb-4">

                <div className="card-header d-flex justify-content-between align-items-center">

                    <h5 className="mb-0">
                        Diagnosis
                    </h5>


                    <div>


                        {!diagnosis &&
                            !loadingDiagnosis && (

                                <button
                                    className="btn btn-primary btn-sm"
                                    onClick={() =>
                                        setShowDiagnosisForm(
                                            !showDiagnosisForm
                                        )
                                    }
                                >
                                    + Add Diagnosis
                                </button>

                            )}


                        {diagnosis && (

                            <button
                                className="btn btn-warning btn-sm"
                                onClick={
                                    handleStartUpdateDiagnosis
                                }
                            >
                                ✏ Update Diagnosis
                            </button>

                        )}

                    </div>

                </div>


                <div className="card-body">


                    {loadingDiagnosis && (

                        <div className="text-muted">
                            Loading diagnosis...
                        </div>

                    )}


                    {!loadingDiagnosis &&
                        diagnosisError && (

                            <div className="alert alert-danger">

                                {diagnosisError}

                            </div>

                        )}


                    {!loadingDiagnosis &&
                        !diagnosisError &&
                        !diagnosis && (

                            <p className="text-muted mb-0">

                                No diagnosis added yet.

                            </p>

                        )}


                    {/* ========================================
                        DIAGNOSIS DATA
                    ======================================== */}

                    {!loadingDiagnosis &&
                        diagnosis && (

                            <>

                                <div className="mb-3">

                                    <strong>
                                        Description:
                                    </strong>

                                    <p className="mt-1 mb-0">

                                        {
                                            diagnosis.discription ||
                                            "-"
                                        }

                                    </p>

                                </div>


                                <div className="mb-3">

                                    <strong>
                                        Prescription:
                                    </strong>

                                    <p className="mt-1 mb-0">

                                        {
                                            diagnosis.prescription ||
                                            "-"
                                        }

                                    </p>

                                </div>


                                <button
                                    className="btn btn-success btn-sm"
                                    onClick={() =>
                                        setShowMedicineForm(
                                            !showMedicineForm
                                        )
                                    }
                                >
                                    + Add Medicine
                                </button>

                            </>

                        )}

                </div>

            </div>


            {/* ========================================
                ADD / UPDATE DIAGNOSIS FORM
            ======================================== */}

            {(showDiagnosisForm ||
                editingDiagnosis) && (

                    <div className="card shadow-sm mb-4">

                        <div className="card-header">

                            <h5 className="mb-0">

                                {editingDiagnosis
                                    ? "Update Diagnosis"
                                    : "Add Diagnosis"}

                            </h5>

                        </div>


                        <div className="card-body">

                            <form
                                onSubmit={
                                    editingDiagnosis
                                        ? handleUpdateDiagnosis
                                        : handleAddDiagnosis
                                }
                            >


                                {/* Description */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Description

                                    </label>


                                    <textarea
                                        className="form-control"
                                        name="discription"
                                        rows="4"
                                        value={
                                            diagnosisForm.discription
                                        }
                                        onChange={
                                            handleDiagnosisChange
                                        }
                                        placeholder="Enter diagnosis description"
                                        required
                                    />

                                </div>


                                {/* Prescription */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Prescription

                                    </label>


                                    <textarea
                                        className="form-control"
                                        name="prescription"
                                        rows="4"
                                        value={
                                            diagnosisForm.prescription
                                        }
                                        onChange={
                                            handleDiagnosisChange
                                        }
                                        placeholder="Enter prescription"
                                    />

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-primary me-2"
                                    disabled={
                                        savingDiagnosis
                                    }
                                >

                                    {savingDiagnosis

                                        ? "Saving..."

                                        : editingDiagnosis
                                            ? "Update Diagnosis"
                                            : "Save Diagnosis"

                                    }

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        cancelDiagnosisForm
                                    }
                                >
                                    Cancel
                                </button>

                            </form>

                        </div>

                    </div>

                )}


            {/* ========================================
                ADD / UPDATE MEDICINE FORM
            ======================================== */}

            {(showMedicineForm ||
                editingMedicineId) &&
                diagnosis && (

                    <div className="card shadow-sm mb-4">

                        <div className="card-header">

                            <h5 className="mb-0">

                                {editingMedicineId
                                    ? "Update Medicine"
                                    : "Add Medicine"}

                            </h5>

                        </div>


                        <div className="card-body">

                            <form
                                onSubmit={
                                    editingMedicineId
                                        ? handleUpdateMedicine
                                        : handleAddMedicine
                                }
                            >


                                {/* Medicine Name */}

                                <div className="mb-3">

                                    <label className="form-label">

                                        Medicine Name

                                    </label>


                                    <input
                                        type="text"
                                        className="form-control"
                                        name="medicineName"
                                        value={
                                            medicineForm.medicineName
                                        }
                                        onChange={
                                            handleMedicineChange
                                        }
                                        placeholder="e.g. Paracetamol"
                                        required
                                    />

                                </div>


                                <div className="row">


                                    {/* Dosage */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Dosage

                                        </label>


                                        <input
                                            type="text"
                                            className="form-control"
                                            name="dosage"
                                            value={
                                                medicineForm.dosage
                                            }
                                            onChange={
                                                handleMedicineChange
                                            }
                                            placeholder="e.g. 500mg"
                                            required
                                        />

                                    </div>


                                    {/* Frequency */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Frequency

                                        </label>


                                        <input
                                            type="text"
                                            className="form-control"
                                            name="frequency"
                                            value={
                                                medicineForm.frequency
                                            }
                                            onChange={
                                                handleMedicineChange
                                            }
                                            placeholder="e.g. Twice a day"
                                            required
                                        />

                                    </div>

                                </div>


                                <div className="row">


                                    {/* Duration */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Duration (Days)

                                        </label>


                                        <input
                                            type="number"
                                            className="form-control"
                                            name="durationDays"
                                            min="1"
                                            value={
                                                medicineForm.durationDays
                                            }
                                            onChange={
                                                handleMedicineChange
                                            }
                                            placeholder="e.g. 5"
                                        />

                                    </div>


                                    {/* Instructions */}

                                    <div className="col-md-6 mb-3">

                                        <label className="form-label">

                                            Instructions

                                        </label>


                                        <input
                                            type="text"
                                            className="form-control"
                                            name="instructions"
                                            value={
                                                medicineForm.instructions
                                            }
                                            onChange={
                                                handleMedicineChange
                                            }
                                            placeholder="e.g. After food"
                                        />

                                    </div>

                                </div>


                                <button
                                    type="submit"
                                    className="btn btn-success me-2"
                                    disabled={
                                        savingMedicine
                                    }
                                >

                                    {savingMedicine

                                        ? "Saving..."

                                        : editingMedicineId
                                            ? "Update Medicine"
                                            : "Save Medicine"

                                    }

                                </button>


                                <button
                                    type="button"
                                    className="btn btn-secondary"
                                    onClick={
                                        cancelMedicineForm
                                    }
                                >

                                    Cancel

                                </button>

                            </form>

                        </div>

                    </div>

                )}


            {/* ========================================
                MEDICINES
            ======================================== */}

            {!loadingDiagnosis &&
                diagnosis && (

                    <div className="card shadow-sm mb-4">

                        <div className="card-header">

                            <h5 className="mb-0">
                                Prescribed Medicines
                            </h5>

                        </div>


                        <div className="card-body">


                            {medicines.length === 0 ? (

                                <p className="text-muted mb-0">

                                    No medicines prescribed yet.

                                </p>

                            ) : (

                                <div className="table-responsive">

                                    <table className="table table-bordered table-hover">

                                        <thead>

                                            <tr>

                                                <th>
                                                    Medicine
                                                </th>

                                                <th>
                                                    Dosage
                                                </th>

                                                <th>
                                                    Frequency
                                                </th>

                                                <th>
                                                    Duration
                                                </th>

                                                <th>
                                                    Instructions
                                                </th>

                                                <th>
                                                    Action
                                                </th>

                                            </tr>

                                        </thead>


                                        <tbody>

                                            {medicines.map(
                                                (medicine) => (

                                                    <tr
                                                        key={
                                                            medicine.id
                                                        }
                                                    >

                                                        <td>
                                                            {
                                                                medicine.medicineName
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                medicine.dosage ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                medicine.frequency ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                medicine.durationDays
                                                                    ? `${medicine.durationDays} days`
                                                                    : "-"
                                                            }
                                                        </td>


                                                        <td>
                                                            {
                                                                medicine.instructions ||
                                                                "-"
                                                            }
                                                        </td>


                                                        <td>

                                                            <button
                                                                className="btn btn-warning btn-sm"
                                                                onClick={() =>
                                                                    handleStartUpdateMedicine(
                                                                        medicine
                                                                    )
                                                                }
                                                            >
                                                                ✏ Update
                                                            </button>

                                                        </td>

                                                    </tr>

                                                )
                                            )}

                                        </tbody>

                                    </table>

                                </div>

                            )}

                        </div>

                    </div>

                )}

        </div>
    );
};


export default DoctorAppointmentDetails;