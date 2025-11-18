"use server";

import { prisma } from "@/lib/db";
import { generateWalletId } from "@/lib/utils";
import bcrypt from "bcrypt";

interface UserRegisterProps {
  email: string;
  password: string;
  name: string;
}

export const userRegister = async ({
  email,
  name,
  password,
}: UserRegisterProps) => {
  try {
    const existingUser = await prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existingUser) {
      return {
        msg: "User already exists",
        success: false,
      };
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const walletId = generateWalletId(email);

    const user = await prisma.user.create({
      data: {
        email,
        name,
        password: hashedPassword,
        account: {
          create: {
            balance: {
              create: {
                amount: 0,
                locked: 0,
              },
            },
            walletId,
            balanceHistory: {
              create: {
                balance: 0,
              },
            },
          },
        },
      },

      select: {
        name: true,
        email: true,
        id: true,
        password: true,
      },
    });

    return { data: user, msg: "User registered", success: true };
  } catch (error: any) {
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
