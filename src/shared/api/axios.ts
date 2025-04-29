import axios from "axios";
import Cookies from "js-cookie";

const axiosInstance = axios.create({
  baseURL: "https://app.drophunting.io",
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

axiosInstance.interceptors.request.use((config) => {
  if (!config.headers) {
    config.headers = {};
  }

  const token = Cookies.get("auth-token");
  const twoFA = Cookies.get("2fa");

  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  } else {
    delete config.headers.Authorization;
  }

  if (twoFA) {
    config.headers["X-2FA-Token"] = twoFA;
  } else {
    delete config.headers["X-2FA-Token"];
  }

  return config;
});

export const updateAxiosToken = (newToken: string | null) => {
  if (newToken) {
    Cookies.set("auth-token", newToken, {
      expires: 7,
      sameSite: "None",
      path: "/",
      secure: true,
    });
  } else {
    Cookies.remove("auth-token", { path: "/" });
  }
};

export const update2FA = (newToken: string | null) => {
  if (newToken) {
    Cookies.set("2fa", newToken, { secure: true, sameSite: "None", path: "/" });
  } else {
    Cookies.remove("2fa", { path: "/" });
  }
};

const handleUnauthorized = () => {
  Cookies.remove("auth-token");
  Cookies.remove("2fa");
  Cookies.remove("user");

  updateAxiosToken(null);
  update2FA(null);

  if (typeof window !== "undefined") {
    window.dispatchEvent(new Event("unauthorized"));
  }
};

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    // if (
    //   error.response?.status === 401 &&
    //   !error.config?.url.includes("/login") &&
    //   !error.config?.url.includes("/google/callback")
    // ) {
    //   console.log({ error });
    //   handleUnauthorized();
    // }
    // return Promise.reject(error);
    const isAuthRelatedEndpoint =
      error.config?.url.includes("/login") ||
      error.config?.url.includes("/google/callback");

    if (
      (error.response?.status === 401 || error.response?.status === 403) &&
      !isAuthRelatedEndpoint
    ) {
      console.log("Unauthorized/Forbidden error:", error);
      handleUnauthorized();
    }
    return Promise.reject(error);
  },
);

export default axiosInstance;
