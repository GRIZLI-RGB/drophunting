import React, { useState } from "react";
import { BsTwitterX } from "react-icons/bs";
import { FaCaretDown, FaCheck } from "react-icons/fa6";
import { GrLanguage } from "react-icons/gr";
import { IoMdClose } from "react-icons/io";
import { RiTelegram2Fill } from "react-icons/ri";
import { useTranslation } from "react-i18next";
import Link from "next/link";
import Cookies from "js-cookie";

type LandingModalType = {
  toggleLandingModal: () => void;
  scrollToSection: (ref: React.RefObject<HTMLDivElement | null>) => void;
  aboutSectionRef: React.RefObject<HTMLDivElement>;
  resultsSectionRef: React.RefObject<HTMLDivElement>;
  howItWorksSectionRef: React.RefObject<HTMLDivElement>;
  contactsSectionRef: React.RefObject<HTMLDivElement>;
};

const LandingModal = ({
  toggleLandingModal,
  scrollToSection,
  aboutSectionRef,
  resultsSectionRef,
  howItWorksSectionRef,
  contactsSectionRef,
}: LandingModalType) => {
  const { t, i18n } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);

  const languages = [
    { code: "ru", name: t("profileModal.russian") },
    { code: "en", name: t("profileModal.english") },
  ];

  const handleLanguageChange = (code: string) => {
    if (code === selectedLanguage) return;

    setSelectedLanguage(code);
    i18n.changeLanguage(code);
    // Save language preference in cookies for non-logged in users
    Cookies.set("language", code, { expires: 365, path: "/" });

    setIsLanguageDropdownOpen(false);
  };

  return (
    <div className="h-full bg-[#1C1E22] relative">
      <button
        className="block absolute top-3 right-3 text-white"
        onClick={toggleLandingModal}>
        <IoMdClose size={24} className="hover:text-[#9EA0A6] cursor-pointer" />
      </button>
      <div className="p-[16px] flex flex-col justify-between h-full">
        <div className="flex flex-col gap-[4px] text-[16px] leading-[22px] font-semibold">
          <button
            onClick={() => scrollToSection(aboutSectionRef)}
            className="hover:bg-[#24262A] bg-transparent text-white rounded-[12px] py-[16px] text-left px-[16px] mt-[24px]">
            {t("landingModal.aboutService")}
          </button>
          <button
            onClick={() => scrollToSection(resultsSectionRef)}
            className="hover:bg-[#24262A] bg-transparent text-white rounded-[12px] py-[16px] text-left px-[16px]">
            {t("landingModal.results")}
          </button>
          <button
            onClick={() => scrollToSection(howItWorksSectionRef)}
            className="hover:bg-[#24262A] bg-transparent text-white rounded-[12px] py-[16px] text-left px-[16px]">
            {t("landingModal.howItWorks")}
          </button>
          <button
            onClick={() => scrollToSection(contactsSectionRef)}
            className="hover:bg-[#24262A] bg-transparent text-white rounded-[12px] py-[16px] text-left px-[16px]">
            {t("landingModal.contacts")}
          </button>
          <div className="flex flex-col gap-[12px] mt-[24px]">
            <div className="flex flex-col gap-[12px]">
              <Link
                href="https://app.drophunting.io/guides"
                className="hover:bg-[#0D9E00] transition-colors w-full bg-[#11CA00] py-[18px] rounded-[8px] text-[14px] leading-[16px] flex items-center justify-center">
                {t("landingModal.goToAggregator")}
              </Link>
              {/* <button className="bg-[#21274C] w-full py-[18px] rounded-[8px] text-[14px] leading-[16px] flex items-center justify-center">
                {t("landingModal.subscribeToBot")}
              </button> */}
            </div>
          </div>
          <hr className="my-[26px] border-0 h-px bg-[#24262A]" />
          <div className="flex items-center mb-[26px]">
            <div className="flex items-center gap-[20px]">
              <BsTwitterX
                onClick={() =>
                  window.open("https://x.com/Drophunting_io", "_blank")
                }
                className="cursor-pointer hover:opacity-80 transition-opacity"
                size={24}
              />
              {/* <FaDiscord
                onClick={() => window.open("https://google.com", "_blank")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                size={28}
              /> */}
              <RiTelegram2Fill
                onClick={() =>
                  window.open("https://t.me/drophunting_group", "_blank")
                }
                className="cursor-pointer hover:opacity-80 transition-opacity"
                size={28}
              />
              {/* <FaInstagram
                onClick={() => window.open("https://google.com", "_blank")}
                className="cursor-pointer hover:opacity-80 transition-opacity"
                size={28}
              /> */}
            </div>
          </div>
          <div className="relative">
            <div
              className="cursor-pointer flex items-center gap-[6px]"
              onClick={() =>
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
              }>
              <GrLanguage size={20} />
              <p>{t("landing.language")}</p>
              <FaCaretDown />
            </div>
            {isLanguageDropdownOpen && (
              <div className="block absolute left-0 mt-2 w-[150px] bg-[#141518] p-[4px] rounded-[12px] shadow-lg z-50 space-y-[2px]">
                {languages.map((lang) => (
                  <div
                    key={lang.code}
                    className={`flex items-center justify-between p-[12px] rounded-[12px] cursor-pointer hover:bg-[#181C20] ${
                      selectedLanguage === lang.code && `bg-[#181C20]`
                    }`}
                    onClick={() => handleLanguageChange(lang.code)}>
                    <div className="flex items-center gap-[12px]">
                      <p className="text-[14px] font-semibold">{lang.name}</p>
                    </div>
                    {selectedLanguage === lang.code && (
                      <FaCheck size={16} className="text-[#CBFF51]" />
                    )}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default LandingModal;
