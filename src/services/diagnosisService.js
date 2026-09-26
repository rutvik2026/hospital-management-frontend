import api from "./api";


// ========================================
// ADD DIAGNOSIS
// ========================================

export const addDiagnosis = async (appointId, data) => {

    console.log("Adding diagnosis:");
    console.log("Appointment ID:", appointId);
    console.log("Diagnosis data:", data);

    const response = await api.post(
        `/doctor/add/diagnosis/appoint/${appointId}`,
        data
    );

    console.log(
        "Add diagnosis response:",
        response.data
    );

    return response.data;
};


// ========================================
// GET DIAGNOSIS BY APPOINTMENT
// ========================================

export const getDiagnosis = async (appointmentId) => {

    console.log(
        "Getting diagnosis for appointment:",
        appointmentId
    );

    const response = await api.get(
        `/any/get/dia/${appointmentId}`
    );

    console.log(
        "Diagnosis response:",
        response.data
    );

    return response.data;
};


// ========================================
// GET MEDICINES BY DIAGNOSIS
// ========================================

export const getMedicines = async (diagnosisId) => {

    console.log(
        "Getting medicines for diagnosis:",
        diagnosisId
    );

    const response = await api.get(
        `/any/get/med/${diagnosisId}`
    );

    console.log(
        "Medicines response:",
        response.data
    );

    return response.data;
};


// ========================================
// UPDATE DIAGNOSIS
// ========================================

export const updateDiagnosis = async (
    diagnosisId,
    data
) => {

    const response = await api.patch(
        `/doctor/update/diagnosis/${diagnosisId}`,
        data
    );

    return response.data;
};


// ========================================
// ADD MEDICINE
// ========================================

export const addMedicine = async (
    diagnosisId,
    data
) => {

    const response = await api.post(
        `/doctor/add/medicine/${diagnosisId}`,
        data
    );

    return response.data;
};


// ========================================
// UPDATE MEDICINE
// ========================================

export const updateMedicine = async (
    medicineId,
    data
) => {

    const response = await api.patch(
        `/doctor/update/medicine/${medicineId}`,
        data
    );

    return response.data;
};