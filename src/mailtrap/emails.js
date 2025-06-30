import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 587,
  auth: {
    user: process.env.MAILTRAP_USER,
    pass: process.env.MAILTRAP_PASS,
  },
});

export const sendVerificationEmail = async (email, code) => {
  const message = {
    from: "no-reply@yalm.app",
    to: email,
    subject: "Verify Your Email",
    text: `Your verification code is: ${code}`,
    html: `<p>Thank you for signing up!</p><p>Your verification code is: <strong>${code}</strong></p>`
  };

  await transporter.sendMail(message);
};

export async function sendPasswordResetEmail(email, code) {
  await transporter.sendMail({
    from: '"Yalm Support" <support@yalm.app>',
    to: email,
    subject: "Reset your password",
    text: `Use this code to reset your password: ${code}`,
    html: `<p>Use this code to reset your password:</p><h2>${code}</h2>`,
  });
};

