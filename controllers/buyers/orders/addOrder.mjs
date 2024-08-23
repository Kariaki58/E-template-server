import Order from "../../../models/orders.mjs"
import Cart from "../../../models/carts.mjs";
import Address from "../../../models/address.mjs";

export const addOrder = async (req, res) => {
  const { user: userId, body: { status, cartId, shippingDetails:shippingAddress } } = req;


  try {
    const cart = await Cart.findById(cartId);
    if (!cart) {
      return res.status(404).send({ error: 'Cart not found' });
    }

    const userAddress = new Address({
        name: shippingAddress.name,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zip: shippingAddress.zip,
        phoneNumber: shippingAddress.phone,
        country: shippingAddress.country,
        userId
    })

    const savedAddress = await userAddress.save()


    const totalAmount = cart.totalPrice;
    const newOrder = new Order({
      userId,
      cartId,
      shippingAddress: savedAddress._id,
      totalAmount
    });
    // when the admin comfirm the order, the status would be Paid
    await newOrder.save();
    res.status(201).send({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).send({ error: 'Error placing order' });
  }
};


export const getUserOrders = async (req, res) => {
    const { user: userId } = req;

    try {
      const orders = await Order.find({ userId }).populate('cartId shippingAddress');
      res.status(200).send(orders);
    } catch (error) {
      res.status(500).send({ error: 'Error fetching orders' });
    }
  };
  
export const getAllOrders = async (req, res) => {
    try {
        const orders = await Order.find().populate('userId cartId shippingAddress');

        res.status(200).send(orders);
    } catch (error) {
        res.status(500).send({ error: 'Error fetching orders' });
    }
};

export const getUserAddress = async (req, res) => {
  const { userId } = req.params;
  try {
      const address = await Address.findOne({ userId }).exec();
      if (!address) {
          return res.status(404).send({ error: 'Address not found' });
      }
      res.status(200).send(address);
  } catch (error) {
      res.status(500).send({ error: 'Error fetching address' });
  }
};
