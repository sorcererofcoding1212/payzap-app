import { prisma } from "@/lib/db";

export const checkEmailVerify = async (userId: string) => {
  try {
    const user = await prisma.user.findUnique({
      where: {
        id: userId,
      },

      select: {
        email: true,
        emailVerified: true,
        name: true,
      },
    });

    if (!user) {
      return {
        msg: "Invalid request",
        success: false,
      };
    }

    const { email, emailVerified, name } = user;

    return {
      success: true,
      email,
      emailVerified,
      name,
    };
  } catch {
    return {
      msg: "Internal server error",
      success: false,
    };
  }
};
