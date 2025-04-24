import React, { ChangeEvent, useState } from "react";
import { IoMdClose } from "react-icons/io";
import { MdOutlineKeyboardArrowRight } from "react-icons/md";
import { useTranslation } from "react-i18next";
import useStore from "@/shared/store";
import { validateAmount, formatAmount } from "@/shared/utils/validation";
import clsx from "clsx";

type BalanceModalType = {
  toggleBalanceModal: () => void;
};

const BalanceModal = ({ toggleBalanceModal }: BalanceModalType) => {
  const { t } = useTranslation();
  const { payWithYookassa, payWithNowPayments } = useStore();
  const [amount, setAmount] = useState<number>(100);
  const [inputValue, setInputValue] = useState<string>("100");
  const [selected, setSelected] = useState("Fiat");
  const [error, setError] = useState<string | undefined>();
  const [isFocused, setIsFocused] = useState(false);

  const [paymentLoading, setPaymentLoading] = useState(false);

  const handleSwitch = (type: string) => {
    setSelected(type);
  };

  // const handleInputBalanceChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const rawValue = e.target.value;
  //   setInputValue(rawValue);

  //   const validation = validateAmount(rawValue, selected as "Fiat" | "Crypto");
  //   if (validation.isValid && validation.amount !== null) {
  //     setAmount(validation.amount);
  //     setError(undefined);
  //   } else {
  //     setError(validation.error);
  //     if (rawValue === "") {
  //       setAmount(0);
  //       setInputValue("0");
  //     }
  //   }
  // };

  // const handleInputBalanceChange = (e: ChangeEvent<HTMLInputElement>) => {
  //   const rawValue = e.target.value.replace(/,/g, ".");
  //   setInputValue(rawValue);

  //   const validation = validateAmount(rawValue, selected as "Fiat" | "Crypto");
  //   if (validation.isValid && validation.amount !== null) {
  //     setAmount(validation.amount);
  //     setError(undefined);
  //   } else {
  //     setError(validation.error);
  //     if (rawValue === "") {
  //       setAmount(0);
  //       setInputValue("0");
  //     }
  //   }
  // };

  const handleInputBalanceChange = (e: ChangeEvent<HTMLInputElement>) => {
    const rawValue = e.target.value.replace(/,/g, ".");
    setInputValue(rawValue);

    const validation = validateAmount(rawValue, selected as "Fiat" | "Crypto");
    if (validation.isValid) {
      setAmount(validation.amount !== null ? validation.amount : 0);
      setError(undefined);
    } else {
      setError(validation.error);
      setAmount(0); // Устанавливаем amount в 0 при невалидном вводе или пустой строке
    }
  };

  const handleInputFocus = () => {
    setIsFocused(true);
  };

  const handleInputBlur = () => {
    setIsFocused(false);
    if (!error && amount > 0) {
      setInputValue(formatAmount(amount));
    }
  };

  const handlePayment = async () => {
    if (error || amount <= 0) return;

    let needUrl = "/";

    setPaymentLoading(true);

    if (selected === "Fiat") {
      needUrl = (await payWithYookassa(amount)).redirect_url;
    } else {
      needUrl = (await payWithNowPayments(amount)).redirect_url;
    }

    if (needUrl) {
      window.open(needUrl, "_blank");
    }

    setPaymentLoading(false);
  };

  return (
    <div>
      <button
        className="top-10 absolute sm:top-5 right-5"
        onClick={toggleBalanceModal}>
        <IoMdClose
          size={24}
          className="block lg:hidden hover:text-[#9EA0A6] cursor-pointer"
        />
      </button>
      <div>
        <p className="text-[18px] font-bold leading-[20px]">
          {t("balanceModal.title")}
        </p>
        <div className="mt-5">
          <p className="font-semibold leading-[16px]">
            {t("balanceModal.currencyType")}
          </p>
          <div className="flex items-center bg-[#292B2F] rounded-full mt-2 w-[184px]">
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium w-[92px] ${
                selected === "Fiat"
                  ? "bg-[#36383D] text-white"
                  : "bg-transparent text-gray-400"
              }`}
              onClick={() => handleSwitch("Fiat")}>
              {t("balanceModal.fiat")}
            </button>
            <button
              className={`px-4 py-2 rounded-full text-sm font-medium w-[92px] ${
                selected === "Crypto"
                  ? "bg-[#36383D] text-white"
                  : "bg-transparent text-gray-400"
              }`}
              onClick={() => handleSwitch("Crypto")}>
              {t("balanceModal.crypto")}
            </button>
          </div>
        </div>
        <div className="my-5">
          <p className="font-semibold leading-[16px]">
            {t("balanceModal.amount")}
          </p>

          <div
            className={clsx(
              "flex items-center gap-1.5 bg-[#292B2F] border-[1px] py-[12px] px-[16px] rounded-[14px] mt-2 w-full focus:border-[1px]",
              isFocused
                ? error
                  ? "border-red-500"
                  : "border-gray-500"
                : error
                  ? "border-red-500"
                  : "border-transparent",
            )}>
            <span>$</span>

            <input
              className="bg-transparent focus:outline-none w-full"
              type="text"
              value={inputValue}
              onChange={handleInputBalanceChange}
              onFocus={handleInputFocus}
              onBlur={handleInputBlur}
              placeholder={t("balanceModal.enterAmount")}
            />
          </div>

          {error && <p className="text-red-500 text-sm mt-1">{error}</p>}
        </div>
        <button
          onClick={handlePayment}
          disabled={!!error || amount <= 0 || paymentLoading}
          className={`w-full flex items-center justify-center gap-1 rounded-[16px] h-[56px] pr-[16px] pl-[24px] ${
            error || amount <= 0
              ? "bg-gray-500 cursor-not-allowed"
              : "bg-[#11CA00] hover:bg-blue-500"
          } font-semibold leading-[20px] text-[17px]`}>
          {paymentLoading ? (
            <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]" />
          ) : (
            <>
              {t("balanceModal.goToPayment")}
              <MdOutlineKeyboardArrowRight />
            </>
          )}
        </button>
      </div>
    </div>
  );
};

export default BalanceModal;
