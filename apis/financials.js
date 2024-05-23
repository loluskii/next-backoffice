
import { useMutation } from "@tanstack/react-query";
import { axios } from "@/libs/axios";

export const login = async (data) => {
  return await axios.post(`/auth/login/`, data);
};

export const useSendResetPasswordToken = () =>
  useMutation((email) =>
    axios
      .post("/auth/users/reset_password/", { email: email })
      .then((res) => res.data)
      .catch((err) => {
        throw err.response.data;
      })
  );

export const useVerifyEmail = () =>
  useMutation(
    (token) =>
      axios
        .post("/auth/users/verify/", { token: token })
        .then((res) => res.data)
        .catch((err) => {
          throw err.response.data;
        }),
    { retry: 0 }
  );


export const tryLinkedinSSO = async (auth_token) => {
  return await axios
    .post("/auth/users/social_login/linkedin/", {
      auth_token: auth_token,
    })
    .then((res) => res.data)
    .catch((err) => {
      throw err.response.data;
    });
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
