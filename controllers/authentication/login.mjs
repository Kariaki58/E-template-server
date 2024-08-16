import User from "../../models/users.mjs";
import { generateToken } from "../../middleware/auth.mjs";
import bcrypt from 'bcryptjs'

export const login = async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) {
        return res.status(400).json({ message: 'Invalid email or password' });
    }

    const token = generateToken(user.email);
    res.cookie('token', token, {
        httpOnly: true,
        secure: process.env.NODE_ENV === 'production',
        maxAge: 3600000
    });
    return res.json({ message: 'User login successfully', token });
}
