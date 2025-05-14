import { IoIosArrowBack, IoMdClose } from "react-icons/io";
import { useEffect, useRef, useState } from "react";
import clsx from "clsx";
import useStore from "@/shared/store";
import { update2FA } from "@/shared/api/axios";
import { usePathname } from "next/navigation";
import { useTranslation } from "react-i18next";

type DeleteAccountModalType = {
  onClose: () => void;
  onBack?: () => void;
};

export const AuthenticatorVerificationModal = ({
  onClose,
  onBack,
}: DeleteAccountModalType) => {
  const { t } = useTranslation();
  const pathname = usePathname();

  const [code, setCode] = useState<string[]>(Array(6).fill(""));
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  const [badCode, setBadCode] = useState(false);
  const [disableCode, setDisableCode] = useState(false);

  const { confirm2FA, refreshUser } = useStore();

  const [errorMessage, setErrorMessage] = useState(null);

  const handleChange = (index: number, value: string) => {
    setBadCode(false);

    if (!/^\d*$/.test(value)) return;

    const newCode = [...code];
    newCode[index] = value;
    setCode(newCode);

    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (
    index: number,
    e: React.KeyboardEvent<HTMLInputElement>,
  ) => {
    if (e.key === "Backspace" && !code[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleBackClick = () => {
    if (onBack) {
      onBack();
    } else {
      onClose();
    }
  };

  useEffect(() => {
    if (code.every((num) => !isNaN(parseFloat(num)))) {
      setTimeout(() => {
        const finishCode = +code.join("");

        setDisableCode(true);

        confirm2FA(finishCode)
          .then(({ two_factor_token }) => {
            update2FA(two_factor_token);

            if (pathname === "/auth/login" || pathname === "/google/callback") {
              window.location.href = "/guides";
            }

            refreshUser().then(() => {
              if (pathname !== "/google/callback") {
                onClose();
              }
            });
          })
          .catch((err) => {
            if (err.status === 403) {
              if (document.activeElement instanceof HTMLElement) {
                document.activeElement.blur();
              }

              setErrorMessage(
                typeof err?.response?.data === "string"
                  ? err?.response?.data
                  : t("common.tryAgain"),
              );
            }
            setBadCode(true);

            setDisableCode(false);
          });
      }, 500);
    }
  }, [code]);

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-80 flex items-center justify-center">
      <div className="bg-[#1C1E22] rounded-[16px] p-6 max-w-[370px] w-full absolute top-[120px]">
        <button className="absolute top-5 right-5" onClick={onClose}>
          <IoMdClose size={24} className="text-[#8E8E8E] cursor-pointer" />
        </button>

        {typeof onBack === "function" && (
          <div
            className="flex items-center gap-1 mb-[15px] cursor-pointer"
            onClick={handleBackClick}>
            <button>
              <IoIosArrowBack size={16} />
            </button>
            <p className="text-[14px] font-normal leading-[16px] font-sans">
              {t("authenticatorVerificationModal.back")}
            </p>
          </div>
        )}

        <div className="flex flex-col gap-[15px]">
          <p className="text-[22px] font-bold leading-[20px] text-white">
            {t("authenticatorVerificationModal.title")}
          </p>

          <p className="text-[#949392] text-[14px] leading-[20px] mb-6">
            {t("authenticatorVerificationModal.enterCode")}
          </p>
        </div>

        <div className="w-full flex items-center gap-[8px]">
          {[...Array(6)].map((_, index) => (
            <input
              key={index}
              ref={(el) => {
                inputRefs.current[index] = el;
              }}
              type="text"
              maxLength={1}
              inputMode="numeric"
              pattern="[0-9]*"
              value={code[index]}
              onChange={(e) => handleChange(index, e.target.value)}
              onKeyDown={(e) => handleKeyDown(index, e)}
              className={clsx(
                "w-[48px] h-[64px] text-white bg-[#292C33] rounded-[8px] text-center text-[24px] focus:outline-none focus:border-2 focus:border-[#CBFF51]",
                badCode && "border-2 !border-[#FF0000]/65",
                disableCode && "pointer-events-none !opacity-65",
              )}
            />
          ))}
        </div>
        {errorMessage && (
          <p className="text-red-600 mt-3 -mb-4">{errorMessage}</p>
        )}
        <p className="text-[14px] leading-[20px] font-sans text-[#656768] mt-[24px]">
          {t("authenticatorVerificationModal.codeValidity")}
        </p>
      </div>
    </div>
  );
};
