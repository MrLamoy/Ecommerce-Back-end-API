// services/emailService.js
const nodemailer = require('nodemailer');
require('dotenv').config();
const path = require("path");

const transporter = nodemailer.createTransport({
    service: "gmail",
    host: "smtp.gmail.com",
    port: 465,
    secure: true,
    auth: {
        user: process.env.EMAIL_USER,
        pass: process.env.EMAIL_PASSWORD,
    },
});

const sendMail = async (transporter, mailOptions) => {
    try {
        await transporter.sendMail(mailOptions);
        console.log("Email has been sent");
    } catch (error) {
        console.error(error);
    }
};

const sendRegistrationNotification = async (userEmail, userFirstname, userLastname) => {
    const mailOptions = {
        from: {
            name: "csp2-b337-guillen-jubay",
            address: process.env.EMAIL_USER
        },
        to: userEmail,
        subject: "Registration Successful in csp2-b337-guillen-jubay",
        text: `Thank you for registering in csp2-b337-guillen-jubay. Your account is now confirmed, ${userFirstname} ${userLastname}.`,
        html: `
            <html>
                <head>
                    <style>
                        body {
                            font-family: 'Arial', sans-serif;
                            background-color: #f4f4f4;
                            padding: 20px;
                            text-align: center;
                        }
                        h1 {
                            color: #4285f4;
                        }
                        p {
                            color: #333;
                            font-size: 16px;
                            line-height: 1.6;
                        }
                        b {
                            color: #1a73e8;
                        }
                    </style>
                </head>
                <body>
                    <h1>Registration Successful</h1>
                    <p>Dear <b>${userFirstname} ${userLastname}</b>,</p>
                    <p>Thank you for registering in csp2-b337-guillen-jubay. Your account is now confirmed.</p>
                    <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                </body>
            </html>
`,

        attachments: [
                {
                    filename: "",
                    path: path.join(__dirname, "JunelJubay.pdf"),
                    contentType: "application/pdf"
                    //contentType: "image/jpg" 
                }
            ]
    };

    await sendMail(transporter, mailOptions);
};


const sendUpdatePasswordNotification = async (userEmail) => {
    const mailOptions = {
        from: {
            name: "csp2-b337-guillen-jubay",
            address: process.env.EMAIL_USER
        },
        to: userEmail,
        subject: "Update Password Successfully",
        text: "Your password has been updated.",
        html: "<b>Thank you for updating your password.</b>"
    };

    await sendMail(transporter, mailOptions);
};

module.exports = {
    sendRegistrationNotification,
    sendUpdatePasswordNotification,
};
