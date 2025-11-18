import nodemailer from "nodemailer";

console.log(process.env.EMAIL_USER);
console.log(process.env.EMAIL_PASS);
console.log(process.env.EMAIL_FROM);

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

interface SendMailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailProps) {
  try {
    await transporter.sendMail({
      from: process.env.EMAIL_FROM,
      to,
      subject,
      html,
    });
    return { success: true };
  } catch (error) {
    return { success: false, error };
  }
}
