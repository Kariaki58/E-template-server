import User from "../../models/users.mjs";
import { generateToken } from "../../middleware/auth.mjs";
import bcrypt from 'bcryptjs';

export const login = async (req, res) => {
    const { email, password } = req.body;

    try {
        const user = await User.findOne({ email }).select('password isAdmin').exec();
        if (!user) {
            return res.status(400).json({ error: 'User not found' });
        }

        // Check if password matches
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ error: 'Invalid email or password' });
        }

        // Generate token
        const token = generateToken(user._id);
        const isAdmin = user.isAdmin;

        // Set cookie
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 2592000000
        });

        // Send response
        return res.json({ message: 'User login successful', token, isAdmin });

    } catch (error) {
        console.error('Error during login:', error);
        return res.status(500).json({ error: 'Internal server error' });
    }
};
