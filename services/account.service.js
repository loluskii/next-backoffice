import { apiClient } from "./base";

// Login function
export const getStructuredUsers = async (id = null) => {
  try {
    let url;
    if (id) {
      url = `${process.env.NEXT_PUBLIC_AUTH_URL}/users/structured?agentId=${id}`;
    } else {
      url = `${process.env.NEXT_PUBLIC_AUTH_URL}/users/structured`;
    }
    const response = await apiClient.get(url);
    return response;
  } catch (error) {
    console.error(error);
    return false;
    // throw error;
  }
};
// Login function
export const getUser = async (id = null) => {
  try {
    const { data } = await apiClient.get(
      `${process.env.NEXT_PUBLIC_AUTH_URL}/users/${id}`
    );
    return data;
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
      url = `${process.env.NEXT_PUBLIC_AUTH_URL}/users/agents`;
    } else {
      url = `${process.env.NEXT_PUBLIC_AUTH_URL}/v1/users`;
    }
    const response = await apiClient.post(url, payload);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
    // throw error;
  }
};
