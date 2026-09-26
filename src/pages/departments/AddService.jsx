import { useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    ArrowLeft,
    BriefcaseMedical,
    IndianRupee,
    FileText,
    ClipboardList,
    Plus,
} from "lucide-react";

import { addService } from "../../services/departmentService";

import "./ServiceForm.css";

const AddService = () => {
    const navigate = useNavigate();
    const { departmentId } = useParams();

    const [formData, setFormData] = useState({
        serviceName: "",
        serviceFee: "",
        description: "",
        result: "",
    });

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

    const handleSubmit = async (e) => {
        e.preventDefault();

        setError("");
        setSuccess("");

        if (!formData.serviceName.trim()) {
            setError("Service name is required.");
            return;
        }

        if (
            formData.serviceFee === "" ||
            Number(formData.serviceFee) < 0
        ) {
            setError("Please enter a valid service fee.");
            return;
        }

        try {
            setLoading(true);

            const payload = {
                serviceName: formData.serviceName.trim(),

                serviceFee: Number(
                    formData.serviceFee
                ),

                description:
                    formData.description.trim(),

                result:
                    formData.result.trim(),
            };

            await addService(
                departmentId,
                payload
            );

            setSuccess(
                "Service added successfully."
            );

            setTimeout(() => {
                navigate(
                    `/admin/departments/${departmentId}`
                );
            }, 800);

        } catch (err) {
            console.error(
                "Add service error:",
                err
            );

            setError(
                err?.response?.data?.message ||
                    "Unable to add service."
            );
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="service-form-page">

            {/* ================================================= */}
            {/* HEADER */}
            {/* ================================================= */}

            <div className="service-form-header">

                <button
                    type="button"
                    className="service-back-button"
                    onClick={() =>
                        navigate(
                            `/admin/departments/${departmentId}`
                        )
                    }
                >
                    <ArrowLeft size={18} />
                </button>

                <div>

                    <div className="service-eyebrow">
                        Hospital Management
                    </div>

                    <h1>
                        Add Service
                    </h1>

                    <p>
                        Add a healthcare service to this
                        department.
                    </p>

                </div>

            </div>

            {/* ================================================= */}
            {/* FORM CARD */}
            {/* ================================================= */}

            <div className="service-form-card">

                {/* CARD HEADER */}

                <div className="service-card-header">

                    <div className="service-card-icon">
                        <BriefcaseMedical size={21} />
                    </div>

                    <div>

                        <h2>
                            Service Information
                        </h2>

                        <p>
                            Enter the details of the healthcare
                            service.
                        </p>

                    </div>

                </div>

                {/* FORM */}

                <form onSubmit={handleSubmit}>

                    <div className="service-form-body">

                        {/* ERROR */}

                        {error && (
                            <div className="service-alert service-alert-error">
                                {error}
                            </div>
                        )}

                        {/* SUCCESS */}

                        {success && (
                            <div className="service-alert service-alert-success">
                                {success}
                            </div>
                        )}

                        <div className="row g-4">

                            {/* SERVICE NAME */}

                            <div className="col-md-8">

                                <div className="service-field">

                                    <label>
                                        Service Name
                                        <span>*</span>
                                    </label>

                                    <div className="service-input-wrapper">

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
                                            placeholder="e.g. Blood Test"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* SERVICE FEE */}

                            <div className="col-md-4">

                                <div className="service-field">

                                    <label>
                                        Service Fee
                                        <span>*</span>
                                    </label>

                                    <div className="service-input-wrapper">

                                        <IndianRupee
                                            size={17}
                                        />

                                        <input
                                            type="number"
                                            name="serviceFee"
                                            value={
                                                formData.serviceFee
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="0.00"
                                            min="0"
                                            step="0.01"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* DESCRIPTION */}

                            <div className="col-12">

                                <div className="service-field">

                                    <label>
                                        Description
                                    </label>

                                    <div className="service-textarea-wrapper">

                                        <FileText
                                            size={17}
                                        />

                                        <textarea
                                            name="description"
                                            value={
                                                formData.description
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="Describe what this service includes..."
                                            rows="4"
                                        />

                                    </div>

                                </div>

                            </div>

                            {/* RESULT */}

                            <div className="col-12">

                                <div className="service-field">

                                    <label>
                                        Result / Output
                                    </label>

                                    <div className="service-input-wrapper">

                                        <ClipboardList
                                            size={17}
                                        />

                                        <input
                                            type="text"
                                            name="result"
                                            value={
                                                formData.result
                                            }
                                            onChange={
                                                handleChange
                                            }
                                            placeholder="e.g. Laboratory Report"
                                        />

                                    </div>

                                    <small>
                                        Specify the result or
                                        document produced by this
                                        service.
                                    </small>

                                </div>

                            </div>

                        </div>

                    </div>

                    {/* ================================================= */}
                    {/* FOOTER */}
                    {/* ================================================= */}

                    <div className="service-form-footer">

                        <button
                            type="button"
                            className="service-secondary-button"
                            onClick={() =>
                                navigate(
                                    `/admin/departments/${departmentId}`
                                )
                            }
                            disabled={loading}
                        >
                            Cancel
                        </button>

                        <button
                            type="submit"
                            className="service-primary-button"
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
                                    Create Service
                                </>
                            )}
                        </button>

                    </div>

                </form>

            </div>

        </div>
    );
};

export default AddService;