import Email from "../../models/emailList.mjs";
import User from "../../models/users.mjs";
import crypto from 'crypto'
import { sendEmail } from "../Subscriber.mjs";
import { SubscribeToNewsLetterTemplate } from "./emailTemplates.mjs";


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
        const template = SubscribeToNewsLetterTemplate(unsubscribeLink)

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
