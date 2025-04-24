"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { FiUsers } from "react-icons/fi";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Pagination,
} from "@mui/material";
import Link from "next/link";
import Image from "next/image";
import { subaccountTabs, tabs } from "@/shared/utils/tabs";
import SmallChartPie from "@/shared/components/SmallChartPie";
import useStore from "@/shared/store";
import { format } from "date-fns";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import trashIcon from "../../../public/assets/icons/trash-red.png";
import { BuySubaccountsModal } from "../components/modals/BuySubaccountsModal";
import { DeleteSubaccountModal } from "../components/modals/DeleteSubaccountModal";
import { Progress } from "@/shared/icons/Progress";
import { useTranslation } from "react-i18next";
import Unauthorized from "@/shared/components/Unauthorized";

const Subaccounts = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const [copied, setCopied] = useState(false);
  const [currentPage, setCurrentPage] = useState(1);
  const [showBuySubaccountsModal, setShowBuySubaccountsModal] = useState(false);
  const [showDeleteSubaccountModal, setShowDeleteSubaccountModal] =
    useState(false);
  const [subaccountId, setSubaccountId] = useState<number | null>(null);

  const {
    subaccounts,
    isLoadingSubaccounts,
    subaccountsError,
    fetchSubaccounts,
    deleteSubaccount,
    user,
  } = useStore();

  useEffect(() => {
    fetchSubaccounts();
  }, [fetchSubaccounts]);

  const handlePageChange = (
    _event: React.ChangeEvent<unknown>,
    page: number,
  ) => {
    setCurrentPage(page);
    fetchSubaccounts(page);
  };

  const handleDeleteSubaccount = (id: number) => {
    deleteSubaccount(id)
      .then(() => {
        setShowDeleteSubaccountModal(false);
        fetchSubaccounts(currentPage);
      })
      .catch((error) => {
        console.error("Error deleting subaccount:", error);
      });
  };

  const handleCopy = () => {
    if (subaccounts?.subaccounts_link) {
      navigator.clipboard.writeText(subaccounts.subaccounts_link);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy");
    } catch (error) {
      console.error(error);
      return dateString;
    }
  };

  return (
    <div className="bg-[#101114] text-white">
      <Header />

      <main className="px-[16px] sm:px-[32px] sm:pt-[48px] sm:pb-[64px] lg:px-[96px]">
        <div className="flex flex-col lg:flex-row justify-center w-full p-3">
          <nav className="lg:w-[240px] w-full font-chakra font-bold leading-[20px] text-[#8E8E8E] m-0 lg:mr-[40px]">
            <OverlayScrollbarsComponent
              className="h-auto max-h-[300px] lg:max-h-none"
              options={{
                scrollbars: {
                  autoHide: "never",
                },
              }}>
              <ul className="w-full border-b-[1px] border-[#27292D] lg:border-none flex flex-row lg:flex-col mb-3">
                {user?.subaccount
                  ? subaccountTabs().map((tab) => (
                      <li
                        key={tab.name}
                        className={`whitespace-nowrap p-[6px] lg:px-[16px] lg:py-[12px] lg:rounded-[12px] lg:mb-1 cursor-pointer ${
                          isActive(tab.href)
                            ? "border-b-[1px] border-white lg:border-none lg:bg-[--dark-gray] text-white"
                            : "hover:border-b-[1px] border-white lg:border-none lg:hover:bg-[--dark-gray] hover:text-white"
                        }`}>
                        <Link
                          href={tab.href}
                          className="flex items-center gap-3 text-[16px]">
                          <span className="hidden lg:block">
                            {tab.name === "Progress" ? (
                              <div className="group-hover:text-white">
                                <Progress
                                  size={24}
                                  color={
                                    isActive(tab.href)
                                      ? "white"
                                      : "currentColor"
                                  }
                                />
                              </div>
                            ) : (
                              tab.icon
                            )}
                          </span>
                          {tab.name}
                        </Link>
                      </li>
                    ))
                  : tabs().map((tab) => (
                      <li
                        key={tab.name}
                        className={`whitespace-nowrap p-[6px] lg:px-[16px] lg:py-[12px] lg:rounded-[12px] lg:mb-1 cursor-pointer ${
                          isActive(tab.href)
                            ? "border-b-[1px] border-white lg:border-none lg:bg-[--dark-gray] text-white"
                            : "hover:border-b-[1px] border-white lg:border-none lg:hover:bg-[--dark-gray] hover:text-white"
                        }`}>
                        <Link
                          href={tab.href}
                          className="flex items-center gap-3 text-[16px]">
                          <span className="hidden lg:block">
                            {tab.name === "Progress" ? (
                              <div className="group-hover:text-white">
                                <Progress
                                  size={24}
                                  color={
                                    isActive(tab.href)
                                      ? "white"
                                      : "currentColor"
                                  }
                                />
                              </div>
                            ) : (
                              tab.icon
                            )}
                          </span>
                          {tab.name}
                        </Link>
                      </li>
                    ))}
              </ul>
            </OverlayScrollbarsComponent>
          </nav>
          <section className="w-full min-h-[1300px] bg-[--dark-gray] p-[32px] rounded-[16px]">
            {user?.verify_email ? (
              <>
                {isLoadingSubaccounts && !subaccounts ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                  </div>
                ) : subaccountsError ? (
                  <div className="flex justify-center items-center h-[200px]">
                    <p className="text-red-500">{subaccountsError}</p>
                  </div>
                ) : (
                  <div className="flex flex-col">
                    <div className="flex flex-col">
                      <div>
                        <div className="flex items-center justify-center w-[48px] h-[48px] bg-[#2A2B32] rounded-[12px]">
                          <FiUsers size={24} />
                        </div>
                        <div className="mt-4">
                          <p className="text-[24px] font-semibold leading-[32px] tracking-[-3%] mb-2">
                            {t("subaccounts.title")}
                          </p>
                          <p className="text-[#949392] leading-[20px] mt-2 max-w-full lg:w-[650px]">
                            {t("subaccounts.description")}
                          </p>
                        </div>
                        <div className="bg-[#1B1C20] p-[24px] rounded-[12px] my-6 w-full lg:w-[630px]">
                          <div className="flex flex-col sm:flex-row gap-3">
                            <p className="leading-[16px] font-semibold">
                              {subaccounts?.subaccounts_count ===
                                subaccounts?.limit_subaccounts && (
                                <span className="leading-[16px] font-semibold text-[#FF6951]">
                                  {t("subaccounts.attention")}
                                </span>
                              )}{" "}
                              {t("subaccounts.usedSubaccounts")}
                            </p>
                            <div className="flex items-center gap-3">
                              {subaccounts?.subaccounts_count ===
                              subaccounts?.limit_subaccounts ? (
                                <SmallChartPie
                                  max={subaccounts?.limit_subaccounts || 0}
                                  current={subaccounts?.subaccounts_count || 0}
                                  color="#FF6951"
                                />
                              ) : (
                                <SmallChartPie
                                  max={subaccounts?.limit_subaccounts || 0}
                                  current={subaccounts?.subaccounts_count || 0}
                                />
                              )}

                              <p className="leading-[16px] font-semibold">
                                {subaccounts
                                  ? `${subaccounts.subaccounts_count}/${subaccounts.limit_subaccounts}`
                                  : "0/0"}
                              </p>
                            </div>
                          </div>
                          {subaccounts?.subaccounts_count !==
                            subaccounts?.limit_subaccounts && (
                            <>
                              <hr className="mb-[25px] mt-[10px] border-0 h-px bg-[#27292D]" />
                              <div className="flexitems-center justify-between">
                                <p className="text-[13px] sm:text-[14px] leading-[20px] font-bold mr-[5px]">
                                  {t("subaccounts.sendInvitationLink")}
                                </p>
                                <div className="relative flex items-center justify-between md:w-[465px] gap-[10px] mt-3">
                                  <input
                                    value={subaccounts?.subaccounts_link || ""}
                                    readOnly
                                    className="bg-[#24262B] p-[12px] rounded-[12px] w-full truncate leading-[20px]"
                                  />
                                  <button
                                    onClick={handleCopy}
                                    className="relative flex items-center rounded-[12px] p-[12px] md:py-[12px] md:px-[20px] text-[15px] bg-[#11CA00] font-bold leading-[20px] hover:bg-blue-500">
                                    {t("subaccounts.copy")}
                                    {copied && (
                                      <span className="absolute top-[-35px] right-0 bg-[--dark-gray] text-white text-xs px-2 py-1 rounded-md w-[110px]">
                                        {t("subaccounts.linkCopied")}
                                      </span>
                                    )}
                                  </button>
                                </div>
                              </div>
                            </>
                          )}
                        </div>
                      </div>
                      <button
                        onClick={() => setShowBuySubaccountsModal(true)}
                        className="bg-[#11CA00] text-white px-[16px] py-[12px] rounded-[12px] my-6 text-[15px] font-bold leading-[20px] w-fit">
                        {t("subaccounts.buySubaccounts")}
                      </button>
                    </div>
                    <div className="flex items-center gap-3">
                      <p className="text-[16px] font-bold leading-[24px] -tracking-[3%]">
                        {t("subaccounts.mySubaccounts")}
                      </p>
                      <p className="text-[#797979] text-[16px] leading-[24px] font-bold">
                        {subaccounts?.subaccounts_user_count ?? 0}
                      </p>
                    </div>

                    {isLoadingSubaccounts && subaccounts ? (
                      <div className="flex justify-center py-8">
                        <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                      </div>
                    ) : (
                      <div className="overflow-hidden">
                        <OverlayScrollbarsComponent
                          options={{
                            scrollbars: {
                              autoHide: "never",
                            },
                          }}>
                          <TableContainer
                            sx={{
                              backgroundColor: "transparent",
                              overflowX: "visible",
                            }}>
                            <Table
                              sx={{
                                width: "100%",
                                "& .MuiTableCell-head": {
                                  backgroundColor: "transparent",
                                  color: "#949392",
                                  fontWeight: "bold",
                                  fontSize: "13px",
                                  lineHeight: "16px",
                                  borderBottom: "1px solid #27292D",
                                  padding: "16px",
                                  fontFamily: "IBM Plex Mono",
                                },
                                "& .MuiTableCell-body": {
                                  minWidth: 150,
                                  color: "#FFFFFF",
                                  fontSize: "14px",
                                  lineHeight: "20px",
                                  borderBottom: "1px solid #27292D",
                                  padding: "16px",
                                  fontFamily: "IBM Plex Mono",
                                },
                              }}
                              aria-label="subaccounts table">
                              <TableHead>
                                <TableRow>
                                  <TableCell
                                    align="left"
                                    className="min-w-[150px]">
                                    {t("subaccounts.name")}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="min-w-[150px]">
                                    {t("subaccounts.email")}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="min-w-[150px]">
                                    {t("subaccounts.date")}
                                  </TableCell>
                                  <TableCell
                                    align="left"
                                    className="min-w-[150px]">
                                    {t("subaccounts.delete")}
                                  </TableCell>
                                </TableRow>
                              </TableHead>
                              <TableBody>
                                {subaccounts?.subaccounts.data &&
                                subaccounts.subaccounts.data.length > 0 ? (
                                  subaccounts.subaccounts.data.map(
                                    (subaccount) => (
                                      <TableRow
                                        key={subaccount.id}
                                        sx={{
                                          "&:hover": {
                                            backgroundColor: "#27292D",
                                          },
                                        }}>
                                        <TableCell
                                          align="left"
                                          className="min-w-[50px]">
                                          <div className="flex items-center gap-2">
                                            <Image
                                              src={subaccount.avatar}
                                              alt={subaccount.name}
                                              width={28}
                                              height={28}
                                              className="w-[28px] h-[28px] rounded-full object-cover"
                                            />
                                            <p>{subaccount.name}</p>
                                          </div>
                                        </TableCell>
                                        <TableCell
                                          align="left"
                                          className="min-w-[50px]">
                                          {subaccount.email}
                                        </TableCell>
                                        <TableCell align="left">
                                          {formatDate(subaccount.created_at)}
                                        </TableCell>
                                        <TableCell align="left">
                                          <button
                                            className="text-[#FFA7A7] flex items-center gap-1"
                                            onClick={() => {
                                              setShowDeleteSubaccountModal(
                                                true,
                                              );
                                              setSubaccountId(subaccount.id);
                                            }}>
                                            <Image
                                              src={trashIcon}
                                              alt="trash"
                                              width={14}
                                              height={14}
                                            />
                                            <p className="text-[14px] leading-[20px]">
                                              {t("subaccounts.delete")}
                                            </p>
                                          </button>
                                        </TableCell>
                                      </TableRow>
                                    ),
                                  )
                                ) : (
                                  <TableRow>
                                    <TableCell colSpan={4} align="center">
                                      {t("subaccounts.noSubaccountsFound")}
                                    </TableCell>
                                  </TableRow>
                                )}
                              </TableBody>
                            </Table>
                          </TableContainer>
                        </OverlayScrollbarsComponent>
                        {subaccounts?.subaccounts.data &&
                          subaccounts.subaccounts.data.length > 0 && (
                            <div className="flex justify-center mt-6">
                              <Pagination
                                count={Math.ceil(
                                  (subaccounts?.subaccounts_count || 0) /
                                    parseInt(
                                      subaccounts?.subaccounts.per_page || "10",
                                    ),
                                )}
                                page={currentPage}
                                onChange={handlePageChange}
                                variant="outlined"
                                shape="rounded"
                                sx={{
                                  "& .MuiPaginationItem-root": {
                                    color: "#FFFFFF",
                                    borderColor: "#27292D",
                                  },
                                  "& .MuiPaginationItem-root.Mui-selected": {
                                    backgroundColor: "#11CA00",
                                    borderColor: "#11CA00",
                                  },
                                }}
                              />
                            </div>
                          )}
                      </div>
                    )}
                  </div>
                )}
              </>
            ) : (
              <Unauthorized />
            )}
          </section>
        </div>
      </main>

      <Footer />

      {showBuySubaccountsModal && (
        <BuySubaccountsModal
          onClose={() => setShowBuySubaccountsModal(false)}
          subaccountPrice={subaccounts?.price || 0}
        />
      )}

      {showDeleteSubaccountModal && (
        <DeleteSubaccountModal
          onClose={() => setShowDeleteSubaccountModal(false)}
          onConfirm={() => handleDeleteSubaccount(subaccountId as number)}
        />
      )}
    </div>
  );
};

export default Subaccounts;
