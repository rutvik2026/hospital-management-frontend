import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { signupUser } from "../../services/authService";
import toast from "react-hot-toast";

import {
    User,
    Mail,
    Lock,
    Phone,
    CalendarDays,
    Weight,
    Stethoscope,
    Eye,
    EyeOff,
    ArrowRight,
    ArrowLeft,
    HeartPulse,
    ShieldCheck,
    Loader2,
} from "lucide-react";

const SignUp = () => {

    const navigate = useNavigate();

    const [formData, setFormData] = useState({
        name: "",
        password: "",
        email: "",
        role: "PATIENT",
        phone: "",
        age: "",
        weight: "",
        gender: "",
        dateOfBirth: "",
        specialization: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };


    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const data = {
                ...formData,

                age: Number(formData.age),

                weight: Number(formData.weight),

                specialization:
                    formData.role === "DOCTOR"
                        ? formData.specialization
                        : null,
            };

            console.log("Signup data:", data);

            await signupUser(data);

            toast.success(
                "Account created successfully!"
            );

            navigate("/login");

        } catch (error) {

            console.error("Signup error:", error);

            toast.error(
                error.response?.data?.message ||
                "Unable to create account"
            );

        } finally {

            setLoading(false);

        }
    };


    return (

        <div className="auth-page">

            {/* LEFT BRAND PANEL */}

            <div className="auth-brand-panel">

                <div className="brand-content">

                    <div className="brand-logo">
                        <HeartPulse size={32} />
                    </div>

                    <h1>
                        Join our
                        <br />
                        healthcare platform
                    </h1>

                    <p className="brand-description">
                        Create your account and access
                        a secure digital healthcare experience.
                    </p>

                    <div className="brand-features">

                        <div className="brand-feature">
                            <ShieldCheck size={20} />
                            <span>
                                Secure patient information
                            </span>
                        </div>

                        <div className="brand-feature">
                            <CalendarDays size={20} />
                            <span>
                                Simplified appointment management
                            </span>
                        </div>

                        <div className="brand-feature">
                            <Stethoscope size={20} />
                            <span>
                                Connected doctors and patients
                            </span>
                        </div>

                    </div>

                </div>

                <div className="brand-footer">
                    © 2026 Hospital Management System
                </div>

            </div>


            {/* FORM PANEL */}

            <div className="auth-form-panel signup-panel">

                <div className="signup-form-container">

                    <div className="mobile-brand">

                        <div className="brand-logo">
                            <HeartPulse size={26} />
                        </div>

                        <span>HMS</span>

                    </div>


                    {/* HEADER */}

                    <div className="auth-heading">

                        <p className="auth-welcome">
                            Get started
                        </p>

                        <h2>
                            Create your account
                        </h2>

                        <p>
                            Enter your details to create your
                            healthcare account.
                        </p>

                    </div>


                    <form
                        className="auth-form signup-form"
                        onSubmit={handleSubmit}
                    >

                        {/* NAME + EMAIL */}

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="name">
                                    Full name
                                </label>

                                <div className="input-wrapper">

                                    <User
                                        size={18}
                                        className="input-icon"
                                    />

                                    <input
                                        id="name"
                                        type="text"
                                        name="name"
                                        placeholder="John Doe"
                                        value={formData.name}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="email">
                                    Email address
                                </label>

                                <div className="input-wrapper">

                                    <Mail
                                        size={18}
                                        className="input-icon"
                                    />

                                    <input
                                        id="email"
                                        type="email"
                                        name="email"
                                        placeholder="john@example.com"
                                        value={formData.email}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* PASSWORD + PHONE */}

                        <div className="form-row">

                            <div className="form-group">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <div className="input-wrapper">

                                    <Lock
                                        size={18}
                                        className="input-icon"
                                    />

                                    <input
                                        id="password"
                                        type={
                                            showPassword
                                                ? "text"
                                                : "password"
                                        }
                                        name="password"
                                        placeholder="Create password"
                                        value={formData.password}
                                        onChange={handleChange}
                                        minLength="6"
                                        required
                                    />

                                    <button
                                        type="button"
                                        className="password-toggle"
                                        onClick={() =>
                                            setShowPassword(
                                                !showPassword
                                            )
                                        }
                                    >
                                        {showPassword ? (
                                            <EyeOff size={18} />
                                        ) : (
                                            <Eye size={18} />
                                        )}
                                    </button>

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="phone">
                                    Phone number
                                </label>

                                <div className="input-wrapper">

                                    <Phone
                                        size={18}
                                        className="input-icon"
                                    />

                                    <input
                                        id="phone"
                                        type="tel"
                                        name="phone"
                                        placeholder="9876543210"
                                        value={formData.phone}
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        </div>


                        {/* ROLE */}

                        <div className="form-group">

                            <label>
                                Account type
                            </label>

                            <div className="role-options">

                                {/* PATIENT */}
                                <label
                                    className={
                                        formData.role === "PATIENT"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="PATIENT"
                                        checked={formData.role === "PATIENT"}
                                        onChange={handleChange}
                                    />

                                    <div>
                                        <strong>Patient</strong>
                                        <span>
                                            Manage appointments & medical records
                                        </span>
                                    </div>
                                </label>


                                {/* DOCTOR */}
                                <label
                                    className={
                                        formData.role === "DOCTOR"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="DOCTOR"
                                        checked={formData.role === "DOCTOR"}
                                        onChange={handleChange}
                                    />

                                    <div>
                                        <strong>Doctor</strong>
                                        <span>
                                            Manage patients & consultations
                                        </span>
                                    </div>
                                </label>


                                {/* EMPLOYEE */}
                                <label
                                    className={
                                        formData.role === "EMPLOYEE"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="EMPLOYEE"
                                        checked={formData.role === "EMPLOYEE"}
                                        onChange={handleChange}
                                    />

                                    <div>
                                        <strong>Employee</strong>
                                        <span>
                                            Manage hospital operations
                                        </span>
                                    </div>
                                </label>


                                {/* ADMIN */}
                                <label
                                    className={
                                        formData.role === "ADMIN"
                                            ? "role-card active"
                                            : "role-card"
                                    }
                                >
                                    <input
                                        type="radio"
                                        name="role"
                                        value="ADMIN"
                                        checked={formData.role === "ADMIN"}
                                        onChange={handleChange}
                                    />

                                    <div>
                                        <strong>Administrator</strong>
                                        <span>
                                            Manage hospital system
                                        </span>
                                    </div>
                                </label>

                            </div>

                        </div>

                        {/* DOCTOR SPECIALIZATION */}

                        {formData.role === "DOCTOR" && (

                            <div className="form-group">

                                <label htmlFor="specialization">
                                    Medical specialization
                                </label>

                                <div className="input-wrapper">

                                    <Stethoscope
                                        size={18}
                                        className="input-icon"
                                    />

                                    <input
                                        id="specialization"
                                        type="text"
                                        name="specialization"
                                        placeholder="e.g. Cardiology"
                                        value={
                                            formData.specialization
                                        }
                                        onChange={handleChange}
                                        required
                                    />

                                </div>

                            </div>

                        )}


                        {/* AGE / WEIGHT / GENDER */}

                        <div className="form-row three-columns">

                            <div className="form-group">

                                <label htmlFor="age">
                                    Age
                                </label>

                                <input
                                    id="age"
                                    type="number"
                                    name="age"
                                    placeholder="25"
                                    value={formData.age}
                                    onChange={handleChange}
                                    min="1"
                                    max="120"
                                    required
                                />

                            </div>


                            <div className="form-group">

                                <label htmlFor="weight">
                                    Weight (kg)
                                </label>

                                <div className="input-wrapper">

                                    <Weight
                                        size={18}
                                        className="input-icon"
                                    />

                                    <input
                                        id="weight"
                                        type="number"
                                        name="weight"
                                        placeholder="65"
                                        value={formData.weight}
                                        onChange={handleChange}
                                        min="1"
                                        required
                                    />

                                </div>

                            </div>


                            <div className="form-group">

                                <label htmlFor="gender">
                                    Gender
                                </label>

                                <select
                                    id="gender"
                                    name="gender"
                                    value={formData.gender}
                                    onChange={handleChange}
                                    required
                                >
                                    <option value="">
                                        Select
                                    </option>

                                    <option value="MALE">
                                        Male
                                    </option>

                                    <option value="FEMALE">
                                        Female
                                    </option>

                                    <option value="OTHER">
                                        Other
                                    </option>

                                </select>

                            </div>

                        </div>


                        {/* DATE OF BIRTH */}

                        <div className="form-group">

                            <label htmlFor="dateOfBirth">
                                Date of birth
                            </label>

                            <div className="input-wrapper">

                                <CalendarDays
                                    size={18}
                                    className="input-icon"
                                />

                                <input
                                    id="dateOfBirth"
                                    type="date"
                                    name="dateOfBirth"
                                    value={
                                        formData.dateOfBirth
                                    }
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* BUTTON */}

                        <button
                            type="submit"
                            className="auth-button"
                            disabled={loading}
                        >

                            {loading ? (
                                <>
                                    <Loader2
                                        size={20}
                                        className="spinner"
                                    />
                                    Creating account...
                                </>
                            ) : (
                                <>
                                    Create account
                                    <ArrowRight size={20} />
                                </>
                            )}

                        </button>

                    </form>


                    <div className="login-link">

                        <span>
                            Already have an account?
                        </span>

                        <Link to="/login">
                            Sign in
                        </Link>

                    </div>


                    <p className="auth-security">

                        <ShieldCheck size={16} />

                        Your information is securely protected.

                    </p>

                </div>

            </div>

        </div>
    );
};

export default SignUp;