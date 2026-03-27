const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    secure: true,
    auth: {
        user: "tempmail72553@gmail.com",
        pass: "nvtgsjqpsuzbladd"
    }
})

async function sendMail(to, subject, text, html = "") {
    try {
        const mailOptions = {
            from: '"PixelBOX" <tempmail72553@gmail.com>',
            to,
            subject,
            text,
        };

        if (html) mailOptions.html = html;

        const info = await transporter.sendMail(mailOptions);
        console.log("Message sent: %s", info.messageId);
    } catch (err) {
        console.error("Error while sending mail:", err);
    }
}
module.exports = {sendMail}