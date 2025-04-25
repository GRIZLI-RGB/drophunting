"use client";
import Cookies from "js-cookie";
import { AuthenticatorVerificationModal } from "@/app/components/modals/AuthenticatorVerificationModal";
import { updateAxiosToken } from "@/shared/api/axios";
import useStore, { User } from "@/shared/store";
import { useEffect, useState } from "react";
import { useTranslation } from "react-i18next";
import axiosInstance from "@/shared/api/axios";

export default function GoogleCallback() {
  const { googleLogin, setIsLoading } = useStore();

  const { t } = useTranslation();

  const [loadingData, setLoadingData] = useState(true);

  const [bannedMessage, setBannedMessage] = useState<string | false>(false);
  const [needs2FA, setNeeds2FA] = useState(false);
  const { updateUser } = useStore();

  useEffect(() => {
    setIsLoading(true);
    setLoadingData(true);

    if (typeof window !== "undefined") {
      const accessToken = new URLSearchParams(window.location.search).get(
        "access_token",
      );

      if (accessToken) {
        updateAxiosToken(accessToken);

        googleLogin(accessToken)
          .then(async () => {
            const token = Cookies.get("auth-token");
            const selectedLanguage = Cookies.get("language");

            if (token) {
              try {
                updateAxiosToken(token);
                const { data } = await axiosInstance.get<User>("/api/user");

                if (data) {
                  updateUser({
                    lang: selectedLanguage,
                  });
                }

                setTimeout(() => {
                  window.location.href = "https://app.drophunting.io/guides";
                }, 100);
              } catch (error) {
                console.error("Error fetching user data:", error);
              }
            }
          })
          .catch((err) => {
            console.log(err.errorMessage);

            if (err.errorMessage === "2-factor authentication failed.") {
              setNeeds2FA(true);
              updateAxiosToken(accessToken);
            } else {
              setBannedMessage(err.errorMessage);
            }
          })
          .finally(() => {
            setIsLoading(false);
            setLoadingData(false);
          });
      } else {
        console.error("Access token not found in the URL");
        window.location.href = "https://app.drophunting.io/auth/login";
      }
    }
  }, []);

  return (
    <>
      {!loadingData && bannedMessage && (
        <div className="w-full h-full flex flex-col gap-4 items-center justify-center">
          <p className="text-[16px] text-red-600">{bannedMessage}</p>
          <button
            onClick={() =>
              (window.location.href = "https://app.drophunting.io/auth/login")
            }
            className="bg-[#11CA00] hover:bg-[#0CAE00] transition-colors font-medium text-[14px] px-4 py-2.5 rounded-lg">
            {t("header.login")}
          </button>
        </div>
      )}
      {!loadingData && needs2FA && (
        <AuthenticatorVerificationModal
          onClose={() => {
            window.location.href = "https://app.drophunting.io/auth/login";
          }}
        />
      )}
    </>
  );
}
