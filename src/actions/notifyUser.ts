"use server";

import { socketInstance } from "@/lib/axios";
import { TRANSFER } from "@/lib/constants";
import { prisma } from "@/lib/db";
import { adjustAmount } from "@/lib/utils";
import { OutgoingRequest } from "@/types/outgoingRequest";

export const notifyUser = async (
  recieverAccountId: string,
  senderAccountId: string,
  amount: number
) => {
  try {
    const senderDetails = await prisma.account.findUnique({
      where: {
        id: senderAccountId,
      },

      select: {
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const recieverDetails = await prisma.account.findUnique({
      where: {
        id: recieverAccountId,
      },
      select: {
        user: {
          select: {
            id: true,
          },
        },
      },
    });

    if (!senderDetails || !recieverDetails) {
      throw new Error("Details could not be found");
    }

    const { name: senderName } = senderDetails.user;
    const { id: recieverId } = recieverDetails.user;

    const outgoingMessage: OutgoingRequest = {
      type: TRANSFER,
      payload: {
        senderName,
        recieverId,
        amount: adjustAmount(amount, "APPLICATION"),
      },
    };

    await socketInstance.post("/api/notify", outgoingMessage);
  } catch (error) {
    console.log(error);
  }
};
