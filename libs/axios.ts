import Axios from "axios";

export const axios = Axios.create({
  baseURL: "https://aviata.sportsbookengine.com"
});

export const ProfileApi = (token: string) => {
  const instance = Axios.create({
    baseURL: "https://aviata.sportsbookengine.com",
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });
  return {
    getUser: async ({ id }: { id: string }) => {
      return await instance.get(`/v1/users/${id}/`);
    }
  };
};









