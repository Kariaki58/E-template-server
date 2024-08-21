import Cart from "../../../models/carts.mjs"
import Product from "../../../models/products.mjs";

export const incrementCart = async (req, res) => {
    const { body: { productId, quantity, pos } } = req

    const user = req.user

    if (!productId || !quantity || pos === undefined) {
        console.log("failed checking")
        return res.status(400).send({ error: "productId, pos and quantity are required" });
    }

    if (!user) {
        return res.status(401).send({ error: "You are not logged in" });
    }

    let cart = await Cart.findOne({ userId: user }).populate('items.productId');

    if (!cart) {
        return res.status(400).send({ error: "item not present in your cart"})
    }
    const product = await Product.findById(productId);
    if (!product) {
        return res.status(404).send({ error: "Product not found" });
    }

    if (typeof quantity !== 'number' || quantity <= 0) {
        return res.status(400).send({ error: "Quantity must be a positive number" });
    }


    if (pos > -1) {
        cart.items[pos].quantity += quantity;
        cart.items[pos].price = product.price;
    } else {
        return res.status(400).send({ error: "invalid position"})
    }
    
    cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);
    await cart.save();

    return res.status(200).send({ message: "quantity updated successfully", cart });
}
