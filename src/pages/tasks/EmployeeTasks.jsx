import { useEffect, useState } from "react";

import {
    getEmployeeTasks,
    updateEmployeeTask,
} from "../../services/taskService";

import {
    getServiceInventories,
    updateInventoryStock,
    addPatientToInventory,
    removePatientFromInventory,
} from "../../services/departmentService";


const EmployeeTasks = () => {

    // =====================================================
    // TASK STATE
    // =====================================================

    const [tasks, setTasks] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");

    const [savingId, setSavingId] = useState(null);


    // =====================================================
    // INVENTORY STATE
    // =====================================================

    const [inventoryMap, setInventoryMap] = useState({});

    const [inventoryLoading, setInventoryLoading] = useState({});

    const [inventoryError, setInventoryError] = useState({});

    const [stockValues, setStockValues] = useState({});

    const [patientValues, setPatientValues] = useState({});

    const [inventorySavingId, setInventorySavingId] = useState(null);


    // =====================================================
    // LOGGED-IN USER
    // =====================================================

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const userId =
        user?.userId ||
        user?.id ||
        user?.userID;


    console.log("Employee User:", user);

    console.log("Employee User ID:", userId);


    // =====================================================
    // GET SERVICE ID FROM TASK
    // =====================================================

    const getServiceId = (task) => {

        return (
            task?.serviceId ||
            task?.serviceID ||
            task?.service?.id ||
            task?.service?.serviceId ||
            null
        );
    };


    // =====================================================
    // GET SERVICE NAME
    // =====================================================

    const getServiceName = (task) => {

        return (
            task?.serviceName ||
            task?.service?.serviceName ||
            "Service"
        );
    };


    // =====================================================
    // LOAD EMPLOYEE TASKS
    // =====================================================

    const loadTasks = async () => {

        if (!userId) {

            setError(
                "User ID not found. Please login again."
            );

            setLoading(false);

            return;
        }


        try {

            setLoading(true);

            setError("");


            const response =
                await getEmployeeTasks(userId);


            console.log(
                "Employee tasks response:",
                response
            );


            let taskList = [];

            if (Array.isArray(response)) {

                taskList = response;

            } else if (
                Array.isArray(response?.data)
            ) {

                taskList = response.data;

            } else if (
                Array.isArray(response?.tasks)
            ) {

                taskList = response.tasks;

            }


            setTasks(taskList);


            // Load inventories for tasks
            // which contain serviceId.
            await loadInventoriesForTasks(taskList);


        } catch (error) {

            console.error(
                "Error loading employee tasks:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to load tasks."
            );

        } finally {

            setLoading(false);

        }

    };


    // =====================================================
    // LOAD INVENTORIES FOR ALL SERVICES
    // =====================================================

    const loadInventoriesForTasks = async (
        taskList
    ) => {

        const uniqueServiceIds = [
            ...new Set(
                taskList
                    .map(task => getServiceId(task))
                    .filter(id => id !== null)
            )
        ];


        console.log(
            "Service IDs found in tasks:",
            uniqueServiceIds
        );


        for (
            const serviceId of uniqueServiceIds
        ) {

            await loadServiceInventory(
                serviceId
            );

        }

    };


    // =====================================================
    // LOAD INVENTORY FOR SERVICE
    // =====================================================

    const loadServiceInventory = async (
        serviceId
    ) => {

        if (!serviceId) {
            return;
        }


        try {

            setInventoryLoading(
                previous => ({
                    ...previous,
                    [serviceId]: true
                })
            );


            setInventoryError(
                previous => ({
                    ...previous,
                    [serviceId]: ""
                })
            );


            console.log(
                "Loading inventory for service:",
                serviceId
            );


            const response =
                await getServiceInventories(
                    serviceId
                );


            console.log(
                "Service inventory response:",
                serviceId,
                response
            );


            let inventoryList = [];

            if (Array.isArray(response)) {

                inventoryList = response;

            } else if (
                Array.isArray(response?.data)
            ) {

                inventoryList = response.data;

            } else if (
                Array.isArray(response?.inventories)
            ) {

                inventoryList =
                    response.inventories;

            }


            setInventoryMap(
                previous => ({
                    ...previous,
                    [serviceId]: inventoryList
                })
            );


            // Initialize stock input values
            const stockState = {};

            inventoryList.forEach(
                inventory => {

                    const inventoryId =
                        inventory?.id ||
                        inventory?.inventoryId;

                    if (inventoryId) {

                        stockState[inventoryId] =
                            inventory?.stock ?? 0;

                    }

                }
            );


            setStockValues(
                previous => ({
                    ...previous,
                    ...stockState
                })
            );


        } catch (error) {

            console.error(
                "Inventory loading error:",
                error
            );


            setInventoryError(
                previous => ({
                    ...previous,
                    [serviceId]:
                        error?.response?.data?.message ||
                        error?.response?.data ||
                        "Unable to load inventory."
                })
            );

        } finally {

            setInventoryLoading(
                previous => ({
                    ...previous,
                    [serviceId]: false
                })
            );

        }

    };


    // =====================================================
    // LOAD ON PAGE OPEN
    // =====================================================

    useEffect(() => {

        loadTasks();

    }, []);


    // =====================================================
    // CHANGE TASK STATUS
    // =====================================================

    const handleStatusChange = (
        taskId,
        status
    ) => {

        setTasks(previousTasks =>

            previousTasks.map(task =>

                task.id === taskId

                    ? {
                        ...task,
                        status: status
                    }

                    : task

            )

        );

    };


    // =====================================================
    // CHANGE TASK RESULT
    // =====================================================

    const handleResultChange = (
        taskId,
        result
    ) => {

        setTasks(previousTasks =>

            previousTasks.map(task =>

                task.id === taskId

                    ? {
                        ...task,
                        result: result
                    }

                    : task

            )

        );

    };


    // =====================================================
    // SAVE TASK
    // =====================================================

    const handleSave = async (task) => {

        try {

            setSavingId(task.id);


            console.log(
                "Updating employee task:",
                task.id
            );


            const response =
                await updateEmployeeTask(
                    task.id,
                    {
                        status:
                            task.status,

                        result:
                            task.result || ""
                    }
                );


            console.log(
                "Task updated:",
                response
            );


            alert(
                "Task updated successfully."
            );


            await loadTasks();


        } catch (error) {

            console.error(
                "Update task error:",
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

            setSavingId(null);

        }

    };


    // =====================================================
    // STOCK INPUT
    // =====================================================

    const handleStockChange = (
        inventoryId,
        value
    ) => {

        setStockValues(
            previous => ({
                ...previous,
                [inventoryId]: value
            })
        );

    };


    // =====================================================
    // PATIENT INPUT
    // =====================================================

    const handlePatientChange = (
        inventoryId,
        value
    ) => {

        setPatientValues(
            previous => ({
                ...previous,
                [inventoryId]: value
            })
        );

    };


    // =====================================================
    // UPDATE STOCK
    // =====================================================

    const handleUpdateStock = async (
        inventory,
        serviceId
    ) => {

        const inventoryId =
            inventory?.id ||
            inventory?.inventoryId;


        if (!inventoryId) {

            alert(
                "Inventory ID not found."
            );

            return;
        }


        const newStock =
            Number(
                stockValues[inventoryId]
            );


        if (
            Number.isNaN(newStock) ||
            newStock < 0
        ) {

            alert(
                "Please enter a valid stock value."
            );

            return;
        }


        try {

            setInventorySavingId(
                `stock-${inventoryId}`
            );


            console.log(
                "Updating inventory stock:",
                {
                    inventoryId,
                    newStock
                }
            );


            await updateInventoryStock(
                inventoryId,
                newStock
            );


            alert(
                "Inventory stock updated successfully."
            );


            await loadServiceInventory(
                serviceId
            );


        } catch (error) {

            console.error(
                "Stock update error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to update stock."
            );

        } finally {

            setInventorySavingId(null);

        }

    };


    // =====================================================
    // ASSIGN PATIENT
    // =====================================================

    const handleAssignPatient = async (
        inventory,
        serviceId
    ) => {

        const inventoryId =
            inventory?.id ||
            inventory?.inventoryId;


        const patientId =
            Number(
                patientValues[inventoryId]
            );


        if (!inventoryId) {

            alert(
                "Inventory ID not found."
            );

            return;
        }


        if (
            !patientId ||
            patientId <= 0
        ) {

            alert(
                "Please enter a valid patient ID."
            );

            return;
        }


        try {

            setInventorySavingId(
                `patient-${inventoryId}`
            );


            console.log(
                "Assigning patient:",
                {
                    inventoryId,
                    patientId
                }
            );


            await addPatientToInventory(
                inventoryId,
                patientId
            );


            alert(
                "Patient assigned successfully."
            );


            setPatientValues(
                previous => ({
                    ...previous,
                    [inventoryId]: ""
                })
            );


            await loadServiceInventory(
                serviceId
            );


        } catch (error) {

            console.error(
                "Assign patient error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to assign patient."
            );

        } finally {

            setInventorySavingId(null);

        }

    };


    // =====================================================
    // REMOVE PATIENT
    // =====================================================

    const handleRemovePatient = async (
        inventory,
        serviceId
    ) => {

        const inventoryId =
            inventory?.id ||
            inventory?.inventoryId;


        if (!inventoryId) {

            alert(
                "Inventory ID not found."
            );

            return;
        }


        const confirmRemove =
            window.confirm(
                "Are you sure you want to remove the patient from this inventory?"
            );


        if (!confirmRemove) {
            return;
        }


        try {

            setInventorySavingId(
                `remove-${inventoryId}`
            );


            console.log(
                "Removing patient from inventory:",
                inventoryId
            );


            await removePatientFromInventory(
                inventoryId
            );


            alert(
                "Patient removed successfully."
            );


            await loadServiceInventory(
                serviceId
            );


        } catch (error) {

            console.error(
                "Remove patient error:",
                error
            );


            alert(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to remove patient."
            );

        } finally {

            setInventorySavingId(null);

        }

    };


    // =====================================================
    // STATUS BADGE
    // =====================================================

    const statusBadge = (status) => {

        if (status === "COMPLETED") {

            return (
                <span className="badge bg-success rounded-pill px-3 py-2">
                    COMPLETED
                </span>
            );

        }


        if (status === "IN_PROGRESS") {

            return (
                <span className="badge bg-warning text-dark rounded-pill px-3 py-2">
                    IN PROGRESS
                </span>
            );

        }


        return (
            <span className="badge bg-secondary rounded-pill px-3 py-2">
                PENDING
            </span>
        );

    };


    // =====================================================
    // INVENTORY CARD
    // =====================================================

    const renderInventory = (
        serviceId
    ) => {

        const inventories =
            inventoryMap[serviceId] || [];


        if (
            inventoryLoading[serviceId]
        ) {

            return (
                <div className="text-center py-4">

                    <div
                        className="spinner-border text-primary"
                        role="status"
                    />

                    <div className="text-muted mt-2">
                        Loading inventory...
                    </div>

                </div>
            );

        }


        if (
            inventoryError[serviceId]
        ) {

            return (
                <div className="alert alert-danger mb-0">

                    {inventoryError[serviceId]}

                </div>
            );

        }


        if (
            inventories.length === 0
        ) {

            return (
                <div className="alert alert-info mb-0">

                    No inventory found
                    for this service.

                </div>
            );

        }


        return (

            <div className="table-responsive">

                <table className="table table-bordered table-hover align-middle mb-0">

                    <thead className="table-light">

                        <tr>

                            <th>
                                Inventory
                            </th>

                            <th>
                                Stock
                            </th>

                            <th>
                                Patient
                            </th>

                            <th>
                                Update Stock
                            </th>

                            <th>
                                Patient Action
                            </th>

                        </tr>

                    </thead>


                    <tbody>

                        {inventories.map(
                            inventory => {

                                const inventoryId =
                                    inventory?.id ||
                                    inventory?.inventoryId;


                                const patient =
                                    inventory?.patient ||
                                    inventory?.patientName ||
                                    inventory?.patientId;


                                return (

                                    <tr
                                        key={
                                            inventoryId
                                        }
                                    >

                                        {/* INVENTORY */}

                                        <td>

                                            <div className="fw-semibold">

                                                {inventory?.inventoryName ||
                                                    inventory?.name ||
                                                    inventory?.itemName ||
                                                    `Inventory #${inventoryId}`}

                                            </div>

                                            {inventory?.description && (

                                                <small className="text-muted">

                                                    {
                                                        inventory.description
                                                    }

                                                </small>

                                            )}

                                        </td>


                                        {/* CURRENT STOCK */}

                                        <td>

                                            <span className="badge bg-primary">

                                                {inventory?.stock ??
                                                    inventory?.quantity ??
                                                    0}

                                            </span>

                                        </td>


                                        {/* PATIENT */}

                                        <td>

                                            {patient ? (

                                                <div>

                                                    <div className="fw-semibold">

                                                        {typeof patient ===
                                                            "object"

                                                            ? (
                                                                patient?.name ||
                                                                patient?.userName ||
                                                                `Patient #${patient?.id}`
                                                            )

                                                            : patient
                                                        }

                                                    </div>

                                                </div>

                                            ) : (

                                                <span className="text-muted">

                                                    No patient assigned

                                                </span>

                                            )}

                                        </td>


                                        {/* UPDATE STOCK */}

                                        <td>

                                            <div className="d-flex flex-column flex-lg-row gap-2">

                                                <input
                                                    type="number"
                                                    min="0"
                                                    className="form-control"
                                                    style={{
                                                        minWidth: "100px"
                                                    }}
                                                    value={
                                                        stockValues[
                                                            inventoryId
                                                        ] ?? ""
                                                    }
                                                    onChange={e =>
                                                        handleStockChange(
                                                            inventoryId,
                                                            e.target.value
                                                        )
                                                    }
                                                />

                                                <button
                                                    type="button"
                                                    className="btn btn-primary text-nowrap"
                                                    disabled={
                                                        inventorySavingId ===
                                                        `stock-${inventoryId}`
                                                    }
                                                    onClick={() =>
                                                        handleUpdateStock(
                                                            inventory,
                                                            serviceId
                                                        )
                                                    }
                                                >

                                                    {inventorySavingId ===
                                                    `stock-${inventoryId}` ? (

                                                        <span
                                                            className="spinner-border spinner-border-sm"
                                                        />

                                                    ) : (

                                                        "Update"

                                                    )}

                                                </button>

                                            </div>

                                        </td>


                                        {/* PATIENT ACTION */}

                                        <td>

                                            <div className="d-flex flex-column gap-2">

                                                <input
                                                    type="number"
                                                    min="1"
                                                    className="form-control"
                                                    placeholder="Patient ID"
                                                    value={
                                                        patientValues[
                                                            inventoryId
                                                        ] ?? ""
                                                    }
                                                    onChange={e =>
                                                        handlePatientChange(
                                                            inventoryId,
                                                            e.target.value
                                                        )
                                                    }
                                                />


                                                <div className="d-flex flex-wrap gap-2">

                                                    <button
                                                        type="button"
                                                        className="btn btn-success btn-sm"
                                                        disabled={
                                                            inventorySavingId ===
                                                            `patient-${inventoryId}`
                                                        }
                                                        onClick={() =>
                                                            handleAssignPatient(
                                                                inventory,
                                                                serviceId
                                                            )
                                                        }
                                                    >

                                                        {inventorySavingId ===
                                                        `patient-${inventoryId}` ? (

                                                            <span
                                                                className="spinner-border spinner-border-sm"
                                                            />

                                                        ) : (

                                                            "Assign Patient"

                                                        )}

                                                    </button>


                                                    {patient && (

                                                        <button
                                                            type="button"
                                                            className="btn btn-outline-danger btn-sm"
                                                            disabled={
                                                                inventorySavingId ===
                                                                `remove-${inventoryId}`
                                                            }
                                                            onClick={() =>
                                                                handleRemovePatient(
                                                                    inventory,
                                                                    serviceId
                                                                )
                                                            }
                                                        >

                                                            {inventorySavingId ===
                                                            `remove-${inventoryId}` ? (

                                                                <span
                                                                    className="spinner-border spinner-border-sm"
                                                                />

                                                            ) : (

                                                                "Remove Patient"

                                                            )}

                                                        </button>

                                                    )}

                                                </div>

                                            </div>

                                        </td>

                                    </tr>

                                );

                            }
                        )}

                    </tbody>

                </table>

            </div>

        );

    };


    // =====================================================
    // PAGE
    // =====================================================

    return (

        <div className="container-fluid py-3 py-md-4 px-2 px-sm-3 px-md-4">


            {/* =================================================
                HEADER
            ================================================= */}

            <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">

                <div>

                    <h2 className="fw-bold mb-1">
                        My Tasks
                    </h2>

                    <p className="text-muted mb-0">
                        Tasks and service inventory assigned to you
                    </p>

                </div>


                <button
                    type="button"
                    className="btn btn-outline-primary"
                    onClick={loadTasks}
                    disabled={loading}
                >

                    {loading ? (

                        <>
                            <span
                                className="spinner-border spinner-border-sm me-2"
                                role="status"
                            />

                            Loading...
                        </>

                    ) : (

                        <>
                            ↻ Refresh
                        </>

                    )}

                </button>

            </div>


            {/* =================================================
                ERROR
            ================================================= */}

            {error && (

                <div
                    className="alert alert-danger"
                    role="alert"
                >

                    <strong>Error:</strong>{" "}

                    {error}

                </div>

            )}


            {/* =================================================
                LOADING
            ================================================= */}

            {loading && (

                <div className="card border-0 shadow-sm">

                    <div className="card-body text-center py-5">

                        <div
                            className="spinner-border text-primary"
                            role="status"
                        />

                        <p className="text-muted mt-3 mb-0">
                            Loading your tasks...
                        </p>

                    </div>

                </div>

            )}


            {/* =================================================
                EMPTY
            ================================================= */}

            {!loading &&
                !error &&
                tasks.length === 0 && (

                    <div className="card border-0 shadow-sm">

                        <div className="card-body text-center py-5">

                            <div className="fs-1 mb-3">
                                📋
                            </div>

                            <h5 className="fw-bold">
                                No Tasks Assigned
                            </h5>

                            <p className="text-muted mb-0">
                                You currently don't have
                                any assigned tasks.
                            </p>

                        </div>

                    </div>

                )}


            {/* =================================================
                TASK LIST
            ================================================= */}

            {!loading &&
                !error &&
                tasks.length > 0 && (

                    <div className="d-flex flex-column gap-4">

                        {tasks.map(
                            (task, index) => {

                                const serviceId =
                                    getServiceId(task);


                                return (

                                    <div
                                        className="card border-0 shadow-sm"
                                        key={task.id}
                                    >

                                        {/* =================================
                                            TASK HEADER
                                        ================================= */}

                                        <div className="card-header bg-white p-3 p-md-4">

                                            <div className="row align-items-center g-3">

                                                <div className="col-12 col-md">

                                                    <div className="d-flex align-items-center gap-2 mb-1">

                                                        <span className="badge bg-light text-dark border">
                                                            #{task.id}
                                                        </span>

                                                        <small className="text-muted">
                                                            Task {index + 1}
                                                        </small>

                                                    </div>

                                                    <h5 className="fw-bold mb-0 text-break">
                                                        {task.taskName ||
                                                            "Untitled Task"}
                                                    </h5>

                                                </div>


                                                <div className="col-12 col-md-auto">

                                                    {statusBadge(
                                                        task.status
                                                    )}

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            TASK INFORMATION
                                        ================================= */}

                                        <div className="card-body p-3 p-md-4">

                                            <div className="row g-3">


                                                {/* SERVICE */}

                                                <div className="col-12 col-md-4">

                                                    <label className="form-label text-muted small fw-semibold">
                                                        Service
                                                    </label>

                                                    <div className="bg-light border rounded p-3">

                                                        <div className="fw-semibold text-break">

                                                            {getServiceName(
                                                                task
                                                            )}

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* APPOINTMENT */}

                                                <div className="col-12 col-md-4">

                                                    <label className="form-label text-muted small fw-semibold">
                                                        Appointment
                                                    </label>

                                                    <div className="bg-light border rounded p-3">

                                                        {task.appointmentId ? (

                                                            <div className="fw-semibold">

                                                                Appointment #
                                                                {
                                                                    task.appointmentId
                                                                }

                                                            </div>

                                                        ) : (

                                                            <div className="text-muted">

                                                                Direct Task

                                                            </div>

                                                        )}

                                                    </div>

                                                </div>


                                                {/* ASSIGNED EMPLOYEE */}

                                                <div className="col-12 col-md-4">

                                                    <label className="form-label text-muted small fw-semibold">
                                                        Assigned Employee
                                                    </label>

                                                    <div className="bg-light border rounded p-3">

                                                        <div className="fw-semibold text-break">

                                                            {
                                                                task.userName ||
                                                                "-"
                                                            }

                                                        </div>

                                                    </div>

                                                </div>


                                                {/* STATUS */}

                                                <div className="col-12 col-lg-4">

                                                    <label
                                                        htmlFor={`status-${task.id}`}
                                                        className="form-label fw-semibold"
                                                    >
                                                        Update Status
                                                    </label>

                                                    <select
                                                        id={`status-${task.id}`}
                                                        className="form-select"
                                                        value={
                                                            task.status ||
                                                            "PENDING"
                                                        }
                                                        onChange={e =>
                                                            handleStatusChange(
                                                                task.id,
                                                                e.target.value
                                                            )
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


                                                {/* RESULT */}

                                                <div className="col-12 col-lg-8">

                                                    <label
                                                        htmlFor={`result-${task.id}`}
                                                        className="form-label fw-semibold"
                                                    >
                                                        Result / Remarks
                                                    </label>

                                                    <textarea
                                                        id={`result-${task.id}`}
                                                        className="form-control"
                                                        rows="2"
                                                        value={
                                                            task.result ||
                                                            ""
                                                        }
                                                        onChange={e =>
                                                            handleResultChange(
                                                                task.id,
                                                                e.target.value
                                                            )
                                                        }
                                                        placeholder="Enter task result or remarks..."
                                                    />

                                                </div>

                                            </div>

                                        </div>


                                        {/* =================================
                                            TASK SAVE
                                        ================================= */}

                                        <div className="card-footer bg-white p-3 p-md-4">

                                            <div className="d-flex justify-content-end">

                                                <button
                                                    type="button"
                                                    className="btn btn-primary px-4"
                                                    onClick={() =>
                                                        handleSave(task)
                                                    }
                                                    disabled={
                                                        savingId ===
                                                        task.id
                                                    }
                                                >

                                                    {savingId ===
                                                    task.id ? (

                                                        <>
                                                            <span
                                                                className="spinner-border spinner-border-sm me-2"
                                                            />

                                                            Saving...
                                                        </>

                                                    ) : (

                                                        "Save Task"

                                                    )}

                                                </button>

                                            </div>

                                        </div>


                                        {/* =================================
                                            SERVICE INVENTORY
                                        ================================= */}

                                        <div className="card-body border-top bg-light p-3 p-md-4">

                                            <div className="d-flex flex-column flex-md-row justify-content-between align-items-md-center gap-2 mb-3">

                                                <div>

                                                    <h5 className="fw-bold mb-1">

                                                        📦 Service Inventory

                                                    </h5>

                                                    <small className="text-muted">

                                                        Inventory for{" "}
                                                        {getServiceName(
                                                            task
                                                        )}

                                                    </small>

                                                </div>


                                                {serviceId && (

                                                    <button
                                                        type="button"
                                                        className="btn btn-outline-primary btn-sm"
                                                        onClick={() =>
                                                            loadServiceInventory(
                                                                serviceId
                                                            )
                                                        }
                                                        disabled={
                                                            inventoryLoading[
                                                                serviceId
                                                            ]
                                                        }
                                                    >

                                                        ↻ Refresh Inventory

                                                    </button>

                                                )}

                                            </div>


                                            {!serviceId ? (

                                                <div className="alert alert-warning mb-0">

                                                    <strong>
                                                        Service ID is missing.
                                                    </strong>

                                                    <div className="small mt-1">

                                                        Your task response contains
                                                        the service name but the
                                                        inventory API requires
                                                        the service ID.

                                                    </div>

                                                </div>

                                            ) : (

                                                renderInventory(
                                                    serviceId
                                                )

                                            )}

                                        </div>

                                    </div>

                                );

                            }
                        )}

                    </div>

                )}

        </div>

    );

};


export default EmployeeTasks;