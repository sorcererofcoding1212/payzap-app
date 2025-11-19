import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY);

interface SendMailProps {
  to: string;
  subject: string;
  html: string;
}

export async function sendMail({ to, subject, html }: SendMailProps) {
  try {
    const response = await resend.emails.send({
      from: "Payzap <onboarding@manvir.site>",
      to,
      subject,
      html,
    });
    if (response.error) return { success: false, error: response.error };
    return { success: true };
  } catch (error) {
    console.log("MAIL_ERROR:", error);
    return { success: false, error };
  }
}
