import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "smtp.gmail.com",
  port: 465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
  tls: {
    rejectUnauthorized: false,
  },
});

interface SendMailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailProps) {
  try {
    console.log("Inside the main send mail function");
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    console.log("MAIL_ERROR : ", error);
    return { success: false, error };
  }
}
