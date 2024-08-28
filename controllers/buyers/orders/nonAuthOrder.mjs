import Product from "../../../models/products.mjs";
import Address from "../../../models/address.mjs";
import Order from "../../../models/orders.mjs";



export const nonAuthOrder = async (req, res) => {
    let { user: userId, body: { color, size, quantity, productId, shippingDetails:shippingAddress } } = req;

    try {
      const userAddress = new Address({
        name: shippingAddress.name,
        email: shippingAddress.email,
        address: shippingAddress.address,
        city: shippingAddress.city,
        state: shippingAddress.state,
        zipCode: shippingAddress.zip,
        phoneNumber: shippingAddress.phone,
        country: shippingAddress.country,
        userId
      })

      try {
        quantity = Number(quantity)
      } catch (err) {
        return res.status(400).send({ error: "quantity must be a number"})
      }

      const savedAddress = await userAddress.save()
  
  
      const product = await Product.findById(productId);
      const totalAmount = quantity * product.price
      const newOrder = new Order({
        userId,
        color,
        size,
        quantity,
        shippingAddress: savedAddress._id,
        price: totalAmount
      });
      await newOrder.save();
      res.status(201).send({ message: 'Order placed successfully', order: newOrder });
    } catch (error) {
      res.status(500).send({ error: 'Error placing order' });
    }
  };
  