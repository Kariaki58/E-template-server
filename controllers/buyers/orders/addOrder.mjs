import Order from "../../../models/orders.mjs";
import Address from "../../../models/address.mjs";
import Cart from "../../../models/carts.mjs";
import mongoose from "mongoose";
import Product from "../../../models/products.mjs";
import { sendEmail } from "../../Subscriber.mjs";
import { generateEmailTemplate } from "../../email-management/emailTemplates.mjs";


export const addOrder = async (req, res) => {
    const { user: userId, body: { cartId, shippingDetails } } = req;

    if (!cartId || !shippingDetails.address || !shippingDetails.city || !shippingDetails.state  ||
        !shippingDetails.country || !shippingDetails.phone || !shippingDetails.email || !shippingDetails.name
    ) {
        return res.status(400).send({ error: "all input are required" })
    }

    if (!mongoose.isValidObjectId(cartId)) {
        return res.status(400).send({ error: "not a valid mongodb id" })
    }
    try {
        Object.values(shippingDetails).forEach(other => {
            if (typeof other !== 'string') {
                throw new Error('all input must be string')
            }
        });
    } catch (error) {
        return res.status(400).send(error.message)
    }
    try {
        const findCart = await Cart.findById(cartId).populate('items.productId');
        if (!findCart) {
            return res.status(404).send({ error: 'Cart not found' });
        }

        let findAddress = await Address.findOneAndUpdate(
            { userId },
            {
                address: shippingDetails.address,
                city: shippingDetails.city,
                state: shippingDetails.state,
                zipCode: shippingDetails.zip,
                country: shippingDetails.country,
                phoneNumber: shippingDetails.phone,
                email: shippingDetails.email,
                name: shippingDetails.name
            },
            { new: true, upsert: true }
        );

        const orders = findCart.items.map(item => ({
            userId,
            color: item.color,
            size: item.size,
            quantity: item.quantity,
            shippingAddress: findAddress._id,
            price: (item.productId.price - (item.productId.price * (item.productId.percentOff / 100))) * item.quantity
        }));

        await Order.insertMany(orders);

        findCart.items.map(async(item) => {
            const productStock = await Product.findById(item.productId._id)
            productStock.stock -= item.quantity
            await productStock.save()
        })
        console.log(findCart.items)
        const template = generateEmailTemplate(shippingDetails.name, findCart.items, shippingDetails, findCart.totalPrice, process.env.ADDRESS)
        const subjectLine = "Thank You for Your Order! 🎉";
        const result = await sendEmail(process.env.ADDRESS, subjectLine, shippingDetails.email, template)


        if (result && result.error) {
            return res.status(500).send({ error: "An unexpected error occured while sending email" })
        }
        await Cart.findByIdAndDelete(cartId);

        res.status(201).send({ message: 'Order placed successfully', orders });
    } catch (error) {
        res.status(500).send({ error: 'Error placing order', details: error.message });
    }
};

export const getUserOrders = async (req, res) => {
    const { user: userId } = req;
    try {
        const orders = await Order.find({ userId }).populate('shippingAddress').exec();
        
        res.status(200).send({ orders });
    } catch (error) {
        res.status(500).send({ error: 'Error fetching orders', details: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('shippingAddress').exec();
        res.status(200).send({ orders });
    } catch (error) {
        res.status(500).send({ error: 'Error fetching orders', details: error.message });
    }
};

export const getUserAddress = async (req, res) => {
    const { orderId } = req.params;
    try {
        const address = await Address.findById(orderId).exec();
        if (!address) {
            return res.status(404).send({ error: 'Address not found' });
        }
        res.status(200).send(address);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching address', details: error.message });
    }
};
