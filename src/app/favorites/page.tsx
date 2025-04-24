"use client";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { IoMdClose, IoMdTime } from "react-icons/io";
import {
  IoCalendarClear,
  IoFilterOutline,
  IoSearchOutline,
} from "react-icons/io5";
import {
  MdFavorite,
  MdFavoriteBorder,
  MdOutlineKeyboardArrowRight,
} from "react-icons/md";
import Image from "next/image";
import { Slider, sliderClasses, styled } from "@mui/material";
import { GoArrowDown, GoDotFill } from "react-icons/go";
import HalfChartPie from "@/shared/components/HalfChartPie";
import { useEffect, useState, useMemo, useRef } from "react";
import { useRouter } from "next/navigation";
import useStore, { GuidesParams } from "@/shared/store";
import { debounce } from "lodash";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";
import CalendarModal from "@/shared/components/CalendarModal";
import clsx from "clsx";
import { useTranslation } from "react-i18next";
import { formatInvestmentAmount } from "@/shared/utils/formatters";

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
  const { t, i18n } = useTranslation();

  const SORTING_OPTIONS = [
    {
      key: "date",
      name: t("guides.sortByNewest"),
      icon: <GoArrowDown size={16} />,
    },
    {
      key: "invest",
      name: t("guides.sortByInvest"),
      icon: <GoArrowDown size={16} />,
    },
    {
      key: "score",
      name: t("guides.sortByScore"),
      icon: <GoArrowDown size={16} />,
    },
    {
      key: "network",
      name: t("guides.sortByNetwork"),
      icon: <GoArrowDown size={16} />,
    },
  ];

  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [actualSorting, setActualSorting] = useState<
    (typeof SORTING_OPTIONS)[number] & {
      orderBy: "asc" | "desc";
    }
  >({ ...SORTING_OPTIONS[0], orderBy: "desc" });

  const sortDropdownRef = useRef<HTMLDivElement>(null);

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
    setActualSorting((prev) => ({
      ...prev,
      name:
        prev.key === "date"
          ? t("guides.sortByNewest")
          : t(
              `guides.sortBy${prev.key.charAt(0).toUpperCase() + prev.key.slice(1)}`,
            ),
    }));

    const params: GuidesParams = {
      page: currentPage,
      favorites: 1,
    };

    if (actualSorting.key !== "default") {
      params.sorting = actualSorting.orderBy === "asc" ? 1 : 2;
      params.type_sorting = actualSorting.key as GuidesParams["type_sorting"];
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    fetchGuides(params);
  }, [
    fetchGuides,
    currentPage,
    searchQuery,
    actualSorting.key,
    actualSorting.orderBy,
    effectiveLanguage,
  ]);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        sortDropdownRef.current &&
        !sortDropdownRef.current.contains(event.target as Node)
      ) {
        setIsSortDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const handleToggleFavorite = async (e: React.MouseEvent, guideId: number) => {
    e.stopPropagation();
    await toggleFavorite(guideId);
  };

  const handleSortingChange = (option: (typeof SORTING_OPTIONS)[number]) => {
    setActualSorting((prev) => {
      if (prev.key === option.key) {
        return {
          ...prev,
          orderBy: prev.orderBy === "desc" ? "asc" : "desc",
        };
      }
      return {
        ...option,
        orderBy: "desc",
      };
    });
    setIsSortDropdownOpen(false);
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
    const backendUrl = "https://app.drophunting.io";
    return path.startsWith("http") ? path : `${backendUrl}${path}`;
  };

  const favoriteGuides = guides?.data.filter((guide) => guide.favorite > 0);

  const [isCalendarModalOpen, setIsCalendarModalOpen] = useState(false);
  const [guideCalendarId, setGuideCalendarId] = useState<number>(0);

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
            <div
              className="flex items-center gap-[10px] text-[#676A70] relative"
              ref={sortDropdownRef}>
              <IoFilterOutline
                size={20}
                className={`${actualSorting.orderBy === "asc" && "rotate-180"}`}
              />
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
                <p className="mr-[5px] ">
                  {t("guides.sort")}{" "}
                  <span className="text-white">{actualSorting.name}</span>
                </p>
                {isSortDropdownOpen ? (
                  <FaAngleUp size={16} className="text-[#8E8E8E] ml-1" />
                ) : (
                  <FaAngleDown size={16} className="text-[#8E8E8E] ml-1" />
                )}
              </div>

              {isSortDropdownOpen && (
                <>
                  <div
                    className="fixed inset-0 bg-black bg-opacity-40 z-40 xs:hidden"
                    onClick={() => setIsSortDropdownOpen(false)}
                  />

                  <div className="fixed xs:absolute inset-x-0 xs:inset-auto bottom-0 xs:bottom-auto xs:right-0 xs:top-[30px] mt-0 xs:mt-[2px] w-screen xs:w-[340px] text-white bg-[#141518] p-[16px] sm:p-[4px] rounded-t-[16px] xs:rounded-[12px] shadow-lg z-50 flex flex-col h-auto xs:h-auto">
                    <div className="flex xs:hidden justify-between mb-[24px]">
                      <button
                        onClick={() => {
                          setActualSorting({
                            ...SORTING_OPTIONS[0],
                            orderBy: "desc",
                          });
                        }}
                        className="text-[14px] leading-[24px] font-semibold font-sans">
                        {t("guides.clear")}
                      </button>
                      <p className="text-[20px] leading-[13px] font-bold font-sans">
                        {t("guides.sortBy")}
                      </p>
                      <button
                        className="flex items-center justify-center"
                        onClick={() => setIsSortDropdownOpen(false)}>
                        <IoMdClose size={24} />
                      </button>
                    </div>

                    <div className="mb-[2px] flex-grow">
                      {SORTING_OPTIONS.map((option) => (
                        <div
                          key={option.key}
                          className={clsx(
                            "flex items-center justify-between p-[12px] border-b-[1px] border-[#212327] last:border-b-0 font-sans",
                            option.key === "default" &&
                              option.key === actualSorting.key
                              ? "cursor-default"
                              : "cursor-pointer hover:bg-[#181C20] ",
                          )}
                          onClick={() => handleSortingChange(option)}>
                          <p className="text-[15px] leading-[24px] font-normal flex items-center gap-[16px] font-sans">
                            <span
                              className={clsx(
                                "transition-transform",
                                actualSorting.key === option.key &&
                                  actualSorting.orderBy === "asc" &&
                                  "rotate-180",
                              )}>
                              {option.icon}
                            </span>
                            {option.name}
                          </p>
                          {actualSorting.key === option.key && (
                            <FaCheck size={16} className="text-[#CBFF51]" />
                          )}
                        </div>
                      ))}
                    </div>
                  </div>
                </>
              )}
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
                                alt={""}
                                width={12}
                                height={12}
                                className="w-[12px] h-[12px]"
                              />
                            )}
                            <p className="text-[12px] leading-[14px] sm:text-[13px] sm:leading-[16px] font-semibold text-[#A0A8AE] max-w-[100px] truncate">
                              {marker.name[i18n.language]}
                            </p>
                          </div>
                        ))}
                      </div>
                      <div className="flex items-center gap-[3px]">
                        <div
                          onClick={(e) => {
                            setGuideCalendarId(guide.id);
                            setIsCalendarModalOpen(true);
                            e.stopPropagation();
                          }}
                          className="relative z-[3] w-[36px] h-[36px] bg-[#181A1D] rounded-full flex items-center justify-center">
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
                          alt={`${effectiveLanguage === "ru" ? guide.name.ru : guide.name.en} logo`}
                          fill
                          className="object-cover"
                        />
                      </div>
                      <div className="flex flex-col gap-[8px]">
                        <div className="flex items-center gap-3">
                          <p className="text-[18px] font-bold leading-[22px] max-w-[200px] truncate">
                            {effectiveLanguage === "ru"
                              ? guide.name.ru
                              : guide.name.en}
                          </p>
                          {guide.network?.icon && (
                            <div className="w-[20px] h-[20px] rounded-[10px] relative overflow-hidden">
                              <Image
                                src={getImageUrl(guide.network.icon)}
                                alt={`${effectiveLanguage === "ru" ? guide.name.ru : guide.name.en} network`}
                                fill
                                className="object-cover"
                              />
                            </div>
                          )}
                        </div>
                        <p className="text-[13px] text-[#8E8E8E] max-w-[200px] truncate">
                          {effectiveLanguage === "ru"
                            ? guide.excerpt.ru
                            : guide.excerpt.en}
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
                          {formatInvestmentAmount(guide.investments)}
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
                      <GoDotFill
                        className={clsx(
                          {
                            1: "text-green-500",
                            2: "text-yellow-500",
                            3: "text-red-500",
                          }[guide.status_id],
                        )}
                      />
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

      <CalendarModal
        metadata={{
          project_id: guideCalendarId,
        }}
        open={isCalendarModalOpen}
        onClose={() => setIsCalendarModalOpen(false)}
      />

      <Footer />
    </div>
  );
};

export default Favorites;
