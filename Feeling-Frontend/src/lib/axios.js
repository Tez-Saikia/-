import axios from "axios";

export const axiosInstance = axios.create({
  baseURL: "http://localhost:5000/api/v1",
  withCredentials: true,
});

let isRefreshing = false;
let refreshSubscribers = [];

const subscribeTokenRefresh = (cb) => {
  refreshSubscribers.push(cb);
};

const onRefreshed = () => {
  refreshSubscribers.forEach((cb) => cb());
  refreshSubscribers = [];
};

axiosInstance.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (
      error.response?.status !== 401 ||
      originalRequest._retry ||
      originalRequest.url.includes("deleteAccount")
    ) {
      return Promise.reject(error);
    }

    const hasAdminToken = document.cookie.includes("adminAccessToken");
    const hasUserToken = document.cookie.includes("accessToken");

    if (!hasAdminToken && !hasUserToken) {
      return Promise.reject(error);
    }

    originalRequest._retry = true;

    if (isRefreshing) {
      return new Promise((resolve) => {
        subscribeTokenRefresh(() => {
          resolve(axiosInstance(originalRequest));
        });
      });
    }

    isRefreshing = true;

    try {
      const isAdminRoute = originalRequest?.url?.startsWith("/admin");

      const refreshUrl = isAdminRoute
        ? "http://localhost:5000/api/v1/admin/refreshToken"
        : "http://localhost:5000/api/v1/users/refreshToken";

      await axios.post(refreshUrl, {}, { withCredentials: true });

      isRefreshing = false;
      onRefreshed();

      return axiosInstance(originalRequest);
    } catch (refreshError) {
      isRefreshing = false;
      return Promise.reject(refreshError);
    }
  },
);
