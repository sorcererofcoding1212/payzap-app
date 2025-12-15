"use client";

import { checkAccountPinExists } from "@/actions/checkAccountPinExists";
import { checkEmailVerify } from "@/actions/checkEmailVerify";
import { CreatePinModal } from "@/components/CreatePinModal";
import { PinModal } from "@/components/PinModal";
import { declineRequest } from "@/features/request/actions/declineRequest";
import { transferRequest } from "@/features/request/actions/transferRequest";
import { cn, readTime, truncateText } from "@/lib/utils";
import { Notification } from "@manvirsingh7/payzap-database/generated/prisma/client";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { toast } from "sonner";

interface NotificationComponentProps {
  notification: Notification;
  refetch: () => void;
}

export const NotificationComponent = ({
  notification,
  refetch,
}: NotificationComponentProps) => {
  const [loading, setLoading] = useState<boolean>(false);
  const [openPinModal, setOpenPinModal] = useState<boolean>(false);
  const [openCreatePinModal, setOpenCreatePinModal] = useState<boolean>(false);
  const { data, status } = useSession();

  const onInitialSubmit = async () => {
    if (status === "loading") {
      toast.loading("Please try again after some time");
      return;
    }
    if (status === "unauthenticated" || !data) {
      toast.error("Invalid request");
      return;
    }
    const { emailVerified } = await checkEmailVerify(data.user.id);
    if (!emailVerified) {
      toast.error("Please verify your email first");
      return;
    }
    const { msg, success } = await checkAccountPinExists();
    if (!success) {
      toast.error(msg);
      setOpenCreatePinModal(true);
      return;
    }

    setOpenPinModal(true);
  };

  const rejectRequest = async () => {
    try {
      if (!notification.requestId) return;
      setLoading(true);
      const response = await declineRequest(notification.requestId);
      if (!response.success) {
        toast.error(response.msg || "Some error occured");
        return;
      }
      toast.success("Request declined");
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  const acceptRequest = async () => {
    try {
      if (!notification.requestId) return;
      setLoading(true);
      const response = await transferRequest(notification.requestId);
      if (!response.success) {
        toast.error(response.msg || "Some error occured");
        return;
      }
      toast.success("Request accepted");
      refetch();
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  return (
    <div
      className={cn(
        "w-full min-h-18 h-fit text-sm bg-base-300 mb-2 cursor-pointer rounded px-6 py-3 text-base-content"
      )}
    >
      <div>{truncateText(notification.content, 45)}</div>
      {notification.requestId && (
        <div className="mt-3 mb-2 flex justify-between">
          <button
            onClick={rejectRequest}
            disabled={loading}
            className={cn(
              "px-5 cursor-pointer hover:scale-99 transition-all py-2 text-xs font-semibold text-center bg-red-500 rounded text-white",
              loading && "bg-red-400"
            )}
          >
            Reject
          </button>
          <button
            onClick={onInitialSubmit}
            disabled={loading}
            className={cn(
              "px-5 cursor-pointer hover:scale-99 transition-all py-2 text-xs font-semibold text-center bg-green-500 rounded text-white",
              loading && "bg-green-400"
            )}
          >
            Accept
          </button>
        </div>
      )}
      <div className="text-base-content text-right text-[11px]">
        {readTime(new Date(notification.createdAt))}
      </div>
      <CreatePinModal
        open={openCreatePinModal}
        setOpen={setOpenCreatePinModal}
      />
      <PinModal
        open={openPinModal}
        setOpen={setOpenPinModal}
        onSuccess={acceptRequest}
      />
    </div>
  );
};
