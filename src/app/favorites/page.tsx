"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { IoMdTime } from "react-icons/io";
import {
  IoCalendarClear,
  IoFilterOutline,
  IoSearchOutline,
} from "react-icons/io5";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineArrowDropDown,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Image from "next/image";
import { Slider, sliderClasses, styled } from "@mui/material";
import { GoDotFill } from "react-icons/go";
import HalfChartPie from "@/shared/components/HalfChartPie";
import { useEffect, useState, useMemo } from "react";
import { useRouter } from "next/navigation";
import useStore, { GuidesParams } from "@/shared/store";
import { debounce } from "lodash";
import { useTranslation } from "react-i18next";

const CustomSlider = styled(Slider)({
  height: 8,
  [`&.${sliderClasses.root}`]: {
    padding: 0,
    margin: 0,
  },
  "& .MuiSlider-track": {
    background: "linear-gradient(to right, #5af86e, #d2f21b)",
    border: "none",
    zIndex: 2,
  },
  "& .MuiSlider-thumb": {
    display: "none",
  },
  "& .MuiSlider-rail": {
    opacity: 0.3,
    backgroundColor: "#333",
  },
  "& .MuiSlider-mark": {
    height: 4,
    width: 1,
    backgroundColor: "#777",
    zIndex: 1,
  },
});

