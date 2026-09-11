import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASSWORD,
  },
});

const sendPasswordResetEmail = async (
  email,
  resetUrl
) => {
  await transporter.sendMail({
    from: `"ProjectFlow" <${process.env.EMAIL_USER}>`,
    to: email,
    subject: "Reset your ProjectFlow password",

    html: `
      <div style="
        font-family: Arial, sans-serif;
        max-width: 600px;
        margin: auto;
        padding: 30px;
        color: #1e293b;
      ">

        <h2 style="margin-bottom: 10px;">
          Reset your ProjectFlow password
        </h2>

        <p>
          We received a request to reset your password.
        </p>

        <p>
          Click the button below to create a new password.
        </p>

        <a
          href="${resetUrl}"
          style="
            display: inline-block;
            margin: 20px 0;
            padding: 12px 22px;
            background: #4f6ff5;
            color: white;
            text-decoration: none;
            border-radius: 8px;
          "
        >
          Reset Password
        </a>

        <p style="color: #64748b;">
          This link will expire in 15 minutes.
        </p>

        <p style="color: #94a3b8; font-size: 13px;">
          If you did not request a password reset,
          you can safely ignore this email.
        </p>

      </div>
    `,
  });
};

export { sendPasswordResetEmail };