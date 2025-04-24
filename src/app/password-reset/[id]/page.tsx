"use client";

import React, { ChangeEvent, FormEvent, useState } from "react";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import Header from "@/app/auth/components/Header";
import { RiKey2Line } from "react-icons/ri";
import Footer from "@/app/auth/components/Footer";
import useStore from "@/shared/store";
import { useTranslation } from "react-i18next";

const PasswordResetHandler = () => {
  const { t } = useTranslation();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const token = pathname.split("/")[2];
  const email = searchParams.get("email");

  const [password, setPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const { newPassword: newPasswordCreation } = useStore();
  const handlePasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setPassword(event.target.value);
  };

  const handleNewPasswordChange = (event: ChangeEvent<HTMLInputElement>) => {
    setNewPassword(event.target.value);
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setError("");
    setLoading(true);

    if (!password || !newPassword) {
      setError(t("passwordReset.bothFieldsRequired"));
      setLoading(false);
      return;
    }

    if (password !== newPassword) {
      setError(t("passwordReset.passwordsDontMatch"));
      setLoading(false);
      return;
    }

    try {
      await newPasswordCreation({
        email: email as string,
        token,
        password: password,
        password_confirmation: newPassword,
      });
      router.push("/auth/password-reset-confirmation");
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setError(t("passwordReset.resetFailed"));
    }

    setLoading(false);
  };

  return (
    <div className="bg-[#101114] mx-auto text-white min-h-screen flex flex-col overflow-hidden">
      <Header />

      <main className="flex flex-col items-center text-center flex-grow">
        <div className="flex flex-col items-center min-h-[70vh] mt-[38px]">
          <div className="flex items-center justify-center w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] bg-[--dark-gray] rounded-[14px] bg-gradient-to-b from-[#030304] to-[#2e2f34] border-[1px] border-[#323339]">
            <RiKey2Line size={28} className="text-[#EDEDED]" />
          </div>
          <div className="flex flex-col items-center justify-center w-[335px] sm:w-[375px]">
            <h2 className="text-[24px] sm:text-[28px] w-[350px] font-bold leading-[40px] mt-[35px] mb-[20px]">
              {t("passwordReset.title")}
            </h2>
            <p className="text-[#B0B0B0] leading-[20px] w-[340px] mb-[30px]">
              {t("passwordReset.description")}
            </p>

            <form onSubmit={handleSubmit}>
              <input
                type="password"
                placeholder={t("passwordReset.newPassword")}
                value={password}
                onChange={handlePasswordChange}
                className={`p-3 border-[1px] border-[--dark-gray] px-4 w-full bg-[--dark-gray] rounded-[14px] mb-2 focus:border-[1px] focus:border-gray-500 focus:outline-none ${
                  error
                    ? "bg-[--input-bg-error] placeholder:text-[--input-error] border border-[--input-bg-error]"
                    : "border-[--dark-gray] border-[1px] bg-[--dark-gray] focus:border-[1px] focus:border-gray-500"
                }`}
              />
              <input
                type="password"
                placeholder={t("passwordReset.repeatPassword")}
                value={newPassword}
                onChange={handleNewPasswordChange}
                className={`p-3 border-[1px] border-[--dark-gray] px-4 w-full bg-[--dark-gray] rounded-[14px] mb-4 focus:border-[1px] focus:border-gray-500 focus:outline-none ${
                  error
                    ? "bg-[--input-bg-error] placeholder:text-[--input-error] border border-[--input-bg-error]"
                    : "border-[--dark-gray] border-[1px] bg-[--dark-gray] focus:border-[1px] focus:border-gray-500"
                }`}
              />
              <button
                className="p-3 px-4 w-full bg-[--green] rounded-[14px] mb-6 font-sans font-bold hover:bg-blue-500 hover:rounded-[10px]"
                type="submit">
                {loading
                  ? t("passwordReset.loading")
                  : t("passwordReset.resetButton")}
              </button>
            </form>
            {error && <p className="text-[--error] text-sm mb-4">{error}</p>}
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default PasswordResetHandler;
