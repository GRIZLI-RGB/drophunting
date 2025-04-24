import React, { useState } from "react";
import { IoMdClose } from "react-icons/io";
import Link from "next/link";
import Image from "next/image";
import starIcon from "../../../../public/assets/icons/star.png";
import { useTranslation } from "react-i18next";
import useAuth from "@/shared/hooks/useAuth";
import { FaCheck, FaCaretDown } from "react-icons/fa6";
import Cookies from "js-cookie";
import { RiTelegram2Fill } from "react-icons/ri";
import { PiXLogo } from "react-icons/pi";
import ru from "../../../../public/assets/icons/ru.png";
import en from "../../../../public/assets/icons/en.png";
import { GrLanguage } from "react-icons/gr";

type ProfileModalType = {
  toggleNavigationModal: () => void;
  openPlansModal: () => void;
};

const NavigationModal = ({
  toggleNavigationModal,
  openPlansModal,
}: ProfileModalType) => {
  const { t, i18n } = useTranslation();
  const { user } = useAuth();
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  const languages = [
    { code: "ru", name: t("profileModal.russian"), flag: ru },
    { code: "en", name: t("profileModal.english"), flag: en },
  ];

  const handleLanguageChange = async (code: string) => {
    if (isUpdatingLanguage || code === selectedLanguage) return;

    setIsUpdatingLanguage(true);
    setSelectedLanguage(code);
    i18n.changeLanguage(code);

    // Save language in cookies for non-logged in users
    Cookies.set("language", code, { expires: 365, path: "/" });

    setIsLanguageDropdownOpen(false);
    setIsUpdatingLanguage(false);
  };

  const tabs = [
    {
      name: t("navigationModal.guides"),
      href: "/guides",
    },
    {
      name: t("navigationModal.blog"),
      href: "/blog",
    },
    // {
    //   name: t("navigationModal.store"),
    //   href: "/store",
    // },
  ];

  return (
    <div className="h-full bg-[#1C1E22] relative lg:w-[299px] rounded-[12px] px-[12px] pt-[32px]">
      <button
        className="block lg:hidden absolute top-3 right-3 text-white"
        onClick={toggleNavigationModal}>
        <IoMdClose size={24} className="hover:text-[#9EA0A6] cursor-pointer" />
      </button>
      <div className="w-[275px] flex flex-col gap-[23px]">
        <ul className="space-y-[2px]">
          {tabs.map((tab) => (
            <Link key={tab.name} href={tab.href} className="block w-full">
              <li className="hover:bg-[#24262A] rounded-[12px] cursor-pointer flex items-center p-[12px] lg:px-[12px] lg:py-[8px] h-[40px]">
                <span className="text-[16px] font-semibold leading-[18px]">
                  {tab.name}
                </span>
              </li>
            </Link>
          ))}
        </ul>
        {!user && (
          <div className="relative w-fit">
            <div
              className="cursor-pointer flex items-center justify-between rounded-[12px] hover:bg-[#24262A] h-[40px] p-[12px] gap-[12px]"
              onClick={() =>
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
              }>
              <div className="flex items-center gap-[12px]">
                {/* <Image
                  src={
                    languages.find((lang) => lang.code === selectedLanguage)
                      ?.flag || en
                  }
                  alt={selectedLanguage}
                  className="h-[20px] w-[20px] object-cover rounded-full"
                /> */}
                <GrLanguage size={20} />
                <p className="text-[14px] leading-[20px] font-medium">
                  {selectedLanguage === "ru" ? "RU" : "EN"}
                </p>
              </div>
              <FaCaretDown />
            </div>

            {isLanguageDropdownOpen && (
              <div className="absolute left-0 mt-2 bg-[#141518] p-[4px] rounded-[12px] shadow-lg z-50 space-y-[2px] w-[200px]">
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
        )}
        {!user ? (
          <div className="p-[8px] w-full">
            <Link
              href="/auth/login"
              className="flex justify-center items-center h-[40px] w-full bg-[#11CA00] hover:bg-[#0CAE00] transition-colors rounded-[12px] text-[14px] leading-[16px] font-medium"
              onClick={toggleNavigationModal}>
              {t("navigationModal.login")}
            </Link>
          </div>
        ) : (
          user &&
          !user?.subaccount &&
          user.verify_email && (
            <div className="p-[8px] w-full">
              <button
                className="flex w-full items-center gap-1 bg-gradient-to-r from-[#C3FF361C] to-[#00AFB81C] p-2 rounded-lg h-[40px] justify-center"
                onClick={() => {
                  openPlansModal();
                  toggleNavigationModal();
                }}>
                <Image
                  src={starIcon}
                  alt="Star icon"
                  className="w-[16px] h-[16px]"
                />
                <p className="bg-gradient-to-r from-[#CBFF51] to-[#7EE39C] inline-block text-transparent bg-clip-text">
                  {t("navigationModal.upgrade")}
                </p>
              </button>
            </div>
          )
        )}
        <div className="flex gap-2">
          <Link href="https://t.me/drophunting_group" target="_blank">
            <div className="cursor-pointer">
              <RiTelegram2Fill size={28} />
            </div>
          </Link>
          <Link href="https://x.com/Drophunting_io" target="_blank">
            <div className="cursor-pointer">
              <PiXLogo size={28} />
            </div>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default NavigationModal;
