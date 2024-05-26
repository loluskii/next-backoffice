import { apiClient } from "./base";

// Login function
export const getStructuredUsers = async () => {
  try {
    const response = await apiClient.get("v1/users/structured");
    return response;
  } catch (error) {
    console.error(error);
    return false;
    // throw error;
  }
};

export const createAgentOrCashier = async (type, payload) => {
  try {
    let url = "";
    if (type === "agent") {
      url = "v1/users/agents";
    } else {
      url = "v1/users";
    }
    const response = await apiClient.post(url, payload);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
    // throw error;
  }
};
