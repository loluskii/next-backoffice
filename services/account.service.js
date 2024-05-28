import { apiClient } from "./base";

// Login function
export const getStructuredUsers = async (id = null) => {
  try {
    let url;
    if (id) {
      url = `/v1/users/structured?agentId=${id}`;
    } else {
      url = `/v1/users/structured`;
    }
    const response = await apiClient.get(url);
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
