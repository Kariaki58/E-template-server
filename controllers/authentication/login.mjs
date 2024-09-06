import User from "../../models/users.mjs";
import Cart from "../../models/carts.mjs";
import { generateToken } from "../../middleware/auth.mjs";
import bcrypt from 'bcryptjs';
import validator from "validator";

export const login = async (req, res) => {
    const { email, password, checkLocalCart } = req.body;

    if ((checkLocalCart && !Array.isArray(checkLocalCart)) || (checkLocalCart && checkLocalCart.length <= 0)) {
        return res.status(400).send({ error: "checkLocalCart must be an array" })
    }

    if (!email || !password) {
        return res.status(400).send({ error: "email and password is required" })
    }
    if (!validator.isEmail(email)) {
        return res.status(400).send({ error: "not a valid email" })
    }
    if (password.length <= 5) {
        return res.status(400).send({ error: "password is too short" })
    }
    
    try {
        const user = await User.findOne({ email }).select('password isAdmin _id').exec();
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

        // add localstorage to the authenticated user cart in the database
        if (checkLocalCart && checkLocalCart.length > 0) {
            const findUserCart = await Cart.findOne({ userId: user._id })
            if (findUserCart) {
                let calTotalPrice = 0
                checkLocalCart.forEach(items => {
                    calTotalPrice += items.price * items.quantity

                    findUserCart.items.push({
                        productId: items.productId._id,
                        size: items.size,
                        color: items.color,
                        quantity: items.quantity,
                        price: items.price
                    })
                });
                findUserCart.totalPrice += calTotalPrice
            }
            await findUserCart.save()
        }
        
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
        return res.status(500).json({ error: 'Internal server error' });
    }
};
