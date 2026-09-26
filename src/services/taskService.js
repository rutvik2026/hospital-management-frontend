import api from "./api";

// ========================================
// ADD TASK
// ========================================

export const addTask = async (data) => {
    const response = await api.post(
        "/task/add",
        data
    );

    return response.data;
};


// ========================================
// GET APPOINTMENT TASKS
// ========================================

export const getAppointmentTasks = async (appointmentId) => {
    const response = await api.get(
        `/any/get/tasks/appointment/${appointmentId}`
    );

    return response.data;
};


// ========================================
// UPDATE TASK
// ========================================

export const updateTask = async (taskId, data) => {

    console.log(
        "Updating task:",
        taskId,
        data
    );

    const response = await api.patch(
        `/task/update/${taskId}`,
        data
    );

    return response.data;
};


// ========================================
// DELETE TASK
// ========================================

export const deleteTask = async (taskId, userId) => {

    console.log(
        "Deleting task:",
        taskId,
        "userId:",
        userId
    );

    const response = await api.delete(
        `/task/remove/${taskId}/${userId}`
    );

    return response.data;
};


// ========================================
// EMPLOYEE TASKS
// ========================================

export const getEmployeeTasks = async (userId) => {

    const response = await api.get(
        `/emp/get/tasks/${userId}`
    );

    return response.data;
};


// ========================================
// EMPLOYEE UPDATE TASK
// ========================================

export const updateEmployeeTask = async (
    taskId,
    data
) => {
    console.log(
        "Updating employee task:",
        taskId,
        data
    );
    const response = await api.patch(
        `/emp/update/task/${taskId}`,
        data
    );

    return response.data;
};

export const getAllTasks = async () => {
    const response = await api.get(
        "/admin/get/tasks"
    );

    return response.data;
};
