import { apiClient } from "./base";

// Login function
export const getTicketsHistory = async (data) => {
  try {
    let url = `cashier/v1/bet/history?`;

    // Check if startDate exists in data before adding it to the URL
    if (data.startDate && data.endDate) {
      url += `startDate=${data.startDate}&endDate=${data.endDate}`;
      // Add other query parameters if they exist in data
      if (data.limit) {
        url += `&limit=${data.limit}`;
      }

      if (data.cashierId) {
        url += `&cashierId=${data.cashierId}`;
      }

      if (data.betType) {
        url += `&betType=${data.betType}`;
      }

      if (data.payout) {
        url += `&payout=${data.payout}`;
      }
      const response = await apiClient.get(url);
      return response.data;
    } else {
      return false;
    }
  } catch (error) {
    console.error(error);
    return false;
    // throw error;
  }
};

export const createCurrency = async (data) => {
  try {
    let url = `cashier/v1/currency/`;
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getCurrencies = async (data) => {
  try {
    let url = `cashier/v1/currency/`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};
