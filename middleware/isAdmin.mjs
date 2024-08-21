import User from "../models/users.mjs"


export const isAdmin = async (req, res, next) => {
    const { user } = req

    if (!user) {
        return res.status(400).send({message: "you are not loged in"})
    }
    const verifyAdmin = await User.findOne({ _id: user }).select('-password')
    if (!verifyAdmin || !verifyAdmin.isAdmin) {
        return res.status(400).send({message: "unauthorize opperation"})
    }
    next()
}