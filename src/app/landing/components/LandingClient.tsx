"use client";

import Image from "next/image";
import { FaCheck, FaDollarSign } from "react-icons/fa6";
import { MdAccessTime } from "react-icons/md";
import { HiLightningBolt } from "react-icons/hi";
import { BsTwitterX } from "react-icons/bs";
import { FaPlay, FaCaretDown } from "react-icons/fa";
import { RiTelegram2Fill } from "react-icons/ri";
import { GrLanguage } from "react-icons/gr";
import { GiHamburgerMenu } from "react-icons/gi";
import { useEffect, useState, useRef } from "react";
import { useTranslation } from "react-i18next";
import Cookies from "js-cookie";
import Link from "next/link";
import clsx from "clsx";

import landingHeaderBg from "../../../../public/assets/landing-header-bg.jpg";
import landingFooterBg from "../../../../public/assets/landing-footer-bg.jpg";
import video from "../../../../public/assets/video.png";
import blocks from "../../../../public/assets/blocks.png";
import greenBlur from "../../../../public/assets/green-blur.png";
import arrow from "../../../../public/assets/arrow.png";
import telegram from "../../../../public/assets/telegram.png";
import paint from "../../../../public/assets/paint.png";
import bitcoin from "../../../../public/assets/bitcoin.png";
import ethereum from "../../../../public/assets/ethereum.png";
import coin from "../../../../public/assets/coin.png";
import dollar from "../../../../public/assets/dollar.png";
import landingZenchain from "../../../../public/assets/landing-zenchain.png";
import dollarBag from "../../../../public/assets/dollar-bag.jpg";
import group from "../../../../public/assets/group.png";
import underline from "../../../../public/assets/underline.png";
import goldBitcoin from "../../../../public/assets/gold-bitcoin.png";
import goldCrypto from "../../../../public/assets/gold-crypto.png";
import greenTether from "../../../../public/assets/green-tether.png";
import LandingModal from "../../components/modals/LandingModal";
import { MainLogo } from "@/shared/icons/MainLogo";
import "../../../../public/fonts/stylesheet.css";
import { landingBlocks } from "@/shared/utils/tabs";

