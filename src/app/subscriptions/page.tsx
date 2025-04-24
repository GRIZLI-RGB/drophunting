"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import { FaDollarSign } from "react-icons/fa6";
import {
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import Link from "next/link";
import { subaccountTabs, tabs } from "@/shared/utils/tabs";
import SmallChartPie from "@/shared/components/SmallChartPie";
import { PlansModal } from "../components/modals/PlansModal";
import useStore from "@/shared/store";
import { format } from "date-fns";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { Progress } from "@/shared/icons/Progress";
import { useTranslation } from "react-i18next";
import Unauthorized from "@/shared/components/Unauthorized";

const Subscriptions = () => {
  const { t } = useTranslation();
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;
  const [isModalOpen, setIsModalOpen] = useState(false);
  const {
    user,
    subscriptions,
    isLoadingSubscriptions,
    subscriptionsError,
    fetchSubscriptions,
  } = useStore();

  useEffect(() => {
    fetchSubscriptions();
  }, [fetchSubscriptions]);

  const toggleModal = () => {
    setIsModalOpen(!isModalOpen);
    if (!isModalOpen) {
      document.body.classList.add("no-scroll");
    } else {
      document.body.classList.remove("no-scroll");
    }
  };

  const formatDate = (dateString: string) => {
    try {
      return format(new Date(dateString), "dd.MM.yyyy");
    } catch (error) {
      console.error("Error formatting date:", error);
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
                          <span className="hidden lg:block">{tab.icon}</span>
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
              <div className="flex-col flex">
                <div className="flex items-center justify-center w-[48px] h-[48px] bg-[#2A2B32] rounded-[12px]">
                  <FaDollarSign size={24} />
                </div>
                <div className="mt-4">
                  <p className="text-[24px] font-semibold leading-[32px] tracking-[-3%] mb-2">
                    {t("subscriptions.title")}
                  </p>
                  <p className="text-[#949392] leading-[20px] mt-2 md:w-[80%]">
                    {t("subscriptions.description")}
                  </p>
                </div>
                <div className="mt-7">
                  {user?.plan_id === null && (
                    <div className="flex flex-col sm:flex-row gap-[10px]">
                      <p className="text-[15px] leading-[16px] font-semibold">
                        {user?.count_views === 0 && (
                          <span className="leading-[16px] font-semibold text-[#FF6951]">
                            {t("subscriptions.attention")}
                          </span>
                        )}{" "}
                        {t("subscriptions.freeViews")}
                      </p>
                      <div className="flex items-center gap-[10px]">
                        {user?.count_views === 0 ? (
                          <SmallChartPie
                            max={user?.free_views || 0}
                            current={user?.count_views || 0}
                            color="#FF6951"
                          />
                        ) : (
                          <SmallChartPie
                            max={user?.free_views || 0}
                            current={user?.count_views || 0}
                          />
                        )}
                        <p className="text-[15px] leading-[16px] font-semibold">
                          {user?.count_views} / {user?.free_views}
                        </p>
                      </div>
                    </div>
                  )}
                  <button
                    onClick={toggleModal}
                    className={`h-[44px] bg-[--green] px-[14px] py-[20px] font-sans font-bold leading-[16px] tracking-[-1%] rounded-[12px] flex items-center justify-center mt-[40px] my-[60px] ${
                      subscriptions.length > 0 && "mt-0"
                    }`}>
                    {t("subscriptions.seePlans")}
                  </button>
                </div>
                <div>
                  <div className="flex items-center gap-3">
                    <p className="text-[16px] font-bold leading-[24px] -tracking-[3%]">
                      {t("subscriptions.mySubscriptions")}
                    </p>
                    {!isLoadingSubscriptions && (
                      <p className="text-[#797979] text-[16px] leading-[24px] font-bold">
                        {subscriptions.length}
                      </p>
                    )}
                  </div>

                  {subscriptionsError && (
                    <div className="mt-4 p-3 bg-red-900/30 border border-red-500 rounded-[12px] text-red-400">
                      {subscriptionsError}
                    </div>
                  )}

                  {isLoadingSubscriptions ? (
                    <div className="flex justify-center py-8">
                      <div className="animate-spin rounded-full h-8 w-8 border-t-2 border-b-2 border-[#CBFF51]"></div>
                    </div>
                  ) : (
                    <div className="overflow-hidden">
                      <OverlayScrollbarsComponent
                        className="overflow-auto"
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
                            aria-label="subscriptions table">
                            <TableHead>
                              <TableRow>
                                <TableCell>{t("subscriptions.plan")}</TableCell>
                                <TableCell align="left">
                                  {t("subscriptions.dateStart")}
                                </TableCell>
                                <TableCell align="left">
                                  {t("subscriptions.dateEnd")}
                                </TableCell>
                                <TableCell align="left">
                                  {t("subscriptions.price")}
                                </TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {subscriptions.length > 0 ? (
                                subscriptions.map((subscription, index) => (
                                  <TableRow
                                    key={index}
                                    sx={{
                                      "&:hover": {
                                        backgroundColor: "#27292D",
                                      },
                                    }}>
                                    <TableCell align="left">
                                      {subscription.name}
                                    </TableCell>
                                    <TableCell align="left">
                                      {formatDate(subscription.date_start)}
                                    </TableCell>
                                    <TableCell align="left">
                                      {formatDate(subscription.date_end)}
                                    </TableCell>
                                    <TableCell align="left">
                                      ${subscription.price}
                                    </TableCell>
                                  </TableRow>
                                ))
                              ) : (
                                <TableRow>
                                  <TableCell
                                    colSpan={4}
                                    align="center"
                                    sx={{ color: "#8E8E8E" }}>
                                    {t("subscriptions.noActiveSubscriptions")}
                                  </TableCell>
                                </TableRow>
                              )}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </OverlayScrollbarsComponent>
                    </div>
                  )}
                </div>
              </div>
            ) : (
              <Unauthorized />
            )}
          </section>
        </div>
        {isModalOpen && <PlansModal togglePlansModal={toggleModal} />}
      </main>

      <Footer />
    </div>
  );
};

export default Subscriptions;
