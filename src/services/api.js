import axios from "axios";

const api = axios.create({
    baseURL: import.meta.env.VITE_API_URL,
    headers: {
        "Content-Type": "application/json",
    },
});

// ===============================
// REQUEST INTERCEPTOR
// ===============================
api.interceptors.request.use(
    (config) => {

        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },

    (error) => {
        return Promise.reject(error);
    }
);


// ===============================
// GLOBAL RESPONSE INTERCEPTOR
// ===============================
api.interceptors.response.use(

    // SUCCESS
    (response) => {
        return response;
    },

    // ERROR
    (error) => {

        console.error("API ERROR:", error);

        let message = "Something went wrong.";

        /*
         * BACKEND RESPONSE:
         *
         * {
         *     "status": 409,
         *     "message": "Cannot delete department because services are assigned to it."
         * }
         */

        if (error.response?.data?.message) {

            // Take EXACT message from backend
            message = error.response.data.message;

        } else if (typeof error.response?.data === "string") {

            // Backend returned plain text
            message = error.response.data;

        } else if (error.message) {

            message = error.message;
        }

        // Store backend message on Axios error
        error.globalMessage = message;

        // SHOW BACKEND MESSAGE TO USER
        alert(message);

        // Continue rejecting so the calling function can also handle it
        return Promise.reject(error);
    }
);

export default api;