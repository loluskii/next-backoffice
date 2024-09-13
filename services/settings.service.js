import { apiClient } from "./base";

export const getGameSettings = async (id = null, gameType = null) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_CASHIER_URL}/game/gameConfig/${id}/${gameType}`;

    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    return error.response;
  }
};

export const updateGameData = async (payload, id, gameType) => {
  try {
    delete payload.id;
    delete payload.agentId;
    const response = await apiClient.patch(
     `${process.env.NEXT_PUBLIC_CASHIER_URL}/game/gameSettings/${id}/${gameType}`,
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
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_CASHIER_URL}/wallet`,
      payload
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const fundOrDeductWallet = async (payload) => {
  try {
    const response = await apiClient.post(
      `${process.env.NEXT_PUBLIC_CASHIER_URL}/wallet/fund`,
      payload
    );
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};
