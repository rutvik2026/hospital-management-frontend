import api from "./api";

/*
 * Create Appointment
 */
export const createAppointment = async (data) => {

    console.log("Creating appointment:", data);

    const response = await api.post(
        "/patient/add/appoint",
        data
    );

    console.log(
        "Create appointment response:",
        response.data
    );

    return response.data;
};


/*
 * Get Appointments
 *
 * userId = logged-in USER ID
 * role   = PATIENT / DOCTOR
 */
export const getAppointments = async (userId, role) => {

    console.log(
        "Getting appointments:",
        {
            userId,
            role
        }
    );

    const response = await api.get(
        `/appointment/get/${userId}/${role}`
    );

    console.log(
        "Appointments API response:",
        response
    );

    console.log(
        "Appointments response.data:",
        response.data
    );

    return response.data;
};


/*
 * Delete Appointment
 */
export const deleteAppointment = async (id) => {

    console.log(
        "Deleting appointment:",
        id
    );

    const response = await api.delete(
        `/appointment/remove/${id}`
    );

    console.log(
        "Delete appointment response:",
        response.data
    );

    return response.data;
};


/*
 * Update Appointment
 */
export const updateAppointment = async (
    appointmentId,
    data
) => {

    console.log(
        "Updating appointment:",
        appointmentId,
        data
    );

    const response = await api.patch(
        `/appointment/update/${appointmentId}`,
        data
    );

    console.log(
        "Update appointment response:",
        response.data
    );

    return response.data;
};