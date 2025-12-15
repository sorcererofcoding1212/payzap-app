import { serverInstance } from "@/lib/axios";
import { NOTIFICATION } from "@/lib/constants";
import { useSocketStore } from "@/store/socketStore";
import { IncomingRequest } from "@/types/incomingRequest";
import { useEffect, useState } from "react";
import { useNotifications } from "./useNotifications";

export const useRealtimeNotifications = () => {
  const [isNotificationOpen, setIsNotificationOpen] = useState<boolean>(false);
  const [unreadNotifications, setUnreadNotifications] = useState<number>(0);
  const { notifications, loading, refetch } = useNotifications();
  const [newNotificationsAvailable, setNewNotificationsAvailable] =
    useState<boolean>(false);
  const socket = useSocketStore((state) => state.socket);

  const checkUnreadNotifications = () => {
    const unreadNotificationsLength = notifications.filter(
      (n) => n.isRead === false
    ).length;
    setUnreadNotifications(unreadNotificationsLength);
  };

  const updateNotificationsToRead = async () => {
    try {
      const response = await serverInstance.post("/api/notification", {
        notifications,
      });
      if (!response.data.success) return;
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    if (!socket) return;
    const handler = (message: MessageEvent) => {
      try {
        const payload =
          typeof message.data === "string"
            ? JSON.parse(message.data)
            : message.data;

        if ((payload as IncomingRequest).type === NOTIFICATION) {
          if (isNotificationOpen) setNewNotificationsAvailable(true);
          else refetch();
        }
      } catch (err) {
        console.error("Failed to parse socket message", err, message.data);
      }
    };

    socket.addEventListener("message", handler);

    return () => {
      socket.removeEventListener("message", handler);
      setNewNotificationsAvailable(false);
    };
  }, [socket, isNotificationOpen]);

  useEffect(() => {
    checkUnreadNotifications();
  }, [notifications]);

  useEffect(() => {
    if (isNotificationOpen) {
      updateNotificationsToRead();
      setUnreadNotifications(0);
    }
  }, [isNotificationOpen]);

  return {
    notifications,
    loading,
    refetch,
    isNotificationOpen,
    setIsNotificationOpen,
    unreadNotifications,
    newNotificationsAvailable,
    setNewNotificationsAvailable,
  };
};
