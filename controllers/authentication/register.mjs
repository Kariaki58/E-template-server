import User from "../../models/users.mjs"
import bcrypt from 'bcryptjs'
import { generateToken } from "../../middleware/auth.mjs"
import Email from "../../models/emailList.mjs"


export const register = async (req, res) => {
    const { body: { email, password } } = req
    const userExits = await User.findOne({ email })
    if (userExits) {
        return res.status(400).send({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new User({ email, password: hashedPassword })
    const saveUserEmail = new Email({ email })

    await newUser.save()
    await saveUserEmail.save()
    const token = generateToken(newUser._id)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        sameSite: 'None',
        maxAge: 2592000000
    });
    return res.status(201).json({ message: 'User registerd successfully', token })
}
