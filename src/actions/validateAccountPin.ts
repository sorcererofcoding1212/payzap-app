"use server";

import { validateSession } from "./validateSession";
import { prisma } from "@/lib/db";
import bcrypt from "bcrypt";

export const validateAccountPin = async (accountPin: string) => {
  try {
    const session = await validateSession();

    const account = await prisma.account.findUnique({
      where: {
        userId: session.user.id,
      },

      select: {
        accountPin: true,
      },
    });

    if (!account) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }

    if (!account.accountPin) {
      return {
        msg: "Please set up your account pin",
        success: false,
      };
    }

    const isAccountPinValid = await bcrypt.compare(
      accountPin,
      account.accountPin
    );

    if (!isAccountPinValid) {
      return {
        msg: "Invalid PIN entered",
        success: false,
      };
    }

    return {
      msg: "PIN verified",
      success: true,
    };
  } catch (error) {
    console.log(error);
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
