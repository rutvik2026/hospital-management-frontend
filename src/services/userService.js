import api from "./api";

export const getUserById = async (userId) => {
    console.log("userId:", userId);

    const response = await api.get(`/any/user/${userId}`);
     console.log("FULL RESPONSE:", response);
    console.log("RESPONSE DATA:", response.data);
    return response.data;
};

export const updateUser = async (userId, userData) => {
    console.log("userId:", userId);
    console.log("userData:", userData);

    const response = await api.patch(
        `/any/update/user/${userId}`,
        userData
    );

    return response.data;
};

export const getDoctors = async () => {

    console.log("Getting doctors...");

    const response = await api.get(
        "/any/get/doctors"
    );

    console.log("Doctors response:", response.data);

    return response.data;
};