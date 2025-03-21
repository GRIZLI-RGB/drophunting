import React, { useEffect, useRef } from "react";
import { GoDotFill } from "react-icons/go";
import { LuBell } from "react-icons/lu";
import { IoMdClose } from "react-icons/io";
import useStore from "@/shared/store";
import Image from "next/image";
import { OverlayScrollbarsComponent } from "overlayscrollbars-react";

type NotificationsModalType = {
  toggleNotificationsModal: () => void;
};

const NotificationsModal = ({
  toggleNotificationsModal,
}: NotificationsModalType) => {
  const { notifications, isLoadingNotifications, fetchNotifications } =
    useStore();

  const hasFetched = useRef(false);

  useEffect(() => {
    if (!hasFetched.current) {
      fetchNotifications();
      hasFetched.current = true;
    }
  }, [fetchNotifications]);

  return (
    <div className="flex flex-col h-full">
      <button
        className="block md:hidden absolute top-4 right-3 text-[#8E8E8E]"
        onClick={toggleNotificationsModal}>
        <IoMdClose size={24} className="cursor-pointer" />
      </button>
      <p className="text-[16px] leading-[16px] font-bold pl-[15px]">
        Notifications
      </p>
      <OverlayScrollbarsComponent
        className="overflow-y-auto mt-2"
        options={{
          scrollbars: {
            autoHide: "scroll",
          },
        }}>
        {isLoadingNotifications ? (
          <div className="flex justify-center items-center py-6">
            <div className="animate-spin rounded-full h-6 w-6 border-t-2 border-b-2 border-gray-500"></div>
          </div>
        ) : notifications?.data && notifications.data.length > 0 ? (
          notifications.data.map((notification) => (
            <div
              key={notification.id}
              onClick={() => {
                window.location.href = `${notification.article_id ? "/blog" : "/guides"}/${
                  notification.project_id || notification.article_id
                }`;
              }}
              className={`pl-[15px] flex gap-3 mt-[20px] border-b-[1px] border-[#24262A] pb-[10px] text-white overflow-y-auto ${(notification.article_id || notification.project_id) && "cursor-pointer hover:text-[#9EA0A6]"}`}>
              <div className="relative w-[28px] h-[28px] rounded-full bg-[#23252A] flex items-center justify-center">
                {notification.seen === 0 && (
                  <GoDotFill className="absolute right-[25px] md:right-[30px] text-red-500" />
                )}
                {notification.icon ? (
                  <div className="w-4 h-4 relative">
                    <Image
                      src={notification.icon.path}
                      alt="Notification icon"
                      fill
                      sizes="16px"
                      className="object-contain"
                    />
                  </div>
                ) : (
                  <LuBell size={16} />
                )}
              </div>
              <div>
                <p className="font-semibold leading-[19px] mb-1 sm:mb-1">
                  {notification.text}
                </p>
                <p className="text-[#8E8E8E] text-[13px] leading-[15px]">
                  {notification.date_time}
                </p>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-4 text-gray-400">No notifications</div>
        )}
      </OverlayScrollbarsComponent>
    </div>
  );
};

export default NotificationsModal;
