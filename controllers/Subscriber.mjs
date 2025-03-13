import User from "../models/users.mjs";
import Transaction from '../models/transactions.mjs';
import { createTransport } from 'nodemailer';

export const sendEmail = async (email, subject, receiver, template) => {
    try {
        console.log({ email, subject, receiver, template })
        const transporter = createTransport({
            service: process.env.SERVICE,
            auth: {
                user: process.env.EMAIL_SERVER_USER,
                pass: process.env.PASS
            }
        });
        console.log("LINE 15")

        const mailOptions = {
            from: email,
            to: receiver,
            subject,
            html: template
        };

        await transporter.sendMail(mailOptions);
        console.log("LINE 25")
        return null;
    } catch (error) {
        console.log(error)
        return { error: 'An error occurred while sending the email. Please try again later.' };
    }
};

export const Subscriber = async (req, res) => {
    try {
        const { statuserror, reference, status, message, transaction, trxref, email } = req.body;
        const user = req.user;

        if (!statuserror && (!reference || !status || !message || !transaction || !trxref || !email)) {
            return res.status(400).send({ error: 'All transaction details are required' });
        }
        if (!statuserror && (typeof statuserror !== 'string' || typeof reference !== 'string' || typeof status !== 'string' || typeof message !== 'string' || typeof transaction !== 'string' || typeof trxref !== 'string' || typeof email !== 'string')) {
            return res.status(400).send({ error: "all field must be a string" })
        }

        // Fallback values for failed transactions
        const data = statuserror ? {
            reference: 'xxxxxxxxxxxxxxx',
            status: 'failed',
            message: 'xxxxxxxxxxxxxxxxx',
            transaction: 'xxxxxxxxxxxxxxxxxx',
            trxref: 'xxxxxxxxxxxxxxxxx',
            email
        } : { reference, status, message, transaction, trxref, email };

        // Save the transaction
        const transactionRecord = new Transaction(data);
        await transactionRecord.save();

        // Fetch admin users
        const adminUsers = await User.find({ isAdmin: true });

        // Prepare email template
        const template = `
        <h1>Web Customization Paid Request</h1>
        <p>You are assigned to create a website on ${new Date().toLocaleString()}</p>
        <p>Email of the requester: ${email}</p>
        `;

        // Send email notification
        const emailResponse = await sendEmail(email, 'Web Customization Request', process.env.ADDRESS, template);
        if (emailResponse) {
            return res.status(500).send(emailResponse);
        }

        // Handle response based on admin availability
        if (adminUsers.length > 0) {
            return res.status(200).send({ message: "Payment received. We'll get back to you within 24 hours." });
        }

        // If no admins are present, make the current user an admin
        const currentUser = await User.findById(user);
        if (!currentUser) {
            return res.status(404).send({ error: "User not found" });
        }

        currentUser.isAdmin = true;
        await currentUser.save();

        return res.status(200).send({ message: "You now own the site! Please relogin to gain access." });
    } catch (error) {
        return res.status(500).send({ error: "An error occurred. Please contact support for assistance." });
    }
};
