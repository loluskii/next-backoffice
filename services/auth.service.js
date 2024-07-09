import { apiClient } from "./base";

// Login function
export const loginUser = async (username, password) => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/login/`,
      {
        username,
        password,
      }
    );
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

// Login function
export const resetPassword = async (payload) => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/forgot-password/`,
      payload
    );
    return { status: true, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: false, data: error.response.data };
  }
};
