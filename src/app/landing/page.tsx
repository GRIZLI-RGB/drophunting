import { Metadata } from "next";
import { LandingClient } from "./components/LandingClient";
import axiosInstance from "@/shared/api/axios";
import { cookies } from "next/headers";

type SeoMetadata = {
  title: {
    en: string;
    ru: string;
  };
  description: {
    en: string;
    ru: string;
  };
  keywords: {
    en: string;
    ru: string;
  };
};

async function getLanguage(): Promise<"en" | "ru"> {
  const cookieStore = await cookies();
  const language = cookieStore.get("language")?.value;
  return (language === "ru" ? "ru" : "en") as "en" | "ru";
}

async function getSeoMetadata(): Promise<SeoMetadata> {
  const response = await axiosInstance.get("/api/seo");
  return response.data as SeoMetadata;
}

export async function generateMetadata(): Promise<Metadata> {
  const [seoData, language] = await Promise.all([
    getSeoMetadata(),
    getLanguage(),
  ]);

  return {
    title: seoData.title[language],
    description: seoData.description[language],
    keywords: seoData.keywords[language],
    alternates: {
      languages: {
        en: "/en",
        ru: "/ru",
      },
    },
  };
}

export default async function LandingPage() {
  return <LandingClient />;
}
