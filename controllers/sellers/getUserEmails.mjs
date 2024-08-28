import User from "../../models/users.mjs"


export const getUserEmails = async (req, res) => {
    try {
        const Emails = await User.find({})

        return res.status(200).send({ emails: Emails })
    } catch (error) {
        return res.status(500).send({ error: "sever error" })
    }
}