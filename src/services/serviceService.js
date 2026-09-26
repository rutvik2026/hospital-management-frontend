export const getServiceInventories = async (serviceId) => {
    const response = await api.get(
        `/any/get/inventory/serv/${serviceId}`
    );

    return response.data;
};


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