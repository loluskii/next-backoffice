import axios from "axios";

// Create an instance of axios with a base URL
export const apiClient = axios.create({
  baseURL: process.env.NEXT_PUBLIC_BASE_API,
});

// Interceptor to add Authorization header to each request if token is present
apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem("token");
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRefreshing = false; // Flag to indicate if a token refresh request is in progress
let failedQueue = []; // Queue to hold requests that failed due to token expiration

// Function to process the queued requests after refreshing the token
const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error); // Reject the request if there's an error
    } else {
      prom.resolve(token); // Resolve the request with the new token
    }
  });

  failedQueue = []; // Clear the queue
};

// Interceptor to handle 401 errors and refresh the token
apiClient.interceptors.response.use(
  (response) => response, // If response is successful, simply return it
  async (error) => {
    const originalRequest = error.config; // The original request that failed
    const token = localStorage.getItem("token");
    const refreshToken = localStorage.getItem("refreshToken");

    // Check if the error is a 401 and if the request has not been retried yet
    if (error.response.status === 401 && !originalRequest._retry && token) {
      // If a refresh token request is already in progress, add the request to the queue
      if (isRefreshing) {
        return new Promise(function (resolve, reject) {
          failedQueue.push({ resolve, reject });
        })
          .then((token) => {
            originalRequest.headers["Authorization"] = "Bearer " + token;
            return apiClient(originalRequest);
          })
          .catch((err) => {
            return Promise.reject(err);
          });
      }

      // Mark the original request as retried
      originalRequest._retry = true;
      isRefreshing = true;

      // Make a request to refresh the token
      return new Promise(function (resolve, reject) {
        apiClient
          .post("/v1/auth/refresh-tokens", { refreshToken: refreshToken })
          .then(({ data }) => {
            // Update the tokens in localStorage
            localStorage.setItem("token", data.access.token);
            localStorage.setItem("refreshToken", data.refresh.token);

            // Update the default Authorization header and the original request's header
            apiClient.defaults.headers["Authorization"] =
              "Bearer " + data.access.token;
            originalRequest.headers["Authorization"] =
              "Bearer " + data.access.token;

            // Process the queued requests with the new token
            processQueue(null, data.access.token);

            // Retry the original request with the new token
            resolve(apiClient(originalRequest));
          })
          .catch((err) => {
            // If refreshing the token fails, process the queue with the error
            processQueue(err, null);

            // Remove tokens and user data from localStorage
            localStorage.removeItem("token");
            localStorage.removeItem("refreshToken");
            localStorage.removeItem("currentUser");

            // Redirect the user to the login page
            window.location.href = "/login";

            reject(err);
          })
          .finally(() => {
            isRefreshing = false; // Reset the refreshing flag
          });
      });
    }

    // If the error is not a 401 or the token is not present, reject the promise
    return Promise.reject(error);
  }
);