const Favorites = () => {
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [sorting, setSorting] = useState<1 | 2>(2);
  const { t, i18n } = useTranslation();

  const router = useRouter();
  const {
    user,
    sessionVerified,
    guides,
    isLoadingGuides,
    guidesError,
    fetchGuides,
    toggleFavorite,
  } = useStore();

  const effectiveLanguage = useMemo(() => {
    return user?.lang || i18n.language;
  }, [user?.lang, i18n.language]);

  useEffect(() => {
    if (sessionVerified && !user) {
      router.push("/auth/login");
    }
  }, [sessionVerified, user, router]);

  useEffect(() => {
    const params: GuidesParams = {
      page: currentPage,
      sorting: sorting,
      favorites: 1,
    };

    if (searchQuery) {
      params.search = searchQuery;
    }

    fetchGuides(params);
  }, [fetchGuides, currentPage, searchQuery, sorting, effectiveLanguage]);

  const handleToggleFavorite = async (e: React.MouseEvent, guideId: number) => {
    e.stopPropagation();
    await toggleFavorite(guideId);
  };

  const handleSortingChange = () => {
    setSorting(sorting === 1 ? 2 : 1);
    setCurrentPage(1);
  };

  const debouncedSearch = useMemo(
    () =>
      debounce((value: string) => {
        setSearchQuery(value);
        setCurrentPage(1);
      }, 500),
    [setSearchQuery, setCurrentPage],
  );

  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    debouncedSearch(e.target.value);
  };

  const getImageUrl = (path: string) => {
    const backendUrl = "https://app.esdev.tech";
    return path.startsWith("http") ? path : `${backendUrl}${path}`;
  };

  const favoriteGuides = guides?.data.filter((guide) => guide.favorite > 0);

  return (
    <div className="bg-[#101114] text-white">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px] l:py-[64px] min-w-[375px]">
        <p className="text-[32px] sm:text-[42px] leading-[50px] font-bold">
          {t("favorites.title")}
        </p>
        <p className="text-[16px] leading-[22px] text-[#B0B0B0] mt-[20px]">
          {t("favorites.description")}
        </p>

        <div className="mt-[40px] flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <div className="relative text-[#848487] z-0">
            <IoSearchOutline
              className="absolute top-3 left-3 cursor-pointer"
              size={16}
            />
            <input
              placeholder={t("favorites.search")}
              onChange={handleSearchChange}
              className="bg-[#1D1E23] pr-[12px] pl-[36px] py-[10px] rounded-[11px] w-full sm:w-[300px] placeholder:text-[14px] placeholder:leading-[16px] font-semibold"
            />
          </div>
        </div>

        <div className="min-w-[341px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[16px] text-[#57585E] mt-[40px] mb-[32px]">
              {favoriteGuides?.length || 0} {t("favorites.favorites")}
            </p>
            <div className="flex items-center gap-[5px] text-[#676A70]">
              <IoFilterOutline size={20} />
              <p>
                {t("favorites.sortBy")}{" "}
                <span
                  className="text-white cursor-pointer"
                  onClick={handleSortingChange}>
                  {sorting === 1 ? t("favorites.old") : t("favorites.new")}
                </span>
              </p>
              <MdOutlineArrowDropDown className="text-white" size={20} />
            </div>
          </div>

          {isLoadingGuides ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
            </div>
          ) : guidesError ? (
            <div className="text-red-500 p-4 rounded-md bg-red-500/10 border border-red-500/30">
              {t("favorites.error")}
            </div>
          ) : favoriteGuides?.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              {t("favorites.noFavoritesFound")}
            </div>
          ) : (
            <div className="flex flex-wrap gap-[16px] lg:gap-[28px] justify-center items-center">
              {favoriteGuides?.map((guide) => (
                <div key={guide.id}>
                  <div
                    className="w-[339px] sm:w-[340px] lg:w-[394px] h-[280px] lg:h-[294px] bg-[#17181B] p-[16px] pt-[12px] lg:px-[20px] lg:py-[16px] rounded-[16px] border-[1px] border-[#1F2126] hover:border-[#CBFF51] cursor-pointer"
                    onClick={() => router.push(`guides/${guide.slug}`)}>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 flex-wrap">
                        <div className="flex items-center gap-[2px] px-[6px] py-[5px] bg-[#212125] rounded-[8px]">
                          <IoMdTime size={12} className="text-[#A0A8AE]" />
                          <p className="text-[12px] leading-[14px] sm:text-[13px] sm:leading-[16px] text-[#A0A8AE] font-semibold">
                            {guide.time} {t("favorites.min")}
                          </p>
                        </div>
                        {guide.markers.map((marker) => (
                          <div
                            key={marker.id}
                            className="flex items-center gap-[2px] px-[6px] py-[5px] rounded-[8px] bg-[#212125] text-[#A0A8AE]">
                            {marker.icon && (
                              <Image
                                src={getImageUrl(marker.icon.path)}
                                alt={marker.title}
                                width={12}
                                height={12}
                                className="w-[12px] h-[12px]"
                              />
                            )}
                            <p className="text-[12px] leading-[14px] sm:text-[13px] sm:leading-[16px] font-semibold text-[#A0A8AE] max-w-[100px] truncate">
                              {marker.title}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-[3px]">
                        <div className="w-[36px] h-[36px] bg-[#181A1D] rounded-full flex items-center justify-center">
                          <IoCalendarClear
                            className="text-[#515459]"
                            size={20}
                          />
                        </div>
                        <div
                          className="w-[36px] h-[36px] bg-[#1E2023] rounded-full flex items-center justify-center cursor-pointer"
                          onClick={(e) => handleToggleFavorite(e, guide.id)}>
                          {guide.favorite > 0 ? (
                            <MdFavorite className="text-[#CBFF51]" size={20} />
                          ) : (
                            <MdFavoriteBorder
                              className="text-[#515459]"
                              size={20}
                            />
                          )}
                        </div>
                      </div>
                    </div>
                    <div className="mt-[12px] flex gap-[16px]">
                      <div className="w-[48px] h-[48px] rounded-[10px] relative overflow-hidden">
                        <Image
                          src={getImageUrl(guide.logo)}
                          alt={`${guide.title} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-[8px]">
                        <div className="flex items-center gap-3">
                          <p className="text-[18px] font-bold leading-[22px] max-w-[200px] truncate">
                            {guide.title}
                          </p>
                        </div>
                        <p className="text-[13px] text-[#8E8E8E] max-w-[200px] truncate">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[24px] my-[-5px]">
                      <HalfChartPie defaultValue={guide.evaluation} />
                      <div>
                        <p className="text-[13px] leading-[16px] font-semibold text-[#50535D]">
                          {t("favorites.investmentLabel")}
                        </p>
                        <p className="text-[16px] leading-[18px] font-bold max-w-[100px] truncate">
                          {guide.investments}
                        </p>
                      </div>
                      <div>
                        <p className="text-[13px] leading-[16px] font-semibold text-[#50535D]">
                          TVL
                        </p>
                        <p className="text-[16px] leading-[18px] font-bold max-w-[100px] truncate">
                          {guide.tvl}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[12px]">
                      <CustomSlider
                        defaultValue={
                          guide.tasks_count > 0
                            ? (guide.competed_tasks_count / guide.tasks_count) *
                              100
                            : 0
                        }
                        step={1}
                        min={0}
                        max={100}
                        disabled
                      />
                      <p className="text-[16px] leading-[18px] font-bold">
                        {guide.competed_tasks_count > 0
                          ? Math.round(
                              (guide.competed_tasks_count / guide.tasks_count) *
                                100,
                            )
                          : 0}
                        %
                      </p>
                    </div>
                    <div className="mt-[12px] lg:mt-[16px] flex items-center gap-[5px] text-[#50535D] border-t-[1px] border-[#3032393D] pt-[12px] lg:pt-[16px]">
                      <p className="text-[13px] leading-[16px] font-semibold">
                        {t("favorites.lastUpdates")}: {guide.updated}
                      </p>
                      <MdOutlineKeyboardArrowRight size={20} />
                      <GoDotFill className="text-red-500" />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}

          {guides && guides.last_page > 1 && (
            <div className="flex items-center justify-center gap-[8px] mt-[56px]">
              {Array.from({ length: guides.last_page }, (_, i) => i + 1).map(
                (page) => (
                  <button
                    key={page}
                    onClick={() => setCurrentPage(page)}
                    className={`py-[6px] px-[10px] rounded-[8px] h-[40px] w-[40px] ${
                      currentPage === page ? "bg-[#2A2C32]" : "bg-[#15171A]"
                    } flex items-center justify-center cursor-pointer`}>
                    {page}
                  </button>
                ),
              )}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Favorites;
