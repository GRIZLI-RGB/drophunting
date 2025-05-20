export const dynamic = "force-dynamic";
import { Metadata } from "next";
import { LandingClient } from "./components/LandingClient";
import axiosInstance from "@/shared/api/axios";

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

const fallbackSeoData: SeoMetadata = {
  title: {
    en: "DropHunting - Find Profitable Product Drops",
    ru: "DropHunting - Найдите выгодные выпуски продуктов",
  },
  description: {
    en: "Discover the best product drops and limited editions for e-commerce success.",
    ru: "Откройте для себя лучшие выпуски продуктов и ограниченные издания для успеха в электронной коммерции.",
  },
  keywords: {
    en: "drop hunting, product drops, ecommerce, landing page",
    ru: "охота за дропами, выпуск продуктов, электронная коммерция, целевая страница",
  },
};

export async function generateMetadata({
  searchParams,
}: {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  searchParams: any;
}): Promise<Metadata> {
  let lang: "en" | "ru" = "ru";

  if (typeof searchParams.lang === "string") {
    lang = (searchParams.lang === "en" ? "en" : "ru") as "en" | "ru";
  }

  let seoData: SeoMetadata;

  try {
    const response = await axiosInstance.get("/api/seo");
    seoData = response.data as SeoMetadata;
  } catch (error) {
    console.error("Failed to fetch SEO metadata:", error);
    seoData = fallbackSeoData;
  }

  return {
    title: seoData.title[lang],
    description: seoData.description[lang],
    keywords: seoData.keywords[lang],
    alternates: {
      languages: {
        en: "/landing?lang=en",
        ru: "/landing?lang=ru",
      },
    },
  };
}

export default function LandingPage() {
  return <LandingClient />;
}
