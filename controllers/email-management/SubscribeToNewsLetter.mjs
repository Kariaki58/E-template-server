import Email from "../../models/emailList.mjs";
import User from "../../models/users.mjs";
import crypto from 'crypto'
import { sendEmail } from "../Subscriber.mjs";


function generateUnsubscribeToken() {
    return crypto.randomBytes(20).toString('hex');
}


export const UnsubscribeEndpoint = (req, res) => async (req, res) => {
    try {
        const { token } = req.params;

        // Find the user by the unsubscribe token
        const email = await Email.findOne({
            unsubscribeToken: token,
            unsubscribeTokenExpiry: { $gt: Date.now() } // Ensure token is not expired
        });

        if (!email) {
            return res.status(400).send('Invalid or expired unsubscribe link.');
        }

        // Update the email's subscription status
        email.isSubscribed = false;
        email.unsubscribeToken = null; // Optionally, remove the token after use
        email.unsubscribeTokenExpiry = null; // Clear the expiry time
        await email.save();

        res.send('You have successfully unsubscribed from our mailing list.');
    } catch (error) {
        res.status(500).send('An error occurred. Please try again.');
    }
}

export const SubscribeToNewsLetter = async (req, res) => {
    const { email: recieverEmail } = req.body;

    if (!recieverEmail) {
        return res.status(400).send({ error: "Please provide your email." });
    }
    const token = generateUnsubscribeToken();

    const unsubscribeLink = `${process.env.FRONTEND}/unsubscribe/${token}`

    try {
        const template = `<!DOCTYPE html>
            <html lang="en">
            <head>
                <meta charset="UTF-8">
                <meta name="viewport" content="width=device-width, initial-scale=1.0">
                <title>Welcome to Our Newsletter</title>
                <style>
                    body { font-family: Arial, sans-serif; background-color: #f4f4f4; margin: 0; padding: 0; }
                    .container { max-width: 600px; margin: 0 auto; background-color: #ffffff; padding: 20px; border-radius: 8px; box-shadow: 0 0 10px rgba(0, 0, 0, 0.1); }
                    .header { text-align: center; padding: 10px 0; }
                    .header img { max-width: 150px; }
                    .content { padding: 20px; text-align: center; }
                    .content h1 { font-size: 24px; margin-bottom: 20px; }
                    .content p { font-size: 16px; line-height: 1.5; color: #333333; }
                    .button { display: inline-block; margin-top: 20px; padding: 12px 24px; background-color: #007BFF; color: #ffffff; text-decoration: none; border-radius: 4px; }
                    .footer { text-align: center; padding: 20px; font-size: 14px; color: #888888; }
                    .footer a { color: #007BFF; text-decoration: none; }
                    p a { color: "blue"; text-decoration: none; }
                </style>
            </head>
            <body>
                <div class="container">
                    <div class="header"><img src="https://via.placeholder.com/150" alt="Company Logo"></div>
                    <div class="content">
                        <h1>Welcome to OverLow!</h1>
                        <p>Hi there,</p>
                        <p>Thank you for subscribing to our newsletter! We're excited to have you on board. You'll now be the first to hear about our latest updates, exclusive offers, and more.</p>
                        <p>Stay tuned for our upcoming newsletters where we'll share insightful content, industry news, and special promotions just for you.</p>
                        <a href="https://kariaki.vercel.app/" class="button">Visit Our Website</a>
                    </div>
                    <div class="footer">
                        <p>If you have any questions or need assistance, feel free to <a href=mailto:${process.env.ADDRESS}>contact us</a>.</p>
                        <p>&copy; 2024 Overflow. All rights reserved.</p>
                        <p><a href="${unsubscribeLink}">Unsubscribe</a></p>
                    </div>
                </div>
            </body>
            </html>
        `;

        const senderEmail = process.env.ADDRESS;
        const emailSent = await sendEmail(senderEmail, 'Thank you for subscribing to our newsletter', recieverEmail, template);

        if (!emailSent) {
            let existingEmail = await Email.findOne({ email: recieverEmail });
            if (existingEmail) {
                return res.status(200).send({ message: "We are sure to give you the best offer." });
            }

            const newEmail = new Email({ email: recieverEmail });
            newEmail.unsubscribeToken = token;
            newEmail.unsubscribeTokenExpiry = tokenExpiry;

            await newEmail.save();

            return res.status(200).send({ message: "Thanks for subscribing, We are sure to give you the best offer." });
        } else {
            return res.status(500).send({ error: "Sorry, an error occurred while sending the email." });
        }

    } catch (error) {
        return res.status(500).send({ error: "Sorry, an error occurred while processing your request." });
    }
};
