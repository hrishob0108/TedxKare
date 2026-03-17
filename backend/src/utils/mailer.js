import nodemailer from 'nodemailer';
import dotenv from 'dotenv';
dotenv.config();

// Create a reusable transporter object using the default SMTP transport
const transporter = nodemailer.createTransport({
  service: 'gmail', // Use 'gmail' for simplicity with the app password
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.PASS,
  },
});

export const sendEmail = async (toEmail, subject, bodyText) => {
  try {
    const info = await transporter.sendMail({
      from: `"TEDxKARE" <${process.env.EMAIL_USER}>`, // sender address
      to: toEmail, // list of receivers
      subject: subject, // Subject line
      text: bodyText, // plain text body
      html: bodyText.replace(/\n/g, '<br>'), // html body
    });

    console.log("Message sent: %s", info.messageId);
    return true;
  } catch (error) {
    console.error("Error sending email via nodemailer:", error);
    return false;
  }
};
