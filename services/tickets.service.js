import { apiClient } from "./base";

// Login function
export const getTicketsHistory = async (data) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_CASHIER_URL}/bet/history?limit=25&page=${data.page}`;

    // Check if startDate exists in data before adding it to the URL
    if (data.startDate && data.endDate) {
      url += `&startDate=${data.startDate}&endDate=${data.endDate}`;
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

      if (data.gameType) {
        url += `&gameType=${data.gameType}`;
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
    let url = `${process.env.NEXT_PUBLIC_CASHIER_URL}/currency/`;
    const response = await apiClient.post(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const updateCurrency = async (id, data) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_CASHIER_URL}/currency/${id}`;
    const response = await apiClient.patch(url, data);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getCurrencies = async (data) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_CASHIER_URL}/currency/`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getFinancialReport = async (startDate, endDate, betType) => {
  try {
    let url = `${process.env.NEXT_PUBLIC_CASHIER_URL}/bet/financial-reports?startDate=${startDate}&endDate=${endDate}&betType=${betType}`;
    const response = await apiClient.get(url);
    return response.data;
  } catch (error) {
    console.error(error);
    return false;
  }
};

export const getUsers = async (type) => {
  const url = `${process.env.NEXT_PUBLIC_AUTH_URL}/users?role=${type}`;
  try {
    const response = await apiClient.get(url);
    return { status: true, data: response.data };
  } catch (error) {
    console.error(error);
    return { status: false, data: error.response.data };
  }
};
