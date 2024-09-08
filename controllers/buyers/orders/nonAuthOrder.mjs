import Product from "../../../models/products.mjs";
import Address from "../../../models/address.mjs";
import Order from "../../../models/orders.mjs";
import mongoose from "mongoose";
import jwt from 'jsonwebtoken';
import { sendEmail } from "../../Subscriber.mjs";
import { generateEmailTemplate, generateSimpleSellerNotificationTemplate } from "../../email-management/emailTemplates.mjs";


export const nonAuthOrder = async (req, res) => {
    let { user: userId, body: { color, size, quantity, productId, shippingDetails: shippingAddress, totalAmount } } = req;
    const token = req.cookies.token || req.cookies._auth;

    if (!totalAmount) {
        return res.sendStatus(400)
    }

    if (color && typeof color !== 'string') {
        return res.status(400).send({ error: "color must be a string" })
    }
    if (size && typeof size !== 'string') {
        return res.status(400).send({ error: "size must be a string" })
    }

    if (!quantity) {
        return res.status(400).send({ error: "quantity is required" })
    }
    if (!productId) {
        return res.status(400).send({ error: "product id is required" })
    }
    if (!mongoose.isValidObjectId(productId)) {
        return res.status(400).send({ error: "product Id is not a valid object id"})
    }

    if (!shippingAddress.address || !shippingAddress.city || !shippingAddress.state  ||
        !shippingAddress.country || !shippingAddress.phone || !shippingAddress.email || !shippingAddress.name
    ) {
        return res.status(400).send({ error: "all input are required" })
    }

    Object.values(shippingAddress).forEach(other => {
        if (typeof other !== 'string') {
            return res.status(400).send({ error: "all field must be a string" })
        }
    })
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

        const product = await Product.findById(productId);
        if (!product) {
        return res.status(404).send({ error: "Product not found" });
        }

        // Proceed with creating the new order
        const newOrder = new Order({
        productName: product.name,
        userId,
        color,
        size,
        quantity,
        shippingAddress: findAddress._id,
        price: Number(totalAmount) / 100
        });

        await newOrder.save();

        // Update product stock and save
        product.stock -= quantity;
        await product.save();  // No error here, since `product` is a Mongoose document

        const template = generateEmailTemplate(shippingAddress.name, process.env.ADDRESS)
        const subjectLine = "Thank You for Your Order! 🎉";
        const result = await sendEmail(process.env.ADDRESS, subjectLine, shippingAddress.email, template)

        const notifyTemplateSeller = generateSimpleSellerNotificationTemplate()

        const SellerResult = await sendEmail(process.env.ADDRESS, "Order Alert: A Customer Just Placed an Order!", process.env.ADDRESS, notifyTemplateSeller)
        if ((result && result.error) || (SellerResult && SellerResult.error)) {
            return res.status(500).send({ error: "An unexpected error occured while sending email" })
        }

        res.status(201).send({ message: 'Order placed successfully', order: newOrder });

    } catch (error) {
        res.status(500).send({ error: 'Error placing order' });
    }
};
