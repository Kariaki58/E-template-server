import Order from "../../../models/orders.mjs"
import Address from "../../../models/address.mjs";
import Cart from "../../../models/carts.mjs";


export const addOrder = async (req, res) => {
  const { user: userId, body: { cartId, status, shippingDetails:shippingAddress } } = req;

  
  try {
    let findAddress = await Address.findOne({ userId });
    const findCart = await Cart.findById(cartId).populate('items.productId')
    if (findAddress) {
      findAddress.userId = userId,
      findAddress.address = shippingAddress.address;
      findAddress.city = shippingAddress.city;
      findAddress.state = shippingAddress.state;
      findAddress.zipCode = shippingAddress.zip;
      findAddress.country = shippingAddress.country;
      findAddress.phoneNumber = shippingAddress.phone;
      findAddress.email = shippingAddress.email;
      findAddress.name = shippingAddress.name;
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
          name: shippingAddress.name
        });
      }

    const savedAddress = await findAddress.save()


    let newOrder = []
    findCart.items.forEach(async (item) => {
      newOrder = new Order({
        userId,
        color: item.color,
        size: item.size,
        quantity: item.quantity,
        shippingAddress: savedAddress._id,
        price: item.productId.price * item.quantity
      })
      await newOrder.save()
    })
    await Cart.findOneAndDelete({ cartId })
    res.status(201).send({ message: 'Order placed successfully', order: newOrder });
  } catch (error) {
    res.status(500).send({ error: 'Error placing order' });
  }
};


export const getUserOrders = async (req, res) => {
  const { user: userId } = req;
  try {
    const orders = await Order.find({ userId }).populate('shippingAddress');
    res.status(200).send(orders);
  } catch (error) {
    res.status(500).send({ error: 'Error fetching orders' });
  }
};
  
export const getAllOrders = async (req, res) => {
  try {
      const orders = await Order.find({}).populate('shippingAddress');

      res.status(200).send(orders);
  } catch (error) {
      res.status(500).send({ error: 'Error fetching orders' });
  }
};

export const getUserAddress = async (req, res) => {
  const { orderId } = req.params; //is actually the address id
  try {
      const address = await Address.findOne({ _id: orderId }).exec();
    
      if (!address) {
          return res.status(404).send({ error: 'Address not found' });
      }
      res.status(200).send(address);
  } catch (error) {
      res.status(500).send({ error: 'Error fetching address' });
  }
};
