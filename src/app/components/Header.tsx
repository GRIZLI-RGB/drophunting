"use client";
import React, { useState, useEffect } from "react";
import Image from "next/image";
import { Badge } from "antd";
import { IoMdNotificationsOutline } from "react-icons/io";
import { MdFavoriteBorder, MdOutlineArrowDropDown } from "react-icons/md";
import starIcon from "../../../public/assets/icons/star.png";
import avatar from "../../../public/assets/avatar.png";
import { GiHamburgerMenu } from "react-icons/gi";
import Link from "next/link";
import ProfileModal from "@/app/components/modals/ProfileModal";
import BalanceModal from "@/app/components/modals/BalanceModal";
import NotificationsModal from "@/app/components/modals/NotificationsModal";
import { usePathname, useRouter } from "next/navigation";
import { useTranslation } from "react-i18next";
import { PlansModal } from "./modals/PlansModal";
import useAuth from "@/shared/hooks/useAuth";
import NavigationModal from "./modals/NavigationModal";
import { RiTelegram2Fill } from "react-icons/ri";
import { PiXLogo } from "react-icons/pi";
import { MainLogo } from "@/shared/icons/MainLogo";
import { FaCheck, FaCaretDown } from "react-icons/fa6";
import Cookies from "js-cookie";
import ru from "../../../public/assets/icons/ru.png";
import en from "../../../public/assets/icons/en.png";
import { GrLanguage } from "react-icons/gr";

