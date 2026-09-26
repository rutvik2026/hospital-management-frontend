import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    Building2,
    UserRound,
    Plus,
    X,
    Save,
} from "lucide-react";

import {
    getDepartments,
    updateDepartment,
} from "../../services/departmentService";

import "./DepartmentForm.css";


const EditDepartment = () => {

    const navigate = useNavigate();

    const { departmentId } = useParams();


    /* =========================================================
       FORM DATA
       ========================================================= */

    const [formData, setFormData] = useState({
        deptName: "",
        headOfDeptId: "",
        deptRole: [],
    });


    const [roleInput, setRoleInput] = useState("");

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


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


            const departments =
                await getDepartments();


            const department =
                departments.find(
                    (item) =>
                        Number(item.id) ===
                        Number(departmentId)
                );


            if (!department) {

                setError(
                    "Department not found."
                );

                return;
            }


            console.log(
                "Department to edit:",
                department
            );


            setFormData({

                deptName:
                    department.deptName || "",

                /*
                 * Your API may return headOfDept
                 * as an object.
                 */
                headOfDeptId:
                    department.headOfDept?.id ||
                    department.headOfDeptId ||
                    "",

                deptRole:
                    Array.isArray(
                        department.deptRole
                    )
                        ? department.deptRole
                        : [],

            });


        } catch (err) {

            console.error(
                "Load department error:",
                err
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
       HANDLE INPUT
       ========================================================= */

    const handleChange = (e) => {

        const {
            name,
            value,
        } = e.target;


        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    /* =========================================================
       ADD ROLE
       ========================================================= */

    const addRole = () => {

        const role =
            roleInput.trim();


        if (!role) {
            return;
        }


        const alreadyExists =
            formData.deptRole.some(
                (existingRole) =>
                    existingRole.toLowerCase() ===
                    role.toLowerCase()
            );


        if (alreadyExists) {
            return;
        }


        setFormData((prev) => ({

            ...prev,

            deptRole: [
                ...prev.deptRole,
                role,
            ],

        }));


        setRoleInput("");

    };


    /* =========================================================
       REMOVE ROLE
       ========================================================= */

    const removeRole = (roleToRemove) => {

        setFormData((prev) => ({

            ...prev,

            deptRole:
                prev.deptRole.filter(
                    (role) =>
                        role !== roleToRemove
                ),

        }));

    };


    /* =========================================================
       ENTER KEY FOR ROLE
       ========================================================= */

    const handleRoleKeyDown = (e) => {

        if (e.key === "Enter") {

            e.preventDefault();

            addRole();

        }

    };


    /* =========================================================
       UPDATE DEPARTMENT
       ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        try {

            setSaving(true);


            /*
             * Build payload dynamically.
             *
             * Nothing is required.
             * Only fields containing values
             * will be sent.
             */

            const payload = {};


            /* =========================
               DEPARTMENT NAME
               ========================= */

            if (
                formData.deptName.trim()
            ) {

                payload.deptName =
                    formData.deptName.trim();

            }


            /* =========================
               HEAD OF DEPARTMENT
               ========================= */

            if (
                formData.headOfDeptId !== "" &&
                formData.headOfDeptId !== null &&
                formData.headOfDeptId !== undefined
            ) {

                payload.headOfDept = {

                    id: Number(
                        formData.headOfDeptId
                    ),

                };

            }


            /* =========================
               ROLES
               ========================= */

            /*
             * Send roles only when the user
             * has roles in the form.
             */

            if (
                Array.isArray(
                    formData.deptRole
                )
            ) {

                payload.deptRole =
                    formData.deptRole;

            }


            /* =========================
               NOTHING TO UPDATE
               ========================= */

            if (
                Object.keys(payload).length === 0
            ) {

                setError(
                    "Please enter at least one field to update."
                );

                setSaving(false);

                return;
            }


            console.log(
                "========== UPDATE DEPARTMENT =========="
            );

            console.log(
                "Department ID:",
                departmentId
            );

            console.log(
                "Update Payload:",
                payload
            );


            /* =========================
               API CALL
               ========================= */

            const response =
                await updateDepartment(
                    departmentId,
                    payload
                );


            console.log(
                "Update Response:",
                response
            );


            setSuccess(
                "Department updated successfully."
            );


            /* =========================
               REDIRECT
               ========================= */

            setTimeout(() => {

                navigate(
                    `/admin/departments/${departmentId}`
                );

            }, 800);


        } catch (err) {

            console.error(
                "Update department error:",
                err
            );


            console.error(
                "Status:",
                err?.response?.status
            );


            console.error(
                "Response:",
                err?.response?.data
            );


            setError(
                err?.response?.data?.message ||
                "Unable to update department."
            );


        } finally {

            setSaving(false);

        }

    };


    /* =========================================================
       LOADING
       ========================================================= */

    if (loading) {

        return (

            <div className="department-form-page">

                <div className="department-loading">

                    <div className="spinner-border text-primary" />

                    <p>
                        Loading department...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================================================
       UI
       ========================================================= */

    return (

        <div className="department-form-page">


            {/* =================================================
                HEADER
               ================================================= */}

            <div className="department-form-header">


                <button
                    type="button"
                    className="back-button"
                    onClick={() =>
                        navigate(
                            `/admin/departments/${departmentId}`
                        )
                    }
                >

                    <ArrowLeft size={18} />

                </button>


                <div>

                    <div className="form-eyebrow">

                        Hospital Management

                    </div>


                    <h1>

                        Edit Department

                    </h1>


                    <p>

                        Update any department information.
                        All fields are optional.

                    </p>

                </div>

            </div>



            {/* =================================================
                FORM CARD
               ================================================= */}

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

                            Change one or more department
                            details.

                        </p>

                    </div>

                </div>



                <form onSubmit={handleSubmit}>


                    <div className="form-card-body">


                        {/* =================================================
                            ERROR
                           ================================================= */}

                        {error && (

                            <div className="form-alert form-alert-error">

                                {error}

                            </div>

                        )}



                        {/* =================================================
                            SUCCESS
                           ================================================= */}

                        {success && (

                            <div className="form-alert form-alert-success">

                                {success}

                            </div>

                        )}



                        {/* =================================================
                            DEPARTMENT NAME
                           ================================================= */}

                        <div className="form-field">


                            <label>

                                Department Name

                            </label>


                            <div className="form-input-wrapper">


                                <Building2 size={17} />


                                <input
                                    type="text"
                                    name="deptName"
                                    value={
                                        formData.deptName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Department name"
                                />

                            </div>

                        </div>



                        {/* =================================================
                            HEAD OF DEPARTMENT
                           ================================================= */}

                        <div className="form-field">


                            <label>

                                Head of Department

                            </label>


                            <div className="form-input-wrapper">


                                <UserRound size={17} />


                                <input
                                    type="number"
                                    name="headOfDeptId"
                                    value={
                                        formData.headOfDeptId
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="1"
                                    placeholder="User ID"
                                />

                            </div>


                            <small>

                                Enter the user ID only if you
                                want to change the department head.

                            </small>

                        </div>



                        {/* =================================================
                            ROLES
                           ================================================= */}

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
                                        placeholder="Add department role"
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



                            {/* SELECTED ROLES */}

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

                        </div>


                    </div>



                    {/* =================================================
                        FOOTER
                       ================================================= */}

                    <div className="form-card-footer">


                        <button
                            type="button"
                            className="secondary-form-button"
                            onClick={() =>
                                navigate(
                                    `/admin/departments/${departmentId}`
                                )
                            }
                            disabled={saving}
                        >

                            Cancel

                        </button>


                        <button
                            type="submit"
                            className="primary-form-button"
                            disabled={saving}
                        >

                            {saving ? (

                                <>

                                    <span className="spinner-border spinner-border-sm" />

                                    Saving...

                                </>

                            ) : (

                                <>

                                    <Save size={17} />

                                    Save Changes

                                </>

                            )}

                        </button>


                    </div>


                </form>

            </div>

        </div>

    );

};


export default EditDepartment;