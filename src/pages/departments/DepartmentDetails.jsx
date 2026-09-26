import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Building2,
    UserRound,
    BriefcaseMedical,
    Pencil,
    Plus,
    Users,
    ArrowRight
} from "lucide-react";

import {
    getDepartments,
    getDepartmentServices
} from "../../services/departmentService";

import "./DepartmentDetails.css";


const DepartmentDetails = () => {

    const navigate = useNavigate();

    const { departmentId } = useParams();


    /* =========================================================
       STATE
       ========================================================= */

    const [department, setDepartment] = useState(null);

    const [services, setServices] = useState([]);

    const [loading, setLoading] = useState(true);

    const [error, setError] = useState("");


    /* =========================================================
       USER
       ========================================================= */

    const user = JSON.parse(
        localStorage.getItem("user")
    );

    const isAdmin = user?.role === "ADMIN";


    /* =========================================================
       LOAD DEPARTMENT
       ========================================================= */

    useEffect(() => {

        loadDepartment();

    }, [departmentId]);


    const loadDepartment = async () => {

        try {

            setLoading(true);

            setError("");


            /* =================================================
               GET ALL DEPARTMENTS
               ================================================= */

            const departments =
                await getDepartments();


            /* =================================================
               FIND CURRENT DEPARTMENT
               ================================================= */

            const selectedDepartment =
                departments.find(
                    (item) =>
                        Number(item.id) ===
                        Number(departmentId)
                );


            if (!selectedDepartment) {

                setError(
                    "Department not found."
                );

                return;
            }


            console.log(
                "Selected Department:",
                selectedDepartment
            );


            setDepartment(
                selectedDepartment
            );


            /* =================================================
               GET SERVICES
               ================================================= */

            const serviceData =
                await getDepartmentServices(
                    departmentId
                );


            console.log(
                "Department Services:",
                serviceData
            );


            /*
             * Backend may directly return an array.
             */

            if (Array.isArray(serviceData)) {

                setServices(serviceData);

            }

            /*
             * In case response is wrapped inside
             * services/data.
             */

            else if (
                Array.isArray(
                    serviceData?.services
                )
            ) {

                setServices(
                    serviceData.services
                );

            }

            else if (
                Array.isArray(
                    serviceData?.data
                )
            ) {

                setServices(
                    serviceData.data
                );

            }

            else {

                setServices([]);

            }


        } catch (err) {

            console.error(
                "Department details error:",
                err
            );


            console.error(
                "Response:",
                err?.response?.data
            );


            setError(
                err?.response?.data?.message ||
                "Unable to load department."
            );


        } finally {

            setLoading(false);

        }

    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="department-details-page">

                <div className="details-loading">

                    <div className="spinner-border text-primary" />

                    <p>
                        Loading department...
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
        !department
    ) {

        return (

            <div className="department-details-page">

                <button
                    className="details-back-button"
                    onClick={() =>
                        navigate("/admin/departments")
                    }
                >

                    <ArrowLeft size={17} />

                    Departments

                </button>


                <div className="details-error">

                    <Building2 size={28} />

                    <h4>
                        Department unavailable
                    </h4>

                    <p>
                        {error ||
                            "Department could not be found."}
                    </p>

                </div>

            </div>

        );

    }


    /* =========================================================
       MAIN UI
       ========================================================= */

    return (

        <div className="department-details-page">


            {/* =================================================
                HEADER
               ================================================= */}

            <div className="details-header">

                <div className="details-header-left">

                    <button
                        className="details-back-button"
                        onClick={() =>
                            navigate("/admin/departments")
                        }
                    >

                        <ArrowLeft size={17} />

                    </button>


                    <div>

                        <div className="details-eyebrow">
                            Hospital Management
                        </div>


                        <h1>
                            {department.deptName}
                        </h1>


                        <p>
                            Department overview and available
                            healthcare services.
                        </p>

                    </div>

                </div>


                {isAdmin && (

                    <button
                        className="details-edit-button"
                        onClick={() =>
                            navigate(
                                `/admin/departments/edit/${department.id}`
                            )
                        }
                    >

                        <Pencil size={16} />

                        Edit Department

                    </button>

                )}

            </div>



            {/* =================================================
                INFORMATION
               ================================================= */}

            <div className="department-info-grid">


                {/* =================================================
                   BASIC INFORMATION
                   ================================================= */}

                <div className="details-card">

                    <div className="details-card-header">

                        <div className="details-card-icon">

                            <Building2 size={19} />

                        </div>


                        <div>

                            <h2>
                                Department Information
                            </h2>

                            <p>
                                Basic department details
                            </p>

                        </div>

                    </div>


                    <div className="details-card-body">

                        <div className="info-item">

                            <span>
                                Department
                            </span>

                            <strong>
                                {department.deptName}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Department ID
                            </span>

                            <strong>
                                #{department.id}
                            </strong>

                        </div>


                        <div className="info-item">

                            <span>
                                Status
                            </span>

                            <span className="status-badge">
                                Active
                            </span>

                        </div>

                    </div>

                </div>



                {/* =================================================
                   HEAD OF DEPARTMENT
                   ================================================= */}

                <div className="details-card">

                    <div className="details-card-header">

                        <div className="details-card-icon purple">

                            <UserRound size={19} />

                        </div>


                        <div>

                            <h2>
                                Head of Department
                            </h2>

                            <p>
                                Department leadership
                            </p>

                        </div>

                    </div>


                    <div className="details-card-body">

                        <div className="department-head-profile">

                            <div className="department-head-avatar">

                                <UserRound size={22} />

                            </div>


                            <div>

                                <h3>
                                    {department.headOfDeptName ||
                                        "Not assigned"}
                                </h3>


                                {department.headOfDeptEmail && (

                                    <p>
                                        {department.headOfDeptEmail}
                                    </p>

                                )}

                            </div>

                        </div>

                    </div>

                </div>

            </div>



            {/* =================================================
                DEPARTMENT ROLES
               ================================================= */}

            <div className="details-card roles-card">

                <div className="details-card-header">

                    <div className="details-card-icon green">

                        <Users size={19} />

                    </div>


                    <div>

                        <h2>
                            Department Roles
                        </h2>

                        <p>
                            Roles associated with this department
                        </p>

                    </div>

                </div>


                <div className="roles-body">

                    {Array.isArray(
                        department.deptRole
                    ) &&
                        department.deptRole.length > 0 ? (

                        department.deptRole.map(
                            (role, index) => (

                                <span
                                    key={index}
                                    className="details-role-badge"
                                >

                                    {role}

                                </span>

                            )
                        )

                    ) : (

                        <span className="details-muted">

                            No department roles configured.

                        </span>

                    )}

                </div>

            </div>



            {/* =================================================
                SERVICES
               ================================================= */}

            <div className="details-card services-card">


                {/* =================================================
                   SERVICES HEADER
                   ================================================= */}

                <div className="services-header">

                    <div className="details-card-header border-0">

                        <div className="details-card-icon blue">

                            <BriefcaseMedical size={19} />

                        </div>


                        <div>

                            <h2>
                                Department Services
                            </h2>

                            <p>
                                Healthcare services provided by
                                this department
                            </p>

                        </div>

                    </div>


                    {isAdmin && (

                        <button
                            className="add-service-button"
                            onClick={() =>
                                navigate(
                                    `/admin/departments/${department.id}/services/add`
                                )
                            }
                        >

                            <Plus size={17} />

                            Add Service

                        </button>

                    )}

                </div>



                {/* =================================================
                    NO SERVICES
                   ================================================= */}

                {services.length === 0 ? (

                    <div className="no-services">

                        <div className="no-services-icon">

                            <BriefcaseMedical size={25} />

                        </div>


                        <h4>
                            No services available
                        </h4>


                        <p>
                            This department does not have any
                            services configured yet.
                        </p>


                        {isAdmin && (

                            <button
                                className="add-service-outline"
                                onClick={() =>
                                    navigate(
                                        `/admin/departments/${department.id}/services/add`
                                    )
                                }
                            >

                                <Plus size={16} />

                                Add First Service

                            </button>

                        )}

                    </div>

                ) : (

                    /* =================================================
                       SERVICE LIST
                       ================================================= */

                    <div className="service-list">

                        {services.map(
                            (service) => (

                                <div
                                    className="service-list-item"
                                    key={service.id}
                                >

                                    {/* SERVICE INFORMATION */}

                                    <div className="service-list-main">

                                        <div className="service-list-icon">

                                            <BriefcaseMedical
                                                size={18}
                                            />

                                        </div>


                                        <div className="service-list-info">

                                            <h3>
                                                {
                                                    service.serviceName
                                                }
                                            </h3>

                                            <span>
                                                Service #
                                                {
                                                    service.id
                                                }
                                            </span>

                                        </div>

                                    </div>



                                    {/* DESCRIPTION */}

                                    <div className="service-list-description">

                                        {
                                            service.description ||
                                            "No description"
                                        }

                                    </div>



                                    {/* FEE */}

                                    <div className="service-list-fee">

                                        ₹{" "}

                                        {
                                            service.serviceFee ??
                                            0
                                        }

                                    </div>



                                    {/* SEE MORE */}

                                    <button
                                        type="button"
                                        className="service-see-more-button"
                                        onClick={() =>
                                            navigate(
                                                `/admin/departments/${department.id}/services/${service.id}`
                                            )
                                        }
                                    >

                                        See More

                                        <ArrowRight
                                            size={15}
                                        />

                                    </button>

                                </div>

                            )
                        )}

                    </div>

                )}

            </div>

        </div>

    );

};


export default DepartmentDetails;