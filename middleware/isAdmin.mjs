import User from "../models/users.mjs"


export const isAdmin = async (req, res, next) => {
    const { user: { email } } = req

    if (!email) {
        return res.status(400).send({message: "you are not loged in"})
    }
    const verifyAdmin = await User.findOne({ email })
    if (!verifyAdmin || !verifyAdmin.isAdmin) {
        return res.status(400).send({message: "unauthorize opperation"})
    }
    next()
}