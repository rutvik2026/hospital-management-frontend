import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";

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

import "./EmployeeDashboard.css";

const Icon = ({ name, size = 20 }) => {
    const icons = {
        dashboard: (
            <>
                <rect x="3" y="3" width="7" height="7" rx="1" />
                <rect x="14" y="3" width="7" height="7" rx="1" />
                <rect x="3" y="14" width="7" height="7" rx="1" />
                <rect x="14" y="14" width="7" height="7" rx="1" />
            </>
        ),

        task: (
            <>
                <rect x="4" y="3" width="16" height="18" rx="2" />
                <path d="M8 7h8M8 11h8M8 15h5" />
                <path d="M7 3v3M17 3v3" />
            </>
        ),

        inventory: (
            <>
                <path d="M3 7l9-4 9 4-9 4-9-4z" />
                <path d="M3 7v10l9 4 9-4V7" />
                <path d="M12 11v10" />
            </>
        ),

        profile: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M4 21c.7-4 3.3-6 8-6s7.3 2 8 6" />
            </>
        ),

        refresh: (
            <>
                <path d="M20 11a8 8 0 0 0-14-5L3 9" />
                <path d="M3 4v5h5" />
                <path d="M4 13a8 8 0 0 0 14 5l3-3" />
                <path d="M21 20v-5h-5" />
            </>
        ),

        logout: (
            <>
                <path d="M10 17l5-5-5-5" />
                <path d="M15 12H3" />
                <path d="M21 19V5a2 2 0 0 0-2-2h-7" />
            </>
        ),

        menu: (
            <>
                <path d="M4 6h16M4 12h16M4 18h16" />
            </>
        ),

        close: (
            <>
                <path d="M6 6l12 12M18 6L6 18" />
            </>
        ),

        check: (
            <>
                <path d="M20 6L9 17l-5-5" />
            </>
        ),

        clock: (
            <>
                <circle cx="12" cy="12" r="9" />
                <path d="M12 7v5l3 2" />
            </>
        ),

        box: (
            <>
                <path d="M21 8l-9-5-9 5 9 5 9-5z" />
                <path d="M3 8v9l9 4 9-4V8" />
                <path d="M12 13v8" />
            </>
        ),

        hospital: (
            <>
                <path d="M4 21V5a2 2 0 0 1 2-2h12a2 2 0 0 1 2 2v16" />
                <path d="M9 21v-4h6v4M12 7v6M9 10h6" />
            </>
        ),

        patient: (
            <>
                <circle cx="12" cy="8" r="4" />
                <path d="M5 21c.8-4.2 3.1-6 7-6s6.2 1.8 7 6" />
            </>
        ),
    };

    return (
        <svg
            width={size}
            height={size}
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeLinejoin="round"
        >
            {icons[name]}
        </svg>
    );
};

