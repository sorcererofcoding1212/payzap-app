import { serverInstance } from "@/lib/axios";
import { Notification } from "@manvirsingh7/payzap-database/generated/prisma/client";
import axios from "axios";
import { useEffect, useState } from "react";
import { toast } from "sonner";

export const useNotifications = () => {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const [loading, setLoading] = useState<boolean>(false);

  const fetchUserNotifications = async () => {
    try {
      setLoading(true);
      const response = await serverInstance.get("/api/notification");

      if (!response.data.success) return;
      setNotifications(response.data.notifications);
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchUserNotifications();
  }, []);

  return { notifications, refetch: fetchUserNotifications, loading };
};
