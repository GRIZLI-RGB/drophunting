import React from "react";
import Link from "next/link";
import { FaAngleUp } from "react-icons/fa6";
import { MainLogo } from "@/shared/icons/MainLogo";
import { useTranslation } from "react-i18next";

const Footer = () => {
  const { t } = useTranslation();
  const scrollToTop = () => {
    if (typeof window !== "undefined" && window.overlayScrollbarsInstance) {
      window.overlayScrollbarsInstance.elements().viewport.scroll({
        top: 0,
        behavior: "smooth",
      });
    } else {
      // Fallback to default scroll if overlay scrollbar isn't initialized
      window.scrollTo({
        top: 0,
        behavior: "smooth",
      });
    }
  };

  return (
    <footer className="mt-auto py-[24px] pb-[30px] flex flex-col gap-4 relative">
      <div className="flex items-center justify-center text-center">
        <MainLogo width={170} height={40} color="#fff" />
      </div>
      <Link
        href="https://t.me/help_dh"
        target="_blank"
        className="text-[14px] leading-[16px] text-center">
        {t("footer.support")}
      </Link>
      <div className="flex items-center justify-center gap-5 text-[#707070] text-[12px] leading-[16px]">
        <Link href="/terms-and-privacy">{t("footer.terms")}</Link>
        <Link href="/terms-and-privacy">{t("footer.privacy")}</Link>
      </div>
      <div
        className="absolute top-[70px] right-[20px]  xs:top-[20px] xs:right-[50px] size-[57px] bg-[#17181B] rounded-full flex items-center justify-center cursor-pointer hover:bg-[#1f2025] transition-colors"
        onClick={scrollToTop}
        aria-label="Scroll to top">
        <FaAngleUp size={24} className="text-[#7F7F7F]" />
      </div>
    </footer>
  );
};

export default Footer;
