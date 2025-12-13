"use server";

import { createTransfer } from "@/features/transfer/actions/createTransfer";
import { prisma } from "@/lib/db";

export const transferRequest = async (requestId: string) => {
  try {
    const request = await prisma.request.findUnique({
      where: {
        id: requestId,
      },
      include: {
        requestBy: {
          select: {
            walletId: true,
          },
        },
      },
    });

    if (!request)
      return {
        msg: "Request not found",
        success: false,
      };

    if (request.status === "Accepted" || request.transactionId)
      return {
        msg: "Request has already been accepted",
        success: false,
      };

    const response = await createTransfer(
      request.amount,
      request.requestBy.walletId
    );

    if (response.success) {
      await prisma.$transaction(async (txn) => {
        await txn.request.update({
          data: {
            status: "Accepted",
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
    } else {
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
    }

    return response;
  } catch (error) {
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
