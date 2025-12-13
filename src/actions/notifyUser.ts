"use server";

import { socketInstance } from "@/lib/axios";
import { NOTIFICATION } from "@/lib/constants";
import { OutgoingRequest } from "@/types/outgoingRequest";

export const notifyUser = async (content: string, receiverId: string) => {
  const outgoingRequest: OutgoingRequest = {
    type: NOTIFICATION,
    payload: {
      content,
      receiverId,
    },
  };
  await socketInstance.post("/api/notify", outgoingRequest);
};
