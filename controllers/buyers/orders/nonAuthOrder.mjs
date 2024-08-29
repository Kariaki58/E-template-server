import Product from "../../../models/products.mjs";
import Address from "../../../models/address.mjs";
import Order from "../../../models/orders.mjs";
import jwt from 'jsonwebtoken'



export const nonAuthOrder = async (req, res) => {
    let { user: userId, body: { color, size, quantity, productId, shippingDetails:shippingAddress } } = req;

    const token = req.cookies.token || req.cookies._auth
    
    try {
      jwt.verify(token, process.env.JWT_SECRET, (err, user) => {
        if (err) {
            return res.sendStatus(403)
        }
        userId = user._id
      }) 
    } catch (err) {

    }

    let findAddress = await Address.findOne({ userId });

    try {
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

      try {
        quantity = Number(quantity)
      } catch (err) {
        return res.status(400).send({ error: "quantity must be a number"})
      }

      const savedAddress = await findAddress.save()


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
  