"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { BiLogoTelegram } from "react-icons/bi";
import { RiKey2Line } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import avatarImg from "../../../public/assets/avatar.png";
import authenticator from "../../../public/assets/icons/authenticator.png";
import cancel from "../../../public/assets/icons/cancel.png";
import { CustomCheckbox } from "@/shared/components/CustomCheckbox";
import Link from "next/link";
import { subaccountTabs, tabs } from "@/shared/utils/tabs";
import ru from "../../../public/assets/icons/ru.png";
import en from "../../../public/assets/icons/en.png";
import pencil from "../../../public/assets/icons/pencil.png";
import { useTranslation } from "react-i18next";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";
import useStore from "@/shared/store";
import useCustomScrollbar from "@/shared/hooks/useCustomScrollbar";
import { useRouter } from "next/navigation";
import { DeleteAccountModal } from "@/app/components/modals/DeleteAccountModal";
import { ChangePasswordModal } from "@/app/components/modals/ChangePasswordModal";
import Cookies from "js-cookie";
import { AuthenticatorModal } from "../components/modals/AuthenticatorModal";
import { AuthenticatorVerificationModal } from "../components/modals/AuthenticatorVerificationModal";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Progress } from "@/shared/icons/Progress";
import { MdOutlineDone } from "react-icons/md";
import { Delete2FAModal } from "../components/modals/Delete2FAModal";
import { update2FA } from "@/shared/api/axios";

const languages = [
  { code: "ru", name: { en: "Russian", ru: "Русский" }, flag: ru },
  { code: "en", name: { en: "English", ru: "Английский" }, flag: en },
];

const toBool = (value: boolean | undefined): boolean => {
  if (typeof value === "string") {
    return value === "1" || value === "true";
  }
  return Boolean(value);
};

