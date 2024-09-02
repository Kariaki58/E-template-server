import Order from "../../../models/orders.mjs";
import Address from "../../../models/address.mjs";
import Cart from "../../../models/carts.mjs";

export const addOrder = async (req, res) => {
    const { user: userId, body: { cartId, shippingDetails } } = req;

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
            price: item.productId.price * item.quantity
        }));

        await Order.insertMany(orders);
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
        
        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching orders', details: error.message });
    }
};

export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find({}).populate('shippingAddress').exec();
        res.status(200).send(orders);
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