const EmployeeDashboard = () => {
    const navigate = useNavigate();

    const user = JSON.parse(
        localStorage.getItem("user") || "{}"
    );

    const userId =
        user?.userId ||
        user?.id ||
        user?.userID;

    const [tasks, setTasks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [savingId, setSavingId] = useState(null);

    const [inventoryMap, setInventoryMap] = useState({});
    const [inventoryLoading, setInventoryLoading] = useState({});
    const [inventoryError, setInventoryError] = useState({});
    const [stockValues, setStockValues] = useState({});
    const [patientValues, setPatientValues] = useState({});
    const [inventorySavingId, setInventorySavingId] = useState(null);

    const [sidebarOpen, setSidebarOpen] = useState(false);

    // =====================================================
    // HELPERS
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

    const getServiceName = (task) => {
        return (
            task?.serviceName ||
            task?.service?.serviceName ||
            task?.service?.name ||
            "Service"
        );
    };

    const getTaskId = (task) => {
        return task?.id || task?.taskId;
    };

    // =====================================================
    // LOAD TASKS
    // =====================================================

    const loadTasks = async () => {
        if (!userId) {
            setError("User ID not found. Please login again.");
            setLoading(false);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await getEmployeeTasks(userId);

            let taskList = [];

            if (Array.isArray(response)) {
                taskList = response;
            } else if (Array.isArray(response?.data)) {
                taskList = response.data;
            } else if (Array.isArray(response?.tasks)) {
                taskList = response.tasks;
            }

            setTasks(taskList);

            await loadInventoriesForTasks(taskList);
        } catch (err) {
            console.error("Error loading tasks:", err);

            setError(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to load tasks."
            );
        } finally {
            setLoading(false);
        }
    };

    // =====================================================
    // INVENTORY
    // =====================================================

    const loadInventoriesForTasks = async (taskList) => {
        const serviceIds = [
            ...new Set(
                taskList
                    .map((task) => getServiceId(task))
                    .filter(
                        (id) =>
                            id !== null &&
                            id !== undefined
                    )
            ),
        ];

        for (const serviceId of serviceIds) {
            await loadServiceInventory(serviceId);
        }
    };

    const loadServiceInventory = async (serviceId) => {
        if (!serviceId) return;

        try {
            setInventoryLoading((previous) => ({
                ...previous,
                [serviceId]: true,
            }));

            setInventoryError((previous) => ({
                ...previous,
                [serviceId]: "",
            }));

            const response =
                await getServiceInventories(serviceId);

            let inventoryList = [];

            if (Array.isArray(response)) {
                inventoryList = response;
            } else if (Array.isArray(response?.data)) {
                inventoryList = response.data;
            } else if (
                Array.isArray(response?.inventories)
            ) {
                inventoryList = response.inventories;
            }

            setInventoryMap((previous) => ({
                ...previous,
                [serviceId]: inventoryList,
            }));

            const stockState = {};

            inventoryList.forEach((inventory) => {
                const inventoryId =
                    inventory?.id ||
                    inventory?.inventoryId;

                if (inventoryId) {
                    stockState[inventoryId] =
                        inventory?.stock ??
                        inventory?.quantity ??
                        0;
                }
            });

            setStockValues((previous) => ({
                ...previous,
                ...stockState,
            }));
        } catch (err) {
            console.error("Inventory error:", err);

            setInventoryError((previous) => ({
                ...previous,
                [serviceId]:
                    err?.response?.data?.message ||
                    err?.response?.data ||
                    "Unable to load inventory.",
            }));
        } finally {
            setInventoryLoading((previous) => ({
                ...previous,
                [serviceId]: false,
            }));
        }
    };

    useEffect(() => {
        loadTasks();

        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // =====================================================
    // TASK UPDATE
    // =====================================================

    const handleStatusChange = (taskId, status) => {
        setTasks((previous) =>
            previous.map((task) =>
                getTaskId(task) === taskId
                    ? { ...task, status }
                    : task
            )
        );
    };

    const handleResultChange = (taskId, result) => {
        setTasks((previous) =>
            previous.map((task) =>
                getTaskId(task) === taskId
                    ? { ...task, result }
                    : task
            )
        );
    };

    const handleSave = async (task) => {
        const taskId = getTaskId(task);

        try {
            setSavingId(taskId);

            await updateEmployeeTask(
                taskId,
                {
                    status: task.status,
                    result: task.result || "",
                }
            );

            await loadTasks();

            alert("Task updated successfully.");
        } catch (err) {
            console.error("Task update error:", err);

            alert(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to update task."
            );
        } finally {
            setSavingId(null);
        }
    };

    // =====================================================
    // INVENTORY UPDATE
    // =====================================================

    const handleStockChange = (
        inventoryId,
        value
    ) => {
        setStockValues((previous) => ({
            ...previous,
            [inventoryId]: value,
        }));
    };

    const handlePatientChange = (
        inventoryId,
        value
    ) => {
        setPatientValues((previous) => ({
            ...previous,
            [inventoryId]: value,
        }));
    };

    const handleUpdateStock = async (
        inventory,
        serviceId
    ) => {
        const inventoryId =
            inventory?.id ||
            inventory?.inventoryId;

        const newStock = Number(
            stockValues[inventoryId]
        );

        if (
            Number.isNaN(newStock) ||
            newStock < 0
        ) {
            alert("Please enter a valid stock value.");
            return;
        }

        try {
            setInventorySavingId(
                `stock-${inventoryId}`
            );

            await updateInventoryStock(
                inventoryId,
                newStock
            );

            await loadServiceInventory(serviceId);

            alert("Stock updated successfully.");
        } catch (err) {
            console.error("Stock update error:", err);

            alert(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to update stock."
            );
        } finally {
            setInventorySavingId(null);
        }
    };

    const handleAssignPatient = async (
        inventory,
        serviceId
    ) => {
        const inventoryId =
            inventory?.id ||
            inventory?.inventoryId;

        const patientId = Number(
            patientValues[inventoryId]
        );

        if (!patientId || patientId <= 0) {
            alert("Please enter a valid patient ID.");
            return;
        }

        try {
            setInventorySavingId(
                `patient-${inventoryId}`
            );

            await addPatientToInventory(
                inventoryId,
                patientId
            );

            setPatientValues((previous) => ({
                ...previous,
                [inventoryId]: "",
            }));

            await loadServiceInventory(serviceId);

            alert("Patient assigned successfully.");
        } catch (err) {
            console.error(
                "Patient assignment error:",
                err
            );

            alert(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to assign patient."
            );
        } finally {
            setInventorySavingId(null);
        }
    };

    const handleRemovePatient = async (
        inventory,
        serviceId
    ) => {
        const inventoryId =
            inventory?.id ||
            inventory?.inventoryId;

        if (
            !window.confirm(
                "Are you sure you want to remove this patient?"
            )
        ) {
            return;
        }

        try {
            setInventorySavingId(
                `remove-${inventoryId}`
            );

            await removePatientFromInventory(
                inventoryId
            );

            await loadServiceInventory(serviceId);

            alert("Patient removed successfully.");
        } catch (err) {
            console.error(
                "Remove patient error:",
                err
            );

            alert(
                err?.response?.data?.message ||
                err?.response?.data ||
                "Unable to remove patient."
            );
        } finally {
            setInventorySavingId(null);
        }
    };

    // =====================================================
    // STATUS
    // =====================================================

    const normalizeStatus = (status) =>
        String(status || "")
            .toUpperCase()
            .replace(/\s+/g, "_");

    const statusBadge = (status) => {
        const normalized = normalizeStatus(status);

        if (normalized === "COMPLETED") {
            return (
                <span className="employee-status completed">
                    <Icon name="check" size={14} />
                    Completed
                </span>
            );
        }

        if (normalized === "IN_PROGRESS") {
            return (
                <span className="employee-status progress">
                    <Icon name="clock" size={14} />
                    In Progress
                </span>
            );
        }

        return (
            <span className="employee-status pending">
                <Icon name="clock" size={14} />
                Pending
            </span>
        );
    };

    // =====================================================
    // STATISTICS
    // =====================================================

    const dashboardStats = useMemo(() => {
        return {
            total: tasks.length,

            pending: tasks.filter(
                (task) =>
                    normalizeStatus(task.status) ===
                    "PENDING"
            ).length,

            inProgress: tasks.filter(
                (task) =>
                    normalizeStatus(task.status) ===
                    "IN_PROGRESS"
            ).length,

            completed: tasks.filter(
                (task) =>
                    normalizeStatus(task.status) ===
                    "COMPLETED"
            ).length,
        };
    }, [tasks]);

    const totalInventoryItems = useMemo(() => {
        return Object.values(inventoryMap).reduce(
            (total, inventories) =>
                total + inventories.length,
            0
        );
    }, [inventoryMap]);

    const uniqueServices = useMemo(() => {
        const serviceMap = new Map();

        tasks.forEach((task) => {
            const serviceId = getServiceId(task);

            if (!serviceId) return;

            if (!serviceMap.has(serviceId)) {
                serviceMap.set(serviceId, {
                    serviceId,
                    serviceName:
                        getServiceName(task),
                });
            }
        });

        return Array.from(serviceMap.values());
    }, [tasks]);

    // =====================================================
    // LOGOUT
    // =====================================================

    const handleLogout = () => {
        localStorage.removeItem("token");
        localStorage.removeItem("user");
        localStorage.removeItem("role");
        localStorage.removeItem("userId");
        localStorage.removeItem("accessToken");
        localStorage.removeItem("refreshToken");

        sessionStorage.clear();

        navigate("/login", {
            replace: true,
        });
    };

    // =====================================================
    // PROFILE
    // =====================================================

    const profileName =
        user?.name ||
        user?.username ||
        user?.userName ||
        "Employee";

    const profileInitial =
        profileName
            .charAt(0)
            .toUpperCase();

    // =====================================================
    // INVENTORY TABLE
    // =====================================================

    const renderInventory = (serviceId) => {
        const inventories =
            inventoryMap[serviceId] || [];

        if (inventoryLoading[serviceId]) {
            return (
                <div className="employee-loading-box">
                    <div className="spinner-border text-primary" />
                    <p>Loading inventory...</p>
                </div>
            );
        }

        if (inventoryError[serviceId]) {
            return (
                <div className="p-4">
                    <div className="alert alert-danger mb-0">
                        {inventoryError[serviceId]}
                    </div>
                </div>
            );
        }

        if (inventories.length === 0) {
            return (
                <div className="p-4">
                    <div className="alert alert-info mb-0">
                        No inventory found for this service.
                    </div>
                </div>
            );
        }

        return (
            <>
                {/* Desktop */}
                <div className="employee-inventory-desktop">
                    <div className="table-responsive">
                        <table className="table employee-table align-middle mb-0">
                            <thead>
                                <tr>
                                    <th>Inventory</th>
                                    <th>Stock</th>
                                    <th>Patient</th>
                                    <th>Update Stock</th>
                                    <th>Patient Action</th>
                                </tr>
                            </thead>

                            <tbody>
                                {inventories.map(
                                    (inventory) => {
                                        const inventoryId =
                                            inventory?.id ||
                                            inventory?.inventoryId;

                                        const patientId =
                                            inventory?.patientId;

                                        const patient =
                                            inventory?.patient;

                                        const hasPatient =
                                            patientId !==
                                            null &&
                                            patientId !==
                                            undefined;

                                        const stock =
                                            inventory?.stock ??
                                            inventory?.quantity ??
                                            0;

                                        return (
                                            <tr
                                                key={
                                                    inventoryId
                                                }
                                            >
                                                <td>
                                                    <div className="employee-inventory-name">
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

                                                <td>
                                                    <span
                                                        className={
                                                            Number(stock) <=
                                                                5
                                                                ? "employee-stock low"
                                                                : "employee-stock normal"
                                                        }
                                                    >
                                                        {stock}
                                                    </span>
                                                </td>

                                                <td>
                                                    {hasPatient ? (
                                                        <>
                                                            <div className="fw-semibold">
                                                                {patient?.name ||
                                                                    patient?.userName ||
                                                                    `Patient #${patientId}`}
                                                            </div>
                                                            <small className="text-muted">
                                                                ID:{" "}
                                                                {
                                                                    patientId
                                                                }
                                                            </small>
                                                        </>
                                                    ) : (
                                                        <span className="text-muted">
                                                            Not Assigned
                                                        </span>
                                                    )}
                                                </td>

                                                <td>
                                                    <div className="employee-control">
                                                        <input
                                                            type="number"
                                                            min="0"
                                                            className="form-control"
                                                            value={
                                                                stockValues[
                                                                inventoryId
                                                                ] ??
                                                                ""
                                                            }
                                                            onChange={(
                                                                e
                                                            ) =>
                                                                handleStockChange(
                                                                    inventoryId,
                                                                    e
                                                                        .target
                                                                        .value
                                                                )
                                                            }
                                                        />

                                                        <button
                                                            className="btn btn-primary"
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
                                                                <span className="spinner-border spinner-border-sm" />
                                                            ) : (
                                                                "Update"
                                                            )}
                                                        </button>
                                                    </div>
                                                </td>

                                                <td>
                                                    {!hasPatient ? (
                                                        <div className="employee-control">
                                                            <input
                                                                type="number"
                                                                min="1"
                                                                className="form-control"
                                                                placeholder="Patient ID"
                                                                value={
                                                                    patientValues[
                                                                    inventoryId
                                                                    ] ??
                                                                    ""
                                                                }
                                                                onChange={(
                                                                    e
                                                                ) =>
                                                                    handlePatientChange(
                                                                        inventoryId,
                                                                        e
                                                                            .target
                                                                            .value
                                                                    )
                                                                }
                                                            />

                                                            <button
                                                                className="btn btn-success"
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
                                                                Assign
                                                            </button>
                                                        </div>
                                                    ) : (
                                                        <button
                                                            className="btn btn-outline-danger btn-sm"
                                                            onClick={() =>
                                                                handleRemovePatient(
                                                                    inventory,
                                                                    serviceId
                                                                )
                                                            }
                                                        >
                                                            Remove
                                                        </button>
                                                    )}
                                                </td>
                                            </tr>
                                        );
                                    }
                                )}
                            </tbody>
                        </table>
                    </div>
                </div>

                {/* Mobile */}
                <div className="employee-inventory-mobile">
                    {inventories.map(
                        (inventory) => {
                            const inventoryId =
                                inventory?.id ||
                                inventory?.inventoryId;

                            const patientId =
                                inventory?.patientId;

                            const patient =
                                inventory?.patient;

                            const hasPatient =
                                patientId !== null &&
                                patientId !== undefined;

                            const stock =
                                inventory?.stock ??
                                inventory?.quantity ??
                                0;

                            return (
                                <div
                                    className="employee-inventory-card"
                                    key={inventoryId}
                                >
                                    <div className="employee-inventory-card-head">
                                        <div>
                                            <h6>
                                                {inventory?.inventoryName ||
                                                    inventory?.name ||
                                                    inventory?.itemName ||
                                                    `Inventory #${inventoryId}`}
                                            </h6>

                                            <small>
                                                ID:{" "}
                                                {inventoryId}
                                            </small>
                                        </div>

                                        <span
                                            className={
                                                Number(stock) <=
                                                    5
                                                    ? "employee-stock low"
                                                    : "employee-stock normal"
                                            }
                                        >
                                            Stock: {stock}
                                        </span>
                                    </div>

                                    {inventory?.description && (
                                        <p className="text-muted small">
                                            {
                                                inventory.description
                                            }
                                        </p>
                                    )}

                                    <div className="employee-info-box">
                                        <small>
                                            Patient
                                        </small>

                                        {hasPatient ? (
                                            <>
                                                <strong>
                                                    {patient?.name ||
                                                        patient?.userName ||
                                                        `Patient #${patientId}`}
                                                </strong>

                                                <span>
                                                    ID:{" "}
                                                    {
                                                        patientId
                                                    }
                                                </span>
                                            </>
                                        ) : (
                                            <span>
                                                No patient assigned
                                            </span>
                                        )}
                                    </div>

                                    <label>
                                        Update Stock
                                    </label>

                                    <div className="employee-mobile-control">
                                        <input
                                            type="number"
                                            min="0"
                                            className="form-control"
                                            value={
                                                stockValues[
                                                inventoryId
                                                ] ?? ""
                                            }
                                            onChange={(e) =>
                                                handleStockChange(
                                                    inventoryId,
                                                    e.target.value
                                                )
                                            }
                                        />

                                        <button
                                            className="btn btn-primary"
                                            onClick={() =>
                                                handleUpdateStock(
                                                    inventory,
                                                    serviceId
                                                )
                                            }
                                        >
                                            Update
                                        </button>
                                    </div>

                                    <label className="mt-3">
                                        Patient Action
                                    </label>

                                    {!hasPatient ? (
                                        <div className="employee-mobile-control">
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
                                                onChange={(e) =>
                                                    handlePatientChange(
                                                        inventoryId,
                                                        e.target.value
                                                    )
                                                }
                                            />

                                            <button
                                                className="btn btn-success"
                                                onClick={() =>
                                                    handleAssignPatient(
                                                        inventory,
                                                        serviceId
                                                    )
                                                }
                                            >
                                                Assign
                                            </button>
                                        </div>
                                    ) : (
                                        <button
                                            className="btn btn-outline-danger w-100"
                                            onClick={() =>
                                                handleRemovePatient(
                                                    inventory,
                                                    serviceId
                                                )
                                            }
                                        >
                                            Remove Patient
                                        </button>
                                    )}
                                </div>
                            );
                        }
                    )}
                </div>
            </>
        );
    };

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <div className="employee-dashboard">

            {/* SIDEBAR OVERLAY */}
            {sidebarOpen && (
                <div
                    className="employee-sidebar-overlay"
                    onClick={() =>
                        setSidebarOpen(false)
                    }
                />
            )}

            {/* SIDEBAR */}
            <aside
                className={`employee-sidebar ${sidebarOpen
                        ? "employee-sidebar-open"
                        : ""
                    }`}
            >
                <div className="employee-logo">
                    <div className="employee-logo-icon">
                        <Icon
                            name="hospital"
                            size={26}
                        />
                    </div>

                    <div>
                        <h3>MediCare</h3>
                        <span>Hospital Management</span>
                    </div>

                    <button
                        className="employee-close-sidebar"
                        onClick={() =>
                            setSidebarOpen(false)
                        }
                    >
                        <Icon name="close" size={20} />
                    </button>
                </div>

                <div className="employee-sidebar-title">
                    MAIN MENU
                </div>

                <nav className="employee-nav">

                    {/* Dashboard */}
                    <button
                        type="button"
                        className="employee-nav-item active"
                        onClick={() => {
                            document
                                .querySelector(".employee-content")
                                ?.scrollTo({
                                    top: 0,
                                    behavior: "smooth",
                                });

                            setSidebarOpen(false);
                        }}
                    >
                        <Icon name="dashboard" size={19} />
                        <span>Dashboard</span>
                    </button>

                    {/* My Tasks */}
                    <button
                        type="button"
                        className="employee-nav-item"
                        onClick={() => {
                            document
                                .querySelector(".employee-section-card")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });

                            setSidebarOpen(false);
                        }}
                    >
                        <Icon name="task" size={19} />
                        <span>My Tasks</span>
                    </button>

                    {/* Inventory */}
                    <button
                        type="button"
                        className="employee-nav-item"
                        onClick={() => {
                            document
                                .querySelector(".employee-inventory-section")
                                ?.scrollIntoView({
                                    behavior: "smooth",
                                    block: "start",
                                });

                            setSidebarOpen(false);
                        }}
                    >
                        <Icon name="inventory" size={19} />
                        <span>Inventory</span>
                    </button>

                    {/* Profile */}
                    <button
                        type="button"
                        className="employee-nav-item"
                        onClick={() => {
                            setSidebarOpen(false);
                            navigate("/profile");
                        }}
                    >
                        <Icon name="profile" size={19} />
                        <span>My Profile</span>
                    </button>

                </nav>

                <div className="employee-sidebar-bottom">

                    <div className="employee-user-mini">
                        <div className="employee-avatar">
                            {profileInitial}
                        </div>

                        <div>
                            <strong>
                                {profileName}
                            </strong>

                            <span>
                                Employee
                            </span>
                        </div>
                    </div>

                    <button
                        className="employee-logout"
                        onClick={handleLogout}
                    >
                        <Icon
                            name="logout"
                            size={19}
                        />
                        Logout
                    </button>
                </div>
            </aside>

            {/* MAIN */}
            <main className="employee-main">

                {/* TOPBAR */}
                <header className="employee-topbar">

                    <button
                        className="employee-menu-button"
                        onClick={() =>
                            setSidebarOpen(true)
                        }
                    >
                        <Icon name="menu" size={23} />
                    </button>

                    <div className="employee-topbar-title">
                        Employee Dashboard
                    </div>

                    <div className="employee-topbar-profile">
                        <div className="employee-avatar">
                            {profileInitial}
                        </div>

                        <div className="employee-top-profile-text">
                            <strong>
                                {profileName}
                            </strong>

                            <span>
                                Employee
                            </span>
                        </div>
                    </div>
                </header>

                {/* CONTENT */}
                <div className="employee-content">

                    {/* WELCOME */}
                    <section className="employee-welcome">

                        <div>
                            <span className="employee-welcome-label">
                                Welcome back
                            </span>

                            <h1>
                                Hello, {profileName} 👋
                            </h1>

                            <p>
                                Manage your assigned tasks
                                and service inventory from
                                one place.
                            </p>
                        </div>

                        <div className="employee-welcome-icon">
                            <Icon
                                name="hospital"
                                size={48}
                            />
                        </div>

                    </section>

                    {/* ERROR */}
                    {error && (
                        <div className="alert alert-danger">
                            <strong>Error:</strong>{" "}
                            {error}
                        </div>
                    )}

                    {/* STATISTICS */}
                    <section className="employee-stat-grid">

                        <div className="employee-stat-card">
                            <div>
                                <span>
                                    Total Tasks
                                </span>

                                <h2>
                                    {
                                        dashboardStats.total
                                    }
                                </h2>

                                <small>
                                    Assigned to you
                                </small>
                            </div>

                            <div className="employee-stat-icon blue">
                                <Icon
                                    name="task"
                                    size={24}
                                />
                            </div>
                        </div>

                        <div className="employee-stat-card">
                            <div>
                                <span>
                                    Pending
                                </span>

                                <h2>
                                    {
                                        dashboardStats.pending
                                    }
                                </h2>

                                <small>
                                    Awaiting action
                                </small>
                            </div>

                            <div className="employee-stat-icon orange">
                                <Icon
                                    name="clock"
                                    size={24}
                                />
                            </div>
                        </div>

                        <div className="employee-stat-card">
                            <div>
                                <span>
                                    In Progress
                                </span>

                                <h2>
                                    {
                                        dashboardStats.inProgress
                                    }
                                </h2>

                                <small>
                                    Currently working
                                </small>
                            </div>

                            <div className="employee-stat-icon purple">
                                <Icon
                                    name="refresh"
                                    size={24}
                                />
                            </div>
                        </div>

                        <div className="employee-stat-card">
                            <div>
                                <span>
                                    Completed
                                </span>

                                <h2>
                                    {
                                        dashboardStats.completed
                                    }
                                </h2>

                                <small>
                                    Successfully completed
                                </small>
                            </div>

                            <div className="employee-stat-icon green">
                                <Icon
                                    name="check"
                                    size={24}
                                />
                            </div>
                        </div>

                    </section>

                    {/* QUICK SUMMARY */}
                    <section className="employee-summary-grid">

                        <div className="employee-summary-card">
                            <div className="employee-summary-icon">
                                <Icon
                                    name="box"
                                    size={22}
                                />
                            </div>

                            <div>
                                <span>
                                    Inventory Items
                                </span>

                                <strong>
                                    {
                                        totalInventoryItems
                                    }
                                </strong>
                            </div>
                        </div>

                        <div className="employee-summary-card">
                            <div className="employee-summary-icon">
                                <Icon
                                    name="hospital"
                                    size={22}
                                />
                            </div>

                            <div>
                                <span>
                                    Services
                                </span>

                                <strong>
                                    {
                                        uniqueServices.length
                                    }
                                </strong>
                            </div>
                        </div>

                        <button
                            className="employee-refresh-card"
                            onClick={loadTasks}
                            disabled={loading}
                        >
                            <Icon
                                name="refresh"
                                size={21}
                            />

                            <div>
                                <span>
                                    Dashboard
                                </span>

                                <strong>
                                    {loading
                                        ? "Refreshing..."
                                        : "Refresh Data"}
                                </strong>
                            </div>
                        </button>

                    </section>

                    {/* TASKS */}
                    <section className="employee-section-card">

                        <div className="employee-section-header">

                            <div>
                                <h2>
                                    My Tasks
                                </h2>

                                <p>
                                    Manage your assigned
                                    hospital tasks.
                                </p>
                            </div>

                            <span className="employee-count-badge">
                                {tasks.length}
                            </span>

                        </div>

                        {loading ? (
                            <div className="employee-loading-box">
                                <div className="spinner-border text-primary" />
                                <p>
                                    Loading dashboard...
                                </p>
                            </div>
                        ) : tasks.length === 0 ? (
                            <div className="employee-empty">
                                <div className="employee-empty-icon">
                                    <Icon
                                        name="task"
                                        size={34}
                                    />
                                </div>

                                <h3>
                                    No Tasks Assigned
                                </h3>

                                <p>
                                    You currently don't
                                    have any assigned
                                    tasks.
                                </p>
                            </div>
                        ) : (
                            <div className="employee-task-wrapper">

                                {/* DESKTOP */}
                                <div className="employee-task-desktop">
                                    <div className="table-responsive">
                                        <table className="table employee-table align-middle mb-0">

                                            <thead>
                                                <tr>
                                                    <th>
                                                        Task
                                                    </th>
                                                    <th>
                                                        Service
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
                                                {tasks.map(
                                                    (task) => {
                                                        const taskId =
                                                            getTaskId(
                                                                task
                                                            );

                                                        return (
                                                            <tr
                                                                key={
                                                                    taskId
                                                                }
                                                            >
                                                                <td>
                                                                    <strong>
                                                                        {task.taskName ||
                                                                            "Untitled Task"}
                                                                    </strong>

                                                                    <small>
                                                                        Task #
                                                                        {
                                                                            taskId
                                                                        }
                                                                    </small>
                                                                </td>

                                                                <td>
                                                                    <span className="employee-service-badge">
                                                                        {
                                                                            getServiceName(
                                                                                task
                                                                            )
                                                                        }
                                                                    </span>
                                                                </td>

                                                                <td>
                                                                    {task.appointmentId
                                                                        ? `#${task.appointmentId}`
                                                                        : "Direct Task"}
                                                                </td>

                                                                <td>
                                                                    {statusBadge(
                                                                        task.status
                                                                    )}
                                                                </td>

                                                                <td className="employee-result-cell">
                                                                    <textarea
                                                                        className="form-control"
                                                                        rows="2"
                                                                        value={
                                                                            task.result ||
                                                                            ""
                                                                        }
                                                                        placeholder="Enter result..."
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleResultChange(
                                                                                taskId,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
                                                                        }
                                                                    />
                                                                </td>

                                                                <td>
                                                                    <select
                                                                        className="form-select mb-2"
                                                                        value={
                                                                            task.status ||
                                                                            "PENDING"
                                                                        }
                                                                        onChange={(
                                                                            e
                                                                        ) =>
                                                                            handleStatusChange(
                                                                                taskId,
                                                                                e
                                                                                    .target
                                                                                    .value
                                                                            )
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

                                                                    <button
                                                                        className="btn btn-primary w-100"
                                                                        disabled={
                                                                            savingId ===
                                                                            taskId
                                                                        }
                                                                        onClick={() =>
                                                                            handleSave(
                                                                                task
                                                                            )
                                                                        }
                                                                    >
                                                                        {savingId ===
                                                                            taskId ? (
                                                                            <>
                                                                                <span className="spinner-border spinner-border-sm me-1" />
                                                                                Saving
                                                                            </>
                                                                        ) : (
                                                                            "Save Task"
                                                                        )}
                                                                    </button>
                                                                </td>
                                                            </tr>
                                                        );
                                                    }
                                                )}
                                            </tbody>

                                        </table>
                                    </div>
                                </div>

                                {/* MOBILE */}
                                <div className="employee-task-mobile">

                                    {tasks.map((task) => {
                                        const taskId =
                                            getTaskId(
                                                task
                                            );

                                        return (
                                            <div
                                                className="employee-task-card"
                                                key={
                                                    taskId
                                                }
                                            >

                                                <div className="employee-task-card-header">
                                                    <div>
                                                        <h3>
                                                            {task.taskName ||
                                                                "Untitled Task"}
                                                        </h3>

                                                        <small>
                                                            Task #
                                                            {
                                                                taskId
                                                            }
                                                        </small>
                                                    </div>

                                                    {statusBadge(
                                                        task.status
                                                    )}
                                                </div>

                                                <div className="employee-task-info-grid">

                                                    <div>
                                                        <span>
                                                            Service
                                                        </span>

                                                        <strong>
                                                            {
                                                                getServiceName(
                                                                    task
                                                                )
                                                            }
                                                        </strong>
                                                    </div>

                                                    <div>
                                                        <span>
                                                            Appointment
                                                        </span>

                                                        <strong>
                                                            {task.appointmentId
                                                                ? `#${task.appointmentId}`
                                                                : "Direct Task"}
                                                        </strong>
                                                    </div>

                                                </div>

                                                <label>
                                                    Update Status
                                                </label>

                                                <select
                                                    className="form-select mb-3"
                                                    value={
                                                        task.status ||
                                                        "PENDING"
                                                    }
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleStatusChange(
                                                            taskId,
                                                            e
                                                                .target
                                                                .value
                                                        )
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

                                                <label>
                                                    Result / Remarks
                                                </label>

                                                <textarea
                                                    className="form-control mb-3"
                                                    rows="4"
                                                    value={
                                                        task.result ||
                                                        ""
                                                    }
                                                    placeholder="Enter result or remarks..."
                                                    onChange={(
                                                        e
                                                    ) =>
                                                        handleResultChange(
                                                            taskId,
                                                            e
                                                                .target
                                                                .value
                                                        )
                                                    }
                                                />

                                                <button
                                                    className="btn btn-primary w-100"
                                                    disabled={
                                                        savingId ===
                                                        taskId
                                                    }
                                                    onClick={() =>
                                                        handleSave(
                                                            task
                                                        )
                                                    }
                                                >
                                                    {savingId ===
                                                        taskId ? (
                                                        <>
                                                            <span className="spinner-border spinner-border-sm me-2" />
                                                            Saving...
                                                        </>
                                                    ) : (
                                                        "Save Task"
                                                    )}
                                                </button>

                                            </div>
                                        );
                                    })}

                                </div>

                            </div>
                        )}

                    </section>

                    {/* INVENTORY */}
                    {!loading &&
                        !error &&
                        uniqueServices.length >
                        0 && (
                            <section className="employee-inventory-section">

                                <div className="employee-section-heading">
                                    <div>
                                        <h2>
                                            Service Inventory
                                        </h2>

                                        <p>
                                            Manage inventory
                                            assigned to your
                                            services.
                                        </p>
                                    </div>
                                </div>

                                {uniqueServices.map(
                                    (service) => (
                                        <div
                                            className="employee-inventory-section-card"
                                            key={
                                                service.serviceId
                                            }
                                        >

                                            <div className="employee-inventory-header">

                                                <div>
                                                    <span className="employee-service-label">
                                                        SERVICE
                                                    </span>

                                                    <h3>
                                                        <Icon
                                                            name="box"
                                                            size={21}
                                                        />

                                                        {
                                                            service.serviceName
                                                        }
                                                    </h3>

                                                    <small>
                                                        Service ID:{" "}
                                                        {
                                                            service.serviceId
                                                        }
                                                    </small>
                                                </div>

                                                <button
                                                    className="btn btn-outline-primary"
                                                    onClick={() =>
                                                        loadServiceInventory(
                                                            service.serviceId
                                                        )
                                                    }
                                                    disabled={
                                                        inventoryLoading[
                                                        service
                                                            .serviceId
                                                        ]
                                                    }
                                                >
                                                    <Icon
                                                        name="refresh"
                                                        size={16}
                                                    />

                                                    {inventoryLoading[
                                                        service
                                                            .serviceId
                                                    ]
                                                        ? "Loading..."
                                                        : "Refresh Inventory"}
                                                </button>

                                            </div>

                                            <div className="employee-inventory-body">
                                                {renderInventory(
                                                    service.serviceId
                                                )}
                                            </div>

                                        </div>
                                    )
                                )}

                            </section>
                        )}

                </div>
            </main>
        </div>
    );
};

export default EmployeeDashboard;