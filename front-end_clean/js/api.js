/* =========================================
   MPLADS — SHARED API HELPER
   Points at the live FastAPI risk-detection backend.
========================================= */

const API_BASE_URL = "https://mplad-project.onrender.com";

async function apiRequest(endpoint, options = {}) {

    try {

        const url = `${API_BASE_URL}${endpoint}`;

        console.log("API Request:", url);

        const response = await fetch(url, options);

        if (!response.ok) {
            throw new Error(`API Error: ${response.status}`);
        }

        const data = await response.json();

        console.log("API Response:", data);

        return data;

    } catch (error) {

        console.error("Backend connection error:", error);

        throw error;
    }
}