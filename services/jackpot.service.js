import { apiClient } from "./base";

// Login function
export const getJackpots = async (payload) =>
  apiClient
    .post(`${process.env.NEXT_PUBLIC_CASHIER_URL}/game/jackpot`, payload)
    .then((res) => res.data)
    .catch((err) => ({
      status: false,
      data: err.response ? err.response.data : err.message,
    }));

export const updateJackpot = async (payload) => {
  try {
    const response = await apiClient.patch(
      `${process.env.NEXT_PUBLIC_CASHIER_URL}/game/jackpot`,
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
