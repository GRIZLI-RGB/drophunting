"use client";
import React, { useEffect, useRef, useState } from "react";
import { usePathname } from "next/navigation";
import Image from "next/image";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { CustomSwitch } from "@/shared/components/CustomSwitch";
import { BiLogoTelegram } from "react-icons/bi";
import { RiKey2Line } from "react-icons/ri";
import { IoIosCloseCircle } from "react-icons/io";
import avatarImg from "../../../public/assets/avatar.png";
import authenticator from "../../../public/assets/icons/authenticator.png";
import cancel from "../../../public/assets/icons/cancel.png";
import { CustomCheckbox } from "@/shared/components/CustomCheckbox";
import Link from "next/link";
import { tabs } from "@/shared/utils/tabs";
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

const languages = [
  { code: "ru", name: "Russian", flag: ru },
  { code: "en", name: "English", flag: en },
];

const Profile = () => {
  const { i18n } = useTranslation();
  const pathname = usePathname();
  // const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [isTimeDropdownOpen, setIsTimeDropdownOpen] = useState(false);
  const [isTelegramNotificationsEnabled, setIsTelegramNotificationsEnabled] =
    useState(true);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [avatar] = useState(avatarImg);
  const {
    timezones,
    selectedTimezone,
    setSelectedTimezone,
    fetchTimezones,
    deleteUser,
    user,
    updateUser,
  } = useStore();
  const router = useRouter();

  // State for editable fields
  const [editedName, setEditedName] = useState(user?.name ?? "");
  const [editedLanguage, setEditedLanguage] = useState(
    user?.lang ?? i18n.language
  );
  const [editedTimezone, setEditedTimezone] = useState(selectedTimezone);

  const scrollRef = useCustomScrollbar();
  const [showDeleteModal, setShowDeleteModal] = useState(false);
  const [showChangePasswordModal, setShowChangePasswordModal] = useState(false);

  const handleDeleteAccount = () => {
    setShowDeleteModal(true);
  };

  const handleConfirmDelete = () => {
    deleteUser();
    Cookies.remove("auth-token");
    Cookies.remove("user");
    router.push("/auth/login");
  };

  useEffect(() => {
    fetchTimezones();
  }, [fetchTimezones]);

  useEffect(() => {
    if (user) {
      Cookies.set("user", JSON.stringify(user));
      setEditedName(user.name ?? "");
      setEditedLanguage(user.lang ?? i18n.language);
      setEditedTimezone(selectedTimezone); // Sync with store's selectedTimezone
    }
  }, [user, i18n.language, selectedTimezone]);

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

  // Handle changes
  const handleNameChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setEditedName(event.target.value);
  };

  const handleLanguageChange = (code: string) => {
    setEditedLanguage(code);
    i18n.changeLanguage(code); // Update i18n immediately for UI
    setIsLanguageDropdownOpen(false);
  };

  const handleTimeChange = (value: string) => {
    setEditedTimezone(value);
    setSelectedTimezone(value); // Update store immediately for UI
    setIsTimeDropdownOpen(false);
  };

  // Check if there are changes to save
  const hasChanges = () => {
    return (
      (user?.name !== editedName && editedName !== "") ||
      (user?.lang !== editedLanguage && editedLanguage !== "") ||
      (selectedTimezone !== editedTimezone && editedTimezone !== "")
    );
  };

  // Handle saving all changes
  const handleSaveChanges = async () => {
    if (!user || !hasChanges()) return;

    const updateData: { name?: string; lang?: string; timezone?: string } = {};
    if (editedName !== user.name) updateData.name = editedName;
    if (editedLanguage !== user.lang) updateData.lang = editedLanguage;
    if (editedTimezone !== selectedTimezone)
      updateData.timezone = editedTimezone;

    const success = await updateUser(updateData);

    if (success) {
      window.location.reload(); // Reload to reflect changes
    } else {
      console.error("Failed to update profile");
    }
  };

  const handleTelegramSwitchChange = (
    event: React.ChangeEvent<HTMLInputElement>
  ) => {
    setIsTelegramNotificationsEnabled(event.target.checked);
  };

  return (
    <div className="bg-[#101114] text-white">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px]">
        <div className="flex flex-col lg:flex-row justify-center w-full p-3">
          <nav className="lg:w-[240px] w-full font-chakra font-bold leading-[20px] text-[#8E8E8E] m-0 lg:mr-[40px]">
            <ul className="no-scrollbar overflow-auto w-full border-b-[1px] border-[#27292D] lg:border-none flex flex-row lg:flex lg:flex-col mb-5">
              {tabs.map((tab) => (
                <li
                  key={tab.name}
                  className={`p-[6px] lg:px-[16px] lg:py-[12px] lg:rounded-[12px] lg:mb-1 cursor-pointer ${
                    isActive(tab.href)
                      ? "border-b-[1px] border-white lg:border-none lg:bg-[--dark-gray] text-white"
                      : "hover:border-b-[1px] border-white lg:border-none lg:hover:bg-[--dark-gray] hover:text-white"
                  }`}
                >
                  <Link
                    href={tab.href}
                    className="flex items-center gap-3 text-[16px]"
                  >
                    <p className="hidden lg:block">{tab.icon}</p>
                    {tab.name}
                  </Link>
                </li>
              ))}
            </ul>
          </nav>
          <section className="w-full min-h-[1300px] bg-[--dark-gray] p-[32px] rounded-[16px]">
            <div className="flex-col flex sm:flex-row border-4 gap-[24px] border-transparent">
              <div className="relative w-[64px] h-[64px] md:w-[73px] md:h-[73px] lg:w-[83px] lg:h-[83px] flex-shrink-0">
                <Image
                  src={avatar}
                  alt="Avatar"
                  className="w-full h-full object-cover object-center rounded-[22px]"
                  width={83}
                  height={83}
                />
                <input
                  type="file"
                  accept="image/*"
                  className="hidden"
                  ref={fileInputRef}
                />
                <div
                  className="cursor-pointer absolute -bottom-1 -right-1 bg-[#2A2B30] p-[5px] border-[3px] border-[--dark-gray] rounded-full translate-x-1/4 translate-y-1/4"
                  onClick={handleImageClick}
                >
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
                <p className="mb-1 md:mb-0 font-semibold">Name</p>
                <input
                  value={editedName}
                  onChange={handleNameChange}
                  className="max-w-[350px] sm:w-[350px] bg-[#212226] border-[1px] border-[#212226] py-[12px] px-[16px] rounded-[14px] focus:border-[1px] focus:border-gray-400 focus:outline-none"
                />
              </div>
              <div className="flex-col flex md:flex-row md:items-center md:justify-between mb-3">
                <p className="mb-1 md:mb-0 font-semibold">Wallet</p>
                <p className="md:py-[12px] md:px-[16px] w-full md:w-[350px]">
                  {user?.affiliate_id}
                </p>
              </div>
              <div className="flex-col flex md:flex-row md:items-center md:justify-between mb-3">
                <p className="mb-1 md:mb-0 font-semibold">Language</p>
                <div className="relative max-w-[350px] sm:w-[350px]">
                  <button
                    className="w-full h-[48px] bg-[#212226] flex items-center justify-between p-[12px] rounded-[12px]"
                    onClick={() =>
                      setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                    }
                  >
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
                            ?.name
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
                          onClick={() => handleLanguageChange(lang.code)}
                        >
                          <div className="flex items-center gap-[12px]">
                            <Image
                              src={lang.flag}
                              alt={lang.name}
                              className="h-[20px] w-[20px] object-cover rounded-full"
                            />
                            <p className="text-[15px] leading-[24px] font-normal">
                              {lang.name}
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
                <p className="mb-1 md:mb-0 font-semibold">Worldtime</p>
                <div className="relative max-w-[350px] sm:w-[350px]">
                  <button
                    className="w-full h-[48px] bg-[#212226] flex items-center justify-between p-[12px] rounded-[12px]"
                    onClick={() => setIsTimeDropdownOpen(!isTimeDropdownOpen)}
                  >
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
                        }}
                      >
                        {timezones.map((timezone) => (
                          <div
                            key={timezone.value}
                            className={`flex items-center justify-between p-[12px] rounded-[12px] cursor-pointer hover:bg-[#181C20] ${
                              editedTimezone === timezone.value &&
                              `bg-[#181C20]`
                            }`}
                            onClick={() => handleTimeChange(timezone.value)}
                          >
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
                Notifications
              </p>
              <div className="flex gap-1 mb-4 flex-col justify-start">
                <CustomCheckbox checked={true} label="Change in favorites" />
                <CustomCheckbox checked={true} label="New guides" />
                <CustomCheckbox checked={false} label="New articles" />
                <CustomCheckbox
                  checked={false}
                  label="Deadlines in favorites"
                />
              </div>
            </div>

            <div className="flex gap-4 font-chakra mt-[40px]">
              <BiLogoTelegram size={20} className="flex-shrink-0 text-white" />
              <div>
                <p className="text-[16px] font-semibold">
                  Telegram notifications
                </p>
                <p className="max-w-[350px] sm:w-[350px] leading-[18px] text-[#949392]">
                  Subscribe to our bot to receive notifications about changes to
                  favorite guides, publication of new guides and articles.
                </p>
              </div>
              <CustomSwitch
                checked={isTelegramNotificationsEnabled}
                onChange={handleTelegramSwitchChange}
              />
            </div>

            <hr className="my-[45px] border-0 h-px bg-[#27292D]" />

            <div className="font-chakra">
              <div className="mb-[40px]">
                <p className="text-[20px] font-bold leading-[16px] mb-6">
                  Security
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
                        Change password
                      </p>
                      <p className="w-full md:w-[250px] sm:w-full leading-[18px] text-[#949392]">
                        Use your email to protect your account and transactions
                      </p>
                    </div>
                  </div>
                  <button
                    className="w-[100px] bg-[#2C2D31] py-[8px] px-[20px] ml-[35px] rounded-[10px]"
                    onClick={() => setShowChangePasswordModal(true)}
                  >
                    Change
                  </button>
                </div>
              </div>
              <div className="mb-[40px] w-full md:w-[600px]">
                <p className="text-[18px] font-bold leading-[18px] mb-6">
                  Two-Factor Authentication (2FA)
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
                        Authenticator app
                      </p>
                      <p className="md:w-[250px] sm:w-full leading-[18px] text-[#949392]">
                        Use Google Authenticator to protect your account and
                        transactions
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-row items-center gap-[24px]">
                    <button>
                      <div className="flex items-center gap-1 ml-[35px]">
                        <IoIosCloseCircle size={16} />
                        <p className="text-[#C2C0BD] leading-[18px]">Off</p>
                      </div>
                    </button>
                    <button className="w-[100px] bg-[#2C2D31] py-[8px] px-[20px] rounded-[10px]">
                      Manage
                    </button>
                  </div>
                </div>
              </div>

              <hr className="mb-[45px] mt-[60px] border-0 h-px bg-[#27292D]" />

              <div className="flex justify-between items-center">
                <button
                  className="bg-[#2C2D31] py-[8px] pl-[12px] pr-[16px] rounded-[10px] flex items-center gap-3 font-chakra font-semibold"
                  onClick={handleDeleteAccount}
                >
                  <div>
                    <Image
                      src={cancel}
                      alt="Cancel icon"
                      className="w-[16px] h-[16px]"
                    />
                  </div>
                  <div>Delete account</div>
                </button>
                {hasChanges() && (
                  <button
                    className="bg-[#CBFF51] text-black py-[8px] px-[16px] rounded-[10px] font-chakra font-semibold"
                    onClick={handleSaveChanges}
                  >
                    Save Changes
                  </button>
                )}
              </div>
            </div>
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

      {showChangePasswordModal && (
        <ChangePasswordModal
          onClose={() => setShowChangePasswordModal(false)}
        />
      )}
    </div>
  );
};

export default Profile;
