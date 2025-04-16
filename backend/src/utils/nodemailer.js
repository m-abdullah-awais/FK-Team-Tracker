import nodemailer from "nodemailer";

const transporter = nodemailer.createTransport({
    service: "gmail",
    auth: {
        user: process.env.USER_EMAIL,
        pass: process.env.USER_APP_PASSWORD
    }
});

export const send_Mail = async (receiverEmail, subject, text) => {
    const mailOptions = {
        from: process.env.USER_EMAIL,
        to: receiverEmail,
        subject,
        text
    };

    return transporter.sendMail(mailOptions);
};
