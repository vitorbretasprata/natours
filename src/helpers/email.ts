import nodemailder from "nodemailer";

const sendEmail = async (options : any) => {
    const transporter = nodemailder.createTransport({
        service: process.env.EMAIL_HOST,
        port: 2525,
        auth: {
            user: process.env.EMAIL_USERNAME,
            pass: process.env.EMAIL_PASSWORD
        }
    });

    const mailOptions = {
        from: "Vitor Bratas <vitorbretsaprata@gmail.com>",
        to: options.email,
        subject: options.subject,
        text: options.message
        //html: 
    }

    await transporter.sendMail(mailOptions);
}

export default sendEmail;