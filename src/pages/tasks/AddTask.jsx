import { useEffect, useState } from "react";
import {
    useLocation,
    useNavigate,
    useParams
} from "react-router-dom";

import {
    getDepartments,
    getDepartmentServices
} from "../../services/departmentService";

import {
    addTask,
    updateTask
} from "../../services/taskService";


const AddTask = () => {

    const navigate = useNavigate();
    const location = useLocation();

    const {
        appointmentId,
        taskId
    } = useParams();


    // ========================================
    // DATA FROM APPOINTMENT PAGE
    // ========================================

    const appointment =
        location.state?.appointment;

    const existingTask =
        location.state?.task;


    const isEditMode =
        Boolean(taskId);


    // ========================================
    // STATE
    // ========================================

    const [departments, setDepartments] =
        useState([]);

    const [services, setServices] =
        useState([]);

    const [departmentId, setDepartmentId] =
        useState("");

    const [serviceId, setServiceId] =
        useState("");

    const [taskName, setTaskName] =
        useState("");


    const [loadingDepartments, setLoadingDepartments] =
        useState(true);

    const [loadingServices, setLoadingServices] =
        useState(false);

    const [loading, setLoading] =
        useState(false);

    const [error, setError] =
        useState("");


    // ========================================
    // LOAD DEPARTMENTS
    // ========================================

    useEffect(() => {

        loadDepartments();

    }, []);


    const loadDepartments = async () => {

        try {

            setLoadingDepartments(true);
            setError("");

            const data =
                await getDepartments();


            console.log(
                "Departments received:",
                data
            );


            setDepartments(
                Array.isArray(data)
                    ? data
                    : []
            );

        } catch (error) {

            console.error(
                "Error loading departments:",
                error
            );

            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to load departments."
            );

        } finally {

            setLoadingDepartments(false);
        }
    };


    // ========================================
    // LOAD EXISTING TASK FOR EDIT
    // ========================================

    useEffect(() => {

        if (
            !isEditMode ||
            !existingTask
        ) {
            return;
        }


        console.log(
            "Existing task:",
            existingTask
        );


        setTaskName(
            existingTask.taskName || ""
        );


        const existingServiceId =
            existingTask.serviceId ||
            existingTask.services?.id ||
            "";


        if (existingServiceId) {

            setServiceId(
                String(existingServiceId)
            );
        }


        /*
         * If backend response contains
         * departmentId, use it directly.
         */

        if (existingTask.departmentId) {

            const id =
                String(
                    existingTask.departmentId
                );

            setDepartmentId(id);

            loadServices(
                id
            );

        }

    }, [
        isEditMode,
        existingTask
    ]);


    // ========================================
    // LOAD SERVICES BY DEPARTMENT
    // ========================================

    const loadServices = async (
        departmentId
    ) => {

        if (!departmentId) {

            setServices([]);

            return;
        }


        try {

            setLoadingServices(true);

            setError("");

            console.log(
                "Loading services for department:",
                departmentId
            );


            const data =
                await getDepartmentServices(
                    departmentId
                );


            console.log(
                "Services received:",
                data
            );


            /*
             * Backend may return:
             *
             * [
             *   {
             *      id: 1,
             *      serviceName: "Blood Test"
             *   }
             * ]
             *
             * or an object containing
             * services.
             */

            if (Array.isArray(data)) {

                setServices(data);

            } else if (
                Array.isArray(data?.services)
            ) {

                setServices(
                    data.services
                );

            } else {

                setServices([]);
            }

        } catch (error) {

            console.error(
                "Error loading services:",
                error
            );


            setServices([]);


            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to load services."
            );

        } finally {

            setLoadingServices(false);
        }
    };


    // ========================================
    // DEPARTMENT CHANGE
    // ========================================

    const handleDepartmentChange = async (e) => {

        const id =
            e.target.value;


        setDepartmentId(id);

        // Clear previous service

        setServiceId("");

        setServices([]);


        if (!id) {
            return;
        }


        await loadServices(id);
    };


    // ========================================
    // SERVICE CHANGE
    // ========================================

    const handleServiceChange = (e) => {

        setServiceId(
            e.target.value
        );
    };


    // ========================================
    // CREATE TASK
    // ========================================

    const handleCreateTask = async () => {

        setError("");


        if (!taskName.trim()) {

            setError(
                "Please enter task name."
            );

            return;
        }


        if (!departmentId) {

            setError(
                "Please select a department."
            );

            return;
        }


        if (!serviceId) {

            setError(
                "Please select a service."
            );

            return;
        }


        try {

            setLoading(true);


            const data = {

                taskName:
                    taskName.trim(),

                serviceId:
                    Number(serviceId),

                appointmentId:
                    appointmentId
                        ? Number(appointmentId)
                        : appointment?.id
                            ? Number(appointment.id)
                            : null
            };


            console.log(
                "Creating task:",
                data
            );


            const response =
                await addTask(data);


            console.log(
                "Task created:",
                response
            );


            alert(
                `Task created successfully${
                    response?.assignedUserName
                        ? ` and assigned to ${response.assignedUserName}`
                        : ""
                }`
            );


            if (appointmentId) {

                navigate(
                    `/doctor/appointments/${appointmentId}`,
                    {
                        state: {
                            appointment
                        }
                    }
                );

            } else {

                navigate(-1);
            }

        } catch (error) {

            console.error(
                "Error creating task:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to create task."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================
    // UPDATE TASK
    // ========================================

    const handleUpdateTask = async () => {

        setError("");


        if (!taskId) {

            setError(
                "Task ID not found."
            );

            return;
        }


        if (!taskName.trim()) {

            setError(
                "Please enter task name."
            );

            return;
        }


        if (!serviceId) {

            setError(
                "Please select a service."
            );

            return;
        }


        try {

            setLoading(true);


            const data = {

                taskName:
                    taskName.trim(),

                serviceId:
                    Number(serviceId)
            };


            const response =
                await updateTask(
                    taskId,
                    data
                );


            console.log(
                "Task updated:",
                response
            );


            alert(
                "Task updated successfully."
            );


            if (appointmentId) {

                navigate(
                    `/doctor/appointments/${appointmentId}`,
                    {
                        state: {
                            appointment
                        }
                    }
                );

            } else {

                navigate(-1);
            }

        } catch (error) {

            console.error(
                "Error updating task:",
                error
            );


            setError(
                error?.response?.data?.message ||
                error?.response?.data ||
                "Unable to update task."
            );

        } finally {

            setLoading(false);
        }
    };


    // ========================================
    // CANCEL
    // ========================================

    const handleCancel = () => {

        if (appointmentId) {

            navigate(
                `/doctor/appointments/${appointmentId}`,
                {
                    state: {
                        appointment
                    }
                }
            );

        } else {

            navigate(-1);
        }
    };


    // ========================================
    // UI
    // ========================================

    return (

        <div className="container py-4">

            {/* HEADER */}

            <div className="d-flex justify-content-between align-items-center mb-4">

                <div>

                    <h2 className="mb-1">

                        {isEditMode
                            ? "Update Task"
                            : "Create New Task"}

                    </h2>

                    <p className="text-muted mb-0">

                        {isEditMode
                            ? "Update task details"
                            : "Create a task and assign it automatically"}

                    </p>

                </div>


                <button
                    className="btn btn-secondary"
                    onClick={handleCancel}
                >
                    ← Back
                </button>

            </div>


            {/* APPOINTMENT */}

            {appointment && (

                <div className="card shadow-sm mb-4">

                    <div className="card-header">

                        <h5 className="mb-0">
                            Appointment Information
                        </h5>

                    </div>


                    <div className="card-body">

                        <div className="row">

                            <div className="col-md-4">

                                <strong>
                                    Appointment ID
                                </strong>

                                <p className="mb-0">
                                    {appointment.id}
                                </p>

                            </div>


                            <div className="col-md-4">

                                <strong>
                                    Date
                                </strong>

                                <p className="mb-0">
                                    {appointment.appointmentDate || "-"}
                                </p>

                            </div>


                            <div className="col-md-4">

                                <strong>
                                    Time
                                </strong>

                                <p className="mb-0">
                                    {appointment.appointmentTime || "-"}
                                </p>

                            </div>

                        </div>

                    </div>

                </div>

            )}


            {/* ERROR */}

            {error && (

                <div className="alert alert-danger">

                    {error}

                </div>

            )}


            {/* TASK FORM */}

            <div className="card shadow-sm">

                <div className="card-header">

                    <h5 className="mb-0">
                        Task Details
                    </h5>

                </div>


                <div className="card-body">


                    {/* TASK NAME */}

                    <div className="mb-4">

                        <label className="form-label">

                            Task Name
                            <span className="text-danger">
                                *
                            </span>

                        </label>


                        <input
                            type="text"
                            className="form-control"
                            placeholder="e.g. Perform Blood Test"
                            value={taskName}
                            onChange={(e) =>
                                setTaskName(
                                    e.target.value
                                )
                            }
                            disabled={loading}
                        />

                    </div>


                    {/* DEPARTMENT */}

                    <div className="mb-4">

                        <label className="form-label">

                            Department
                            <span className="text-danger">
                                *
                            </span>

                        </label>


                        <select
                            className="form-select"
                            value={departmentId}
                            onChange={
                                handleDepartmentChange
                            }
                            disabled={
                                loading ||
                                loadingDepartments
                            }
                        >

                            <option value="">

                                {loadingDepartments
                                    ? "Loading departments..."
                                    : "Select Department"}

                            </option>


                            {departments.map(
                                department => (

                                    <option
                                        key={
                                            department.id
                                        }
                                        value={
                                            department.id
                                        }
                                    >

                                        {
                                            department.deptName ||
                                            department.departmentName ||
                                            department.name
                                        }

                                    </option>

                                )
                            )}

                        </select>

                    </div>


                    {/* SERVICE */}

                    <div className="mb-4">

                        <label className="form-label">

                            Service
                            <span className="text-danger">
                                *
                            </span>

                        </label>


                        <select
                            className="form-select"
                            value={serviceId}
                            onChange={
                                handleServiceChange
                            }
                            disabled={
                                loading ||
                                loadingServices ||
                                !departmentId
                            }
                        >

                            <option value="">

                                {loadingServices
                                    ? "Loading services..."
                                    : !departmentId
                                        ? "Select department first"
                                        : "Select Service"}

                            </option>


                            {services.map(
                                service => (

                                    <option
                                        key={
                                            service.id
                                        }
                                        value={
                                            service.id
                                        }
                                    >

                                        {
                                            service.serviceName ||
                                            service.name ||
                                            service.service
                                        }

                                    </option>

                                )
                            )}

                        </select>


                        {/* NO SERVICES */}

                        {departmentId &&
                            !loadingServices &&
                            services.length === 0 && (

                                <div className="text-danger mt-2">

                                    No services found for
                                    this department.

                                </div>

                            )}

                    </div>


                    {/* AUTOMATIC ASSIGNMENT */}

                    {!isEditMode && (

                        <div className="alert alert-info">

                            <strong>
                                Automatic Assignment
                            </strong>

                            <p className="mb-0 mt-1">

                                After creating the task,
                                the system will automatically
                                assign it to an employee from
                                the selected service who has
                                the lowest active task load.

                            </p>

                        </div>

                    )}


                    {/* BUTTONS */}

                    <div className="d-flex gap-2">

                        <button
                            type="button"
                            className="btn btn-primary"
                            onClick={
                                isEditMode
                                    ? handleUpdateTask
                                    : handleCreateTask
                            }
                            disabled={
                                loading ||
                                loadingServices ||
                                !serviceId
                            }
                        >

                            {loading

                                ? (
                                    <>
                                        <span
                                            className="spinner-border spinner-border-sm me-2"
                                        />

                                        {isEditMode
                                            ? "Updating..."
                                            : "Creating..."}

                                    </>
                                )

                                : (
                                    isEditMode
                                        ? "Update Task"
                                        : "Create Task"
                                )}

                        </button>


                        <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={handleCancel}
                            disabled={loading}
                        >
                            Cancel
                        </button>

                    </div>

                </div>

            </div>

        </div>
    );
};


export default AddTask;