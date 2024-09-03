import { sendEmail } from "../Subscriber.mjs";
import User from "../../models/users.mjs";

export const emailAutomate = async (req, res) => {
    const { subject, message, userEmail } = req.body;

    if (!subject || !message || !userEmail) {
        return res.status(400).send({ error: "Subject, message, and user email are required." });
    }

    try {
        const findAdmin = await User.findOne({ isAdmin: true }).select('email -_id');

        if (!findAdmin) {
            return res.status(404).send({ error: "Admin user not found." });
        }

        const emailSent = await sendEmail(findAdmin.email, subject, userEmail, message);
        if (!emailSent) {
            return res.status(200).send({ message: "Email sent successfully." });
        } else {
            return res.status(500).send({ error: "Could not send email, please try again." });
        }
    } catch (error) {
        console.error("Error sending email:", error);
        return res.status(500).send({ error: "Server error, please try again later." });
    }
};
