import Email from "../../models/emailList.mjs";
import crypto from 'crypto';
import { sendEmail } from "../Subscriber.mjs";
import { SubscribeToNewsLetterTemplate } from "./emailTemplates.mjs";

// Function to generate unsubscribe token
function generateUnsubscribeToken() {
    return crypto.randomBytes(20).toString('hex');
}

// Unsubscribe endpoint
export const UnsubscribeEndpoint = async (req, res) => {
    try {
        const { token } = req.params;

        // Find the user by the unsubscribe token and ensure it's not expired
        const email = await Email.findOne({
            unsubscribeToken: token,
            unsubscribeTokenExpiry: { $gt: Date.now() }
        });

        if (!email) {
            return res.status(400).send('Invalid or expired unsubscribe link.');
        }

        // Update the email's subscription status
        email.isSubscribed = false;
        email.unsubscribeToken = null;
        email.unsubscribeTokenExpiry = null;
        await email.save();

        return res.send('You have successfully unsubscribed from our mailing list.');
    } catch (error) {
        console.error('Error unsubscribing:', error);
        return res.status(500).send('An error occurred. Please try again.');
    }
};

// Subscribe to the newsletter
export const SubscribeToNewsLetter = async (req, res) => {
    const { email: receiverEmail } = req.body;

    if (!receiverEmail) {
        return res.status(400).send({ error: "Please provide your email." });
    }

    const token = generateUnsubscribeToken();
    const tokenExpiry = Date.now() + 24 * 60 * 60 * 1000; // Token valid for 24 hours
    const unsubscribeLink = `${process.env.FRONTEND}/unsubscribe/${token}`;

    try {
        // Check if the email already exists
        let existingEmail = await Email.findOne({ email: receiverEmail });

        if (existingEmail && existingEmail.isSubscribed) {
            return res.status(200).send({ message: "You are already subscribed to our newsletter." });
        }

        // Create or update the email record
        if (!existingEmail) {
            existingEmail = new Email({
                email: receiverEmail,
                unsubscribeToken: token,
                unsubscribeTokenExpiry: tokenExpiry,
                isSubscribed: true
            });
        } else {
            existingEmail.unsubscribeToken = token;
            existingEmail.unsubscribeTokenExpiry = tokenExpiry;
            existingEmail.isSubscribed = true;
        }

        await existingEmail.save();

        // Send the subscription confirmation email
        const template = SubscribeToNewsLetterTemplate(unsubscribeLink);
        const senderEmail = process.env.ADDRESS;
        const emailSent = await sendEmail(senderEmail, 'Thank you for subscribing to our newsletter', receiverEmail, template);

        if (!emailSent) {
            return res.status(200).send({ message: "Thanks for subscribing! We are sure to give you the best offers." });
        } else {
            return res.status(500).send({ error: "An error occurred while sending the confirmation email." });
        }
    } catch (error) {
        console.error(error);
        return res.status(500).send({ error: "Sorry, an error occurred while processing your request." });
    }
};
