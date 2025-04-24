"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { subaccountTabs, tabs } from "@/shared/utils/tabs";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { GrBook } from "react-icons/gr";
import useStore from "@/shared/store";
import { Progress } from "@/shared/icons/Progress";
import { useTranslation } from "react-i18next";
import { IoMdClose } from "react-icons/io";
import { FiCheck } from "react-icons/fi";
import Unauthorized from "@/shared/components/Unauthorized";

const SuggestGuide = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const [isSend, setIsSend] = useState(false);

  const {
    suggestGuide,
    isSuggestingGuide,
    suggestGuideSuccess,
    resetSuggestGuideState,
    user,
  } = useStore();

  useEffect(() => {
    return () => {
      resetSuggestGuideState();
    };
  }, [resetSuggestGuideState]);

  useEffect(() => {
    if (suggestGuideSuccess) {
      setName("");
      setDescription("");
      setFormErrors({});
      resetSuggestGuideState();
    }
  }, [suggestGuideSuccess, resetSuggestGuideState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; description?: string } = {};
    if (!name.trim()) errors.name = t("suggestGuide.nameRequired");
    if (!description.trim())
      errors.description = t("suggestGuide.descriptionRequired");

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    await suggestGuide({ name, description });

    setIsSend(true);
  };

  return (
    <div className="bg-[#101114] text-white">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px]">
        <div className="flex flex-col lg:flex-row justify-center w-full p-3">
          <nav className="lg:w-[240px] w-full font-chakra font-bold leading-[20px] text-[#8E8E8E] m-0 lg:mr-[40px]">
            <OverlayScrollbarsComponent
              className="h-auto max-h-[300px] lg:max-h-none"
              options={{
                scrollbars: {
                  autoHide: "never",
                },
              }}>
              <ul className="w-full border-b-[1px] border-[#27292D] lg:border-none flex flex-row lg:flex-col mb-3">
                {user?.subaccount
                  ? subaccountTabs().map((tab) => (
                      <li
                        key={tab.name}
                        className={`whitespace-nowrap p-[6px] lg:px-[16px] lg:py-[12px] lg:rounded-[12px] lg:mb-1 cursor-pointer ${
                          isActive(tab.href)
                            ? "border-b-[1px] border-white lg:border-none lg:bg-[--dark-gray] text-white"
                            : "hover:border-b-[1px] border-white lg:border-none lg:hover:bg-[--dark-gray] hover:text-white"
                        }`}>
                        <Link
                          href={tab.href}
                          className="flex items-center gap-3 text-[16px]">
                          <span className="hidden lg:block">{tab.icon}</span>
                          {tab.name}
                        </Link>
                      </li>
                    ))
                  : tabs().map((tab) => (
                      <li
                        key={tab.name}
                        className={`whitespace-nowrap p-[6px] lg:px-[16px] lg:py-[12px] lg:rounded-[12px] lg:mb-1 cursor-pointer ${
                          isActive(tab.href)
                            ? "border-b-[1px] border-white lg:border-none lg:bg-[--dark-gray] text-white"
                            : "hover:border-b-[1px] border-white lg:border-none lg:hover:bg-[--dark-gray] hover:text-white"
                        }`}>
                        <Link
                          href={tab.href}
                          className="flex items-center gap-3 text-[16px]">
                          <span className="hidden lg:block">
                            {tab.name === "Progress" ? (
                              <div className="group-hover:text-white">
                                <Progress
                                  size={24}
                                  color={
                                    isActive(tab.href)
                                      ? "white"
                                      : "currentColor"
                                  }
                                />
                              </div>
                            ) : (
                              tab.icon
                            )}
                          </span>
                          {tab.name}
                        </Link>
                      </li>
                    ))}
              </ul>
            </OverlayScrollbarsComponent>
          </nav>
          <section className="w-full min-h-[1300px] bg-[--dark-gray] p-[32px] rounded-[16px]">
            {user?.verify_email ? (
              <div className="flex-col flex">
                <div className="flex items-center justify-center w-[48px] h-[48px] bg-[#2A2B32] rounded-[12px]">
                  <GrBook size={24} />
                </div>
                <div className="mt-4 mb-[32px]">
                  <p className="text-[24px] font-semibold leading-[32px] tracking-[-3%] mb-2">
                    {t("guides.title")}
                  </p>
                  <p className="text-[#949392] text-[14px] leading-[20px] sm:w-[450px] lg:w-[650px]">
                    {t("suggestGuide.description")}
                  </p>
                </div>
                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                  <p className="text-[18px] leading-[32px] font-semibold">
                    {t("suggestGuide.suggestTheGuide")}
                  </p>
                  <div className="max-w-[635px] w-full flex flex-col gap-4">
                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="guide-name"
                        className="text-[14px] leading-[16px]">
                        {t("suggestGuide.nameOfGuide")}
                      </label>
                      <input
                        id="guide-name"
                        type="text"
                        value={name}
                        onChange={(e) => {
                          if (e.target.value.length <= 255) {
                            setName(e.target.value);
                          }
                        }}
                        placeholder={t("suggestGuide.enterNamePlaceholder")}
                        className={`w-full h-[48px] bg-[#292B2F] rounded-[14px] py-[12px] px-[16px] text-[14px] leading-[20px] text-white ${
                          formErrors.name ? "border border-red-500" : ""
                        }`}
                      />
                      {formErrors.name && (
                        <span className="text-red-500 text-[12px]">
                          {formErrors.name}
                        </span>
                      )}
                      <div className="text-right">
                        <span className="text-[12px] text-[#949392]">
                          {name.length}/255
                        </span>
                      </div>
                    </div>

                    <div className="flex flex-col gap-2">
                      <label
                        htmlFor="guide-description"
                        className="text-[14px] leading-[16px]">
                        {t("suggestGuide.describeGuide")}
                      </label>
                      <div>
                        <textarea
                          id="guide-description"
                          value={description}
                          onChange={(e) => {
                            if (e.target.value.length <= 800) {
                              setDescription(e.target.value);
                            }
                          }}
                          className={`w-full min-h-[160px] h-full bg-[#292B2F] py-[12px] px-[16px] rounded-[10px] resize-none overflow-auto text-white ${
                            formErrors.description
                              ? "border border-red-500"
                              : ""
                          }`}
                          placeholder={t(
                            "suggestGuide.describeIdeaPlaceholder",
                          )}
                        />
                        {formErrors.description && (
                          <span className="text-red-500 text-[12px]">
                            {formErrors.description}
                          </span>
                        )}
                      </div>
                      <div className="text-right">
                        <span className="text-[12px] text-[#949392]">
                          {description.length}/800
                        </span>
                      </div>
                    </div>

                    <button
                      type="submit"
                      disabled={isSuggestingGuide}
                      className={`w-fit h-[44px] font-sans font-semibold ${
                        isSuggestingGuide
                          ? "bg-[#0E9900] opacity-70"
                          : "bg-[#11CA00]"
                      } rounded-[14px] px-[20px] py-[14px] flex items-center justify-center text-[15px] leading-[16px] text-white`}>
                      {isSuggestingGuide
                        ? t("suggestGuide.sending")
                        : t("suggestGuide.send")}
                    </button>
                  </div>
                </form>
              </div>
            ) : (
              <Unauthorized />
            )}
          </section>
        </div>
      </main>

      <Footer />

      {isSend && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-40 z-50"></div>

          <div className="fixed top-[150px] md:top-[60px] left-1/2 -translate-x-1/2 w-[357px] sm:w-[381px] h-[474px] lg:h-[494px] rounded-[12px] z-50 bg-[#1C1E22] p-6">
            <button
              className="absolute top-5 right-5"
              onClick={() => setIsSend(false)}>
              <IoMdClose size={24} className="text-[#9EA0A6] cursor-pointer" />
            </button>

            <div className="flex flex-col items-center justify-center h-full">
              <div className="bg-[#11CA00] rounded-full p-4 mb-6">
                <FiCheck size={32} className="text-white" />
              </div>
              <h2 className="text-[24px] font-bold mb-4 text-center">
                {t("suggestGuide.isSendTitle")}
              </h2>
              <p className="text-[16px] text-[#B0B0B0] text-center mb-8">
                {t("suggestGuide.isSendDescription")}
              </p>
              <button
                onClick={() => setIsSend(false)}
                className="h-[44px] lg:h-[56px] font-sans w-full px-[20px] lg:px-[24px] py-[12px] lg:py-[18px] rounded-[16px] bg-[#1D1E23] text-[16px] lg:text-[17px] leading-[20px] font-semibold">
                {t("common.close")}
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default SuggestGuide;
