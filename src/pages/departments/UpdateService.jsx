import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import {
    ArrowLeft,
    BriefcaseMedical,
    Save,
} from "lucide-react";

import {
    getDepartmentServices,
    updateService,
} from "../../services/departmentService";

import "./ServiceForm.css";


const UpdateService = () => {

    const navigate = useNavigate();

    const {
        departmentId,
        serviceId,
    } = useParams();


    /* =========================================================
       FORM DATA
       ========================================================= */

    const [formData, setFormData] = useState({

        serviceName: "",
        serviceFee: "",
        description: "",
        result: "",

    });


    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [error, setError] = useState("");

    const [success, setSuccess] = useState("");


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


            const services =
                await getDepartmentServices(
                    departmentId
                );


            const service =
                services.find(
                    (item) =>
                        Number(item.id) ===
                        Number(serviceId)
                );


            if (!service) {

                setError(
                    "Service not found."
                );

                return;
            }


            console.log(
                "Service to edit:",
                service
            );


            setFormData({

                serviceName:
                    service.serviceName || "",

                serviceFee:
                    service.serviceFee ?? "",

                description:
                    service.description || "",

                result:
                    service.result || "",

            });


        } catch (err) {

            console.error(
                "Load service error:",
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
       HANDLE CHANGE
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
       UPDATE SERVICE
       ========================================================= */

    const handleSubmit = async (e) => {

        e.preventDefault();

        setError("");

        setSuccess("");


        try {

            setSaving(true);


            /*
             * All fields are optional.
             *
             * Only fields containing values
             * are sent to backend.
             */

            const payload = {};


            if (
                formData.serviceName.trim()
            ) {

                payload.serviceName =
                    formData.serviceName.trim();

            }


            if (
                formData.serviceFee !== "" &&
                formData.serviceFee !== null
            ) {

                payload.serviceFee =
                    Number(formData.serviceFee);

            }


            if (
                formData.description.trim()
            ) {

                payload.description =
                    formData.description.trim();

            }


            if (
                formData.result.trim()
            ) {

                payload.result =
                    formData.result.trim();

            }


            /* =========================================
               NOTHING TO UPDATE
               ========================================= */

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
                "========== UPDATE SERVICE =========="
            );

            console.log(
                "Service ID:",
                serviceId
            );

            console.log(
                "Payload:",
                payload
            );


            /* =========================================
               API
               ========================================= */

            await updateService(
                serviceId,
                payload
            );


            setSuccess(
                "Service updated successfully."
            );


            /* =========================================
               REDIRECT
               ========================================= */

            setTimeout(() => {

                navigate(
                    `/admin/departments/${departmentId}`
                );

            }, 800);


        } catch (err) {

            console.error(
                "Update service error:",
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
                "Unable to update service."
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

            <div className="service-form-page">

                <div className="service-loading">

                    <div className="spinner-border text-primary" />

                    <p>
                        Loading service...
                    </p>

                </div>

            </div>

        );

    }


    /* =========================================================
       UI
       ========================================================= */

    return (

        <div className="service-form-page">


            {/* =================================================
                HEADER
               ================================================= */}

            <div className="service-form-header">


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

                        Update Service

                    </h1>


                    <p>

                        Update service information.

                        All fields are optional.

                    </p>

                </div>

            </div>



            {/* =================================================
                CARD
               ================================================= */}

            <div className="service-form-card">


                {/* HEADER */}

                <div className="form-card-header">


                    <div className="form-card-icon">

                        <BriefcaseMedical
                            size={21}
                        />

                    </div>


                    <div>

                        <h2>

                            Service Information

                        </h2>


                        <p>

                            Modify the service
                            associated with this department.

                        </p>

                    </div>

                </div>



                {/* FORM */}

                <form
                    onSubmit={handleSubmit}
                >


                    <div className="form-card-body">


                        {/* ERROR */}

                        {error && (

                            <div className="form-alert form-alert-error">

                                {error}

                            </div>

                        )}



                        {/* SUCCESS */}

                        {success && (

                            <div className="form-alert form-alert-success">

                                {success}

                            </div>

                        )}



                        {/* =================================================
                            SERVICE NAME
                           ================================================= */}

                        <div className="form-field">


                            <label>

                                Service Name

                            </label>


                            <div className="form-input-wrapper">


                                <BriefcaseMedical
                                    size={17}
                                />


                                <input
                                    type="text"
                                    name="serviceName"
                                    value={
                                        formData.serviceName
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    placeholder="Service name"
                                />

                            </div>

                        </div>



                        {/* =================================================
                            SERVICE FEE
                           ================================================= */}

                        <div className="form-field">


                            <label>

                                Service Fee

                            </label>


                            <div className="form-input-wrapper">


                                <span className="input-prefix">

                                    ₹

                                </span>


                                <input
                                    type="number"
                                    name="serviceFee"
                                    value={
                                        formData.serviceFee
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    min="0"
                                    step="0.01"
                                    placeholder="Service fee"
                                />

                            </div>

                        </div>



                        {/* =================================================
                            DESCRIPTION
                           ================================================= */}

                        <div className="form-field">


                            <label>

                                Description

                            </label>


                            <textarea
                                name="description"
                                value={
                                    formData.description
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter service description"
                                rows="4"
                            />

                        </div>



                        {/* =================================================
                            RESULT
                           ================================================= */}

                        <div className="form-field">


                            <label>

                                Result

                            </label>


                            <textarea
                                name="result"
                                value={
                                    formData.result
                                }
                                onChange={
                                    handleChange
                                }
                                placeholder="Enter expected result"
                                rows="4"
                            />

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


export default UpdateService;