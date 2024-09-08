import { sendEmail } from "../Subscriber.mjs"
import Email from "../../models/emailList.mjs"
import User from "../../models/users.mjs"

export const sendEmailToCustomer = async (req, res) => {
    const { body: { subject, message }} = req
    const user = req.user


    if (!subject) {
        return res.status(400).send({ error: "subject is required" })
    }
    if (!message) {
        return res.status(400).send({ error: "message is required" })
    }
    if (typeof subject !== 'string') {
        return res.status(400).send({ error: "subject must be a string" })
    }
    if (typeof message !== 'string') {
        return res.status(400).send({ error: "message must be a string" })
    }

    const adminUserEmail = await User.findOne( { _id: user })
    try {

        const emails = await Email.find({});
        for (const { email } of emails) {
            if (adminUserEmail.email === email) {
                continue
            }
            const result = await sendEmail(process.env.ADDRESS, subject, email, message);
            if (result && result.error) {
                continue
            }
        }
        return res.status(200).send({ message: "email sent to customers" })
    } catch (error) {
        return res.status(500).send({ error: "server error" })
    }
}