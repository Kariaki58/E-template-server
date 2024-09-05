import User from "../../models/users.mjs";
import bcrypt from 'bcryptjs';
import { generateToken } from "../../middleware/auth.mjs";
import Email from "../../models/emailList.mjs";
import Cart from "../../models/carts.mjs";


export const register = async (req, res) => {
    try {
        const { email, password, checkLocalCart } = req.body;

        // Validate input
        if (!email || !password) {
            return res.status(400).json({ error: 'Email and password are required' });
        }

        if ((checkLocalCart && !Array.isArray(checkLocalCart)) || (checkLocalCart && checkLocalCart.length <= 0)) {
            return res.status(400).send({ error: "checkLocalCart must be an array" })
        }

        // Ensure email is unique across both collections
        const [userExists, emailExists] = await Promise.all([
            User.findOne({ email }).exec(),
            Email.findOne({ email }).exec()
        ]);


        if (userExists) {
            return res.status(400).json({ error: 'User already exists' });
        }

        // Hash password securely
        const hashedPassword = await bcrypt.hash(password, 10);
        
        // Create and save new user
        const newUser = new User({ email, password: hashedPassword });
        await newUser.save();

        // Save email to the Email collection
        if (!emailExists) {
            const saveUserEmail = new Email({ email });
            await saveUserEmail.save();
        }

        if (checkLocalCart && checkLocalCart.length > 0) {
            const cartData = {
                userId: '',
                items: [],
                totalPrice: 0
            }
            let calTotalPrice = 0
            checkLocalCart.forEach(items => {
                calTotalPrice += items.price * items.quantity

                cartData.items.push({
                    productId: items.productId._id,
                    size: items.size,
                    color: items.color,
                    quantity: items.quantity,
                    price: items.price
                })
            })
            cartData.totalPrice = calTotalPrice
            cartData.userId = newUser._id


            const saveLocalCartInDb = new Cart(cartData)

            await saveLocalCartInDb.save()
        }

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
