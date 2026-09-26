import { useEffect, useState } from "react";
import {
    User,
    Mail,
    Phone,
    Calendar,
    Weight,
    Stethoscope,
    Edit3,
    Save,
    X,
    ShieldCheck,
} from "lucide-react";

import { useAuth } from "../../context/AuthContext";
import {
    getUserById,
    updateUser,
} from "../../services/userService";

import toast from "react-hot-toast";

const Profile = () => {

    const { user, login } = useAuth();

    const [profile, setProfile] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
        age: "",
        weight: "",
        gender: "",
        dateOfBirth: "",
        specialization: "",
    });

    const [editing, setEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);


    // ==============================
    // LOAD PROFILE
    // ==============================

    useEffect(() => {

        const loadProfile = async () => {

            try {

                setLoading(true);

                const data = await getUserById(user.userId);

                setProfile(data);

                setFormData({
                    name: data.name || "",
                    email: data.email || "",
                    phone: data.phone || "",
                    age: data.age || "",
                    weight: data.weight || "",
                    gender: data.gender || "",
                    dateOfBirth: data.dateOfBirth || "",
                    specialization:
                        data.specialization || "",
                });

            } catch (error) {

                console.error(error);

                toast.error(
                    error.response?.data?.message ||
                    "Unable to load profile"
                );

            } finally {

                setLoading(false);

            }
        };

        if (user?.userId) {
            loadProfile();
        }

    }, [user?.userId]);

    
   

    // ==============================
    // INPUT CHANGE
    // ==============================

    const handleChange = (e) => {

        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));

    };


    // ==============================
    // UPDATE PROFILE
    // ==============================

    const handleSubmit = async (e) => {

        e.preventDefault();

        try {

            setSaving(true);

            const data = {
                name: formData.name,
                email: formData.email,
                phone: formData.phone,
                age: Number(formData.age),
                weight: Number(formData.weight),
                gender: formData.gender,
                dateOfBirth: formData.dateOfBirth,
            };

            // Doctor only
            if (profile?.role === "DOCTOR") {
                data.specialization =
                    formData.specialization;
            }

            const updatedUser =
                await updateUser(
                    user.userId,
                    data
                );

            setProfile(updatedUser);

            setFormData({
                name: updatedUser.name || "",
                email: updatedUser.email || "",
                phone: updatedUser.phone || "",
                age: updatedUser.age || "",
                weight: updatedUser.weight || "",
                gender: updatedUser.gender || "",
                dateOfBirth:
                    updatedUser.dateOfBirth || "",
                specialization:
                    updatedUser.specialization || "",
            });

            /*
             * Update localStorage/AuthContext
             *
             * Keep the existing token.
             */
            const currentUser = {
                ...user,
                ...updatedUser,
            };

            login({
                ...currentUser,
                token: user.token,
            });

            setEditing(false);

            toast.success(
                "Profile updated successfully"
            );

        } catch (error) {

            console.error(
                "Profile update error:",
                error
            );

            toast.error(
                error.response?.data?.message ||
                "Failed to update profile"
            );

        } finally {

            setSaving(false);

        }

    };


    // ==============================
    // CANCEL EDIT
    // ==============================

    const handleCancel = () => {

        setFormData({
            name: profile.name || "",
            email: profile.email || "",
            phone: profile.phone || "",
            age: profile.age || "",
            weight: profile.weight || "",
            gender: profile.gender || "",
            dateOfBirth:
                profile.dateOfBirth || "",
            specialization:
                profile.specialization || "",
        });

        setEditing(false);

    };


    // ==============================
    // LOADING
    // ==============================

    if (loading) {

        return (
            <div className="profile-loading">
                Loading profile...
            </div>
        );

    }


    return (
        <div className="profile-page">

            {/* Header */}

            <div className="profile-header">

                <div>

                    <h1>My Profile</h1>

                    <p>
                        Manage your personal information
                    </p>

                </div>


                {!editing ? (

                    <button
                        className="edit-profile-btn"
                        onClick={() =>
                            setEditing(true)
                        }
                    >

                        <Edit3 size={17} />

                        Edit Profile

                    </button>

                ) : (

                    <button
                        className="cancel-btn"
                        onClick={handleCancel}
                    >

                        <X size={17} />

                        Cancel

                    </button>

                )}

            </div>


            {/* Profile Card */}

            <div className="profile-card">

                {/* Profile Top */}

                <div className="profile-top">

                    <div className="profile-avatar">

                        {profile?.name
                            ?.charAt(0)
                            ?.toUpperCase()
                        }

                    </div>


                    <div className="profile-identity">

                        <h2>
                            {profile?.name}
                        </h2>

                        <div className="profile-role">

                            <ShieldCheck size={15} />

                            {profile?.role}

                        </div>

                    </div>

                </div>


                {/* Form */}

                <form
                    className="profile-form"
                    onSubmit={handleSubmit}
                >

                    <div className="profile-section">

                        <h3>
                            Personal Information
                        </h3>


                        {/* Name */}

                        <div className="profile-field">

                            <label>
                                Full Name
                            </label>

                            <div className="profile-input">

                                <User size={18} />

                                <input
                                    type="text"
                                    name="name"
                                    value={
                                        formData.name
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!editing}
                                   
                                />

                            </div>

                        </div>


                        {/* Email */}

                        <div className="profile-field">

                            <label>
                                Email Address
                            </label>

                            <div className="profile-input">

                                <Mail size={18} />

                                <input
                                    type="email"
                                    name="email"
                                    value={
                                        formData.email
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!editing}
                                   
                                />

                            </div>

                        </div>


                        {/* Phone */}

                        <div className="profile-field">

                            <label>
                                Phone Number
                            </label>

                            <div className="profile-input">

                                <Phone size={18} />

                                <input
                                    type="tel"
                                    name="phone"
                                    value={
                                        formData.phone
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!editing}
                                />

                            </div>

                        </div>


                        {/* Age / Weight */}

                        <div className="profile-two-column">

                            <div className="profile-field">

                                <label>
                                    Age
                                </label>

                                <div className="profile-input">

                                    <User size={18} />

                                    <input
                                        type="number"
                                        name="age"
                                        value={
                                            formData.age
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!editing}
                                        min="1"
                                    />

                                </div>

                            </div>


                            <div className="profile-field">

                                <label>
                                    Weight (kg)
                                </label>

                                <div className="profile-input">

                                    <Weight size={18} />

                                    <input
                                        type="number"
                                        name="weight"
                                        value={
                                            formData.weight
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!editing}
                                        min="1"
                                    />

                                </div>

                            </div>

                        </div>


                        {/* Gender */}

                        <div className="profile-field">

                            <label>
                                Gender
                            </label>

                            <div className="profile-input">

                                <User size={18} />

                                <select
                                    name="gender"
                                    value={
                                        formData.gender
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!editing}
                                >

                                    <option value="">
                                        Select Gender
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


                        {/* Date of Birth */}

                        <div className="profile-field">

                            <label>
                                Date of Birth
                            </label>

                            <div className="profile-input">

                                <Calendar size={18} />

                                <input
                                    type="date"
                                    name="dateOfBirth"
                                    value={
                                        formData.dateOfBirth
                                    }
                                    onChange={
                                        handleChange
                                    }
                                    disabled={!editing}
                                />

                            </div>

                        </div>


                        {/* Doctor specialization */}

                        {profile?.role ===
                            "DOCTOR" && (

                            <div className="profile-field">

                                <label>
                                    Medical Specialization
                                </label>

                                <div className="profile-input">

                                    <Stethoscope
                                        size={18}
                                    />

                                    <input
                                        type="text"
                                        name="specialization"
                                        value={
                                            formData.specialization
                                        }
                                        onChange={
                                            handleChange
                                        }
                                        disabled={!editing}
                                    />

                                </div>

                            </div>

                        )}

                    </div>


                    {/* Save */}

                    {editing && (

                        <div className="profile-actions">

                            <button
                                type="button"
                                className="cancel-action"
                                onClick={
                                    handleCancel
                                }
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="save-action"
                                disabled={saving}
                            >

                                <Save size={17} />

                                {saving
                                    ? "Saving..."
                                    : "Save Changes"
                                }

                            </button>

                        </div>

                    )}

                </form>

            </div>

        </div>
    );
};

export default Profile;