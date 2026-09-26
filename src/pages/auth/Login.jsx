import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import { loginUser } from "../../services/authService";
import toast from "react-hot-toast";

import {
    Mail,
    Lock,
    Eye,
    EyeOff,
    ArrowRight,
    ShieldCheck,
    HeartPulse,
    Loader2,
} from "lucide-react";

const Login = () => {

    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        email: "",
        password: "",
    });

    const [showPassword, setShowPassword] = useState(false);
    const [loading, setLoading] = useState(false);

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setLoading(true);

            const response = await loginUser(formData);

            console.log("Login response:", response);

            login(response);

            toast.success("Login successful");

            if (response.role === "ADMIN") {
                navigate("/admin");
            } else if (response.role === "DOCTOR") {
                navigate("/doctor");
            } else if (response.role === "PATIENT") {
                navigate("/patient");
            } else if (response.role === "EMPLOYEE") {
                navigate("/employee");
            } else {
                navigate("/");
            }

        } catch (error) {

            console.error("Login error:", error);

            toast.error(
                error.response?.data?.message ||
                "Invalid email or password"
            );

        } finally {

            setLoading(false);

        }
    };

    return (

        <div className="auth-page">

            {/* LEFT SIDE */}

            <div className="auth-brand-panel">

                <div className="brand-content">

                    <div className="brand-logo">
                        <HeartPulse size={32} />
                    </div>

                    <h1>
                        Hospital
                        <br />
                        Management System
                    </h1>

                    <p className="brand-description">
                        A smarter way to manage healthcare,
                        appointments, patients and clinical
                        workflows.
                    </p>

                    <div className="brand-features">

                        <div className="brand-feature">
                            <ShieldCheck size={20} />
                            <span>
                                Secure & protected healthcare data
                            </span>
                        </div>

                        <div className="brand-feature">
                            <HeartPulse size={20} />
                            <span>
                                Connected healthcare management
                            </span>
                        </div>

                    </div>

                </div>

                <div className="brand-footer">
                    © 2026 Hospital Management System
                </div>

            </div>


            {/* RIGHT SIDE */}

            <div className="auth-form-panel">

                <div className="auth-form-container">

                    <div className="mobile-brand">
                        <div className="brand-logo">
                            <HeartPulse size={26} />
                        </div>

                        <span>HMS</span>
                    </div>

                    <div className="auth-heading">

                        <p className="auth-welcome">
                            Welcome back
                        </p>

                        <h2>
                            Sign in to your account
                        </h2>

                        <p>
                            Enter your credentials to access
                            the hospital management portal.
                        </p>

                    </div>


                    <form
                        className="auth-form"
                        onSubmit={handleSubmit}
                    >

                        {/* EMAIL */}

                        <div className="form-group">

                            <label htmlFor="email">
                                Email address
                            </label>

                            <div className="input-wrapper">

                                <Mail
                                    size={19}
                                    className="input-icon"
                                />

                                <input
                                    id="email"
                                    type="email"
                                    name="email"
                                    placeholder="you@example.com"
                                    value={formData.email}
                                    onChange={handleChange}
                                    required
                                />

                            </div>

                        </div>


                        {/* PASSWORD */}

                        <div className="form-group">

                            <div className="label-row">

                                <label htmlFor="password">
                                    Password
                                </label>

                                <button
                                    type="button"
                                    className="forgot-password"
                                    onClick={() =>
                                        toast("Password reset will be available soon")
                                    }
                                >
                                    Forgot password?
                                </button>

                            </div>

                            <div className="input-wrapper">

                                <Lock
                                    size={19}
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
                                    placeholder="Enter your password"
                                    value={formData.password}
                                    onChange={handleChange}
                                    required
                                />

                                <button
                                    type="button"
                                    className="password-toggle"
                                    onClick={() =>
                                        setShowPassword(!showPassword)
                                    }
                                >
                                    {showPassword ? (
                                        <EyeOff size={19} />
                                    ) : (
                                        <Eye size={19} />
                                    )}
                                </button>

                            </div>

                        </div>


                        {/* LOGIN BUTTON */}

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
                                    Signing in...
                                </>
                            ) : (
                                <>
                                    Sign in
                                    <ArrowRight size={20} />
                                </>
                            )}

                        </button>

                    </form>


                    <div className="auth-divider">
                        <span>New to the platform?</span>
                    </div>


                    <Link
                        to="/signup"
                        className="secondary-auth-button"
                    >
                        Create an account
                    </Link>


                    <p className="auth-security">

                        <ShieldCheck size={16} />

                        Your information is securely protected.

                    </p>

                </div>

            </div>

        </div>
    );
};

export default Login;