export function LandingClient() {
  const [isLandingModalOpen, setIsLandingModalOpen] = useState(false);
  const { t, i18n } = useTranslation();
  const [isLanguageDropdownOpen, setIsLanguageDropdownOpen] = useState(false);
  const [selectedLanguage, setSelectedLanguage] = useState(i18n.language);
  const [showAllBlocks, setShowAllBlocks] = useState(false);
  const [isSmallScreen, setIsSmallScreen] = useState(false);

  const aboutSectionRef = useRef<HTMLDivElement>(null);
  const resultsSectionRef = useRef<HTMLDivElement>(null);
  const howItWorksSectionRef = useRef<HTMLDivElement>(null);
  const contactsSectionRef = useRef<HTMLDivElement>(null);

  const toggleLandingModal = () => {
    setIsLandingModalOpen(!isLandingModalOpen);
  };

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

  const scrollToSection = (ref: React.RefObject<HTMLDivElement | null>) => {
    if (ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth" });
      if (isLandingModalOpen) {
        toggleLandingModal();
      }
    }
  };

  useEffect(() => {
    // Initialize language from cookies for non-logged in users
    const savedLanguage = Cookies.get("language");
    if (savedLanguage && i18n.language !== savedLanguage) {
      i18n.changeLanguage(savedLanguage);
    }
  }, [i18n]);

  useEffect(() => {
    if (isLandingModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  }, [isLandingModalOpen]);

  useEffect(() => {
    const checkScreenSize = () => {
      setIsSmallScreen(window.innerWidth < 608);
    };

    checkScreenSize();

    window.addEventListener("resize", checkScreenSize);

    return () => window.removeEventListener("resize", checkScreenSize);
  }, []);

  return (
    <div className="bg-black text-white">
      <div className="xl:h-[885px] overflow-hidden">
        <div
          className="bg-[#101114] bg-cover bg-center bg-no-repeat"
          style={{
            backgroundImage: `url(${landingHeaderBg.src})`,
            backgroundSize: "cover",
            backgroundPosition: "center",
            backgroundRepeat: "no-repeat",
          }}>
          <header className="flex justify-between items-center h-[70px] px-[24px]">
            <MainLogo width={170} height={40} color="#fff" />
            <ul className="hidden lg:flex gap-[16px]">
              <li>
                <button
                  onClick={() => scrollToSection(aboutSectionRef)}
                  className="text-white hover:text-[#11CA00] transition-colors">
                  {t("landing.aboutService")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(resultsSectionRef)}
                  className="text-white hover:text-[#11CA00] transition-colors">
                  {t("landing.resultsNav")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(howItWorksSectionRef)}
                  className="text-white hover:text-[#11CA00] transition-colors">
                  {t("landing.howItWorksNav")}
                </button>
              </li>
              <li>
                <button
                  onClick={() => scrollToSection(contactsSectionRef)}
                  className="text-white hover:text-[#11CA00] transition-colors">
                  {t("landing.contacts")}
                </button>
              </li>
            </ul>
            <div className="flex items-center gap-[8px] md:gap-[16px]">
              <div className="relative">
                <div
                  className="cursor-pointer"
                  onClick={() =>
                    setIsLanguageDropdownOpen(!isLanguageDropdownOpen)
                  }>
                  <div className="flex items-center gap-[6px]">
                    <GrLanguage size={20} />
                    <p>{t("landing.language")}</p>
                    <FaCaretDown />
                  </div>
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
                          <p className="text-[14px] font-semibold">
                            {lang.name}
                          </p>
                        </div>
                        {selectedLanguage === lang.code && (
                          <FaCheck size={16} className="text-[#CBFF51]" />
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
              <a
                href="https://app.drophunting.io/guides"
                className="hidden bg-[#11CA00] hover:bg-[#0D9E00] transition-colors py-[10px] px-[16px] rounded-[8px] text-[14px] leading-[16px] md:flex items-center justify-center">
                {t("landing.goToAggregator")}
              </a>
              <GiHamburgerMenu
                className="block lg:hidden cursor-pointer"
                size={24}
                onClick={toggleLandingModal}
              />
            </div>

            <div
              className={`fixed top-0 right-0 z-50 transform ${
                isLandingModalOpen ? "translate-x-0" : "translate-x-full"
              } w-[299px] md:w-[366px] h-full bg-[#1C1E22] lg:hidden`}
              onClick={(e) => {
                if (e.target === e.currentTarget) {
                  toggleLandingModal();
                }
              }}>
              <LandingModal
                toggleLandingModal={toggleLandingModal}
                scrollToSection={scrollToSection}
                aboutSectionRef={
                  aboutSectionRef as React.RefObject<HTMLDivElement>
                }
                resultsSectionRef={
                  resultsSectionRef as React.RefObject<HTMLDivElement>
                }
                howItWorksSectionRef={
                  howItWorksSectionRef as React.RefObject<HTMLDivElement>
                }
                contactsSectionRef={
                  contactsSectionRef as React.RefObject<HTMLDivElement>
                }
              />
            </div>

            {isLandingModalOpen && (
              <div className="block lg:hidden fixed top-0 left-0 w-full h-full bg-black opacity-50 z-40" />
            )}
          </header>
          <div className="px-[20px] py-[40px] md:px-[40px] md:py-[56px] lg:p-[64px] xl:px-[96px] xl:py-[80px]">
            <div className="flex xl:items-center flex-col xl:flex-row gap-[40px]">
              <div className="w-full xl:w-[55%]">
                <div className="flex flex-col gap-[28px]">
                  <p className="text-[13px] md:text-[14px] leading-[16px] text-[#89FF45] uppercase">
                    {t("landing.airdropAggregator")}
                  </p>
                  <p
                    className="text-[56px] leading-[56px] md:text-[86px] md:leading-[80px] lg:text-[94px] lg:leading-[86px] uppercase font-bold font-druk"
                    style={{ letterSpacing: 0 }}>
                    {t("landing.getTheBest")}
                  </p>
                  <ul className="font-chakra list-none flex flex-col gap-[24px] mb-[40px] -tracking-tighter">
                    <li className="relative flex items-center gap-[16px]">
                      <div>
                        <FaCheck size={18} className="text-[#ABE91A]" />
                      </div>
                      <p className="text-[14px] leading-[18px] md:text-[15px] lg:text-[18px] md:leading-[24px]">
                        {t("landing.newDrops")}
                      </p>
                    </li>
                    <li className="relative flex items-center gap-[16px]">
                      <div>
                        <FaCheck size={18} className="text-[#ABE91A]" />
                      </div>
                      <p className="text-[14px] leading-[18px] md:text-[15px] lg:text-[18px] md:leading-[24px]">
                        {t("landing.latestNews")}
                      </p>
                    </li>
                    <li className="relative flex items-center gap-[16px]">
                      <div>
                        <FaCheck size={18} className="text-[#ABE91A]" />
                      </div>
                      <p className="text-[14px] leading-[18px] md:text-[15px] lg:text-[18px] md:leading-[24px]">
                        {t("landing.discoverNewDrops")}
                      </p>
                    </li>
                    <li className="relative flex items-center gap-[16px]">
                      <div>
                        <FaCheck size={18} className="text-[#ABE91A]" />
                      </div>
                      <p className="text-[14px] leading-[18px] md:text-[15px] lg:text-[18px] md:leading-[24px]">
                        {t("landing.dontLoseNewDrops")}
                      </p>
                    </li>
                  </ul>
                  <a
                    href="https://app.drophunting.io/guides"
                    className="hover:bg-[#0D9E00] transition-colors w-full sm:w-[260px] md:h-[56px] lg:w-[318px] lg:h-[66px] bg-[#11CA00] py-[18px] md:py-[24px] px-[38px] lg:px-[56px] rounded-[8px] text-[15px] md:text-[16px] lg:text-[18px] leading-[18px] font-semibold flex items-center justify-center">
                    {t("landing.goToAggregator")}
                  </a>
                </div>
              </div>
              <div className="max-w-[600px] xl:w-[45%] relative">
                <Image src={video} alt="Video" />
                <div className="absolute top-1/2 left-1/2 w-[52px] h-[52px] sm:h-[88px] sm:w-[88px] lg:w-[92px] lg:h-[92px] bg-black opacity-75 flex justify-center items-center rounded-full transform -translate-x-1/2 -translate-y-1/2 cursor-pointer">
                  <FaPlay className="h-[14px] w-[14px] sm:h-[22px] sm:w-[22px] lg:h-[24px] lg:w-[24px]" />
                </div>
              </div>
            </div>
            <div className="flex items-center gap-[14px] mt-[40px] xl:mt-[64px] z-5">
              <div className="flex flex-col gap-[16px] w-[190px]">
                <p className="text-[48px] leading-[48px] md:text-[54px] md:leading-[54px] lg:text-[64px] lg:leading-[64px] font-bold font-druk">
                  2102
                </p>
                <p className="text-[#ABABAB] text-[14px] leading-[20px]">
                  {t("landing.airdropsCompleted")}
                </p>
              </div>
              <div className="flex flex-col gap-[16px] w-[400px]">
                <p className="text-[48px] leading-[48px] md:text-[54px] md:leading-[54px] lg:text-[64px] lg:leading-[64px] font-bold font-druk">
                  $ 294 210 391
                </p>
                <p className="text-[#ABABAB] text-[14px] leading-[20px]">
                  {t("landing.availableWinningsSum")}
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={aboutSectionRef}
        className="px-[20px] py-[40px] md:px-[40px] md:py-[56px] lg:p-[64px] xl:px-[96px] xl:py-[80px] overflow-hidden flex flex-col gap-[80px]">
        <div className="flex items-center flex-col xl:flex-row gap-[45px]">
          <div className="w-full xl:w-[50%] flex flex-col gap-[48px] relative">
            <p className="text-[32px] md:text-[64px] xl:text-[80px] md:leading-[64px] xl:leading-[90px] uppercase font-bold font-druk">
              {t("landing.completeTasksEarn")}
            </p>
            <div className="max-w-[500px] flex flex-col gap-[40px]">
              <div className="flex gap-[23px]">
                <div>
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-gradient-to-b from-[#0D0F14] to-[#1E4413] rounded-xl border-[1px] border-[#2E432B8C] text-[#C2FF89]">
                    <MdAccessTime size={24} />
                  </div>
                </div>
                <p className="text-[15px] leading-[20px] md:text-[17px] md:leading-[22px]">
                  <span className="font-bold">{t("landing.saveTime")} </span>
                  <span>{t("landing.getUpdatesOnePlace")}</span>
                </p>
              </div>
              <div className="flex gap-[23px]">
                <div>
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-gradient-to-b from-[#0D0F14] to-[#1E4413] rounded-xl border-[1px] border-[#2E432B8C] text-[#C2FF89]">
                    <FaDollarSign size={24} />
                  </div>
                </div>
                <p className="text-[15px] leading-[20px] md:text-[17px] md:leading-[22px]">
                  <span className="font-bold">
                    {t("landing.distributeResources")}{" "}
                  </span>
                  <span>{t("landing.investmentInfo")}</span>
                </p>
              </div>
              <div className="flex gap-[23px]">
                <div>
                  <div className="flex items-center justify-center w-[44px] h-[44px] bg-gradient-to-b from-[#0D0F14] to-[#1E4413] rounded-xl border-[1px] border-[#2E432B8C] text-[#C2FF89]">
                    <HiLightningBolt size={24} />
                  </div>
                </div>
                <p className="text-[15px] leading-[20px] md:text-[17px] md:leading-[22px]">
                  <span className="font-bold">
                    {t("landing.fastAndAccurate")}{" "}
                  </span>
                  <span>{t("landing.collectAirdropsOnePlace")}</span>
                </p>
              </div>
            </div>
          </div>
          <div className="w-full xl:w-[50%] relative">
            <Image
              src={arrow}
              alt="Arrow"
              className="absolute top-[50px] left-0 xl:top-[-50px] xl:left-[-50px] w-[70px] h-[70px] md:w-[100px] md:h-[100px]"
            />
            <div className="relative">
              <Image
                src={greenBlur}
                alt="Green blur"
                className="absolute top-[-200px] right-[-150px] h-[900px] z-0"
              />

              <Image
                src={blocks}
                alt="Zenchain blocks"
                className="relative z-10"
              />
            </div>
          </div>
        </div>
        <div className="flex items-center flex-col md:flex-row md:gap-[24px] bg-[#131721] rounded-[24px] xl:h-[280px] overflow-hidden p-[24px]">
          <div className="md:w-[50%]">
            <Image src={telegram} alt="Telegram" />
          </div>
          <div className="flex flex-col gap-[24px]">
            <div className="relative">
              <p className="text-[34px] leading-[34px] md:text-[40px] md:leading-[37px] lg:text-[50px] lg:leading-[50px] uppercase font-bold font-druk">
                {t("landing.subscribe")}
                <br className="block xs:hidden" />{" "}
                <span className="relative inline-block">
                  {t("landing.onTelegram")}
                  <Image
                    src={underline}
                    alt="Underline"
                    className="absolute left-[20px] bottom-[-5px] sm:bottom-[-15px] w-[100px] sm:w-full"
                  />
                </span>
              </p>
            </div>

            <p className="text-[14px] leading-[18px] md:text-[15px] lg:text-[17px] md:leading-[22px]">
              {t("landing.newDropsEveryDay")}
            </p>
            <div className="flex">
              <a
                target="_blank"
                href="https://t.me/drophunting_group"
                className="hover:opacity-80 transition-opacity flex items-center justify-center gap-[10px] bg-[#159ADC] pl-[16px] pr-[31px] py-[10px] rounded-[12px]">
                <div>
                  <RiTelegram2Fill size={32} />
                </div>
                <p className="text-[18px] leading-[16px]">
                  {t("landing.telegram")}
                </p>
              </a>
            </div>
          </div>
        </div>
      </div>
      <div
        ref={resultsSectionRef}
        className="px-[20px] py-[40px] md:px-[40px] md:py-[56px] lg:p-[64px] xl:px-[156px] xl:py-[80px] relative z-10 overflow-hidden flex flex-col items-center">
        <p className="text-[20px] leading-[20px] md:text-[28px] md:leading-[75px] uppercase font-bold font-druk text-[#67F25B] text-center">
          {t("landing.resultsTitle")}
        </p>
        <p className="font-bold font-druk text-[46px] leading-[46px] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[80px] text-center mb-[20px]">
          {t("landing.rewardsFromPastDrops")}
        </p>
        <p className="text-center text-[14px] leading-[21px] md:text-[17px] lg:w-full md:leading-[24px]">
          {t("landing.usersParticipate")}
        </p>
        <p className="text-center text-[14px] leading-[21px] md:text-[17px] lg:w-full md:leading-[24px]">
          {t("landing.lookForUpdates")}
        </p>

        <div className="relative z-0 mt-[50px] flex flex-wrap items-center gap-[8px] md:gap-[12px] lg:gap-[25px]">
          <Image
            className="pointer-events-none absolute top-[-130px] left-[-100px] md:left-[-200px] lg:left-[-250px] xl:left-[-300px] h-[900px] z-[-10] rotate-180"
            src={greenBlur}
            alt="Green Blur"
          />

          <div className="flex flex-wrap items-center justify-center gap-[8px] md:gap-[12px] lg:gap-[25px]">
            {landingBlocks()
              .slice(0, isSmallScreen && !showAllBlocks ? 5 : undefined)
              .map((item, index) => (
                <div
                  key={index}
                  className="h-[230px] sm:h-[210px] lg:h-[190px] w-[280px] sm:w-[calc(50%-8px)] md:w-[calc(50%-12px)] lg:w-[356px] bg-[#1F2027AB] rounded-[16px] px-[12px] py-[14px] md:p-[20px] lg:p-[25px] z-10 relative">
                  <div className="flex flex-col md:flex-row md:items-center gap-[20px] md:gap-[24px] mb-[20px] lg:mb-[24px]">
                    <div>
                      <Image
                        src={item.image}
                        alt={item.name}
                        className="w-[32px] h-[32px] md:w-[48px] md:h-[48px] rounded-[10px]"
                        width={48}
                        height={48}
                      />
                    </div>
                    <div className="flex flex-col gap-[8px]">
                      <p className="text-[14px] leading-[17px] md:text-[16px] md:leading-[20px] lg:text-[18px] lg:leading-[22px] font-bold">
                        {item.name}
                      </p>
                      <p className="text-[12px] leading-[14px] md:text-[13px] md:leading-[16px] text-[#8E8E8E]">
                        {item.date}
                      </p>
                    </div>
                  </div>
                  <div className="flex flex-col gap-[12px] lg:gap-[20px]">
                    <div className="flex flex-col md:flex-row md:items-center md:gap-[20px]">
                      <p className="text-[16px] leading-[18px] font-semibold">
                        {item.average}
                      </p>
                    </div>
                    <div className="flex flex-col md:flex-row smd:items-center md:gap-[35px]">
                      <p className="text-[14px] leading-[18px] text-[#ADADAD]">
                        {item.result}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            <div
              className={clsx(
                "flex items-center justify-center w-full",
                (!isSmallScreen || showAllBlocks) && "hidden",
              )}>
              <button
                onClick={() => setShowAllBlocks(true)}
                className="z-[4] flex items-center justify-center bg-white rounded-[12px] px-[16px] py-[10px] h-[57px] min-w-[185px] cursor-pointer mt-[20px] hover:bg-opacity-90">
                <p className="text-[14px] leading-[16px] text-black">
                  {t("landing.showMore")}
                </p>
              </button>
            </div>
          </div>

          <Image
            className="pointer-events-none absolute top-[-40px] sm:top-[-80px] left-[-40px] lg:top-[-150px] sm:left-[-65px] lg:left-[-90px] w-[57px] h-[57px] sm:w-[88px] lg:w-[100px] sm:h-[88px] lg:h-[100px]"
            src={bitcoin}
            alt="Bitcoin"
          />
          <Image
            className="pointer-events-none hidden sm:block absolute sm:top-[-110px] right-[-70px] lg:right-[-150px] sm:w-[105px] lg:w-[180px] sm:h-[105px] lg:h-[180px]"
            src={dollar}
            alt="Dollar"
          />
          <Image
            className="pointer-events-none absolute bottom-[-50px] sm:bottom-[-110px] left-[-30px] sm:left-[-70px] lg:left-[-120px] xl:left-[-160px] w-[55px] h-[55px] sm:w-[105px] lg:w-[120px] sm:h-[105px] lg:h-[120px]"
            src={ethereum}
            alt="Ethereum"
          />
          <Image
            className="pointer-events-none absolute bottom-[-50px] sm:bottom-[-100px] right-[-10px] sm:right-[-40px] lg:right-[-110px] w-[62px] h-[62px] sm:w-[138px] sm:h-[138px] lg:w-[165px] lg:h-[165px]"
            src={coin}
            alt="Coin"
          />
        </div>

        <Image
          className="pointer-events-none absolute top-[10px] lg:top-[30px] right-[-10px] sm:right-[30px] md:right-[10px] lg:right-[70px] xl:right-[140px] w-[145px] md:w-[217px] lg:w-[297px] -rotate-12"
          src={paint}
          alt="Paint"
        />
      </div>
      <div
        ref={howItWorksSectionRef}
        className="px-[20px] py-[50px] pl-0 md:px-[40px] md:pt-[80px] md:pl-0 md:pb-[64px] xl:px-[96px] xl:pl-0 xl:py-[80px] overflow-hidden">
        <p className="pl-[20px] md:pl-[40px] xl:pl-[96px] font-bold font-druk text-[46px] leading-[46px] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[80px] mb-[48px] uppercase">
          {t("landing.howItWorksTitle")}
        </p>
        <div className="relative flex flex-col gap-[40px]">
          {[
            {
              number: "1",
              title: t("landing.howItWorksTitle1"),
              description: t("landing.howItWorksDescription1"),
              image: group,
            },
            {
              number: "2",
              title: t("landing.howItWorksTitle2"),
              description: t("landing.howItWorksDescription2"),
              image: landingZenchain,
            },
            {
              number: "3",
              title: t("landing.howItWorksTitle3"),
              description: t("landing.howItWorksDescription3"),
              image: dollarBag,
            },
            {
              number: "4",
              title: t("landing.howItWorksTitle4"),
              description: t("landing.howItWorksDescription4"),
            },
          ].map((item) => (
            <div
              key={item.number}
              className="pl-[20px] md:pl-[40px] xl:pl-[96px] flex flex-col lg:flex-row lg:justify-between md:items-center gap-[16px] md:gap-[32px] relative overflow-hidden lg:overflow-visible">
              <div className="flex items gap-[24px] md:gap-[55px]">
                <div className="relative flex items-center justify-center h-[36px] w-[36px] md:h-[55px] md:w-[55px] bg-white text-black rounded-full">
                  <p className="text-[18px] leading-[18px] md:text-[28px] md:leading-[28px] font-bold font-druk">
                    {item.number}
                    {Number(item.number) == 1 && (
                      <span className="h-[550px] lg:h-[180px] mmmxl:h-[215px] mmxl:h-[235px] mxl:h-[275px] xl:h-[280px] lxl:h-[300px] w-[1px] bg-[#424242] absolute top-[65px] md:top-[80px] left-1/2 transform translate-x-1/2"></span>
                    )}
                    {Number(item.number) == 2 && (
                      <span className="h-[550px] lg:h-[230px] mmmxl:h-[260px] mmxl:h-[280px] mxl:h-[335px] xl:h-[350px] lxl:h-[370px] w-[1px] bg-[#424242] absolute top-[65px] md:top-[80px] left-1/2 transform translate-x-1/2"></span>
                    )}
                    {Number(item.number) == 3 && (
                      <span className="h-[550px] lg:h-[230px] mmmxl:h-[260px] mmxl:h-[280px] mxl:h-[335px] xl:h-[350px] lxl:h-[370px] w-[1px] bg-[#424242] absolute top-[65px] md:top-[80px] left-1/2 transform translate-x-1/2"></span>
                    )}
                    {Number(item.number) == 4 && (
                      <span className="hidden"></span>
                    )}
                  </p>
                </div>
                <div className="flex flex-col gap-[20px] w-[275px] xs:w-[400px] sm:w-[500px] md:w-[595px] lg:w-[491px]">
                  <p className="text-[26px] leading-[30px] font-bold">
                    {item.title}
                  </p>
                  <p className="text-[16px] leading-[24px] text-[#BDC0CF]">
                    {item.description}
                  </p>
                </div>
              </div>
              <div>
                {item.image && (
                  <Image
                    src={item.image}
                    alt={item.title}
                    className="pl-[60px] lg:p-0 w-[500px]"
                  />
                )}
              </div>
            </div>
          ))}
        </div>
      </div>
      <div
        ref={contactsSectionRef}
        className="bg-cover bg-center bg-no-repeat h-[616px] md:h-[768px] flex items-center justify-center overflow-hidden"
        style={{
          backgroundImage: `url(${landingFooterBg.src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundRepeat: "no-repeat",
        }}>
        <div className="flex flex-col gap-[64px] items-center relative px-[40px]">
          <div className="w-[335px] sm:w-[505px] md:w-[705px] lg:w-[923px] flex flex-col gap-[20px] text-center relative">
            <p className="text-[46px] leading-[46px] md:text-[68px] md:leading-[72px] lg:text-[80px] lg:leading-[75px] font-bold font-druk uppercase">
              {t("landing.joinCommunity")}
            </p>
            <p className="text-[15px] leading-[20px] md:text-[17px] md:leading-[24px] text-center">
              {t("landing.subscribeToDropHunting")}
            </p>
          </div>
          <div className="flex flex-col gap-[40px]">
            <a
              href="https://app.drophunting.io/guides"
              className="hover:bg-[#0D9E00] transition-colors w-[335px] md:w-[573px] bg-[#11CA00] h-[56px] md:h-[88px] py-[24px] px-[56px] rounded-[8px] text-[16px] leading-[18px] md:text-[22px] md:leading-[18px] font-bold flex items-center justify-center">
              {t("landing.goToAggregator")}
            </a>
            <div className="flex items-center justify-center">
              <div className="flex items-center gap-[40px]">
                <BsTwitterX
                  onClick={() =>
                    window.open("https://x.com/Drophunting_io", "_blank")
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={35}
                />
                {/* <FaDiscord
                  onClick={() => window.open("https://google.com", "_blank")}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={40}
                /> */}
                <RiTelegram2Fill
                  onClick={() =>
                    window.open("https://t.me/drophunting_group", "_blank")
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={40}
                />
                {/* <FaInstagram
                  onClick={() => window.open("https://google.com", "_blank")}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={40}
                /> */}
              </div>
            </div>
          </div>
          <Image
            src={goldBitcoin}
            alt="Gold Bitcoin"
            className="absolute w-[67px] h-[67px] md:w-[102px] md:h-[102px] lg:w-[115px] lg:h-[115px] top-[-80px] left-[5px] md:top-[-100px] sm:left-[-20px] md:left-0 lg:left-[-60px] xl:left-[-160px]"
          />
          <Image
            src={goldCrypto}
            alt="Gold Crypto"
            className="absolute w-[77px] h-[77px]  md:w-[115px] md:h-[115px] lg:w-[140px] lg:h-[140px] right-0 bottom-[-70px] sm:right-0 md:bottom-[160px] lg:bottom-[110px] md:right-[-60px] lg:right-[-100px] xl:right-[-200px]"
          />
          <Image
            src={greenTether}
            alt="Green Tether"
            className="absolute w-[75px] h-[75px] md:w-[118px] lg:w-[185px] md:h-[118px] lg:h-[185px] top-[-120px] right-[20px] md:top-[-160px] md:right-[-40px] lg:top-[-200px] lg:right-[-70px] xl:right-[-140px]"
          />
        </div>
      </div>
      <footer className="bg-black h-[751px] md:h-[617px] lg:h-[440px] px-[40px] lg:px-[100px] xl:px-[200px] pt-[56px] flex flex-col justify-between">
        <div>
          <MainLogo width={170} height={40} color="#fff" />
          <div className="flex flex-col md:flex-row md:justify-between gap-[24px] md:gap-[48px]">
            <div className="flex flex-col gap-[24px]">
              <p className="text-[42px] leading-[42px] md:text-[51px] md:leading-[47px] font-bold font-druk uppercase">
                {t("landing.bestAirdropsInWorld")}
              </p>
              <p className="text-[14px] leading-[24px] max-w-[360px]">
                {t("landing.noMorePrivates")}
              </p>
              <div className="flex items-center gap-[10px] mb-[24px]">
                <BsTwitterX
                  onClick={() =>
                    window.open("https://x.com/Drophunting_io", "_blank")
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={23}
                />
                {/* <FaDiscord
                  onClick={() => window.open("https://google.com", "_blank")}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={27}
                /> */}
                <RiTelegram2Fill
                  onClick={() =>
                    window.open("https://t.me/drophunting_group", "_blank")
                  }
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={27}
                />
                {/* <FaInstagram
                  onClick={() => window.open("https://google.com", "_blank")}
                  className="cursor-pointer hover:opacity-80 transition-opacity"
                  size={27}
                /> */}
              </div>
              <ul className="hidden lg:hidden md:flex flex-col gap-[17px] w-[150px]">
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(aboutSectionRef)}>
                    {t("landing.aboutService")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(resultsSectionRef)}>
                    {t("landing.resultsNav")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(howItWorksSectionRef)}>
                    {t("landing.howItWorksNav")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(contactsSectionRef)}>
                    {t("landing.contacts")}
                  </button>
                </li>
              </ul>
            </div>
            <div className="flex flex-col md:flex-row gap-[48px] md:gap-[24px]">
              <ul className="hidden lg:flex flex-col gap-[17px] w-[150px]">
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(aboutSectionRef)}>
                    {t("landing.aboutService")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(resultsSectionRef)}>
                    {t("landing.resultsNav")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(howItWorksSectionRef)}>
                    {t("landing.howItWorksNav")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(contactsSectionRef)}>
                    {t("landing.contacts")}
                  </button>
                </li>
              </ul>
              <div className="flex flex-col gap-[12px]">
                <a
                  href="https://app.drophunting.io/guides"
                  className="hover:bg-[#0D9E00] transition-colors bg-[#11CA00] w-full md:w-[192px] h-[44px] py-[12px] px-[16px] rounded-[8px] text-[14px] leading-[16px] flex items-center justify-center">
                  {t("landing.goToAggregator")}
                </a>
                {/* <button className="bg-[#21274C] w-full md:w-[192px] h-[44px] py-[12px] px-[16px] rounded-[8px] text-[14px] leading-[16px] flex items-center justify-center">
                  {t('landingModal.subscribeToBot')}
                </button> */}
              </div>
              <ul className="flex md:hidden flex-col gap-[17px] w-[150px]">
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(aboutSectionRef)}>
                    {t("landing.aboutService")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(resultsSectionRef)}>
                    {t("landing.resultsNav")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(howItWorksSectionRef)}>
                    {t("landing.howItWorksNav")}
                  </button>
                </li>
                <li className="text-[14px] leading-[13px] text-[#9AA5B9] hover:text-white transition-colors cursor-pointer">
                  <button onClick={() => scrollToSection(contactsSectionRef)}>
                    {t("landing.contacts")}
                  </button>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between lg:justify-normal gap-[12px] md:gap-[40px] py-[24px]">
          <p className="text-[13px] leading-[16px] text-[#ABABAB]">
            Drop Hunting 2025
          </p>
          <ul className="flex flex-wrap items-center gap-[12px] md:gap-[24px]">
            <Link
              href="/terms-and-privacy"
              className="hover:underline text-[12px] leading-[12px] text-[#535353]">
              <li>{t("landing.userAgreement")}</li>
            </Link>
            <Link
              href="/terms-and-privacy"
              className="hover:underline text-[12px] leading-[12px] text-[#535353]">
              <li>{t("landing.privacy")}</li>
            </Link>
            <Link
              href="/terms-and-privacy"
              className="hover:underline text-[12px] leading-[12px] text-[#535353]">
              <li>{t("landing.cookie")}</li>
            </Link>
          </ul>
        </div>
      </footer>
    </div>
  );
}
