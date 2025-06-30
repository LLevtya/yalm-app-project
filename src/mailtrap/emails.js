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

export const sendPasswordResetEmail = async (email, link) => {
  const message = {
    from: "no-reply@yalm.app",
    to: email,
    subject: "Reset Your Password",
    html: `<p>You requested a password reset. Click <a href="${link}">here</a> to reset it.</p>`
  };

  await transporter.sendMail(message);
};

export const sendResetSuccessEmail = async (email) => {
  const message = {
    from: "no-reply@yalm.app",
    to: email,
    subject: "Password Reset Successful",
    text: "Your password was successfully reset. If you didn't request this, please contact support."
  };

  await transporter.sendMail(message);
};

export const sendWelcomeEmail = async (email, name) => {
  const message = {
    from: "no-reply@yalm.app",
    to: email,
    subject: "Welcome to Yalm!",
    html: `<h1>Hi ${name},</h1><p>Welcome to Yalm! We’re glad to have you onboard.</p>`
  };

  await transporter.sendMail(message);
};
