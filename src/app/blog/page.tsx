"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { IoMdTime } from "react-icons/io";
import { IoFilterOutline, IoSearchOutline } from "react-icons/io5";
import { MdOutlineArrowDropDown, MdOutlineDone } from "react-icons/md";
import Image from "next/image";
import { useState, useEffect, useCallback } from "react";
import { useRouter } from "next/navigation";
import useStore from "@/shared/store";
import { debounce } from "lodash";
import useAuthContext from "@/shared/hooks/useAuthContext";

const Blog = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeCategoryId, setActiveCategoryId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<1 | 2>(2);

  const router = useRouter();
  const { user, sessionVerified } = useAuthContext();
  const {
    blogCategories,
    isLoadingBlogCategories,
    blogCategoriesError,
    fetchBlogCategories,
    blogArticles,
    isLoadingBlogArticles,
    blogArticlesError,
    fetchBlogArticles,
    toggleRead,
  } = useStore();

  useEffect(() => {
    if (sessionVerified && !user) {
      router.push("/auth/login");
    }
  }, [sessionVerified, user, router]);

  useEffect(() => {
    fetchBlogCategories();
  }, [fetchBlogCategories]);

  useEffect(() => {
    if (blogCategories.length > 0 && activeFilter === null) {
      setActiveFilter("All");
      setActiveCategoryId(null);
    }
  }, [blogCategories, activeFilter]);

  useEffect(() => {
    const params = {
      page: currentPage,
      category_id: activeCategoryId || undefined,
      search: searchQuery || undefined,
      sorting,
    };

    fetchBlogArticles(params);
  }, [fetchBlogArticles, currentPage, activeCategoryId, searchQuery, sorting]);

  const handleCategoryClick = (
    categoryName: string,
    categoryId: number | null
  ) => {
    setActiveFilter(categoryName);
    setActiveCategoryId(categoryId);
    setCurrentPage(1);
  };

  const handleToggleRead = async (e: React.MouseEvent, articleId: number) => {
    e.stopPropagation();
    await toggleRead(articleId);
  };

  const handleSortingChange = () => {
    setSorting(sorting === 1 ? 2 : 1);
    setCurrentPage(1);
  };

  const debouncedSearch = useCallback(
    debounce((value: string) => {
      setSearchQuery(value);
      setCurrentPage(1);
    }, 500),
    []
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const getImageUrl = (path: string) => {
    const backendUrl = "https://app.esdev.tech";
    return path.startsWith("http") ? path : `${backendUrl}${path}`;
  };

  return (
    <div className="bg-[#101114] text-white">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px] min-w-[375px]">
        <p className="text-[42px] leading-[50px] font-bold">Blog</p>
        <p className="text-[16px] leading-[22px] text-[#B0B0B0] mt-[20px]">
          Celebrate your web3 journey. Complete quests and earn drops!
        </p>
        <div className="mt-[40px] flex flex-col md:flex-row md:items-center md:justify-between">
          {isLoadingBlogCategories ? (
            <div className="flex items-center justify-center py-4">
              <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#CBFF51]"></div>
            </div>
          ) : blogCategoriesError ? (
            <div className="text-red-500 p-2">{blogCategoriesError}</div>
          ) : (
            <div className="flex flex-wrap items-center gap-[6px] mb-[20px] md:mb-0">
              {blogCategories.map((category) => (
                <button
                  key={category.id}
                  onClick={() =>
                    handleCategoryClick(
                      category.title,
                      category.id === 0 ? null : category.id
                    )
                  }
                  className={`p-[12px] rounded-[12px] h-[40px] flex items-center justify-center ${
                    activeFilter === category.title
                      ? "bg-[#11CA00]"
                      : "bg-[#1D1E23]"
                  }`}
                >
                  {category.title}
                </button>
              ))}
            </div>
          )}
          <div className="relative text-[#848487]">
            <IoSearchOutline
              className="absolute top-3 left-3 cursor-pointer"
              size={16}
            />
            <input
              placeholder="Search"
              onChange={handleSearchChange}
              className="bg-[#1D1E23] pr-[12px] pl-[36px] py-[10px] rounded-[11px] w-[300px] placeholder:text-[14px] placeholder:leading-[16px] font-semibold"
            />
          </div>
        </div>
        <div>
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[16px] text-[#57585E] mt-[40px] mb-[32px]">
              {blogArticles?.total || 0} articles
            </p>
            <div className="flex items-center gap-[5px] text-[#676A70]">
              <IoFilterOutline size={20} />
              <p>
                Sort by{" "}
                <span
                  className="text-white cursor-pointer"
                  onClick={handleSortingChange}
                >
                  {sorting === 1 ? "Old" : "New"}
                </span>
              </p>
              <MdOutlineArrowDropDown className="text-white" size={20} />
            </div>
          </div>

          {isLoadingBlogArticles ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
            </div>
          ) : blogArticlesError ? (
            <div className="text-red-500 p-4 rounded-md bg-red-500/10 border border-red-500/30">
              {blogArticlesError}
            </div>
          ) : blogArticles?.data.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No articles found. Try changing your filters.
            </div>
          ) : (
            <div className="flex flex-wrap gap-[16px] sm:gap-[24px] lg:gap-[28px] justify-center items-center">
              {blogArticles?.data.map((article) => (
                <div key={article.id} className="relative">
                  {article.read > 0 && (
                    <div className="absolute inset-0 bg-black opacity-50 z-10 pointer-events-none rounded-[16px]"></div>
                  )}

                  <div
                    className="relative w-[334px] sm:w-[336px] h-[414px] lg:w-[394px] lg:h-[460px] border-[1px] bg-[#1A1B1F] border-[#24262C] rounded-[16px] overflow-hidden hover:border-[#CBFF51] cursor-pointer"
                    onClick={() => router.push(`blog/${article.slug}`)}
                  >
                    <div className="h-[200px] relative">
                      <Image
                        src={getImageUrl(article.img)}
                        alt={article.title}
                        fill
                        className="object-cover"
                      />
                    </div>
                    <div className="h-[260px] p-[20px] pb-[16px] bg-[#1A1B1F] flex flex-col gap-[12px] lg:gap-[20px]">
                      <p className="text-[18px] leading-[22px] font-bold">
                        {article.title}
                      </p>
                      <div className="flex items-center gap-[8px]">
                        <p className="rounded-[6px] px-[8px] py-[6px] bg-[#212125] text-[13px] leading-[16px] font-semibold text-[#A0A8AE]">
                          {article.updated}
                        </p>
                        <p className="rounded-[6px] px-[8px] py-[6px] bg-[#211E12] text-[13px] leading-[16px] font-semibold text-[#C6A975]">
                          {article.category.title}
                        </p>
                      </div>
                      <p className="text-[14px] leading-[20px] text-[#B0B0B0] line-clamp-3">
                        {article.description}
                      </p>
                      <div className="flex items-center justify-between lg:mt-[15px] relative">
                        <div className="text-[#A0A8AE] flex items-center bg-[#0D0E0F] px-[8px] py-[6px] rounded-[6px] gap-1">
                          <IoMdTime size={12} />
                          <p className="text-[13px] leading-[16px] font-semibold">
                            {article.reading_time} min
                          </p>
                        </div>

                        <div
                          onClick={(event) =>
                            handleToggleRead(event, article.id)
                          }
                          className={`w-[40px] h-[40px] min-w-[40px] min-h-[40px] flex items-center justify-center rounded-full border-2 transition-all duration-300 shrink-0 bg-[#101114] cursor-pointer z-20 relative ${
                            article.read > 0
                              ? "border-[1px] border-[#47572D75] bg-[#000] text-[#CBFF51]"
                              : "border-[#2A2D33] border-[1px]"
                          }`}
                        >
                          <div
                            className={`${
                              article.read > 0 &&
                              `bg-[#CBFF512E] rounded-full p-[6px]`
                            }`}
                          >
                            {article.read > 0 && (
                              <div>
                                <MdOutlineDone size={20} />
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {blogArticles && blogArticles.last_page > 1 && (
            <div className="flex items-center justify-center gap-[8px] mt-[56px]">
              {Array.from(
                { length: blogArticles.last_page },
                (_, i) => i + 1
              ).map((page) => (
                <button
                  key={page}
                  onClick={() => setCurrentPage(page)}
                  className={`py-[6px] px-[10px] rounded-[8px] h-[40px] w-[40px] ${
                    currentPage === page ? "bg-[#2A2C32]" : "bg-[#15171A]"
                  } flex items-center justify-center cursor-pointer`}
                >
                  {page}
                </button>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Blog;
