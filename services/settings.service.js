import { apiClient } from "./base";

export const getGameSettings = async () => {
  try {
    const response = await apiClient.get("cashier/v1/game/gameSettings");
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const getGameData = async () => {
  try {
    const response = await apiClient.get("cashier/v1/game/gameData");
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};

export const performWalletAction = async (payload) => {
  try {
    const response = await apiClient.post("cashier/v1/wallet", payload);
    return response;
  } catch (error) {
    console.error(error);
    throw error.response;
  }
};
