import Email from "../../models/emailList.mjs";
import { sendEmail } from "../Subscriber.mjs";


export const SubscribeToNewsLetter = async (req, res) => {
    const requestBody = req.body

    if (!requestBody.email) {
        console.log("here")
        return res.status(400).send({ error: "please provide your email" })
    }

    try {
        const template = `<!DOCTYPE html>
                <html lang="en">
                <head>
                    <meta charset="UTF-8">
                    <meta name="viewport" content="width=device-width, initial-scale=1.0">
                    <title>Welcome to Our Newsletter</title>
                    <style>
                        body {
                            font-family: Arial, sans-serif;
                            background-color: #f4f4f4;
                            margin: 0;
                            padding: 0;
                        }
                        .container {
                            max-width: 600px;
                            margin: 0 auto;
                            background-color: #ffffff;
                            padding: 20px;
                            border-radius: 8px;
                            box-shadow: 0 0 10px rgba(0, 0, 0, 0.1);
                        }
                        .header {
                            text-align: center;
                            padding: 10px 0;
                        }
                        .header img {
                            max-width: 150px;
                        }
                        .content {
                            padding: 20px;
                            text-align: center;
                        }
                        .content h1 {
                            font-size: 24px;
                            margin-bottom: 20px;
                        }
                        .content p {
                            font-size: 16px;
                            line-height: 1.5;
                            color: #333333;
                        }
                        .button {
                            display: inline-block;
                            margin-top: 20px;
                            padding: 12px 24px;
                            background-color: #007BFF;
                            color: #ffffff;
                            text-decoration: none;
                            border-radius: 4px;
                        }
                        .footer {
                            text-align: center;
                            padding: 20px;
                            font-size: 14px;
                            color: #888888;
                        }
                        .footer a {
                            color: #007BFF;
                            text-decoration: none;
                        }
                    </style>
                </head>
                <body>
                    <div class="container">
                        <div class="header">
                            <img src="https://via.placeholder.com/150" alt="Company Logo">
                        </div>
                        <div class="content">
                            <h1>Welcome to OverLow!</h1>
                            <p>Hi there,</p>
                            <p>Thank you for subscribing to our newsletter! We're excited to have you on board. You'll now be the first to hear about our latest updates, exclusive offers, and more.</p>
                            <p>Stay tuned for our upcoming newsletters where we'll share insightful content, industry news, and special promotions just for you.</p>
                            <a href="https://kariaki.vercel.app/" class="button">Visit Our Website</a>
                        </div>
                        <div class="footer">
                            <p>If you have any questions or need assistance, feel free to <a href="mailto:[Your Contact Email]">contact us</a>.</p>
                            <p>&copy; 2024 Overflow. All rights reserved.</p>
                            <p><a href="[Unsubscribe Link]">Unsubscribe</a></p>
                        </div>
                    </div>
                </body>
                </html>
        `
        const Sendder = process.env.ADDRESS
        const recieverEmail = requestBody.email

        const response = sendEmail(Sendder, 'Thank you for subscribing to our newsletter', recieverEmail, template)

        if (response) {
            return res.status(500).send({ error: "sorry an error occured" })
        }
        let findEmail = await Email.findOne({ email: recieverEmail })
        if (findEmail) {
            return res.status(200).send({ message: "We are sure to give you the best offer" })
        } else {
            findEmail = new Email({ email: recieverEmail })
        }
        return res.status(200).send({ message: "Thanks for subscribing, We are sure to give you the best offer" })
    } catch (error) {
        return res.status(500).send({ error: "sorry an error occured" })
    }
}