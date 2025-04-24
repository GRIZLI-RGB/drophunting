"use client";

import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import { IoFilterOutline, IoSearchOutline } from "react-icons/io5";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import useStore from "@/shared/store";
import Image from "next/image";
import useCustomScrollbar from "@/shared/hooks/useCustomScrollbar";
import { useTranslation } from "react-i18next";
import Unauthorized from "@/shared/components/Unauthorized";

const Store = () => {
  const { t, i18n } = useTranslation();
  const router = useRouter();
  const [activeFilter, setActiveFilter] = useState<number | null>(null);
  const [searchQuery, setSearchQuery] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sorting, setSorting] = useState<1 | 2>(2);

  const {
    productCategories,
    isLoadingProductCategories,
    products,
    isLoadingProducts,
    fetchProductCategories,
    fetchProducts,
    productCategoriesError,
    user,
  } = useStore();

  const effectiveLanguage = useMemo(() => {
    return user?.lang || i18n.language;
  }, [user?.lang, i18n.language]);

  useEffect(() => {
    fetchProductCategories();
  }, [fetchProductCategories, effectiveLanguage]);

  useEffect(() => {
    fetchProducts({
      page: currentPage,
      product_category_id: activeFilter || undefined,
      search: searchQuery || undefined,
      sorting,
    });
  }, [
    fetchProducts,
    currentPage,
    activeFilter,
    searchQuery,
    sorting,
    effectiveLanguage,
  ]);

  useEffect(() => {
    if (productCategories.length > 0 && activeFilter === null) {
      setActiveFilter(0);
    }
  }, [productCategories, activeFilter]);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    fetchProducts({
      page: 1,
      product_category_id: activeFilter || undefined,
      search: searchQuery,
      sorting,
    });
    setCurrentPage(1);
  };

  const handleCategoryChange = (categoryId: number | null) => {
    setActiveFilter(categoryId);
    setCurrentPage(1);
  };

  const handleSortingChange = () => {
    setSorting(sorting === 1 ? 2 : 1);
    setCurrentPage(1);
  };

  const handlePageChange = (page: number) => {
    setCurrentPage(page);
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const getImageUrl = (path: string) => {
    const backendUrl = "https://app.drophunting.io";
    return path.startsWith("http") ? path : `${backendUrl}${path}`;
  };

  const scrollRef = useCustomScrollbar({
    scrollbars: {
      autoHide: "never",
    },
  });

  const allCategoriesWithAll = [
    { id: 0, name: { en: "All", ru: "Все" }, sort: 0 },
    ...productCategories,
  ];

  return (
    <div className="bg-[#101114] text-white min-h-screen flex flex-col">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px] flex-grow">
        <p className="text-[42px] leading-[50px] font-bold">
          {t("header.store")}
        </p>
        <p className="text-[16px] leading-[22px] text-[#B0B0B0] mt-[20px]">
          {t("store.buyProducts")}
        </p>
        {user?.verify_email ? (
          <>
            <div className="mt-[40px] flex flex-col md:flex-row md:items-center md:justify-between">
              <div className="w-full overflow-x-auto" ref={scrollRef}>
                <div className="flex flex-wrap items-center gap-[6px] mb-[20px] md:mb-0">
                  {isLoadingProductCategories ? (
                    <div className="flex items-center justify-center py-4">
                      <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#CBFF51]"></div>
                    </div>
                  ) : productCategoriesError ? (
                    <div className="text-red-500 p-2">
                      {productCategoriesError}
                    </div>
                  ) : (
                    allCategoriesWithAll.map((category) => (
                      <button
                        key={category.id}
                        onClick={() => handleCategoryChange(category.id)}
                        className={`p-[12px] rounded-[12px] h-[40px] flex items-center justify-center ${
                          activeFilter === category.id
                            ? "bg-[#11CA00]"
                            : "bg-[#1D1E23]"
                        }`}>
                        {i18n.language === "ru"
                          ? category.name.ru
                          : category.name.en}
                      </button>
                    ))
                  )}
                </div>
              </div>
              <form
                onSubmit={handleSearch}
                className="relative text-[#848487] h-[40px]">
                <IoSearchOutline
                  className="absolute top-3 left-3 cursor-pointer"
                  size={16}
                />
                <input
                  placeholder={t("store.search")}
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="bg-[#1D1E23] pr-[12px] pl-[36px] py-[10px] rounded-[11px] w-[300px] placeholder:text-[14px] placeholder:leading-[16px] font-semibold"
                />
              </form>
            </div>
            <div>
              <div className="flex items-center justify-between">
                <p className="text-[14px] leading-[16px] text-[#57585E] mt-[40px] mb-[32px]">
                  {products?.total || 0} {t("store.products")}
                </p>
                <div
                  className="flex items-center gap-[5px] text-[#676A70] cursor-pointer"
                  onClick={handleSortingChange}>
                  <IoFilterOutline
                    size={20}
                    className={`${sorting === 1 ? "rotate-180" : ""}`}
                  />
                  <p>
                    {t("store.sortBy")}{" "}
                    <span className="text-white">
                      {sorting === 1 ? t("store.oldest") : t("store.newest")}
                    </span>
                  </p>
                </div>
              </div>

              {isLoadingProducts ? (
                <div className="flex justify-center items-center py-20">
                  <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                </div>
              ) : (
                <div className="flex flex-wrap gap-[16px] sm:gap-[24px] justify-center lg:gap-[28px] items-start">
                  {products?.data && products.data.length > 0 ? (
                    products.data.map((product) => (
                      <div
                        key={product.id}
                        className="relative w-[335px] sm:w-[336px] h-[482px] lg:w-[394px] lg:h-[483px] border-[1px] bg-[#1A1B1F] border-[#24262C] rounded-[16px] hover:border-[#CBFF51] cursor-pointer overflow-hidden"
                        onClick={() => router.push(`store/${product.slug}`)}>
                        <div className="h-[200px] overflow-hidden">
                          <Image
                            src={getImageUrl(product.img)}
                            alt={product.title}
                            width={335}
                            height={200}
                            className="w-full h-full object-cover"
                          />
                        </div>
                        <div className="h-[280px] p-[20px] pb-[16px] bg-[#1A1B1F] flex flex-col justify-between">
                          <div className="flex flex-col gap-[20px]">
                            <p className="text-[18px] leading-[22px] font-bold">
                              {product.title}
                            </p>
                            <div className="flex items-center">
                              <p className="rounded-[6px] px-[8px] py-[6px] bg-[#211E12] text-[13px] leading-[16px] font-semibold text-[#C6A975]">
                                {product.product_category.title}
                              </p>
                            </div>
                            <p className="text-[14px] leading-[20px] text-[#B0B0B0] line-clamp-2">
                              {product.description}
                            </p>
                          </div>
                          <div className="flex items-center gap-[12px]">
                            <p className="text-[18px] leading-[20px] font-semibold">
                              {t("store.from")} ${product.price}
                            </p>
                            <p className="text-[14px] leading-[20px] text-[#8E8E8E]">
                              {t("store.perProject")}
                            </p>
                          </div>
                        </div>
                      </div>
                    ))
                  ) : (
                    <div className="w-full text-center py-10">
                      <p className="text-[18px] text-[#B0B0B0]">
                        {t("store.noProductsFound")}
                      </p>
                    </div>
                  )}
                </div>
              )}

              {products && products.last_page > 1 && (
                <div className="flex items-center justify-center gap-[8px] mt-[56px]">
                  {products.links
                    .filter(
                      (link) =>
                        !link.label.includes("&laquo;") &&
                        !link.label.includes("&raquo;"),
                    )
                    .map((link, index) => (
                      <button
                        key={index}
                        onClick={() => handlePageChange(Number(link.label))}
                        className={`py-[6px] px-[10px] rounded-[8px] h-[40px] w-[40px] ${
                          link.active ? "bg-[#2A2C32]" : "bg-[#15171A]"
                        } flex items-center justify-center cursor-pointer`}
                        disabled={link.active}>
                        {link.label}
                      </button>
                    ))}
                </div>
              )}
            </div>
          </>
        ) : (
          <Unauthorized cn="mt-8" />
        )}
      </main>

      <Footer />
    </div>
  );
};

export default Store;
