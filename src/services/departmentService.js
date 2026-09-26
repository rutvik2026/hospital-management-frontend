import api from "./api";

/* =========================================================
   DEPARTMENTS
   ========================================================= */

export const getDepartments = async () => {
    const response = await api.get("/any/get/dept");
    return response.data;
};


export const addDepartment = async (departmentData) => {
    const response = await api.post(
        "/admin/add/department",
        departmentData
    );

    return response.data;
};


export const updateDepartment = async (
    departmentId,
    departmentData
) => {
    const response = await api.patch(
        `/admin/update/dept/${departmentId}`,
        departmentData
    );

    return response.data;
};


export const deleteDepartment = async (departmentId) => {
    const response = await api.delete(
        `/admin/remove/dept/${departmentId}`
    );

    return response.data;
};


/* =========================================================
   SERVICES
   ========================================================= */

export const getDepartmentServices = async (departmentId) => {
    const response = await api.get(
        `/any/get/dept/serv/${departmentId}`
    );

    return response.data;
};


export const addService = async (
    departmentId,
    serviceData
) => {
    const response = await api.post(
        `/admin/add/serv/dept/${departmentId}`,
        serviceData
    );

    return response.data;
};


export const updateService = async (
    serviceId,
    serviceData
) => {
    const response = await api.patch(
        `/admin/update/service/${serviceId}`,
        serviceData
    );

    return response.data;
};


export const deleteService = async (
    departmentId,
    serviceId
) => {
    const response = await api.delete(
        `/admin/remove/serv/dept/${serviceId}/${departmentId}`
    );

    return response.data;
};


/* =========================================================
   INVENTORY OPERATIONS
   ========================================================= */

export const addInventory = async (
    serviceId,
    inventoryData
) => {
    const response = await api.post(
        `/admin/add/inventory/${serviceId}`,
        inventoryData
    );

    return response.data;
};


export const deleteInventory = async (inventoryId) => {
    const response = await api.delete(
        `/admin/remove/inventory/serv/${inventoryId}`
    );

    return response.data;
};


export const updateInventory = async (
    inventoryId,
    inventoryData
) => {
    const response = await api.patch(
        `/admin/update/inve/${inventoryId}`,
        inventoryData
    );

    return response.data;
};


/*
 * Backend:
 * @PatchMapping("/emp/update/inve/stock/{newStock}/{id}")
 *
 * Therefore:
 * URL = /emp/update/inve/stock/{newStock}/{inventoryId}
 */
export const updateInventoryStock = async (
    inventoryId,
    newStock
) => {
    const response = await api.patch(
        `/emp/update/inve/stock/${newStock}/${inventoryId}`
    );

    return response.data;
};


export const addPatientToInventory = async (
    inventoryId,
    patientId
) => {
    const response = await api.patch(
        `/emp/add/patients/inve/${inventoryId}/${patientId}`
    );

    return response.data;
};


export const removePatientFromInventory = async (
    inventoryId
) => {
    const response = await api.patch(
        `/emp/remove/patients/inve/${inventoryId}`
    );

    return response.data;
};


/* =========================================================
   SERVICE USERS
   ========================================================= */

export const addUserToService = async (
    userId,
    serviceId
) => {
    const response = await api.patch(
        `/admin/add/user/serv/${userId}/${serviceId}`
    );

    return response.data;
};


/*
 * IMPORTANT:
 * Your current backend mapping is:
 *
 * @DeleteMapping("/admin/remove/user/service//{userId}/{serviceId}")
 *
 * Notice the double //
 */
export const removeUserFromService = async (
    userId,
    serviceId
) => {
    const response = await api.delete(
        `/admin/remove/user/service/${userId}/${serviceId}`
    );

    return response.data;
};


// GET INVENTORIES OF SERVICE
export const getServiceInventories = async (serviceId) => {
    const response = await api.get(
        `/any/get/inventory/serv/${serviceId}`
    );

    return response.data;
};


// GET USERS ASSIGNED TO SERVICE
export const getServiceUsers = async (serviceId) => {
    const response = await api.get(
        `/any/get/user/serv/${serviceId}`
    );

    return response.data;
};