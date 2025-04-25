import { ChangeEvent, useEffect, useState } from "react";
import { CiCircleInfo } from "react-icons/ci";
import { IoMdClose } from "react-icons/io";
import { MdOutlineDone, MdOutlineKeyboardArrowRight } from "react-icons/md";
import { validateAmount } from "@/shared/utils/validation";
import useStore from "@/shared/store";
import { useTranslation } from "react-i18next";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import clsx from "clsx";

type PlansModalType = {
  togglePlansModal: () => void;
};

enum CurrencyType {
  Fiat = "Fiat",
  Crypto = "Crypto",
}

export const PlansModal = ({ togglePlansModal }: PlansModalType) => {
  const { t } = useTranslation();
  const [isInnerModalOpen, setIsInnerModalOpen] = useState(false);
  const [selectedPlan, setSelectedPlan] = useState<number | null>(null);
  const [amount, setAmount] = useState(100);
  const [inputValue, setInputValue] = useState<string>("100");
  const [selected, setSelected] = useState(CurrencyType.Fiat);
  const [couponCode, setCouponCode] = useState("");
  const [isCouponApplied, setIsCouponApplied] = useState(false);
  const [error, setError] = useState<string | undefined>();
  const [isFocused, setIsFocused] = useState(false);
  const [isPurchaseSuccessful, setIsPurchaseSuccessful] = useState(false);
  const {
    user,
    plans,
    isLoadingPlans,
    plansFetchError,
    fetchPlans,
    payWithYookassa,
    payWithNowPayments,
    checkCoupon,
    coupon,
    isCouponLoading,
    couponError,
    clearCoupon,
    buyPlan,
    isBuyingPlan,
    buyPlanError,
    buyPlanSuccess,
    resetBuyPlanState,
  } = useStore();

  const [paymentLoading, setPaymentLoading] = useState(false);

  useEffect(() => {
    fetchPlans();
    resetBuyPlanState();
    return () => {
      clearCoupon();
      resetBuyPlanState();
    };
  }, [fetchPlans, clearCoupon, resetBuyPlanState]);

  useEffect(() => {
    if (plans.length > 0 && selectedPlan === null) {
      setSelectedPlan(plans[0].id);
    }
  }, [plans, selectedPlan]);

  const handleSwitch = (type: CurrencyType) => {
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
      setInputValue(amount.toString());
    }
  };

  const toggleInnerModal = () => {
    setIsInnerModalOpen(!isInnerModalOpen);
    if (!isInnerModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
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
      window.location.href = needUrl;
    }

    setPaymentLoading(false);
  };

  const handleApplyCoupon = async () => {
    if (!couponCode.trim()) return;

    const result = await checkCoupon(couponCode.trim());
    if (result) {
      setIsCouponApplied(true);
    }
  };

  const handleCouponInputChange = (e: ChangeEvent<HTMLInputElement>) => {
    setCouponCode(e.target.value);
    if (isCouponApplied) {
      setIsCouponApplied(false);
      clearCoupon();
    }
  };

  const handlePurchasePlan = async () => {
    if (!selectedPlan) return;

    try {
      resetBuyPlanState();

      const success = await buyPlan(
        selectedPlan,
        isCouponApplied && couponCode ? couponCode : undefined,
      );

      if (success) {
        setIsPurchaseSuccessful(true);
      }
    } catch (err) {
      console.error("Error purchasing plan:", err);
    }
  };

  const selectedPlanDetails = plans.find((plan) => plan.id === selectedPlan);
  let amountDue = selectedPlanDetails ? Number(selectedPlanDetails.price) : 0;

  if (coupon && selectedPlanDetails) {
    if (coupon.perc) {
      const discountAmount = amountDue * (Number(coupon.sale) / 100);
      amountDue = Math.max(0, amountDue - discountAmount);
    } else {
      amountDue = Math.max(0, amountDue - Number(coupon.sale));
    }
  }

  useEffect(() => {
    return () => {
      resetBuyPlanState();
      clearCoupon();
      document.body.classList.remove("no-scroll");
    };
  }, [resetBuyPlanState, clearCoupon]);

  const isSuccessState = isPurchaseSuccessful || buyPlanSuccess;

  if (isSuccessState) {
    return (
      <div className="fixed inset-0 bg-black bg-opacity-40 z-40 overflow-y-auto flex justify-center items-center">
        <div className="relative w-[95%] max-w-[500px] bg-[#1C1E22] p-6 rounded-[16px] flex flex-col shadow-lg">
          <button className="absolute top-5 right-5" onClick={togglePlansModal}>
            <IoMdClose size={24} className="text-[#8E8E8E] cursor-pointer" />
          </button>
          <div className="flex flex-col items-center justify-center py-8">
            <div className="w-16 h-16 bg-[#11CA00] rounded-full flex items-center justify-center mb-4">
              <MdOutlineDone size={32} />
            </div>
            <h2 className="text-xl font-bold mb-2">{t("common.success")}</h2>
            <p className="text-center text-gray-300 mb-6">
              {t("plansModal.planActivated") || buyPlanSuccess}
            </p>
            <button
              onClick={togglePlansModal}
              className="px-6 py-3 bg-[#11CA00] hover:bg-blue-500 rounded-[12px] font-semibold">
              {t("common.close")}
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black bg-opacity-40 z-40 overflow-y-auto flex justify-center items-center">
      <div className="relative w-[95%] xl:w-[1040px] h-[90% lg:h-auto bg-[#1C1E22] p-2 rounded-[16px] flex flex-col shadow-lg overflow-y-auto">
        <button className="absolute top-5 right-5" onClick={togglePlansModal}>
          <IoMdClose size={24} className="text-[#8E8E8E] cursor-pointer" />
        </button>
        <p className="text-[#CBFF51] leading-[20px] mb-[10px] p-4 pb-0">
          {t("plansModal.title")}
        </p>
        <OverlayScrollbarsComponent
          className="overflow-y-auto flex-1 p-4 pt-0"
          style={{ maxHeight: "calc(100vh - 120px)" }}
          options={{
            scrollbars: {
              autoHide: "scroll",
            },
          }}>
          {buyPlanError && (
            <div className="mb-3 p-3 bg-red-900/30 border border-red-500 rounded-[12px] text-red-400">
              {buyPlanError}
            </div>
          )}

          <div className="flex flex-col lg:flex-row lg:justify-between">
            <div className="py-[10px] sm:p-0 w-[100%] flex flex-col gap-[12px] md:gap-[20px] lg:w-[450px]">
              <p className="font-bold text-[22px] xl:text-[24px] sm:text-[26px] leading-[36px] -tracking-[3%]">
                {t("plansModal.description")}
              </p>
              <div className="flex flex-col gap-5">
                <div className="relative">
                  <MdOutlineDone
                    size={20}
                    className="text-[#CBFF51] absolute top-0 left-0"
                  />
                  <p className="font-semibold leading-[20px] px-[25px]">
                    {t("plansModal.benefit1")}
                  </p>
                </div>
                <div className="relative">
                  <MdOutlineDone
                    size={20}
                    className="text-[#CBFF51] absolute top-0 left-0"
                  />
                  <p className="font-semibold leading-[20px] px-[25px]">
                    {t("plansModal.benefit2")}
                  </p>
                </div>
                <div className="relative">
                  <MdOutlineDone
                    size={20}
                    className="text-[#CBFF51] absolute top-0 left-0"
                  />
                  <p className="font-semibold leading-[20px] px-[25px]">
                    {t("plansModal.benefit3")}
                  </p>
                </div>
                <div className="relative">
                  <MdOutlineDone
                    size={20}
                    className="text-[#CBFF51] absolute top-0 left-0"
                  />
                  <p className="font-semibold leading-[20px] px-[25px]">
                    {t("plansModal.benefit4")}
                  </p>
                </div>
                <div className="relative">
                  <MdOutlineDone
                    size={20}
                    className="text-[#CBFF51] absolute top-0 left-0"
                  />
                  <p className="font-semibold leading-[20px] px-[25px]">
                    {t("plansModal.benefit5")}
                  </p>
                </div>
              </div>
            </div>
            <div className="w-[100%] bg-transparent lg:w-[450px]">
              <h2 className="text-[18px] leading-[20px] -tracking-[0.18px] font-bold pt-[32px] lg:pt-0 mb-[15px]">
                {t("plansModal.choosePlan")}
              </h2>

              {isLoadingPlans ? (
                <div className="flex justify-center py-8">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                </div>
              ) : plansFetchError ? (
                <div className="text-[#FF6F6F] p-4 rounded-[12px] border border-[#FF6F6F] bg-[#FF6F6F10]">
                  {plansFetchError}
                </div>
              ) : (
                <ul className="flex flex-col gap-2">
                  {plans.map((plan) => (
                    <li
                      key={plan.id}
                      onClick={() => setSelectedPlan(plan.id)}
                      className={`cursor-pointer p-4 rounded-[12px] flex justify-between items-center border-[1px] transition-all duration-300 ${
                        selectedPlan === plan.id
                          ? "border-[#436237] border-[1px] bg-[#1D2A19]"
                          : "border-gray-700 hover:border-gray-500"
                      }`}>
                      <div className="flex items-center gap-4">
                        <div
                          className={`w-[24px] h-[24px] flex items-center justify-center rounded-full border-2 transition-all duration-300 ${
                            selectedPlan === plan.id
                              ? "border-[1px] border-[#73A304] bg-[#528E09]"
                              : "border-gray-700"
                          }`}>
                          {selectedPlan === plan.id && (
                            <MdOutlineDone size={20} />
                          )}
                        </div>
                        <div
                          className={`flex flex-col sm:flex-row sm:items-center justify-between sm:gap-[12px] ${
                            plan.sort === 2 || plan.sort === 3
                              ? `sm:w-[200px]`
                              : `sm:w-[200px]`
                          }`}>
                          <p className="font-bold">{plan.name}</p>
                          <p className="text-[#8E8E8E]">
                            {plan.count_days} {t("plansModal.days")}
                          </p>
                        </div>
                      </div>
                      <div>
                        {plan.price_month ? (
                          <div className="flex flex-col sm:flex-row sm:items-center gap-[1px] sm:gap-[12px]">
                            <p className="text-[16px] leading-[18px] font-bold text-[#CBFF51]">
                              ${parseFloat(plan.price).toFixed(0)}
                            </p>
                            <p className="leading-[15px] text-[#8E8E8E]">
                              ${parseFloat(plan.price_month).toFixed(0)}/
                              {t("plansModal.month")}
                            </p>
                          </div>
                        ) : (
                          <p className="text-[16px] text-left leading-[18px] font-bold text-[#CBFF51] w-[75px] sm:mr-[50px]">
                            ${parseFloat(plan.price).toFixed(0)}
                          </p>
                        )}
                      </div>
                    </li>
                  ))}
                </ul>
              )}

              <div className="mt-[25px]">
                <p className="mb-1 leading-[16px] font-semibold">
                  {t("plansModal.coupon")}
                </p>
                <div className="flex items-center gap-2">
                  <input
                    className={`bg-[#212226] p-2 w-[200px] rounded-[12px] placeholder:text-[14px] placeholder:leading-[20px] ${
                      couponError ? "border border-red-500" : ""
                    } ${isCouponApplied ? "border border-green-500" : ""}`}
                    placeholder={t("plansModal.enterCoupon")}
                    value={couponCode}
                    onChange={handleCouponInputChange}
                  />
                  <button
                    className={`px-[10px] py-[12px] text-white font-bold leading-[16px] rounded-[10px] transition-colors ${
                      couponCode && !isCouponApplied && !isCouponLoading
                        ? "bg-[#11CA00] hover:bg-blue-500"
                        : isCouponApplied
                          ? "bg-green-600 cursor-default"
                          : "bg-[#333333] text-[#A4A4A4] cursor-not-allowed"
                    }`}
                    disabled={!couponCode || isCouponApplied || isCouponLoading}
                    onClick={handleApplyCoupon}>
                    {isCouponLoading ? (
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                    ) : isCouponApplied ? (
                      t("plansModal.couponApplied")
                    ) : (
                      t("plansModal.apply")
                    )}
                  </button>
                </div>
                {couponError && (
                  <p className="text-red-500 text-sm mt-1">
                    {t("plansModal.couponInvalid")}
                  </p>
                )}
                {coupon && isCouponApplied && (
                  <p className="text-green-500 text-sm mt-1">
                    {t("plansModal.couponAppliedInfo")}:{" "}
                    {coupon.perc
                      ? `${coupon.sale}% ${t("plansModal.off")}`
                      : `$${coupon.sale} ${t("plansModal.off")}`}
                  </p>
                )}
              </div>
            </div>
          </div>

          <hr className="my-[16px] md:my-[32px] border-0 h-px bg-[#27292D]" />

          <div className="bg-[#1C1E22] sticky -bottom-[30px] h-[150px] left-0 w-full pt-4 lg:pt-0">
            <div className="flex items-center justify-between h-[46px] md:h-[58px] gap-[12px]">
              <div className="flex flex-col gap-[12px]">
                <p className="leading-[20px]">{t("plansModal.totalPrice")}</p>
                <div className="flex items-center gap-2">
                  <p className="text-[20px] leading-[24px] md:text-[24px] md:leading-[28px] font-bold">
                    ${amountDue.toFixed(2)}
                  </p>
                  {coupon && selectedPlanDetails && (
                    <p className="text-[14px] text-gray-400 line-through">
                      ${parseFloat(selectedPlanDetails.price).toFixed(2)}
                    </p>
                  )}
                </div>
              </div>

              {user && Number(user.balance) >= amountDue ? (
                <button
                  className={`flex items-center font-sans gap-1 rounded-[16px] pr-[12px] pl-[20px] py-[12px] md:py-[18px] md:pr-[16px] md:pl-[24px] ${
                    isBuyingPlan
                      ? "bg-gray-600"
                      : "bg-[#11CA00] hover:bg-blue-500"
                  } font-semibold leading-[20px] justify-center text-[16px] md:text-[17px]`}
                  onClick={handlePurchasePlan}
                  disabled={isBuyingPlan}>
                  {isBuyingPlan ? (
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                  ) : (
                    <>
                      {t("plansModal.pay")}
                      <MdOutlineKeyboardArrowRight />
                    </>
                  )}
                </button>
              ) : (
                <button
                  className="flex items-center font-sans gap-1 rounded-[16px] pr-[12px] pl-[20px] py-[12px] md:py-[18px] md:pr-[16px] md:pl-[24px] bg-[#11CA00] hover:bg-blue-500 font-semibold leading-[20px] justify-center text-[16px] md:text-[17px]"
                  onClick={toggleInnerModal}>
                  {t("balanceModal.title")}
                  <MdOutlineKeyboardArrowRight />
                </button>
              )}
            </div>

            {user && Number(user.balance) < amountDue && (
              <p className="text-[#8E8E8E] leading-[20px] mt-[26px]">
                <span className="text-[#FF6F6F]">
                  {t("plansModal.accountBalance")}: ${user.balance}
                </span>{" "}
                <span className="hidden sm:inline">
                  {t("plansModal.insufficientFunds")}
                </span>
              </p>
            )}

            <div className="flex text-[#D7B5FF] bg-[#B030BE0A] gap-2 mt-4 rounded-[12px] p-[10px] items-center">
              <CiCircleInfo size={24} />
              <p className="text-[13px] leading-[18px]">
                {t("plansModal.vpnTip1")}{" "}
                <span className="text-[#E37DFF]">
                  {t("plansModal.vpnTip2")}
                </span>
              </p>
            </div>
          </div>

          {isInnerModalOpen && (
            <>
              <div className="fixed inset-0 bg-black bg-opacity-40 z-80"></div>

              <div className="modal absolute top-[30px] left-1/2 -translate-x-1/2 shadow-2xl w-[351px] md:w-[381px] md:h-[326px] rounded-[12px] bg-[#1C1E22] p-6">
                <button
                  className="top-10 absolute sm:top-5 right-5"
                  onClick={toggleInnerModal}>
                  <IoMdClose
                    size={24}
                    className="text-[#8E8E8E] cursor-pointer"
                  />
                </button>
                <div>
                  <p className="text-[18x] font-bold leading-[20px]">
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
                        onClick={() => handleSwitch(CurrencyType.Fiat)}>
                        {t("balanceModal.fiat")}
                      </button>
                      <button
                        className={`px-4 py-2 rounded-full text-sm font-medium w-[92px] ${
                          selected === "Crypto"
                            ? "bg-[#36383D] text-white"
                            : "bg-transparent text-gray-400"
                        }`}
                        onClick={() => handleSwitch(CurrencyType.Crypto)}>
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

                    {error && (
                      <p className="text-red-500 text-sm mt-1">{error}</p>
                    )}
                  </div>
                  <button
                    onClick={handlePayment}
                    disabled={!!error || amount <= 0}
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
            </>
          )}
        </OverlayScrollbarsComponent>
      </div>
    </div>
  );
};
