import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    Search,
    Plus,
    Eye,
    Pencil,
    Trash2,
    Building2,
    Users,
    BriefcaseMedical,
    RefreshCw,
} from "lucide-react";

import "./Departments.css";
import { getDepartments,deleteDepartment } from "../../services/departmentService";

const Departments = () => {
    const navigate = useNavigate();

    const [departments, setDepartments] = useState([]);
    const [search, setSearch] = useState("");
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const user = JSON.parse(localStorage.getItem("user"));
    const isAdmin = user?.role === "ADMIN";

    useEffect(() => {
        loadDepartments();
    }, []);

    const loadDepartments = async () => {
        try {
            setLoading(true);
            setError("");

            const data = await getDepartments();

            console.log("========== DEPARTMENT API ==========");
            console.log("Response:", data);
            console.log("Is Array:", Array.isArray(data));
            console.log("Department Count:", data?.length);
            console.log("Departments:", data);
            console.log("====================================");

            setDepartments(Array.isArray(data) ? data : []);

        } catch (err) {
            console.error("Department loading error:", err);

            console.error(
                "Response data:",
                err?.response?.data
            );

            console.error(
                "Response status:",
                err?.response?.status
            );

            setError(
                err?.response?.data?.message ||
                "Unable to load departments."
            );
        } finally {
            setLoading(false);
        }
    };

    const filteredDepartments = departments.filter((department) =>
        department?.deptName
            ?.toLowerCase()
            .includes(search.toLowerCase())
    );

    const handleDelete = async (id) => {
        const confirmed = window.confirm(
            "Are you sure you want to delete this department?"
        );
        const data = await deleteDepartment(id);
        if (!confirmed) return;

        // Connect delete department API here
        console.log("Delete department:",data);
    };

    return (
        <div className="department-page">

            {/* ================= PAGE HEADER ================= */}

            <div className="department-header">

                <div>

                    <div className="d-flex align-items-center gap-2 mb-2">

                        <div className="department-title-icon">
                            <Building2 size={19} />
                        </div>

                        <span className="department-eyebrow">
                            Hospital Management
                        </span>

                    </div>

                    <h1 className="department-title">
                        Departments
                    </h1>

                    <p className="department-subtitle">
                        View and manage hospital departments,
                        department heads and available services.
                    </p>

                </div>

                {isAdmin && (
                    <button
                        type="button"
                        className="department-primary-btn"
                        onClick={() =>
                            navigate("/admin/departments/add")
                        }
                    >
                        <Plus size={18} />
                        Add Department
                    </button>
                )}

            </div>


            {/* ================= MAIN CARD ================= */}

            <div className="department-card">

                {/* CARD HEADER */}

                <div className="department-card-header">

                    <div className="department-card-title">

                        <div className="department-card-icon">
                            <Building2 size={20} />
                        </div>

                        <div>

                            <h2>
                                Hospital Departments
                            </h2>

                            <p>
                                {departments.length} departments registered
                            </p>

                        </div>

                    </div>


                    {/* SEARCH */}

                    <div className="department-search">

                        <Search size={18} />

                        <input
                            type="text"
                            placeholder="Search department..."
                            value={search}
                            onChange={(e) =>
                                setSearch(e.target.value)
                            }
                        />

                    </div>

                </div>


                {/* ================= LOADING ================= */}

                {loading && (
                    <div className="department-state">

                        <div className="spinner-border text-primary" />

                        <p>
                            Loading departments...
                        </p>

                    </div>
                )}


                {/* ================= ERROR ================= */}

                {!loading && error && (
                    <div className="department-error-wrapper">

                        <div className="department-error">

                            <p>
                                {error}
                            </p>

                            <button
                                onClick={loadDepartments}
                                className="btn btn-outline-danger btn-sm d-flex align-items-center gap-2 mx-auto"
                            >
                                <RefreshCw size={15} />
                                Try Again
                            </button>

                        </div>

                    </div>
                )}


                {/* ================= EMPTY ================= */}

                {!loading &&
                    !error &&
                    filteredDepartments.length === 0 && (

                        <div className="department-state">

                            <div className="department-empty-icon">
                                <Building2 size={25} />
                            </div>

                            <h5>
                                No departments found
                            </h5>

                            <p>
                                Try searching with another department name.
                            </p>

                        </div>
                    )}


                {/* ================= TABLE ================= */}

                {!loading &&
                    !error &&
                    filteredDepartments.length > 0 && (

                        <div className="table-responsive">

                            <table className="table department-table mb-0">

                                <thead>

                                    <tr>

                                        <th>
                                            Department
                                        </th>

                                        <th>
                                            Head of Department
                                        </th>

                                        <th>
                                            Roles
                                        </th>

                                        <th>
                                            Services
                                        </th>

                                        <th className="text-end">
                                            Actions
                                        </th>

                                    </tr>

                                </thead>


                                <tbody>

                                    {filteredDepartments.map(
                                        (department) => {

                                            const roles =
                                                Array.isArray(
                                                    department.deptRole
                                                )
                                                    ? department.deptRole
                                                    : [];

                                            return (
                                                <tr
                                                    key={department.id}
                                                >

                                                    {/* ================= DEPARTMENT ================= */}

                                                    <td>

                                                        <div className="department-name-cell">

                                                            <div className="department-row-icon">

                                                                <Building2
                                                                    size={18}
                                                                />

                                                            </div>

                                                            <div>

                                                                <div className="department-name">

                                                                    {department.deptName ||
                                                                        "Unnamed Department"}

                                                                </div>

                                                                <div className="department-id">

                                                                    Department #
                                                                    {department.id}

                                                                </div>

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* ================= HEAD OF DEPARTMENT ================= */}

                                                    <td>

                                                        <div className="head-cell">

                                                            <div className="head-avatar">

                                                                <Users
                                                                    size={16}
                                                                />

                                                            </div>

                                                            <div>

                                                                <div className="head-name">

                                                                    {department.headOfDeptName ||
                                                                        "Not assigned"}

                                                                </div>

                                                                {department.headOfDeptEmail && (

                                                                    <div className="head-email">

                                                                        {
                                                                            department.headOfDeptEmail
                                                                        }

                                                                    </div>

                                                                )}

                                                            </div>

                                                        </div>

                                                    </td>


                                                    {/* ================= ROLES ================= */}

                                                    <td>

                                                        {roles.length > 0 ? (

                                                            <div className="role-list">

                                                                {roles
                                                                    .slice(0, 2)
                                                                    .map(
                                                                        (
                                                                            role,
                                                                            index
                                                                        ) => (

                                                                            <span
                                                                                key={index}
                                                                                className="role-badge"
                                                                            >
                                                                                {role}
                                                                            </span>

                                                                        )
                                                                    )}

                                                                {roles.length > 2 && (

                                                                    <span className="role-more">

                                                                        +
                                                                        {roles.length - 2}

                                                                    </span>

                                                                )}

                                                            </div>

                                                        ) : (

                                                            <span className="muted-text">

                                                                No roles

                                                            </span>

                                                        )}

                                                    </td>


                                                    {/* ================= SERVICES ================= */}

                                                    <td>

                                                        <div className="service-count">

                                                            <BriefcaseMedical
                                                                size={17}
                                                            />

                                                            <span>
                                                                {department.serviceCount ?? 0}
                                                            </span>

                                                            <small>
                                                                services
                                                            </small>

                                                        </div>

                                                    </td>


                                                    {/* ================= ACTIONS ================= */}

                                                    <td>

                                                        <div className="department-actions">

                                                            {/* VIEW */}

                                                            <button
                                                                type="button"
                                                                className="action-btn action-view"
                                                                title="View department"
                                                                onClick={() =>
                                                                    navigate(
                                                                        `/admin/departments/${department.id}`
                                                                    )
                                                                }
                                                            >

                                                                <Eye
                                                                    size={16}
                                                                />

                                                            </button>


                                                            {/* ADMIN ONLY */}

                                                            {isAdmin && (
                                                                <>
                                                                    {/* EDIT */}

                                                                    <button
                                                                        type="button"
                                                                        className="action-btn action-edit"
                                                                        title="Edit department"
                                                                        onClick={() =>
                                                                            navigate(
                                                                                `/admin/departments/edit/${department.id}`
                                                                            )
                                                                        }
                                                                    >

                                                                        <Pencil
                                                                            size={16}
                                                                        />

                                                                    </button>


                                                                    {/* DELETE */}

                                                                    <button
                                                                        type="button"
                                                                        className="action-btn action-delete"
                                                                        title="Delete department"
                                                                        onClick={() =>
                                                                            handleDelete(
                                                                                department.id
                                                                            )
                                                                        }
                                                                    >

                                                                        <Trash2
                                                                            size={16}
                                                                        />

                                                                    </button>

                                                                </>
                                                            )}

                                                        </div>

                                                    </td>

                                                </tr>
                                            );
                                        }
                                    )}

                                </tbody>

                            </table>

                        </div>
                    )}


                {/* ================= FOOTER ================= */}

                {!loading &&
                    !error &&
                    filteredDepartments.length > 0 && (

                        <div className="department-footer">

                            Showing{" "}

                            <strong>
                                {filteredDepartments.length}
                            </strong>

                            {" "}of{" "}

                            <strong>
                                {departments.length}
                            </strong>

                            {" "}departments

                        </div>
                    )}

            </div>

        </div>
    );
};

export default Departments;