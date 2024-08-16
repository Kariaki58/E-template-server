import Cart from "../../../models/carts.mjs";
import Product from "../../../models/products.mjs";

export const addToCart = async (req, res) => {
    try {
        const user = req.user;
        const { productId, size, color, quantity } = req.body;
        
        if (!productId || !quantity) {
            return res.status(400).send({ error: "productId and quantity are required" });
        }

        if (!user) {
            return res.status(401).send({ error: "You are not logged in" });
        }

        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).send({ error: "Product not found" });
        }

        if (typeof quantity !== 'number' || quantity <= 0) {
            return res.status(400).send({ error: "Quantity must be a positive number" });
        }

        if (size && typeof size !== 'string') {
            return res.status(400).send({error: "size must be a string"})
        }
        if (color && typeof color !== "string") {
            return res.status(400).send({error: "color must be a string"})
        }

        let cart = await Cart.findOne({ userId: user });
        if (!cart) {
            cart = new Cart({
                userId: user,
                items: [],
                totalPrice: 0,
            });
        }

        const existingItemIndex = cart.items.findIndex(item => 
            item.productId.toString() === productId &&
            item.size === size &&
            item.color === color
        );

        if (existingItemIndex > -1) {
            cart.items[existingItemIndex].quantity += quantity;
            cart.items[existingItemIndex].price = product.price;
        } else {
            cart.items.push({
                productId,
                size,
                color,
                quantity,
                price: product.price
            });
        }

        cart.totalPrice = cart.items.reduce((total, item) => total + item.price * item.quantity, 0);

        await cart.save();

        res.status(200).send({ message: "Product added to cart successfully", cart });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error, please contact support" });
    }
};
