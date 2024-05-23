import axios, { AxiosError, AxiosResponse } from "axios";
import config from "./config";

async function requestNew<T>(options: Record<string, unknown>): Promise<T> {
  const accessToken = JSON.parse(
    localStorage.getItem("token") ?? "null"
  ) as string;

  const headers = accessToken
    ? {
        Authorization: `Bearer ${accessToken}`,
      }
    : undefined;

  const client = axios.create({
    baseURL: config.API_URL,
    headers,
  });

  // request handler
  const onSuccess = (response: AxiosResponse<T>) => {
    const { data } = response;
    return data;
  };

  // error handler
  function onError(error: AxiosError) {
    return Promise.reject(error.response);
  }

  const response = client(options).then(onSuccess).catch(onError);
  // adding success and error handlers to client
  return response;
}

export default requestNew;
