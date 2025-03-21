"use client";
import React, { useState, useEffect } from "react";
import { usePathname } from "next/navigation";
import Header from "@/app/components/Header";
import Footer from "@/app/components/Footer";
import Link from "next/link";
import { subaccountTabs, tabs } from "@/shared/utils/tabs";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";
import { GrBook } from "react-icons/gr";
import useStore from "@/shared/store";
import { Progress } from "@/shared/icons/Progress";

const SuggestGuide = () => {
  const pathname = usePathname();
  const isActive = (href: string) => pathname === href;

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [formErrors, setFormErrors] = useState<{
    name?: string;
    description?: string;
  }>({});

  const {
    suggestGuide,
    isSuggestingGuide,
    suggestGuideSuccess,
    resetSuggestGuideState,
    user,
  } = useStore();

  useEffect(() => {
    return () => {
      resetSuggestGuideState();
    };
  }, [resetSuggestGuideState]);

  useEffect(() => {
    if (suggestGuideSuccess) {
      setName("");
      setDescription("");
      setFormErrors({});
      resetSuggestGuideState();
    }
  }, [suggestGuideSuccess, resetSuggestGuideState]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const errors: { name?: string; description?: string } = {};
    if (!name.trim()) errors.name = "Guide name is required";
    if (!description.trim())
      errors.description = "Guide description is required";

    if (Object.keys(errors).length > 0) {
      setFormErrors(errors);
      return;
    }

    await suggestGuide({ name, description });
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
                  ? subaccountTabs.map((tab) => (
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
                  : tabs.map((tab) => (
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
            <div className="flex-col flex">
              <div className="flex items-center justify-center w-[48px] h-[48px] bg-[#2A2B32] rounded-[12px]">
                <GrBook size={24} />
              </div>
              <div className="mt-4 mb-[32px]">
                <p className="text-[24px] font-semibold leading-[32px] tracking-[-3%] mb-2">
                  Guides
                </p>
                <p className="text-[#949392] text-[14px] leading-[20px] sm:w-[450px] lg:w-[650px]">
                  Do you know any interesting guides? Tell us about the guides
                  you want to see in DropHunting
                </p>
              </div>
              <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                <p className="text-[18px] leading-[32px] font-semibold">
                  Suggest the guide
                </p>
                <div className="max-w-[635px] w-full flex flex-col gap-4">
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guide-name"
                      className="text-[14px] leading-[16px]">
                      Name of the guide
                    </label>
                    <input
                      id="guide-name"
                      type="text"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="Enter the name of the guide"
                      className={`w-full h-[48px] bg-[#292B2F] rounded-[14px] py-[12px] px-[16px] text-[14px] leading-[20px] text-white ${
                        formErrors.name ? "border border-red-500" : ""
                      }`}
                    />
                    {formErrors.name && (
                      <span className="text-red-500 text-[12px]">
                        {formErrors.name}
                      </span>
                    )}
                  </div>
                  <div className="flex flex-col gap-2">
                    <label
                      htmlFor="guide-description"
                      className="text-[14px] leading-[16px]">
                      Describe guide
                    </label>
                    <div>
                      <textarea
                        id="guide-description"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        className={`w-full min-h-[160px] h-full bg-[#292B2F] py-[12px] px-[16px] rounded-[10px] resize-none overflow-auto text-white ${
                          formErrors.description ? "border border-red-500" : ""
                        }`}
                        placeholder="Describe your idea"
                      />
                      {formErrors.description && (
                        <span className="text-red-500 text-[12px]">
                          {formErrors.description}
                        </span>
                      )}
                    </div>
                  </div>
                  <button
                    type="submit"
                    disabled={isSuggestingGuide}
                    className={`w-fit h-[44px] font-sans font-semibold ${
                      isSuggestingGuide
                        ? "bg-[#0E9900] opacity-70"
                        : "bg-[#11CA00]"
                    } rounded-[14px] px-[20px] py-[14px] flex items-center justify-center text-[15px] leading-[16px] text-white`}>
                    {isSuggestingGuide ? "Sending..." : "Send"}
                  </button>
                </div>
              </form>
            </div>
          </section>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default SuggestGuide;
