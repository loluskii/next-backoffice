import { apiClient } from "./base";

export const getGameSettings = async (id = null) => {
  try {
    let url = id
      ? `cashier/v1/game/gameConfig/${id}`
      : "cashier/v1/game/gameSettings";

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const updateGameSettings = async (payload, id) => {
  try {
    const response = await apiClient.patch(
      "cashier/v1/game/gameSettings/" + id,
      payload
    );
    return { status: true, data: response.data };
  } catch (error) {
    return {
      status: false,
      data: error.response ? error.response.data : error.message,
    };
  }
};

export const updateGameData = async (payload, id) => {
  try {
    delete payload.id;
    delete payload.agentId;
    const response = await apiClient.patch(
      "cashier/v1/game/gameData/" + id,
      payload
    );
    return { status: true, data: response.data };
  } catch (error) {
    return {
      status: false,
      data: error.response ? error.response.data : error.message,
    };
  }
};

export const createWallet = async (payload) => {
  try {
    const response = await apiClient.post("cashier/v1/wallet", payload);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const fundOrDeductWallet = async (payload) => {
  try {
    const response = await apiClient.post("cashier/v1/wallet/fund", payload);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};
