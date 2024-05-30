import { apiClient } from "./base";

// Login function
export const loginUser = async (email, password) => {
  try {
    const response = await apiClient.post("/v1/auth/login/", {
      email,
      password,
    });
    localStorage.setItem("token", response.data.tokens.access.token); // Save the token
    localStorage.setItem("refreshToken", response.data.tokens.refresh.token); // Save the token
    localStorage.setItem("currentUser", JSON.stringify(response.data.user)); // Save the token
    return true;
  } catch (error) {
    console.error(error);
    return false;
    // throw error;
  }
};