const Profile = () => {
  const { t, i18n } = useTranslation();
  const pathname = usePathname();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedAvatar, setSelectedAvatar] = useState<File | null>(null);
  const [avatarPreview, setAvatarPreview] = useState<string | null>(null);
  const {
    timezones,
    selectedTimezone,
    setSelectedTimezone,
    fetchTimezones,
    deleteUser,
    user,
    updateUser,
    delete2FA,
    refreshUser,
    setIsLoading,
  } = useStore();
  const router = useRouter();
  const [notifChange, setNotifChange] = useState(toBool(user?.notif_change));
  const [notifGuides, setNotifGuides] = useState(toBool(user?.notif_guides));
  const [notifArticles, setNotifArticles] = useState(
    toBool(user?.notif_articles),
  );
  const [notifDeadline, setNotifDeadline] = useState(
    toBool(user?.notif_deadline),
  );
  const [notifTg, setNotifTg] = useState(toBool(user?.notif_tg));
  const [editedName, setEditedName] = useState(user?.name ?? "");
  const [editedLanguage, setEditedLanguage] = useState(
    user?.lang ?? i18n.language,
  );
  const [editedTimezone, setEditedTimezone] = useState(selectedTimezone);
  const [isSaving, setIsSaving] = useState(false);
  const [isBottomSectionVisible, setIsBottomSectionVisible] = useState(false);
  const bottomSectionRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (user?.lang && user.lang !== i18n.language) {
      i18n.changeLanguage(user.lang);
      setEditedLanguage(user.lang);
    }
  }, [i18n, user?.lang]);

  const languageManuallyChanged = useRef(false);
  const timezoneManuallyChanged = useRef(false);

  const scrollRef = useCustomScrollbar();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showDelete2FA, setShowDelete2FA] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);
  const [showAuthenticatorModal, setShowAuthenticatorModal] = useState(false);
  const [
    showAuthenticatorVerificationModal,
    setShowAuthenticatorVerificationModal,
  ] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleDelete2FA = () => {
    setShowDelete2FA(true);
  };

  const handleConfirmDelete = async () => {
    try {
      setIsLoading(true);
      await deleteUser();
      Cookies.remove("auth-token");
      Cookies.remove("user");
      router.push("/auth/login");
    } catch (error) {
      console.error("Error deleting user account:", error);
      setIsLoading(false);
    }
  };

  const handleConfirmDelete2FA = () => {
    setIsLoading(true);
    setShowDelete2FA(false);
    delete2FA().then(() => {
      update2FA(null);
      refreshUser().finally(() => setIsLoading(false));
    });
  };

  useEffect(() => {
    fetchTimezones();
  }, [fetchTimezones]);

  useEffect(() => {
    return () => {
      if (avatarPreview) {
        URL.revokeObjectURL(avatarPreview);
      }
    };
  }, [avatarPreview]);

  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user));
      setEditedName(user.name ?? "");

      if (!languageManuallyChanged.current) {
        setEditedLanguage(user.lang ?? i18n.language);
      }

      if (!timezoneManuallyChanged.current) {
        setEditedTimezone(user?.timezone ?? selectedTimezone);
      }

      setNotifChange(toBool(user.notif_change));
      setNotifGuides(toBool(user.notif_guides));
      setNotifArticles(toBool(user.notif_articles));
      setNotifDeadline(toBool(user.notif_deadline));
      setNotifTg(toBool(user.notif_tg));
    }
  }, [user, selectedTimezone, i18n.language]);

  useEffect(() => {
    if (!bottomSectionRef.current) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        setIsBottomSectionVisible(entry.isIntersecting);
      },
      {
        threshold: 0.5,
        rootMargin: "0px",
      },
    );

    observer.observe(bottomSectionRef.current);

    return () => {
      if (bottomSectionRef.current) {
        observer.unobserve(bottomSectionRef.current);
      }
    };
  }, [bottomSectionRef]);

  const isActive = (href: string) => {
    if (href === "/profile") {
      return pathname === "/" || pathname === "/profile";
    }
    return pathname === href;
  };

  const handleImageClick = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    }
  };

  const handleFileChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      setSelectedAvatar(file);
      const previewUrl = URL.createObjectURL(file);
      setAvatarPreview(previewUrl);
    }
  };

  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleLanguageChange = (code: string) => {
    languageManuallyChanged.current = true;
    setEditedLanguage(code);
    i18n.changeLanguage(code);
    setIsLanguageDropdownOpen(false);
  };

  const handleTimeChange = (value: string) => {
    timezoneManuallyChanged.current = true;

    setEditedTimezone(value);

    setSelectedTimezone(value);

    setIsTimeDropdownOpen(false);
  };

  const hasChanges = () => {
    return (
      (user?.name !== editedName && editedName !== "") ||
      (user?.lang !== editedLanguage && editedLanguage !== "") ||
      (user?.timezone !== editedTimezone && editedTimezone !== "") ||
      toBool(user?.notif_change) !== notifChange ||
      toBool(user?.notif_guides) !== notifGuides ||
      toBool(user?.notif_articles) !== notifArticles ||
      toBool(user?.notif_deadline) !== notifDeadline ||
      toBool(user?.notif_tg) !== notifTg ||
      selectedAvatar !== null
    );
  };

  const handleSaveChanges = async () => {
    if (!user || !hasChanges() || isSaving) return;

    setIsSaving(true);

    const updateData: {
      name?: string;
      lang?: string;
      timezone?: string;
      notif_change?: boolean;
      notif_guides?: boolean;
      notif_articles?: boolean;
      notif_deadline?: boolean;
      notif_tg?: boolean;
      avatar?: File;
    } = {};

    const fieldsToUpdate = {
      name: editedName !== user.name ? editedName : undefined,
      lang: editedLanguage !== user.lang ? editedLanguage : undefined,
      timezone: editedTimezone !== user.timezone ? editedTimezone : undefined,
      notif_change:
        notifChange !== toBool(user.notif_change) ? notifChange : undefined,
      notif_guides:
        notifGuides !== toBool(user.notif_guides) ? notifGuides : undefined,
      notif_articles:
        notifArticles !== toBool(user.notif_articles)
          ? notifArticles
          : undefined,
      notif_deadline:
        notifDeadline !== toBool(user.notif_deadline)
          ? notifDeadline
          : undefined,
      notif_tg: notifTg !== toBool(user.notif_tg) ? notifTg : undefined,
      avatar: selectedAvatar || undefined,
    };

    Object.entries(fieldsToUpdate).forEach(([key, value]) => {
      if (value !== undefined) {
        (updateData[key as keyof typeof updateData] as typeof value) = value;
      }
    });

    try {
      const success = await updateUser(updateData);

      if (success) {
        if (editedLanguage !== user.lang) {
          i18n.changeLanguage(editedLanguage);
        }
        setIsSaving(false);
      } else {
        console.error("Failed to update profile");
        setIsSaving(false);
      }

      setSelectedAvatar(null);
    } catch (error) {
      console.error("Error updating profile:", error);
      setIsSaving(false);
    }
  };

  const handleNotifChangeToggle = (checked: boolean) => {
    setNotifChange(checked);
  };

  const handleNotifGuidesToggle = (checked: boolean) => {
    setNotifGuides(checked);
  };

  const handleNotifArticlesToggle = (checked: boolean) => {
    setNotifArticles(checked);
  };

  const handleNotifDeadlineToggle = (checked: boolean) => {
    setNotifDeadline(checked);
  };

  // const handleTelegramSwitchChange = (
  //   event: React.ChangeEvent<HTMLInputElement>
  // ) => {
  //   setNotifTg(event.target.checked);
  // };

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
            <div className="flex-col flex sm:flex-row border-4 gap-[24px] border-transparent">
              <div className="relative w-[64px] h-[64px] md:w-[73px] md:h-[73px] lg:w-[83px] lg:h-[83px] flex-shrink-0">
                <Image
                  src={
                    avatarPreview ||
                    (typeof user?.avatar === "string"
                      ? user.avatar.startsWith("https")
                        ? user.avatar
                        : `https://app.drophunting.io${user.avatar}`
                      : avatarImg)
                  }
                  alt="Avatar"
                  className="w-full h-full object-cover object-center rounded-[22px]"
                  width={83}
                  height={83}
                  unoptimized
                  onError={(e) => {
                    e.currentTarget.src = avatarImg.src;
                  }}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                  onChange={handleFileChange}
                />
                <div
                  className="cursor-pointer absolute -bottom-1 -right-1 bg-[#2A2B30] p-[5px] border-[3px] border-[--dark-gray] rounded-full translate-x-1/4 translate-y-1/4"
                  onClick={handleImageClick}>
                  <Image src={pencil} alt="Edit" width={10} height={10} />
                </div>
              </div>

              <div>
                <p className="text-[20px] sm:text-[28px] md:text-[30px] font-semibold leading-[28px] mb-2 break-words max-w-[400px] lg:max-w-[550px]">
                  {user?.name}
                </p>
                <p className="leading-[14px] text-[#8E8E8E] break-words max-w-[400px] lg:max-w-[550px]">
                  {user?.email}
                </p>
              </div>
            </div>
            <div className="w-full md:w-[550px] mt-[32px]">
              <div className="flex-col flex md:flex-row md:items-center md:justify-between mb-3">
                <p className="mb-1 md:mb-0 font-semibold">
                  {t("profile.name")}
                </p>
                <input
                  value={editedName}
                  onChange={handleNameChange}
                  className="max-w-[350px] sm:w-[350px] bg-[#212226] border-[1px] border-[#212226] py-[12px] px-[16px] rounded-[14px] focus:border-[1px] focus:border-gray-400 focus:outline-none"
                />
              </div>
              {/* <div className="flex-col flex md:flex-row md:items-center md:justify-between mb-3">
                <p className="mb-1 md:mb-0 font-semibold">
                  {t("profile.wallet")}
                </p>
                <p className="md:py-[12px] md:px-[16px] w-full md:w-[350px]">
                  {user?.affiliate_id}
                </p>
              </div> */}
              <div className="flex-col flex md:flex-row md:items-center md:justify-between mb-3">
                <p className="mb-1 md:mb-0 font-semibold">
                  {t("profile.language")}
                </p>
                <div className="relative max-w-[350px] sm:w-[350px]">
                  <button
                    className="w-full h-[48px] bg-[#212226] flex items-center justify-between p-[12px] rounded-[12px]"
                    onClick={() =>
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }>
                    <div className="flex items-center gap-[12px]">
                      <Image
                        src={
                          languages.find((lang) => lang.code === editedLanguage)
                            ?.flag || en
                        }
                        alt={editedLanguage}
                        className="h-[20px] w-[20px] object-cover rounded-full"
                      />
                      <p className="text-[15px] leading-[24px] font-normal">
                        {
                          languages.find((lang) => lang.code === editedLanguage)
                            ?.name[
                            i18n.language as keyof (typeof languages)[0]["name"]
                          ]
                        }
                      </p>
                    </div>
                    {isLanguageDropdownOpen ? (
                      <FaAngleUp size={16} className="text-[#8E8E8E]" />
                    ) : (
                      <FaAngleDown size={16} className="text-[#8E8E8E]" />
                    )}
                  </button>
                  {isLanguageDropdownOpen && (
                    <div className="absolute left-0 mt-[2px] w-full bg-[#141518] p-[4px] rounded-[12px] shadow-lg z-50 space-y-[2px]">
                      {languages.map((lang) => (
                        <div
                          key={lang.code}
                          className={`flex items-center justify-between p-[12px] rounded-[12px] cursor-pointer hover:bg-[#181C20] ${
                            editedLanguage === lang.code && `bg-[#181C20]`
                          }`}
                          onClick={() => handleLanguageChange(lang.code)}>
                          <div className="flex items-center gap-[12px]">
                            <Image
                              src={lang.flag}
                              alt={
                                lang.name[
                                  i18n.language as keyof (typeof lang)["name"]
                                ]
                              }
                              className="h-[20px] w-[20px] object-cover rounded-full"
                            />
                            <p className="text-[15px] leading-[24px] font-normal">
                              {
                                lang.name[
                                  i18n.language as keyof (typeof lang)["name"]
                                ]
                              }
                            </p>
                          </div>
                          {editedLanguage === lang.code && (
                            <FaCheck size={16} className="text-[#CBFF51]" />
                          )}
                        </div>
                      ))}
                    </div>
                  )}
                </div>
              </div>
              <div className="flex-col flex md:flex-row md:items-center md:justify-between mb-3">
                <p className="mb-1 md:mb-0 font-semibold">
                  {t("profile.timezone")}
                </p>
                <div className="relative max-w-[350px] sm:w-[350px]">
                  <button
                    className="w-full h-[48px] bg-[#212226] flex items-center justify-between p-[12px] rounded-[12px]"
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}>
                    <p className="text-[15px] leading-[24px] font-normal">
                      {timezones.find((tz) => tz.value === editedTimezone)
                        ?.label || editedTimezone}
                    </p>
                    {isTimeDropdownOpen ? (
                      <FaAngleUp size={16} className="text-[#8E8E8E]" />
                    ) : (
                      <FaAngleDown size={16} className="text-[#8E8E8E]" />
                    )}
                  </button>
                  {isTimeDropdownOpen && (
                    <div className="absolute left-0 mt-[2px] w-full bg-[#141518] p-[4px] rounded-[12px] shadow-lg z-50">
                      <div
                        ref={scrollRef}
                        className="max-h-[300px] space-y-[2px] pr-2"
                        style={{
                          overflowY: "auto",
                          scrollbarWidth: "thin",
                          scrollbarColor: "#27292D #141518",
                        }}>
                        {timezones.map((timezone) => (
                          <div
                            key={timezone.value}
                            className={`flex items-center justify-between p-[12px] rounded-[12px] cursor-pointer hover:bg-[#181C20] ${
                              editedTimezone === timezone.value &&
                              `bg-[#181C20]`
                            }`}
                            onClick={() => handleTimeChange(timezone.value)}>
                            <p className="text-[15px] leading-[24px] font-normal">
                              {timezone.label}
                            </p>
                            {editedTimezone === timezone.value && (
                              <FaCheck size={16} className="text-[#CBFF51]" />
                            )}
                          </div>
                        ))}
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <hr className="my-[45px] border-0 h-px bg-[#27292D]" />

            <div className="font-chakra mb-6">
              <p className="text-[20px] font-bold leading-[16px] mb-6">
                {t("profile.notificationSettings")}
              </p>
              <div className="flex gap-[13px] mb-4 flex-col justify-start">
                <CustomCheckbox
                  checked={notifChange}
                  onChange={handleNotifChangeToggle}
                  label={t("profile.notifyAboutChanges")}
                />
                <CustomCheckbox
                  checked={notifGuides}
                  onChange={handleNotifGuidesToggle}
                  label={t("profile.notifyNewGuides")}
                />
                <CustomCheckbox
                  checked={notifArticles}
                  onChange={handleNotifArticlesToggle}
                  label={t("profile.notifyNewArticles")}
                />
                <CustomCheckbox
                  checked={notifDeadline}
                  onChange={handleNotifDeadlineToggle}
                  label={t("profile.notifyAboutDeadline")}
                />
              </div>
            </div>

            <div className="flex gap-4 font-chakra mt-[40px]">
              <BiLogoTelegram size={20} className="flex-shrink-0 text-white" />
              <div className="flex flex-col gap-4">
                <div>
                  <p className="text-[16px] font-semibold">
                    {t("profile.telegramNotifications")}
                  </p>
                  <p className="max-w-[350px] sm:w-[350px] leading-[18px] text-[#949392]">
                    {t("profile.telegramDescription")}
                  </p>
                </div>
                <a
                  href={user?.telegram_bot_link}
                  target="_blank"
                  className="w-fit bg-[#11CA00] hover:bg-[#11ca00bd] transition-colors py-[8px] px-[12px] rounded-[8px] h-[32px] font-sans font-semibold flex flex-shrink-0 items-center gap-2 text-[14px] leading-[16px]">
                  {t("profile.subscribeTelegram")}
                </a>
              </div>
            </div>

            <hr className="my-[45px] border-0 h-px bg-[#27292D]" />

            <div className="font-chakra">
              <div className="mb-[40px]">
                <p className="text-[20px] font-bold leading-[16px] mb-6">
                  {t("profile.securitySection")}
                </p>
                <div className="flex-col md:flex-row flex md:items-center md:justify-between w-full md:w-[591px]">
                  <div className="flex gap-2 mb-3">
                    <div>
                      <RiKey2Line
                        size={20}
                        className="flex-shrink-0 text-white"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] leading-[24px] tracking-[-0.18px]">
                        {t("profile.changePassword")}
                      </p>
                      <p className="w-full sm:w-full leading-[18px] text-[#949392]">
                        {t("profile.password")}
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-[100px] bg-[#2C2D31] hover:opacity-80 transition-opacity py-[8px] px-[20px] ml-[35px] rounded-[10px]"
                    onClick={() => setShowChangePasswordModal(true)}>
                    {t("profile.changePasswordButton")}
                  </button>
                </div>
              </div>
              <div className="mb-[40px] w-full md:w-[600px]">
                <p className="text-[18px] font-bold leading-[18px] mb-6">
                  {t("profile.twoFactorAuth")}
                </p>
                <div className="flex-col md:flex-row flex md:items-center md:justify-between w-full md:w-[591px]">
                  <div className="mb-3 flex gap-2">
                    <div className="w-[20px] h-[20px] flex-shrink-0">
                      <Image
                        src={authenticator}
                        alt="Authenticator"
                        width={20}
                        height={20}
                        className="text-white"
                      />
                    </div>
                    <div>
                      <p className="font-semibold text-[15px] leading-[24px] tracking-[-0.18px]">
                        {t("profile.twoFactorAuth")}
                      </p>
                      <p className="w-full leading-[18px] text-[#949392]">
                        {t("profile.twoFactorDescription")}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-[24px]">
                    {user?.two_factor ? (
                      <>
                        <div className="h-[18px] rounded-[20px] pr-[8px] pl-[4px] flex items-center gap-1">
                          <MdOutlineDone size={16} className="text-[#0EB159]" />
                          <p className="text-[#39FF6E] text-[14px] font-semibold font-chakra leading-[18px]">
                            {t("profile.twoFactorAuthEnabled")}
                          </p>
                        </div>
                        <button
                          className="hover:opacity-80 transition-opacity bg-[#2C2D31] min-w-[125px] h-[44px] py-[8px] px-[16px] text-[14px] leading-[20px] rounded-[10px] flex items-center justify-center gap-3 font-chakra font-semibold whitespace-nowrap"
                          onClick={handleDelete2FA}
                          disabled={isSaving}>
                          <div className="flex-shrink-0">
                            <Image
                              src={cancel}
                              alt="Cancel icon"
                              className="w-[16px] h-[16px]"
                            />
                          </div>
                          <div className="truncate">
                            {t("profile.twoFactorAuthDelete")}
                          </div>
                        </button>
                      </>
                    ) : (
                      <>
                        <div>
                          <div className="flex items-center gap-1 ml-[35px]">
                            <IoIosCloseCircle size={16} />
                            <p className="text-[#C2C0BD] leading-[18px]">
                              {t("profile.twoFactorAuthDisabled")}
                            </p>
                          </div>
                        </div>{" "}
                        <button
                          className="hover:opacity-80 transition-opacity bg-[#2C2D31] py-[8px] px-[20px] rounded-[10px]"
                          onClick={() => setShowAuthenticatorModal(true)}>
                          {t("profile.link2FAButton")}
                        </button>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <hr className="mb-[45px] mt-[60px] border-0 h-px bg-[#27292D]" />

              <div
                ref={bottomSectionRef}
                className="flex justify-between items-center gap-4">
                {!user?.subaccount ? (
                  <button
                    className="hover:opacity-80 transition-opacity bg-[#2C2D31] h-[44px] py-[8px] pl-[12px] pr-[16px] text-[14px] leading-[20px] rounded-[10px] flex items-center gap-3 font-chakra font-semibold"
                    onClick={handleDeleteAccount}
                    disabled={isSaving}>
                    <div className="flex-shrink-0">
                      <Image
                        src={cancel}
                        alt="Cancel icon"
                        className="w-[16px] h-[16px]"
                      />
                    </div>
                    <div>{t("profile.deleteAccountButton")}</div>
                  </button>
                ) : (
                  <div></div>
                )}
                {hasChanges() && (
                  <button
                    className="bg-[#11CA00] h-[44px] py-[8px] px-[16px] rounded-[10px] text-[16px] leading-[20px] font-sans font-semibold flex items-center gap-2"
                    onClick={handleSaveChanges}
                    disabled={isSaving}>
                    {isSaving ? (
                      <>
                        <svg
                          className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 24 24">
                          <circle
                            className="opacity-25"
                            cx="12"
                            cy="12"
                            r="10"
                            stroke="currentColor"
                            strokeWidth="4"></circle>
                          <path
                            className="opacity-75"
                            fill="currentColor"
                            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                        </svg>
                        {t("profile.saving")}
                      </>
                    ) : (
                      t("profile.saveChanges")
                    )}
                  </button>
                )}
              </div>
            </div>

            {hasChanges() && !isBottomSectionVisible && (
              <div className="sticky bottom-0 bg-[--dark-gray] pt-4 pb-4 border-t border-[#27292D] mt-4 flex justify-end w-full left-0 z-10">
                <button
                  className="bg-[#11CA00] h-[44px] py-[8px] px-[16px] rounded-[10px] text-[16px] leading-[20px] font-sans font-semibold flex items-center gap-2"
                  onClick={handleSaveChanges}
                  disabled={isSaving}>
                  {isSaving ? (
                    <>
                      <svg
                        className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                        xmlns="http://www.w3.org/2000/svg"
                        fill="none"
                        viewBox="0 0 24 24">
                        <circle
                          className="opacity-25"
                          cx="12"
                          cy="12"
                          r="10"
                          stroke="currentColor"
                          strokeWidth="4"></circle>
                        <path
                          className="opacity-75"
                          fill="currentColor"
                          d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                      </svg>
                      {t("profile.saving")}
                    </>
                  ) : (
                    t("profile.saveChanges")
                  )}
                </button>
              </div>
            )}
          </section>
        </div>
      </main>

      <Footer />

      {showDeleteModal && (
        <DeleteAccountModal
          onClose={() => setShowDeleteModal(false)}
          onConfirm={handleConfirmDelete}
        />
      )}

      {showDelete2FA && (
        <Delete2FAModal
          onClose={() => setShowDelete2FA(false)}
          onConfirm={handleConfirmDelete2FA}
        />
      )}

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}

      {showAuthenticatorModal && (
        <AuthenticatorModal
          onClose={() => setShowAuthenticatorModal(false)}
          onNext={() => {
            setShowAuthenticatorModal(false);
            setShowAuthenticatorVerificationModal(true);
          }}
        />
      )}

      {showAuthenticatorVerificationModal && (
        <AuthenticatorVerificationModal
          onClose={() => {
            setShowAuthenticatorVerificationModal(false);
          }}
          onBack={() => {
            setShowAuthenticatorVerificationModal(false);
            setShowAuthenticatorModal(true);
          }}
        />
      )}
    </div>
  );
};

export default Profile;
