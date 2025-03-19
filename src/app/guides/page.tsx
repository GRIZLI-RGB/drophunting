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
import useCustomScrollbar from "@/shared/hooks/useCustomScrollbar";
import useStore from "@/shared/store";
import { debounce } from "lodash";
import { FaAngleDown, FaAngleUp, FaCheck } from "react-icons/fa6";

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

const sortingOptions = [
  { id: 1, name: "By default", icon: <IoFilterOutline size={16} /> },
  { id: 2, name: "By newest", icon: <GoArrowDown size={16} /> },
  { id: 3, name: "By investment", icon: <GoArrowDown size={16} /> },
  { id: 4, name: "By BS", icon: <GoArrowDown size={16} /> },
  { id: 5, name: "By priority", icon: <GoArrowDown size={16} /> },
  { id: 6, name: "By Score", icon: <GoArrowDown size={16} /> },
  { id: 7, name: "By network", icon: <GoArrowDown size={16} /> },
];

const Guides = () => {
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [activeTagId, setActiveTagId] = useState<number | null>(null);
  const [currentPage, setCurrentPage] = useState(1);
  const [searchQuery, setSearchQuery] = useState("");
  const [isSortDropdownOpen, setIsSortDropdownOpen] = useState(false);
  const [sortingOption, setSortingOption] = useState({
    id: 1,
    name: "By newest",
  });

  const sortDropdownRef = useRef<HTMLDivElement>(null);

  const router = useRouter();
  const {
    user,
    sessionVerified,
    tags,
    isLoadingTags,
    tagsError,
    fetchTags,
    guides,
    isLoadingGuides,
    guidesError,
    fetchGuides,
    toggleFavorite,
  } = useStore();

  useEffect(() => {
    if (sessionVerified && !user) {
      router.push("/auth/login");
    }
  }, [sessionVerified, user, router]);

  useEffect(() => {
    fetchTags();
  }, [fetchTags]);

  useEffect(() => {
    if (tags.length > 0 && activeFilter === null) {
      setActiveFilter("All");
      setActiveTagId(null);
    }
  }, [tags, activeFilter]);

  useEffect(() => {
    const params: {
      page?: number;
      tag_id?: number;
      search?: string;
      favorites?: boolean;
      sorting?: 1 | 2;
    } = {
      page: currentPage,
      sorting: sortingOption.id <= 2 ? (sortingOption.id as 1 | 2) : 2,
    };

    if (activeTagId !== null) {
      params.tag_id = activeTagId;
    }

    if (searchQuery) {
      params.search = searchQuery;
    }

    fetchGuides(params);
  }, [fetchGuides, currentPage, activeTagId, searchQuery, sortingOption]);

  // Close dropdown when clicking outside
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

  const handleTagClick = (tagName: string, tagId: number | null) => {
    setActiveFilter(tagName);
    setActiveTagId(tagId);
    setCurrentPage(1);
  };

  const handleToggleFavorite = async (e: React.MouseEvent, guideId: number) => {
    e.stopPropagation();
    await toggleFavorite(guideId);
  };

  const handleSortingChange = (option: (typeof sortingOptions)[number]) => {
    if (option.id <= 2) {
      setSortingOption({
        id: option.id as 1 | 2,
        name: option.name,
      });
    } else {
      // For now, fallback to newest (id: 2) for options that are not yet implemented in the API
      setSortingOption({
        id: 2,
        name: option.name,
      });
    }
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

  const scrollRef = useCustomScrollbar({
    scrollbars: {
      autoHide: "never",
    },
  });

  const allTagsWithAll = [
    { id: 0, name: { en: "All", ru: "Все" }, sort: 0 },
    ...tags,
  ];

  const getImageUrl = (path: string) => {
    const backendUrl = "https://app.esdev.tech";
    return path.startsWith("http") ? path : `${backendUrl}${path}`;
  };

  return (
    <div className="bg-[#101114] text-white">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px] l:py-[64px] min-w-[375p]">
        <p className="text-[42px] leading-[50px] font-bold">Guides</p>
        <p className="text-[16px] leading-[22px] text-[#B0B0B0] mt-[20px]">
          Celebrate your web3 journey. Complete quests and earn drops!
        </p>
        <div className="mt-[40px] flex flex-col xl:flex-row xl:items-center xl:justify-between">
          <div className="w-full overflow-x-auto" ref={scrollRef}>
            {isLoadingTags ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-[#CBFF51]"></div>
              </div>
            ) : tagsError ? (
              <div className="text-red-500 p-2">{tagsError}</div>
            ) : (
              <div className="flex pb-[5px] md:pb-0 items-center gap-[6px] mb-[20px] xl:mb-0">
                {allTagsWithAll.map((tag) => (
                  <button
                    key={tag.id}
                    onClick={() =>
                      handleTagClick(tag.name.en, tag.id === 0 ? null : tag.id)
                    }
                    className={`p-[12px] rounded-[12px] h-[40px] flex items-center justify-center ${
                      activeFilter === tag.name.en
                        ? "bg-[#11CA00]"
                        : "bg-[#1D1E23]"
                    }`}>
                    <p className="text-[14px] leading-[16px] font-semibold truncate max-w-[100px]">
                      {tag.name.en}
                    </p>
                  </button>
                ))}
              </div>
            )}
          </div>
          <div className="relative text-[#848487] z-0">
            <IoSearchOutline
              className="absolute top-3 left-3 cursor-pointer"
              size={16}
            />
            <input
              placeholder="Search"
              onChange={handleSearchChange}
              className="bg-[#1D1E23] pr-[12px] pl-[36px] py-[10px] rounded-[11px] w-full sm:w-[300px] placeholder:text-[14px] placeholder:leading-[16px] font-semibold"
            />
          </div>
        </div>
        <div className="min-w-[341px]">
          <div className="flex items-center justify-between">
            <p className="text-[14px] leading-[16px] text-[#57585E] mt-[40px] mb-[32px]">
              {guides?.total || 0} airdrops
            </p>
            <div
              className="flex items-center gap-[10px] text-[#676A70] relative"
              ref={sortDropdownRef}>
              <IoFilterOutline size={20} />
              <div
                className="flex items-center cursor-pointer"
                onClick={() => setIsSortDropdownOpen(!isSortDropdownOpen)}>
                <p className="text-white mr-[5px] ">
                  Sort <span className="text-white">{sortingOption.name}</span>
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
                      <button className="text-[14px] leading-[24px] font-semibold font-sans">
                        Clear
                      </button>
                      <p className="text-[20px] leading-[13px] font-bold font-sans">
                        Sort by
                      </p>
                      <button
                        className="flex items-center justify-center"
                        onClick={() => setIsSortDropdownOpen(false)}>
                        <IoMdClose size={24} />
                      </button>
                    </div>
                    <div className="mb-[2px] flex-grow">
                      {sortingOptions.map((option) => (
                        <div
                          key={option.id}
                          className="flex items-center justify-between p-[12px] cursor-pointer hover:bg-[#181C20] border-b-[1px] border-[#212327] last:border-b-0 font-sans"
                          onClick={() => handleSortingChange(option)}>
                          <p className="text-[15px] leading-[24px] font-normal flex items-center gap-[16px] font-sans">
                            {option.icon}
                            {option.name}
                          </p>
                          {sortingOption.id === option.id && (
                            <FaCheck size={16} className="text-[#CBFF51]" />
                          )}
                        </div>
                      ))}
                    </div>
                    <div className="mt-[24px] xs:hidden">
                      <button
                        className="h-[45px] w-full bg-[#11CA00] hover:bg-blue-500 hover:rounded-[8px] rounded-[12px] text-[14px] leading-[16px] font-semibold p-[12px] mb-[12px]"
                        onClick={() => setIsSortDropdownOpen(false)}>
                        Apply
                      </button>
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
              {guidesError}
            </div>
          ) : guides?.data.length === 0 ? (
            <div className="text-center py-8 text-gray-400">
              No guides found. Try changing your filters.
            </div>
          ) : (
            <div className="flex flex-wrap gap-[16px] lg:gap-[28px] justify-center items-center">
              {guides?.data.map((guide) => (
                <div key={guide.id}>
                  <div
                    className="w-[339px] sm:w-[340px] lg:w-[394px] h-[280px] lg:h-[294px] bg-[#17181B] p-[16px] pt-[12px] lg:px-[20px] lg:py-[16px] rounded-[16px] border-[1px] border-[#1F2126] hover:border-[#CBFF51] cursor-pointer"
                    onClick={() => router.push(`guides/${guide.id}`)}>
                    <div className="flex justify-between">
                      <div className="flex items-center gap-1 flex-wrap">
                        <div className="flex items-center gap-[2px] px-[6px] py-[5px] bg-[#212125] rounded-[8px]">
                          <IoMdTime size={12} className="text-[#A0A8AE]" />
                          <p className="text-[12px] leading-[14px] sm:text-[13px] sm:leading-[16px] text-[#A0A8AE] font-semibold">
                            {guide.time} min
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
                            <p className="text-[12px] leading-[14px] sm:text-[13px] sm:leading-[16px] font-semibold text-[#A0A8AE] truncate max-w-[100px]">
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
                          <p className="text-[18px] font-bold leading-[22px] truncate max-w-[240px]">
                            {guide.title}
                          </p>
                        </div>
                        <p className="text-[13px] text-[#8E8E8E] overflow-hidden truncate max-w-[240px]">
                          {guide.description}
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-[24px] my-[-5px]">
                      <HalfChartPie defaultValue={guide.evaluation} />
                      <div>
                        <p className="text-[13px] leading-[16px] font-semibold text-[#50535D]">
                          Invest.
                        </p>
                        <p className="text-[16px] leading-[18px] font-bold truncate max-w-[100px]">
                          {guide.investments}
                        </p>
                      </div>
                      <div>
                        <p className="text-[13px] leading-[16px] font-semibold text-[#50535D]">
                          TVL
                        </p>
                        <p className="text-[16px] leading-[18px] font-bold truncate">
                          ${guide.tvl}
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
                          ? (guide.competed_tasks_count / guide.tasks_count) *
                            100
                          : 0}
                        %
                      </p>
                    </div>
                    <div className="mt-[12px] lg:mt-[16px] flex items-center gap-[5px] text-[#50535D] border-t-[1px] border-[#3032393D] pt-[12px] lg:pt-[16px]">
                      <p className="text-[13px] leading-[16px] font-semibold truncate max-w-full">
                        Last updates: {guide.updated}
                      </p>
                      <MdOutlineKeyboardArrowRight
                        size={20}
                        className="flex-shrink-0"
                      />
                      <GoDotFill className="text-red-500 flex-shrink-0" />
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

export default Guides;
