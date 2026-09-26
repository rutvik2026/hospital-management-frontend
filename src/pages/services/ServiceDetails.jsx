import React, { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    BriefcaseMedical,
    Edit,
    IndianRupee,
    Package,
    Plus,
    Pencil,
    Trash2,
    UserRound,
    UserPlus,
    UserMinus,
    X,
    Save,
    Users,
    RefreshCw
} from "lucide-react";

import {
    getDepartmentServices,

    // INVENTORY
    addInventory,
    updateInventory,
    deleteInventory,
    updateInventoryStock,
    getServiceInventories,

    // PATIENT
    addPatientToInventory,
    removePatientFromInventory,

    // SERVICE USERS
    addUserToService,
    removeUserFromService,
    getServiceUsers

} from "../../services/departmentService";

import "./ServiceDetails.css";


const ServiceDetails = () => {

    const navigate = useNavigate();

    const {
        departmentId,
        serviceId
    } = useParams();


    /* =========================================================
       STATE
       ========================================================= */

    const [service, setService] = useState(null);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================================
       USER
       ========================================================= */

    const user = JSON.parse(
        localStorage.getItem("user") || "null"
    );

    const isAdmin =
        user?.role === "ADMIN";


    /* =========================================================
       INVENTORY MODAL
       ========================================================= */

    const [inventoryModal, setInventoryModal] =
        useState(false);

    const [inventoryMode, setInventoryMode] =
        useState("add");

    const [selectedInventory, setSelectedInventory] =
        useState(null);

    const [inventoryLoading, setInventoryLoading] =
        useState(false);

    const [inventoryForm, setInventoryForm] =
        useState({
            name: "",
            fee: "",
            stock: ""
        });


    /* =========================================================
       PATIENT MODAL
       ========================================================= */

    const [patientModal, setPatientModal] =
        useState(false);

    const [selectedPatientInventory, setSelectedPatientInventory] =
        useState(null);

    const [patientId, setPatientId] =
        useState("");

    const [patientLoading, setPatientLoading] =
        useState(false);


    /* =========================================================
       USER MODAL
       ========================================================= */

    const [userModal, setUserModal] =
        useState(false);

    const [serviceUserId, setServiceUserId] =
        useState("");

    const [userLoading, setUserLoading] =
        useState(false);


    /* =========================================================
       LOAD SERVICE
       ========================================================= */

    useEffect(() => {

        loadService();

    }, [departmentId, serviceId]);


    const loadService = async () => {

        try {

            setLoading(true);

            setError("");


            /* =================================================
               1. GET SERVICES OF DEPARTMENT
               ================================================= */

            const response =
                await getDepartmentServices(
                    departmentId
                );


            const services =
                Array.isArray(response)
                    ? response
                    : [];


            /* =================================================
               2. FIND CURRENT SERVICE
               ================================================= */

            const found =
                services.find(
                    item =>
                        Number(item.id) ===
                        Number(serviceId)
                );


            if (!found) {

                setError(
                    "Service not found."
                );

                return;

            }


            /* =================================================
               3. GET INVENTORIES + SERVICE USERS
               ================================================= */

            const [
                inventoriesResponse,
                usersResponse
            ] = await Promise.all([

                getServiceInventories(
                    Number(serviceId)
                ),

                getServiceUsers(
                    Number(serviceId)
                )

            ]);


            /* =================================================
               4. CONVERT RESPONSE TO ARRAY
               ================================================= */

            const inventories =
                Array.isArray(inventoriesResponse)
                    ? inventoriesResponse
                    : [];


            const serviceUsers =
                Array.isArray(usersResponse)
                    ? usersResponse
                    : [];


            /* =================================================
               5. SAVE COMPLETE SERVICE
               ================================================= */

            setService({

                ...found,

                inventories,

                serviceUsers

            });


        } catch (err) {

            console.error(
                "Service loading error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load service."
            );

        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       UPDATE LOCAL INVENTORY
       ========================================================= */

    const updateLocalInventory = (
        inventoryId,
        updatedInventory
    ) => {

        setService(prev => {

            if (!prev) {
                return prev;
            }

            return {

                ...prev,

                inventories:
                    (prev.inventories || []).map(
                        inventory =>

                            Number(inventory.id) ===
                            Number(inventoryId)

                                ? {
                                    ...inventory,
                                    ...updatedInventory
                                }

                                : inventory
                    )

            };

        });

    };


    /* =========================================================
       OPEN ADD INVENTORY
       ========================================================= */

    const openAddInventory = () => {

        setInventoryMode("add");

        setSelectedInventory(null);

        setInventoryForm({
            name: "",
            fee: "",
            stock: ""
        });

        setInventoryModal(true);

    };


    /* =========================================================
       OPEN EDIT INVENTORY
       ========================================================= */

    const openEditInventory = (
        inventory
    ) => {

        setInventoryMode("edit");

        setSelectedInventory(
            inventory
        );

        setInventoryForm({

            name:
                inventory?.name ||
                "",

            fee:
                inventory?.fee ??
                "",

            stock:
                inventory?.stock ??
                ""

        });

        setInventoryModal(true);

    };


    /* =========================================================
       CLOSE INVENTORY MODAL
       ========================================================= */

    const closeInventoryModal = () => {

        if (inventoryLoading) {
            return;
        }

        setInventoryModal(false);

        setSelectedInventory(null);

        setInventoryForm({
            name: "",
            fee: "",
            stock: ""
        });

    };


    /* =========================================================
       INVENTORY CHANGE
       ========================================================= */

    const handleInventoryChange = (
        e
    ) => {

        const {
            name,
            value
        } = e.target;

        setInventoryForm(prev => ({

            ...prev,

            [name]: value

        }));

    };


    /* =========================================================
       ADD / UPDATE INVENTORY
       ========================================================= */

    const handleInventorySubmit = async (
        e
    ) => {

        e.preventDefault();


        if (
            !inventoryForm.name.trim()
        ) {

            alert(
                "Inventory name is required."
            );

            return;
        }


        if (
            inventoryForm.fee === "" ||
            Number(inventoryForm.fee) < 0
        ) {

            alert(
                "Please enter a valid fee."
            );

            return;
        }


        if (
            inventoryForm.stock === "" ||
            Number(inventoryForm.stock) < 0
        ) {

            alert(
                "Please enter a valid stock."
            );

            return;
        }


        try {

            setInventoryLoading(true);


            const payload = {

                name:
                    inventoryForm.name.trim(),

                fee:
                    Number(
                        inventoryForm.fee
                    ),

                stock:
                    Number(
                        inventoryForm.stock
                    )

            };


            /* =========================
               UPDATE
               ========================= */

            if (
                inventoryMode === "edit" &&
                selectedInventory
            ) {

                const updated =
                    await updateInventory(
                        selectedInventory.id,
                        payload
                    );


                updateLocalInventory(
                    selectedInventory.id,
                    updated
                );

            }


            /* =========================
               ADD
               ========================= */

            else {

                const created =
                    await addInventory(
                        service.id,
                        payload
                    );


                setService(prev => ({

                    ...prev,

                    inventories: [

                        ...(prev.inventories || []),

                        created

                    ]

                }));

            }


            closeInventoryModal();


        } catch (err) {

            console.error(
                "Inventory save error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to save inventory."
            );

        } finally {

            setInventoryLoading(false);

        }

    };


    /* =========================================================
       DELETE INVENTORY
       ========================================================= */

    const handleDeleteInventory = async (
        inventoryId
    ) => {

        const confirmed =
            window.confirm(
                "Are you sure you want to delete this inventory?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await deleteInventory(
                inventoryId
            );


            setService(prev => ({

                ...prev,

                inventories:
                    (prev.inventories || [])
                        .filter(
                            inventory =>
                                Number(inventory.id) !==
                                Number(inventoryId)
                        )

            }));


        } catch (err) {

            console.error(
                "Delete inventory error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to delete inventory."
            );

        }

    };


    /* =========================================================
       UPDATE STOCK
       ========================================================= */

    const handleUpdateStock = async (
        inventory
    ) => {

        const value =
            window.prompt(
                "Enter new stock:",
                inventory.stock ?? 0
            );


        if (
            value === null ||
            value.trim() === ""
        ) {

            return;

        }


        const newStock =
            Number(value);


        if (
            !Number.isInteger(newStock) ||
            newStock < 0
        ) {

            alert(
                "Please enter a valid stock number."
            );

            return;
        }


        try {

            const updated =
                await updateInventoryStock(
                    inventory.id,
                    newStock
                );


            updateLocalInventory(
                inventory.id,
                updated
            );


        } catch (err) {

            console.error(
                "Stock update error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to update stock."
            );

        }

    };


    /* =========================================================
       OPEN PATIENT MODAL
       ========================================================= */

    const openPatientModal = (
        inventory
    ) => {

        setSelectedPatientInventory(
            inventory
        );

        setPatientId("");

        setPatientModal(true);

    };


    /* =========================================================
       CLOSE PATIENT MODAL
       ========================================================= */

    const closePatientModal = () => {

        if (patientLoading) {
            return;
        }

        setPatientModal(false);

        setSelectedPatientInventory(
            null
        );

        setPatientId("");

    };


    /* =========================================================
       ADD PATIENT
       ========================================================= */

    const handleAddPatient = async (
        e
    ) => {

        e.preventDefault();


        if (!patientId) {

            alert(
                "Please enter patient ID."
            );

            return;
        }


        try {

            setPatientLoading(true);


            const response =
                await addPatientToInventory(
                    selectedPatientInventory.id,
                    Number(patientId)
                );


            updateLocalInventory(
                selectedPatientInventory.id,
                response
            );


            closePatientModal();


        } catch (err) {

            console.error(
                "Add patient error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to add patient."
            );

        } finally {

            setPatientLoading(false);

        }

    };


    /* =========================================================
       REMOVE PATIENT
       ========================================================= */

    const handleRemovePatient = async (
        inventory
    ) => {

        const confirmed =
            window.confirm(
                "Remove this patient from the inventory?"
            );


        if (!confirmed) {
            return;
        }


        try {

            const response =
                await removePatientFromInventory(
                    inventory.id
                );


            updateLocalInventory(
                inventory.id,
                response
            );


        } catch (err) {

            console.error(
                "Remove patient error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to remove patient."
            );

        }

    };


    /* =========================================================
       OPEN USER MODAL
       ========================================================= */

    const openUserModal = () => {

        setServiceUserId("");

        setUserModal(true);

    };


    /* =========================================================
       CLOSE USER MODAL
       ========================================================= */

    const closeUserModal = () => {

        if (userLoading) {
            return;
        }

        setUserModal(false);

        setServiceUserId("");

    };


    /* =========================================================
       ADD USER TO SERVICE
       ========================================================= */

    const handleAddUser = async (
        e
    ) => {

        e.preventDefault();


        if (!serviceUserId) {

            alert(
                "Please enter user ID."
            );

            return;
        }


        try {

            setUserLoading(true);


            await addUserToService(
                Number(serviceUserId),
                Number(service.id)
            );


            /*
             * Reload the service.
             *
             * loadService() now calls:
             *
             * GET inventories
             * GET service users
             *
             * so the newly added user
             * appears in the UI.
             */

            await loadService();


            closeUserModal();


        } catch (err) {

            console.error(
                "Add service user error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to add user."
            );

        } finally {

            setUserLoading(false);

        }

    };


    /* =========================================================
       REMOVE USER
       ========================================================= */

    const handleRemoveUser = async (
        userId
    ) => {

        const confirmed =
            window.confirm(
                "Remove this user from the service?"
            );


        if (!confirmed) {
            return;
        }


        try {

            await removeUserFromService(
                Number(userId),
                Number(service.id)
            );


            /*
             * Reload service.
             *
             * This calls getServiceUsers()
             * again and refreshes the UI.
             */

            await loadService();


        } catch (err) {

            console.error(
                "Remove service user error:",
                err
            );


            alert(
                err?.response?.data?.message ||
                "Unable to remove user."
            );

        }

    };


    /* =========================================================
       PATIENT DISPLAY
       ========================================================= */

    const getPatientDisplay = (
        inventory
    ) => {

        if (!inventory?.patient) {

            return "No patient assigned";

        }


        if (
            typeof inventory.patient ===
            "string"
        ) {

            return inventory.patient;

        }


        return (

            inventory.patient.name ||

            inventory.patient.patientName ||

            `Patient #${inventory.patient.id || ""}`

        );

    };


    /* =========================================================
       STOCK CLASS
       ========================================================= */

    const getStockClass = (
        stock
    ) => {

        const value =
            Number(stock ?? 0);


        if (value <= 0) {

            return "stock-empty";

        }


        if (value <= 5) {

            return "stock-low";

        }


        return "stock-normal";

    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="service-details-page">

                <div className="service-details-loading">

                    <div className="service-spinner" />

                    <p>
                        Loading service...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================================================
       ERROR
       ========================================================= */

    if (
        error ||
        !service
    ) {

        return (

            <div className="service-details-page">

                <button
                    className="service-details-back"
                    onClick={() =>
                        navigate(
                            `/admin/departments/${departmentId}`
                        )
                    }
                >

                    <ArrowLeft size={17} />

                    Back

                </button>


                <div className="service-details-error">

                    <BriefcaseMedical
                        size={30}
                    />

                    <h3>
                        Service unavailable
                    </h3>

                    <p>
                        {error ||
                            "Service not found."}
                    </p>

                </div>

            </div>

        );

    }


    /* =========================================================
       GET INVENTORIES FROM GET API
       ========================================================= */

    const inventories =
        Array.isArray(
            service.inventories
        )
            ? service.inventories
            : [];


    /* =========================================================
       GET USERS FROM GET API
       ========================================================= */

    const serviceUsers =
        Array.isArray(
            service.serviceUsers
        )
            ? service.serviceUsers
            : [];


    /* =========================================================
       MAIN UI
       ========================================================= */

    return (

        <div className="service-details-page">


            {/* =================================================
               HEADER
               ================================================= */}

            <div className="service-details-header">

                <div className="service-header-left">

                    <button
                        className="service-details-back"
                        onClick={() =>
                            navigate(
                                `/admin/departments/${departmentId}`
                            )
                        }
                    >

                        <ArrowLeft
                            size={17}
                        />

                    </button>


                    <div>

                        <div className="service-details-eyebrow">

                            Hospital Management

                        </div>


                        <h1>
                            {service.serviceName}
                        </h1>


                        <p>
                            Service details and
                            inventory management.
                        </p>

                    </div>

                </div>

            </div>



            {/* =================================================
               SERVICE INFORMATION
               ================================================= */}

            <div className="service-information-card">

                <div className="service-information-header">

                    <div className="service-information-title">

                        <div className="service-information-icon">

                            <BriefcaseMedical
                                size={21}
                            />

                        </div>


                        <div>

                            <h2>
                                Service Information
                            </h2>

                            <p>
                                Basic information about
                                this healthcare service.
                            </p>

                        </div>

                    </div>


                    {isAdmin && (

                        <button
                            className="service-edit-button"
                            onClick={() =>
                                navigate(
                                    `/admin/departments/${departmentId}/services/edit/${service.id}`
                                )
                            }
                        >

                            <Edit size={15} />

                            Edit Service

                        </button>

                    )}

                </div>


                <div className="service-information-body">

                    <div className="service-info-row">

                        <span>
                            Service
                        </span>

                        <strong>
                            {service.serviceName}
                        </strong>

                    </div>


                    <div className="service-info-row">

                        <span>
                            Service ID
                        </span>

                        <strong>
                            #{service.id}
                        </strong>

                    </div>


                    <div className="service-info-row">

                        <span>
                            Service Fee
                        </span>

                        <strong className="service-fee">

                            <IndianRupee
                                size={14}
                            />

                            {service.serviceFee ?? 0}

                        </strong>

                    </div>


                    <div className="service-info-row">

                        <span>
                            Description
                        </span>

                        <strong>
                            {service.description ||
                                "No description"}
                        </strong>

                    </div>


                    <div className="service-info-row">

                        <span>
                            Result / Output
                        </span>

                        <strong>
                            {service.result ||
                                "Not specified"}
                        </strong>

                    </div>

                </div>

            </div>



            {/* =================================================
               INVENTORY
               ================================================= */}

            <div className="service-management-card">

                <div className="service-management-header">

                    <div className="service-section-title">

                        <div className="service-section-icon">

                            <Package
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Inventory
                            </h2>

                            <p>
                                Manage inventory associated
                                with this service.
                            </p>

                        </div>

                    </div>


                    {isAdmin && (

                        <button
                            className="service-primary-button"
                            onClick={
                                openAddInventory
                            }
                        >

                            <Plus size={16} />

                            Add Inventory

                        </button>

                    )}

                </div>


                <div className="service-management-body">


                    {inventories.length === 0 ? (

                        <div className="service-empty-management">

                            <Package
                                size={28}
                            />

                            <h4>
                                No inventory
                            </h4>

                            <p>
                                No inventory has been
                                added to this service.
                            </p>


                            {isAdmin && (

                                <button
                                    className="service-outline-button"
                                    onClick={
                                        openAddInventory
                                    }
                                >

                                    <Plus size={15} />

                                    Add Inventory

                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="service-inventory-list">

                            {inventories.map(
                                inventory => (

                                    <div
                                        className="service-inventory-item"
                                        key={
                                            inventory.id
                                        }
                                    >


                                        {/* INFO */}

                                        <div className="inventory-main">

                                            <div className="inventory-icon">

                                                <Package
                                                    size={18}
                                                />

                                            </div>


                                            <div>

                                                <strong>
                                                    {
                                                        inventory.name
                                                    }
                                                </strong>

                                                <small>
                                                    Inventory #
                                                    {
                                                        inventory.id
                                                    }
                                                </small>

                                            </div>

                                        </div>


                                        {/* FEE */}

                                        <div className="inventory-column">

                                            <span>
                                                Fee
                                            </span>

                                            <strong>

                                                <IndianRupee
                                                    size={13}
                                                />

                                                {
                                                    inventory.fee ??
                                                    0
                                                }

                                            </strong>

                                        </div>


                                        {/* STOCK */}

                                        <div className="inventory-column">

                                            <span>
                                                Stock
                                            </span>

                                            <strong
                                                className={
                                                    getStockClass(
                                                        inventory.stock
                                                    )
                                                }
                                            >

                                                {
                                                    inventory.stock ??
                                                    0
                                                }

                                            </strong>

                                        </div>


                                        {/* PATIENT */}

                                        <div className="inventory-column patient-column">

                                            <span>
                                                Patient
                                            </span>

                                            <strong>

                                                <UserRound
                                                    size={13}
                                                />

                                                {
                                                    getPatientDisplay(
                                                        inventory
                                                    )
                                                }

                                            </strong>

                                        </div>


                                        {/* ACTIONS */}

                                        <div className="inventory-actions">

                                            <button
                                                type="button"
                                                className="inventory-action stock"
                                                onClick={() =>
                                                    handleUpdateStock(
                                                        inventory
                                                    )
                                                }
                                            >

                                                <RefreshCw
                                                    size={14}
                                                />

                                                Stock

                                            </button>


                                            {!inventory.patient ? (

                                                <button
                                                    type="button"
                                                    className="inventory-action patient"
                                                    onClick={() =>
                                                        openPatientModal(
                                                            inventory
                                                        )
                                                    }
                                                >

                                                    <UserPlus
                                                        size={14}
                                                    />

                                                    Patient

                                                </button>

                                            ) : (

                                                <button
                                                    type="button"
                                                    className="inventory-action remove-patient"
                                                    onClick={() =>
                                                        handleRemovePatient(
                                                            inventory
                                                        )
                                                    }
                                                >

                                                    <UserMinus
                                                        size={14}
                                                    />

                                                    Remove

                                                </button>

                                            )}


                                            {isAdmin && (

                                                <>

                                                    <button
                                                        type="button"
                                                        className="inventory-icon-button edit"
                                                        title="Edit inventory"
                                                        onClick={() =>
                                                            openEditInventory(
                                                                inventory
                                                            )
                                                        }
                                                    >

                                                        <Pencil
                                                            size={14}
                                                        />

                                                    </button>


                                                    <button
                                                        type="button"
                                                        className="inventory-icon-button delete"
                                                        title="Delete inventory"
                                                        onClick={() =>
                                                            handleDeleteInventory(
                                                                inventory.id
                                                            )
                                                        }
                                                    >

                                                        <Trash2
                                                            size={14}
                                                        />

                                                    </button>

                                                </>

                                            )}

                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>



            {/* =================================================
               SERVICE USERS
               ================================================= */}

            <div className="service-management-card">

                <div className="service-management-header">

                    <div className="service-section-title">

                        <div className="service-section-icon users">

                            <Users
                                size={20}
                            />

                        </div>


                        <div>

                            <h2>
                                Service Users
                            </h2>

                            <p>
                                Employees assigned to this
                                service.
                            </p>

                        </div>

                    </div>


                    {isAdmin && (

                        <button
                            className="service-primary-button"
                            onClick={
                                openUserModal
                            }
                        >

                            <UserPlus
                                size={16}
                            />

                            Add User

                        </button>

                    )}

                </div>


                <div className="service-management-body">


                    {serviceUsers.length === 0 ? (

                        <div className="service-empty-management">

                            <Users
                                size={28}
                            />

                            <h4>
                                No users assigned
                            </h4>

                            <p>
                                No employees are currently
                                assigned to this service.
                            </p>

                            {isAdmin && (

                                <button
                                    className="service-outline-button"
                                    onClick={
                                        openUserModal
                                    }
                                >

                                    <UserPlus
                                        size={15}
                                    />

                                    Add User

                                </button>

                            )}

                        </div>

                    ) : (

                        <div className="service-users-list">

                            {serviceUsers.map(
                                serviceUser => (

                                    <div
                                        className="service-user-item"
                                        key={
                                            serviceUser.id
                                        }
                                    >

                                        <div className="service-user-avatar">

                                            <UserRound
                                                size={18}
                                            />

                                        </div>


                                        <div className="service-user-info">

                                            <strong>

                                                {
                                                    serviceUser.name ||
                                                    serviceUser.username ||
                                                    `User #${serviceUser.id}`
                                                }

                                            </strong>

                                            <small>

                                                ID #
                                                {
                                                    serviceUser.id
                                                }

                                                {serviceUser.email &&
                                                    ` • ${serviceUser.email}`}

                                            </small>

                                        </div>


                                        {isAdmin && (

                                            <button
                                                type="button"
                                                className="service-user-remove"
                                                onClick={() =>
                                                    handleRemoveUser(
                                                        serviceUser.id
                                                    )
                                                }
                                            >

                                                <UserMinus
                                                    size={15}
                                                />

                                                Remove

                                            </button>

                                        )}

                                    </div>

                                )
                            )}

                        </div>

                    )}

                </div>

            </div>



            {/* =================================================
               INVENTORY MODAL
               ================================================= */}

            {inventoryModal && (

                <div className="service-modal-overlay">

                    <div className="service-modal">

                        <div className="service-modal-header">

                            <div>

                                <h3>

                                    {inventoryMode === "edit"
                                        ? "Edit Inventory"
                                        : "Add Inventory"}

                                </h3>

                                <p>
                                    {service.serviceName}
                                </p>

                            </div>


                            <button
                                className="service-modal-close"
                                onClick={
                                    closeInventoryModal
                                }
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleInventorySubmit
                            }
                        >

                            <div className="service-form-group">

                                <label>
                                    Inventory Name
                                </label>

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        inventoryForm.name
                                    }
                                    onChange={
                                        handleInventoryChange
                                    }
                                    placeholder="e.g. BP Machine"
                                />

                            </div>


                            <div className="service-form-group">

                                <label>
                                    Fee
                                </label>

                                <input
                                    type="number"
                                    name="fee"
                                    value={
                                        inventoryForm.fee
                                    }
                                    onChange={
                                        handleInventoryChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="Enter fee"
                                />

                            </div>


                            <div className="service-form-group">

                                <label>
                                    Stock
                                </label>

                                <input
                                    type="number"
                                    name="stock"
                                    value={
                                        inventoryForm.stock
                                    }
                                    onChange={
                                        handleInventoryChange
                                    }
                                    min="0"
                                    placeholder="Enter stock"
                                />

                            </div>


                            <div className="service-modal-actions">

                                <button
                                    type="button"
                                    className="service-cancel-button"
                                    onClick={
                                        closeInventoryModal
                                    }
                                    disabled={
                                        inventoryLoading
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="service-save-button"
                                    disabled={
                                        inventoryLoading
                                    }
                                >

                                    <Save
                                        size={15}
                                    />

                                    {inventoryLoading
                                        ? "Saving..."
                                        : inventoryMode === "edit"
                                            ? "Update Inventory"
                                            : "Add Inventory"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}



            {/* =================================================
               PATIENT MODAL
               ================================================= */}

            {patientModal && (

                <div className="service-modal-overlay">

                    <div className="service-modal">

                        <div className="service-modal-header">

                            <div>

                                <h3>
                                    Add Patient
                                </h3>

                                <p>
                                    Assign patient to inventory
                                </p>

                            </div>


                            <button
                                className="service-modal-close"
                                onClick={
                                    closePatientModal
                                }
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleAddPatient
                            }
                        >

                            <div className="service-form-group">

                                <label>
                                    Patient ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={patientId}
                                    onChange={e =>
                                        setPatientId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter patient ID"
                                    autoFocus
                                />

                            </div>


                            <div className="service-modal-actions">

                                <button
                                    type="button"
                                    className="service-cancel-button"
                                    onClick={
                                        closePatientModal
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="service-save-button"
                                    disabled={
                                        patientLoading
                                    }
                                >

                                    <UserPlus
                                        size={15}
                                    />

                                    {patientLoading
                                        ? "Adding..."
                                        : "Add Patient"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}



            {/* =================================================
               ADD USER MODAL
               ================================================= */}

            {userModal && (

                <div className="service-modal-overlay">

                    <div className="service-modal">

                        <div className="service-modal-header">

                            <div>

                                <h3>
                                    Add User
                                </h3>

                                <p>
                                    Assign an employee to this
                                    service.
                                </p>

                            </div>


                            <button
                                className="service-modal-close"
                                onClick={
                                    closeUserModal
                                }
                            >

                                <X size={18} />

                            </button>

                        </div>


                        <form
                            onSubmit={
                                handleAddUser
                            }
                        >

                            <div className="service-form-group">

                                <label>
                                    User ID
                                </label>

                                <input
                                    type="number"
                                    min="1"
                                    value={
                                        serviceUserId
                                    }
                                    onChange={e =>
                                        setServiceUserId(
                                            e.target.value
                                        )
                                    }
                                    placeholder="Enter employee user ID"
                                    autoFocus
                                />

                            </div>


                            <div className="service-modal-actions">

                                <button
                                    type="button"
                                    className="service-cancel-button"
                                    onClick={
                                        closeUserModal
                                    }
                                >

                                    Cancel

                                </button>


                                <button
                                    type="submit"
                                    className="service-save-button"
                                    disabled={
                                        userLoading
                                    }
                                >

                                    <UserPlus
                                        size={15}
                                    />

                                    {userLoading
                                        ? "Adding..."
                                        : "Add User"}

                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>

    );

};


export default ServiceDetails;