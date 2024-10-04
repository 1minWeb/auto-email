import { NextRequest } from "next/server";
import nodemailer from "nodemailer";
import { Pool } from "pg";
import cron from "node-cron";

interface SMTPDetails {
  host: string;
  port: number;
  secure: boolean;
  user: string;
  pass: string;
}

interface EmailDetails {
  from: string;
  subject: string;
  body: string;
}

interface Recipient {
  email: string;
}

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
});

export async function POST(req: NextRequest) {
  try {
    const {
      smtpDetails,
      emailDetails,
      recipients,
      sendAsGroup,
      scheduleEmail,
      scheduleDate,
    } = await req.json();

    const sendEmails = async () => {
      try {
        const transporter = nodemailer.createTransport({
          host: smtpDetails.host,
          port: smtpDetails.port,
          secure: smtpDetails.secure,
          auth: {
            user: smtpDetails.user,
            pass: smtpDetails.pass,
          },
        });

        let toField = recipients.map((r: Recipient) => r.email).join(", ");

        let emailContent = {
          from: emailDetails.from,
          to: sendAsGroup ? toField : undefined, // Group recipients if sendAsGroup is true
          subject: emailDetails.subject,
          html: emailDetails.body,
        };

        if (sendAsGroup) {
          // Send as group
          await transporter.sendMail(emailContent);
        } else {
          // Send individually
          for (const recipient of recipients) {
            const trackingLink = `${
              process.env.APP_URL
            }/api/trackClick?email=${encodeURIComponent(
              recipient.email
            )}?subject=${emailContent.subject}`;
            const htmlBody = emailDetails.body.replace(/\n/g, "<br>"); // Replace \n with <br> for HTML

            await transporter.sendMail({
              ...emailContent,
              to: recipient.email,
              html: `${htmlBody}<br/>Please continue the process mentioned above from here : <a href="${trackingLink}">Click here</a>`,
            });
          }
        }

        console.log("Emails sent successfully!");
        return new Response(
          JSON.stringify({ message: "Emails sent successfully!" }),
          { status: 200 }
        );
      } catch (error: any) {
        console.error("Error sending emails:", error);
        return new Response(
          JSON.stringify({
            message: "Error sending emails.",
            error: error.message,
          }),
          { status: 500 }
        );
      }
    };

    // Handle scheduling logic
    if (scheduleEmail && scheduleDate) {
      const date = new Date(scheduleDate);
      const cronTime = `${date.getMinutes()} ${date.getHours()} ${date.getDate()} ${
        date.getMonth() + 1
      } *`;

      cron.schedule(cronTime, async () => {
        try {
          await sendEmails();
        } catch (error) {
          console.error("Error during scheduled email sending:", error);
        }
      });

      // Return response immediately after scheduling the email
      return new Response(
        JSON.stringify({ message: `Email scheduled for ${scheduleDate}` }),
        { status: 200 }
      );
    }

    // Send emails immediately if not scheduled
    return await sendEmails();
  } catch (error: any) {
    console.error("Error in API route:", error);
    return new Response(
      JSON.stringify({ message: "Invalid request", error: error.message }),
      { status: 400 }
    );
  }
}
