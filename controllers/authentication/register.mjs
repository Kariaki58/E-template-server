import User from "../../models/users.mjs"
import bcrypt from 'bcryptjs'
import { generateToken } from "../../middleware/auth.mjs"


export const register = async (req, res) => {
    const { body: { email, password } } = req
    const userExits = await User.findOne({ email })
    if (userExits) {
        return res.status(400).send({ message: 'User already exists' })
    }
    const hashedPassword = await bcrypt.hash(password, 10)
    
    const newUser = new User({ email, password: hashedPassword })

    await newUser.save()
    const token = generateToken(email)
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });
    return res.status(201).json({ message: 'User registerd successfully', token })
}
