import Product from "../../../models/products.mjs";
import Address from "../../../models/address.mjs";
import Order from "../../../models/orders.mjs";
import jwt from 'jsonwebtoken';

export const nonAuthOrder = async (req, res) => {
    let { user: userId, body: { color, size, quantity, productId, shippingDetails: shippingAddress } } = req;
    const token = req.cookies.token || req.cookies._auth;

    try {
        if (token) {
            const user = jwt.verify(token, process.env.JWT_SECRET);
            userId = user._id;
        }
    } catch (err) {
        return res.status(403).send({ error: "Invalid or expired token" });
    }

    try {
        let findAddress = await Address.findOne({ userId }).lean();

        if (findAddress) {
            findAddress = await Address.findByIdAndUpdate(findAddress._id, {
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zip,
                country: shippingAddress.country,
                phoneNumber: shippingAddress.phone,
                email: shippingAddress.email,
                name: shippingAddress.name,
            }, { new: true });
        } else {
            findAddress = new Address({
                userId,
                address: shippingAddress.address,
                city: shippingAddress.city,
                state: shippingAddress.state,
                zipCode: shippingAddress.zip,
                country: shippingAddress.country,
                phoneNumber: shippingAddress.phone,
                email: shippingAddress.email,
                name: shippingAddress.name,
            });
            await findAddress.save();
        }

        quantity = parseInt(quantity, 10);
        if (isNaN(quantity) || quantity <= 0) {
            return res.status(400).send({ error: "Quantity must be a positive number" });
        }

        const product = await Product.findById(productId).lean();
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        const totalAmount = quantity * (product.price - (product.price * (product.percentOff / 100)));
        const newOrder = new Order({
            userId,
            color,
            size,
            quantity,
            shippingAddress: findAddress._id,
            price: totalAmount
        });

        await newOrder.save();
        res.status(201).send({ message: 'Order placed successfully', order: newOrder });

    } catch (error) {
        res.status(500).send({ error: 'Error placing order' });
    }
};
