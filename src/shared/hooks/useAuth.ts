import { useEffect, useState } from "react";
import Cookies from "js-cookie";
import axiosInstance, { updateAxiosToken } from "../api/axios";
import useStore from "../store";
import { User } from "../store";
import i18n from "i18next";

const useAuth = () => {
  const [initializing, setInitializing] = useState(true);
  const {
    user,
    sessionVerified,
    authLoading,
    authErrors,
    authStatus,
    login,
    register,
    logout,
    sendPasswordResetLink,
    newPassword,
    sendEmailVerificationLink,
    setAuthStatus,
    updateUser,
  } = useStore();

  useEffect(() => {
    const initializeAuth = async () => {
      try {
        const token = Cookies.get("auth-token");

        if (token) {
          try {
            updateAxiosToken(token);
            const { data } = await axiosInstance.get<User>("/api/user");

            // Always check the cookie first and use it if available
            const savedLanguage = Cookies.get("language");
            if (savedLanguage) {
              // Set the language in i18n
              i18n.changeLanguage(savedLanguage);

              // Only update the user profile if the language is different
              if (data.lang !== savedLanguage) {
                await updateUser({ lang: savedLanguage });
              }
            } else if (data.lang) {
              // If no cookie exists but user has a language preference
              i18n.changeLanguage(data.lang);
              // Set cookie to match user preference for future visits
              Cookies.set("language", data.lang, { path: "/" });
            }

            useStore.setState({
              user: data,
              sessionVerified: true,
              authLoading: false,
            });
          } catch (error) {
            console.warn("Error initializing authentication:", error);
            Cookies.remove("auth-token");
            updateAxiosToken(null);

            // If there's a saved language in cookies, use that
            const savedLanguage = Cookies.get("language");
            if (savedLanguage) {
              i18n.changeLanguage(savedLanguage);
            }

            useStore.setState({
              user: null,
              sessionVerified: true,
              authLoading: false,
            });
          }
        } else {
          // If there's a saved language in cookies, use that
          const savedLanguage = Cookies.get("language");
          if (savedLanguage) {
            i18n.changeLanguage(savedLanguage);
          }

          useStore.setState({
            sessionVerified: true,
            authLoading: false,
          });
        }
      } finally {
        setInitializing(false);
      }
    };

    if (typeof window !== "undefined") {
      if (!sessionVerified) {
        useStore.setState({ authLoading: true });
        initializeAuth();
      } else {
        setInitializing(false);
      }
    }
  }, [sessionVerified, updateUser]);

  const isAuthenticated = () => {
    return !!user;
  };

  return {
    user,
    isAuthenticated: isAuthenticated(),
    loading: authLoading || initializing,
    errors: authErrors,
    status: authStatus,
    sessionVerified,
    login,
    register,
    logout,
    sendPasswordResetLink,
    newPassword,
    sendEmailVerificationLink,
    setAuthStatus,
  };
};

export default useAuth;
