import {apiClient} from "./base"

// Login function
export const loginUser = async (email, password) => {
    try {
        const response = await apiClient.post('/auth/login/', { email, password });
        localStorage.setItem('token', response.data.token); // Save the token
        return response.data; // Return any additional data needed
    } catch (error) {
        console.error(error);
        throw error;
    }
};

// Signup function
export const signUpUser = async (email, password) => {
    try {
        const response = await apiClient.post('/signup', { email, password });
        localStorage.setItem('token', response.data.token); // Save the token
        return response.data; // Return any additional data needed
    } catch (error) {
        console.error(error);
        throw error;
    }
};