const Header = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const pathname = usePathname();
  const { user, loading } = useAuth();

  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isUpdatingLanguage, setIsUpdatingLanguage] = useState(false);

  useEffect(() => {
    const savedLanguage = Cookies.get("language");
    if (savedLanguage && !user) {
      setSelectedLanguage(savedLanguage);
      if (i18n.language !== savedLanguage) {
        i18n.changeLanguage(savedLanguage);
      }
    }
  }, [i18n, user]);

  const languages = [
    { code: "ru", name: t("profileModal.russian"), flag: ru },
    { code: "en", name: t("profileModal.english"), flag: en },
  ];

  const handleLanguageChange = async (code: string) => {
    if (isUpdatingLanguage || code === selectedLanguage) return;

    setIsUpdatingLanguage(true);
    setSelectedLanguage(code);
    i18n.changeLanguage(code);

    Cookies.set("language", code, { expires: 365, path: "/" });

    setIsLanguageDropdownOpen(false);
    setIsUpdatingLanguage(false);
  };

  const isActive = (href: string) => {
    if (href === "/guides") {
      return pathname.startsWith("/guides");
    }
    if (href === "/blog") {
      return pathname.startsWith("/blog");
    }
    if (href === "/store") {
      return pathname.startsWith("/store");
    }
    return pathname === href;
  };

  const tabs = [
    { name: t("header.guides"), href: "/guides" },
    {
      name: t("header.blog"),
      href: "/blog",
    },
    // { name: t("header.store"), href: "/store" },
  ];

  const [openModal, setOpenModal] = useState<string | null>(null);

  const toggleModal = (modalName: string) => {
    setOpenModal((prev) => (prev === modalName ? null : modalName));
  };

  const toggleProfileModal = () => toggleModal("profile");
  const toggleBalanceModal = () => toggleModal("balance");
  const toggleNotificationsModal = () => toggleModal("notifications");
  const togglePlansModal = () => toggleModal("plans");
  const toggleNavigationModal = () => toggleModal("navigation");

  const openBalanceModal = () => {
    setOpenModal("balance");
  };
  const openPlansModal = () => {
    setOpenModal("plans");
  };

  if (loading) {
    return (
      <div className="bg-[#101114] text-white">
        <div className="flex justify-center items-center h-screen">
          <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
        </div>
      </div>
    );
  }

  return (
    <header className="relative flex items-center justify-between h-[72px] px-[12px] sm:px-8">
      <div>
        <div
          className="flex items-center text-center cursor-pointer"
          onClick={() => router.push("/guides")}>
          <MainLogo width={170} height={40} color="#fff" />
        </div>
      </div>

      <div className="relative hidden xl:absolute xl:left-1/2 xl:transform xl:-translate-x-1/2 lg:block">
        <div className="flex items-center font-chakra font-bold gap-5 text-[16px]">
          {tabs.map((tab) => (
            <div key={tab.name}>
              <Link
                className={`${
                  isActive(tab.href)
                    ? "text-[#CBFF51]"
                    : "text-white hover:text-[#9EA0A6]"
                }`}
                href={tab.href}>
                {tab.name}
              </Link>
            </div>
          ))}
        </div>
      </div>

      <div className="flex items-center gap-3 md:gap-5">
        <div className="gap-2 hidden lg:flex">
          <Link href="https://www.google.com" target="_blank">
            <div className="cursor-pointer">
              <RiTelegram2Fill size={20} />
            </div>
          </Link>
          <Link href="https://www.google.com" target="_blank">
            <div className="cursor-pointer">
              <PiXLogo size={20} />
            </div>
          </Link>
        </div>

        {user && (
          <>
            {user?.verify_email && (
              <Badge
                dot={(user?.notifications || 0) > 0}
                onClick={toggleNotificationsModal}
                className="cursor-pointer">
                <IoMdNotificationsOutline
                  size={20}
                  className="text-[#9EA0A6]"
                />
              </Badge>
            )}
            <div>
              <MdFavoriteBorder
                onClick={() => router.push("/favorites")}
                size={20}
                className="text-[#9EA0A6] cursor-pointer"
              />
            </div>
            {user && !user?.subaccount && user.verify_email && (
              <button
                className="hidden lg:flex items-center gap-1 bg-gradient-to-r from-[#C3FF361C] to-[#00AFB81C] p-2 rounded-lg h-[40px]"
                onClick={togglePlansModal}>
                <Image
                  src={starIcon}
                  alt="Star icon"
                  className="w-[16px] h-[16px]"
                />
                <p className="bg-gradient-to-r from-[#CBFF51] to-[#7EE39C] inline-block text-transparent bg-clip-text">
                  {t("header.upgrade")}
                </p>
              </button>
            )}
          </>
        )}

        {user && !user?.subaccount && user.verify_email && (
          <div
            className="hidden lg:flex items-center justify-center h-[40px] bg-[--dark-gray] py-[10px] pr-[17px] pl-[20px] rounded-[52px] cursor-pointer"
            onClick={toggleBalanceModal}>
            <p className="leading-[16px] font-semibold">
              $ {user?.balance || "0.00"}
            </p>
            <MdOutlineArrowDropDown size={20} className="p-0" />
          </div>
        )}

        {!user && (
          <div className="hidden xs:block relative">
            <div
              className="cursor-pointer flex items-center gap-2"
              onClick={() =>
                setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
              }>
              <GrLanguage size={20} />
              {selectedLanguage === "ru" ? "RU" : "EN"}
              <FaCaretDown />
            </div>

            {isLanguageDropdownOpen && (
              <div className="absolute right-0 mt-2 w-[150px] bg-[#141518] p-[4px] rounded-[12px] shadow-lg z-50 space-y-[2px]">
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

        {user ? (
          <div
            onClick={toggleProfileModal}
            className="flex items-center cursor-pointer">
            <div className="relative w-[28px] sm:w-[32px] lg:w-[48px] h-[28px] sm:h-[32px] lg:h-[48px] rounded-full p-[2px] bg-gradient-to-b from-[#139EA5] to-[#BFFB5E]">
              <div className="w-full h-full rounded-full overflow-hidden bg-white">
                <Image
                  quality={100}
                  src={
                    typeof user?.avatar === "string"
                      ? user.avatar.startsWith("https")
                        ? user.avatar
                        : `https://app.drophunting.io${user.avatar}`
                      : avatar
                  }
                  width={44}
                  height={44}
                  alt="Avatar"
                  className="w-full h-full rounded-full border-[2px] object-cover border-[#101114]"
                />
              </div>
            </div>

            <MdOutlineArrowDropDown size={20} className="p-0" />
          </div>
        ) : (
          <button
            onClick={() => (window.location.href = "/auth/login")}
            className="bg-[#11CA00] hover:bg-[#0CAE00] transition-colors font-medium text-[14px] px-4 py-2.5 rounded-lg">
            {t("header.login")}
          </button>
        )}

        <div>
          <GiHamburgerMenu
            className="block lg:hidden cursor-pointer"
            size={24}
            onClick={toggleNavigationModal}
          />
        </div>
      </div>

      {/* TODO: показывать эти уведомления, когда пользователь пополнил баланс / подключил 2FA / возможно произошло какое то другое изменение уведомлений */}
      {/* <div className="absolute w-[350px] top-[75px] right-1/2 transform translate-x-1/2 sm:transform-none sm:right-[50px] sm:w-[450px] bg-[#1C1E22] rounded-[12px] py-[12px] px-[12px] flex items-center gap-[20px] z-10 justify-between">
        <div className="flex items-center gap-[20px]">
          <div className="w-[28px] h-[28px] rounded-full bg-[#23252A] flex items-center justify-center">
            <LuBell size={16} className="text-[#9EA0A6]" />
          </div>
          <p className="font-semibold leading-[18px]">
            The $200 deposit was successfully funded
          </p>
        </div>
        <IoMdClose size={20} className="hover:text-[#9EA0A6] cursor-pointer " />
      </div> */}

      {/* <div className="absolute w-[350px] top-[75px] right-1/2 transform translate-x-1/2 sm:transform-none sm:right-[50px] sm:w-[450px] bg-[#1C1E22] rounded-[12px] py-[12px] px-[12px] flex items-center gap-[20px] z-10 justify-between">
        <div className="flex items-center gap-[20px]">
          <div className="w-[28px] h-[28px] rounded-full bg-[#23252A] flex items-center justify-center">
            <LuBell size={16} className="text-[#9EA0A6]" />
          </div>
          <p className="font-semibold leading-[18px]">
            Вы успешно подключили 2FA
          </p>
        </div>
        <IoMdClose size={20} className="hover:text-[#9EA0A6] cursor-pointer " />
      </div> */}

      {openModal === "notifications" && (
        <div className="modal absolute max-w-[359px] w-full mx-auto top-[70px] right-1/2 transform translate-x-1/2 md:transform-none md:right-[200px] h-[404px] md:h-[328px] md:max-w-[450px] md:w-[450px] bg-[#1C1E22] rounded-[12px] pl-[5px] pr-[5px] py-[20px] z-[30px] shadow-2xl overflow-y-auto">
          <NotificationsModal
            toggleNotificationsModal={toggleNotificationsModal}
          />
        </div>
      )}

      {openModal === "balance" && (
        <div className="absolute top-0 lg:right-0 right-1/2 translate-x-1/2 z-50 block">
          <div className="absolute top-[70px] lg:right-[330px] right-1/2 translate-x-1/2 shadow-2xl w-[351px] md:w-[381px] md:h-[326px] rounded-[12px] bg-[#1C1E22] p-6">
            <BalanceModal toggleBalanceModal={toggleBalanceModal} />
          </div>
        </div>
      )}
      {openModal === "balance" && (
        <div className="hidden fixed sm:block lg:hidden top-0 left-0 w-full h-full bg-black opacity-50 z-40" />
      )}

      {openModal === "profile" && (
        <div
          className={`fixed top-0 right-0 z-50 ${
            openModal === "profile" &&
            "h-screen bg-[#1C1E22] lg:absolute lg:top-[70px] lg:right-[50px] lg:bg-transparent lg:w-[300px] lg:h-auto lg:shadow-2xl"
          }`}>
          <ProfileModal
            toggleProfileModal={toggleProfileModal}
            openBalanceModal={openBalanceModal}
          />
        </div>
      )}
      {openModal === "profile" && (
        <div className="fixed lg:hidden top-0 left-0 w-full h-full bg-black opacity-50 z-40" />
      )}

      {openModal === "navigation" && (
        <div
          className={`fixed top-0 right-0 z-50 ${
            openModal === "navigation" &&
            "h-screen bg-[#1C1E22] lg:absolute lg:top-[70px] lg:right-[50px] lg:bg-transparent lg:w-[300px] lg:h-auto lg:shadow-2xl"
          }`}>
          <NavigationModal
            toggleNavigationModal={toggleNavigationModal}
            openPlansModal={openPlansModal}
          />
        </div>
      )}
      {openModal === "navigation" && (
        <div className="fixed lg:hidden top-0 left-0 w-full h-full bg-black opacity-50 z-40" />
      )}

      {openModal === "plans" && (
        <PlansModal togglePlansModal={togglePlansModal} />
      )}
    </header>
  );
};

export default Header;
