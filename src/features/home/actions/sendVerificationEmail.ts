"use server";

import { sendMail } from "@/lib/mail";
import jwt from "jsonwebtoken";

export const sendVerificationEmail = async (email: string, name?: string) => {
  console.log("Inside the send verification server action");
  try {
    const token = jwt.sign({ email }, process.env.JWT_SECRET || "mysecretkey", {
      expiresIn: "30m",
    });

    const verifyUrl = `${process.env.NEXT_PUBLIC_APP_URL}/verify-email?token=${token}`;

    console.log(process.env.NEXT_PUBLIC_APP_URL);

    const { success } = await sendMail({
      to: email,
      subject: "Verify Your Email",
      html: `
    <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 24px; background-color: #f9fafb; border-radius: 12px;">
      <div style="text-align: center;">
        <h2 style="color: #111827;">Verify your email address</h2>
        <p style="color: #374151; font-size: 15px;">
          Hey ${name || "there"},<br/>
          Please verify your email to activate your PayZap account.
        </p>
        <a href="${verifyUrl}"
          style="display: inline-block; margin-top: 16px; background-color: #2563eb; color: #fff; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600;">
          Verify Email
        </a>
        <p style="color: #6b7280; font-size: 13px; margin-top: 20px;">
          Or copy and paste this link into your browser:
        </p>
        <p style="color: #2563eb; word-break: break-all; font-size: 13px;">
          ${verifyUrl}
        </p>
        <hr style="margin-top: 24px; border: none; border-top: 1px solid #e5e7eb;" />
        <p style="color: #9ca3af; font-size: 12px; margin-top: 16px;">
          This link will expire in 15 minutes.<br/>
          If you didn&apos;t request this, you can safely ignore this email.
        </p>
      </div>
    </div>
  `,
    });

    if (!success) {
      return {
        success: false,
      };
    }

    return {
      success: true,
    };
  } catch (error) {
    console.log(error);

    return {
      success: false,
    };
  }
};
