import { redirect } from "next/navigation";
import jwt, { JwtPayload } from "jsonwebtoken";
import { prisma } from "@/lib/db";

export const verifyEmailToken = async (token?: string) => {
  try {
    if (!token) redirect("/error");

    const decoded = jwt.verify(
      token,
      process.env.JWT_SECRET || "mysecretkey"
    ) as JwtPayload;

    const { email } = decoded as { email: string };

    if (!email) redirect("/error");

    await prisma.user.update({
      where: {
        email,
      },

      data: {
        emailVerified: true,
      },
    });

    return {
      msg: "Email verified",
      success: true,
    };
  } catch (error: any) {
    if (error.name === "TokenExpiredError" && token) {
      const decoded = jwt.decode(token) as JwtPayload | null;
      const email = decoded?.email as string | undefined;

      return {
        success: false,
        message: "Verification link has expired. Please request a new one.",
        email,
      };
    }

    redirect("/error");
  }
};
