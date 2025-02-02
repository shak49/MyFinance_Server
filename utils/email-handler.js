//
//
//
import nodemailer from 'nodemailer';

const env = process.env;

export const sendEmail = async (email, subject, link) => {
    try {
        const transporter = nodemailer.createTransport({
            sendmail: true,
            newline: 'unix',
            path: '/usr/sbin/sendmail'
        });
        await transporter.sendMail({
            from: 'Shak Feizi',
            to: email,
            subject: subject,
            text: `<a href=${link}>Reset Password</a>`,
        });
        console.log("email was sucessfully sent!");
    } catch (error) {
        console.log(error, "email was not sent!");
    }
};