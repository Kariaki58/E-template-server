import User from "../../models/users.mjs";
import bcrypt from 'bcryptjs';
import { generateToken } from "../../middleware/auth.mjs";
import Email from "../../models/emailList.mjs";

export const register = async (req, res) => {
    try {
        const { email, password } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        // Ensure email is unique across both collections
        const [userExists, emailExists] = await Promise.all([
            User.findOne({ email }).exec(),
            Email.findOne({ email }).exec()
        ]);

        if (userExists || emailExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Save email to the Email collection
        const saveUserEmail = new Email({ email });
        await saveUserEmail.save();

        // Generate and send token
        const token = generateToken(newUser._id);
        res.cookie('token', token, {
            httpOnly: true,
            secure: process.env.NODE_ENV === 'production',
            sameSite: 'None',
            maxAge: 2592000000 // 30 days
        });

        return res.status(201).json({ message: 'User registered successfully', token });
    } catch (error) {
        return res.status(500).json({ error: 'Internal server error' });
    }
};
