import { useState } from "react";
import { useNavigate } from "react-router-dom";
import {
    ArrowLeft,
    Building2,
    UserRound,
    Plus,
    X,
} from "lucide-react";

import { addDepartment } from "../../services/departmentService";

import "./DepartmentForm.css";

const AddDepartment = () => {
    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        deptName: "",
        headOfDeptId: "",
        deptRole: [],
    });

    const [roleInput, setRoleInput] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");
    const [success, setSuccess] = useState("");

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const addRole = () => {
        const role = roleInput.trim();

        if (!role) return;

        if (
            formData.deptRole.some(
                (existingRole) =>
                    existingRole.toLowerCase() ===
                    role.toLowerCase()
            )
        ) {
            return;
        }

        setFormData((prev) => ({
            ...prev,
            deptRole: [...prev.deptRole, role],
        }));

        setRoleInput("");
    };

    const removeRole = (roleToRemove) => {
        setFormData((prev) => ({
            ...prev,
            deptRole: prev.deptRole.filter(
                (role) => role !== roleToRemove
            ),
        }));
    };

    const handleRoleKeyDown = (e) => {
        if (e.key === "Enter") {
            e.preventDefault();
            addRole();
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.deptName.trim()) {
            setError("Department name is required.");
            return;
        }

        if (!formData.headOfDeptId) {
            setError("Head of department user ID is required.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                deptName: formData.deptName.trim(),

                headOfDept: {
                    id: Number(formData.headOfDeptId),
                },

                deptRole: formData.deptRole,

                services: [],
            };

            await addDepartment(payload);

            setSuccess(
                "Department created successfully."
            );

            setTimeout(() => {
                navigate("/admin/departments");
            }, 800);
        } catch (err) {
            console.error(err);

            setError(
                err?.response?.data?.message ||
                    "Unable to create department."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="department-form-page">

            {/* HEADER */}

            <div className="department-form-header">

                <button
                    type="button"
                    className="back-button"
                    onClick={() => navigate("/admin/departments")}
                >
                    <ArrowLeft size={18} />
                </button>

                <div>
                    <div className="form-eyebrow">
                        Hospital Management
                    </div>

                    <h1>
                        Add Department
                    </h1>

                    <p>
                        Create a new department and configure
                        its responsibilities.
                    </p>
                </div>

            </div>

            {/* FORM CARD */}

            <div className="department-form-card">

                <div className="form-card-header">

                    <div className="form-card-icon">
                        <Building2 size={21} />
                    </div>

                    <div>
                        <h2>
                            Department Information
                        </h2>

                        <p>
                            Enter the basic information for this department.
                        </p>
                    </div>

                </div>

                <form onSubmit={handleSubmit}>

                    <div className="form-card-body">

                        {/* ERROR */}

                        {error && (
                            <div className="form-alert form-alert-error">
                                {error}
                            </div>
                        )}

                        {success && (
                            <div className="form-alert form-alert-success">
                                {success}
                            </div>
                        )}

                        {/* DEPARTMENT NAME */}

                        <div className="form-field">

                            <label>
                                Department Name
                                <span>*</span>
                            </label>

                            <div className="form-input-wrapper">

                                <Building2 size={17} />

                                <input
                                    type="text"
                                    name="deptName"
                                    value={formData.deptName}
                                    onChange={handleChange}
                                    placeholder="e.g. Cardiology"
                                />

                            </div>

                        </div>

                        {/* HEAD */}

                        <div className="form-field">

                            <label>
                                Head of Department
                                <span>*</span>
                            </label>

                            <div className="form-input-wrapper">

                                <UserRound size={17} />

                                <input
                                    type="number"
                                    name="headOfDeptId"
                                    value={formData.headOfDeptId}
                                    onChange={handleChange}
                                    placeholder="Enter user ID"
                                    min="1"
                                />

                            </div>

                            <small>
                                Enter the user ID of the doctor or
                                employee who will head this department.
                            </small>

                        </div>

                        {/* ROLES */}

                        <div className="form-field">

                            <label>
                                Department Roles
                            </label>

                            <div className="role-input-row">

                                <div className="form-input-wrapper">

                                    <input
                                        type="text"
                                        value={roleInput}
                                        onChange={(e) =>
                                            setRoleInput(
                                                e.target.value
                                            )
                                        }
                                        onKeyDown={
                                            handleRoleKeyDown
                                        }
                                        placeholder="e.g. Cardiologist"
                                    />

                                </div>

                                <button
                                    type="button"
                                    className="add-role-button"
                                    onClick={addRole}
                                >
                                    <Plus size={17} />
                                    Add
                                </button>

                            </div>

                            {formData.deptRole.length > 0 && (
                                <div className="selected-roles">

                                    {formData.deptRole.map(
                                        (role) => (
                                            <span
                                                key={role}
                                                className="selected-role"
                                            >
                                                {role}

                                                <button
                                                    type="button"
                                                    onClick={() =>
                                                        removeRole(
                                                            role
                                                        )
                                                    }
                                                >
                                                    <X size={13} />
                                                </button>
                                            </span>
                                        )
                                    )}

                                </div>
                            )}

                        </div>

                    </div>

                    {/* FOOTER */}

                    <div className="form-card-footer">

                        <button
                            type="button"
                            className="secondary-form-button"
                            onClick={() =>
                                navigate("/admin/departments")
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="primary-form-button"
                            disabled={loading}
                        >
                            {loading ? (
                                <>
                                    <span className="spinner-border spinner-border-sm" />
                                    Creating...
                                </>
                            ) : (
                                <>
                                    <Plus size={17} />
                                    Create Department
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>
        </div>
    );
};

export default AddDepartment;