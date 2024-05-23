import { axios, ProfileApi } from "libs/axios";

export const login = async (data) => {
  return await axios.post(`/auth/login/`, data);
};

export const updateUserProfile = async (accessToken, data) => {
  return await ProfileApi(accessToken).updateProfile({
    ...data,
  });
};

export const updateUserInfo = async (
  accessToken,
  data,
  id
) => {
  return await ProfileApi(accessToken).updateUserInfo({ id, data });
};

export const verifyToken = async (token) => {
  return await axios.post(`/auth/verify-email-token`, { token });
};

export const loginUser = async (data) => {
  return await axios.post(`/auth/login/`, data);
};

export const authUser = async () => {
  return await axios.get(`/auth/profile`);
};
