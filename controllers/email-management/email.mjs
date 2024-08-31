import { sendEmail } from "../Subscriber.mjs"
import User from "../../models/users.mjs"

export const emailAutomate = async (req, res) => {
    const requestBody = req.body

    if (!requestBody.subject || !requestBody.message || !requestBody.userEmail) {
        return res.status(400).send({ error: "please all input is request" })
    }
    
    try {
        const findAdmin = await User.findOne({ isAdmin: true }).select('-password')

        const { subject, message, userEmail } = requestBody

        const feedback = sendEmail(userEmail, subject, findAdmin.email, message)

        if (!feedback) {
            return res.status(200).send({ message: "Email sent successfully"})
        }
        return res.status(500).send({ error: "could not send email please try again!" })
    } catch (error) {
        return res.status(500).send({ error: "could not send email please try again!"})
    }
}
