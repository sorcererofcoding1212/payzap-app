"use server";

import { prisma } from "@/lib/db";

export const declineRequest = async (requestId: string) => {
  try {
    await prisma.$transaction(async (txn) => {
      await txn.request.update({
        data: {
          status: "Rejected",
        },
        where: {
          id: requestId,
        },
      });

      await txn.notification.update({
        where: {
          requestId,
        },
        data: {
          isArchived: true,
        },
      });
    });
    return {
      success: true,
      msg: "Request declined",
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
