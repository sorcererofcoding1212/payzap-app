"use server";

import { adjustAmount } from "@/lib/utils";
import { errorMessage } from "../lib/errorMessages";
import { validateSession } from "@/actions/validateSession";
import { prisma } from "@/lib/db";
import { notifyUser } from "@/actions/notifyUser";

export const createRequest = async (amount: number, walletId: string) => {
  try {
    const session = await validateSession();

    if (adjustAmount(amount, "APPLICATION") < 50)
      throw new Error(errorMessage.MIN_LIMIT);

    if (adjustAmount(amount, "APPLICATION") > 5000)
      throw new Error(errorMessage.MAX_LIMIT);

    const requestBy = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        id: true,
        user: {
          select: {
            name: true,
          },
        },
      },
    });

    const requestTo = await prisma.account.findUnique({
      where: {
        walletId,
      },

      select: {
        id: true,
        user: {
          select: {
            id: true,
            emailVerified: true,
          },
        },
      },
    });

    if (!requestBy || !requestTo || !requestTo.user.emailVerified)
      throw new Error(errorMessage.ACCOUNT_NOT_FOUND);

    const request = await prisma.request.create({
      data: {
        requestById: requestBy.id,
        requestToId: requestTo.id,
        amount,
      },
    });

    const notificationContent = `${
      requestBy.user.name
    } requested INR ${adjustAmount(amount, "APPLICATION")}`;

    await prisma.notification.create({
      data: {
        type: "RequestReceived",
        content: notificationContent,
        accountId: requestTo.id,
        requestId: request.id,
        amount,
      },
    });

    await notifyUser(notificationContent, requestTo.user.id);

    return {
      success: true,
      msg: "Request made",
    };
  } catch (error: any) {
    const expectedErrors = [
      errorMessage.ACCOUNT_NOT_FOUND,
      errorMessage.EMAIL_NOT_VERIFIED,
      errorMessage.INVALID_REQUEST,
      errorMessage.MIN_LIMIT,
      errorMessage.MAX_LIMIT,
    ];

    if (!expectedErrors.includes(error.message)) {
      return {
        msg: errorMessage.SERVER_ERROR,
        success: false,
      };
    }

    return {
      msg: error.message || errorMessage.SERVER_ERROR,
      success: false,
    };
  }
};
