"use client";
import React, { useState } from "react";
import Header from "@/app/auth/components/Header";
import Footer from "@/app/auth/components/Footer";
import Image from "next/image";
import loginIcon from "../../../../public/assets/icons/login.png";
import { useForm } from "react-hook-form";
import Link from "next/link";
import { useRouter } from "next/navigation";
import useStore from "@/shared/store";
import ReCAPTCHA from "react-google-recaptcha";

type LoginFormData = {
  email: string;
  password: string;
};

const Login = () => {
  const { register, handleSubmit } = useForm<LoginFormData>();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [serverError, setServerError] = useState("");
  const { login } = useStore();

  const handleGoogleLogin = async () => {
    setLoading(true);
    try {
      // Implement Google login functionality here
      // For now, just showing an alert
      alert("Google login integration to be implemented");
      setLoading(false);
    } catch {
      setServerError("Google login failed");
      setLoading(false);
    }
  };

  const handleRecaptchaVerify = (value: string | null) => {
    console.log("Recaptcha verified:", value);
  };

  const onSubmit = async (data: LoginFormData) => {
    setLoading(true);
    try {
      setServerError("");
      await login(data);
      router.push("/guides");
      setLoading(false);
      window.location.reload();
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
    } catch (e) {
      setServerError(
        "This login and password does not exist, please try again or register a new profile"
      );
      setLoading(false);
    }
  };

  return (
    <div className="bg-[#101114] mx-auto text-white min-h-screen flex flex-col overflow-hidden">
      <Header />
      <main className="flex flex-col items-center text-center flex-grow">
        <div className="flex flex-col items-center min-h-[70vh] mt-[38px]">
          <div className="flex items-center justify-center w-[48px] h-[48px] sm:w-[56px] sm:h-[56px] rounded-[14px] bg-gradient-to-b from-[#030304] to-[#2e2f34] border-[1px] border-[#323339]">
            <Image
              src={loginIcon}
              alt="Login Icon"
              className="w-[28px] h-[28px]"
            />
          </div>
          <div className="flex flex-col items-center justify-center w-[335px] sm:w-[375px] mt-[35px]">
            <h2 className="text-[34px] w-[350px] font-bold leading-[40px] mb-[20px]">
              Sign In
            </h2>
            <p className="text-[#B0B0B0] leading-[20px] w-full mb-[30px]">
              Authorize in the system to get into your account
            </p>

            <form
              onSubmit={handleSubmit(onSubmit)}
              className="w-full max-w-[420px]"
            >
              <div className="mb-2">
                <input
                  type="text"
                  placeholder="Email"
                  {...register("email")}
                  className={`p-3 w-full px-4 bg-[--dark-gray] rounded-[14px] focus:outline-none ${
                    serverError
                      ? "bg-[--input-bg-error] placeholder:text-[--input-error] border border-[--input-bg-error]"
                      : "border-[--dark-gray] border-[1px] bg-[--dark-gray] focus:border-[1px] focus:border-gray-500"
                  }`}
                  aria-invalid={!!serverError}
                  aria-describedby="email-error"
                  autoComplete="off"
                />
              </div>

              <div className="mb-4">
                <input
                  type="password"
                  placeholder="Password"
                  {...register("password")}
                  className={`p-3 w-full px-4 bg-[--dark-gray] rounded-[14px] focus:outline-none ${
                    serverError
                      ? "bg-[--input-bg-error] placeholder:text-[--input-error] border border-[--input-bg-error]"
                      : "border-[--dark-gray] border-[1px] bg-[--dark-gray] focus:border-[1px] focus:border-gray-500"
                  }`}
                  aria-invalid={!!serverError}
                  aria-describedby="password-error"
                />
              </div>

              <button
                type="submit"
                className="p-3 px-4 w-full bg-[--green] rounded-[14px] font-sans font-bold hover:bg-blue-500 hover:rounded-[10px]"
                disabled={loading}
              >
                {loading ? "Logging in..." : "Log In"}
              </button>

              <div className="my-4 flex justify-center">
                <ReCAPTCHA
                  sitekey="6Leb5PgqAAAAAPAQU12-5hyBCDVGT_cYPjhZRi2I"
                  onChange={handleRecaptchaVerify}
                />
              </div>

              <div className="flex items-center my-6">
                <div className="flex-grow border-t border-[#27292D]"></div>
                <span className="flex-shrink mx-4 text-[#8E8E8E]">or</span>
                <div className="flex-grow border-t border-[#27292D]"></div>
              </div>

              <button
                type="button"
                onClick={handleGoogleLogin}
                className="py-[12px] px-[20px] w-full h-[44px] bg-[#101114] border border-[#363940] rounded-[14px] font-sans font-medium hover:bg-[#2a2b30] transition-all duration-200 flex items-center justify-center gap-2"
              >
                <div className="size-[24px]">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="24"
                    height="24"
                    viewBox="0 0 48 48"
                  >
                    <path
                      fill="#FFC107"
                      d="M43.611,20.083H42V20H24v8h11.303c-1.649,4.657-6.08,8-11.303,8c-6.627,0-12-5.373-12-12c0-6.627,5.373-12,12-12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C12.955,4,4,12.955,4,24c0,11.045,8.955,20,20,20c11.045,0,20-8.955,20-20C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                    <path
                      fill="#FF3D00"
                      d="M6.306,14.691l6.571,4.819C14.655,15.108,18.961,12,24,12c3.059,0,5.842,1.154,7.961,3.039l5.657-5.657C34.046,6.053,29.268,4,24,4C16.318,4,9.656,8.337,6.306,14.691z"
                    ></path>
                    <path
                      fill="#4CAF50"
                      d="M24,44c5.166,0,9.86-1.977,13.409-5.192l-6.19-5.238C29.211,35.091,26.715,36,24,36c-5.202,0-9.619-3.317-11.283-7.946l-6.522,5.025C9.505,39.556,16.227,44,24,44z"
                    ></path>
                    <path
                      fill="#1976D2"
                      d="M43.611,20.083H42V20H24v8h11.303c-0.792,2.237-2.231,4.166-4.087,5.571c0.001-0.001,0.002-0.001,0.003-0.002l6.19,5.238C36.971,39.205,44,34,44,24C44,22.659,43.862,21.35,43.611,20.083z"
                    ></path>
                  </svg>
                </div>
                <span>Continue with Google</span>
              </button>

              {serverError && (
                <p className="text-[--error] text-sm mt-4">{serverError}</p>
              )}

              <Link
                className="text-[--light-green] block mt-4"
                href="/auth/forgot-password"
              >
                Forgot your password?
              </Link>

              <div className="flex items-center justify-center gap-[16px] mt-5">
                <p className="text-[14px leading-[20px] text-[#B0B0B0]">
                  Don&#39;t have an account?
                </p>
                <Link
                  className="bg-[--dark-gray] font-sans rounded-xl hover:bg-[#2a2b30] transition-all duration-200 text-[14px] leading-[16px] font-medium w-[69px] h-[32px] flex items-center justify-center"
                  href="/auth/sign-up"
                >
                  Sign Up
                </Link>
              </div>
            </form>
          </div>
        </div>
      </main>

      <Footer />

      <script
        dangerouslySetInnerHTML={{
          __html: `
          function handleRecaptchaVerify() {
            window.dispatchEvent(new Event('recaptchaVerified'));
          }
        `,
        }}
      />
    </div>
  );
};

export default Login;
