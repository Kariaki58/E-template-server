import mongoose from 'mongoose';
import Cart from "../../../models/carts.mjs";
import Product from "../../../models/products.mjs";


export const addToCart = async (req, res) => {
    try {
        const userId = req.user;
        const { productId, size, color, quantity = 1 } = req.body;


        // Input validation
        if (!mongoose.Types.ObjectId.isValid(productId)) {
            return res.status(400).json({ error: "Invalid product ID." });
        }

        if (!Number.isInteger(quantity) || quantity <= 0) {
            return res.status(400).json({ error: "Quantity must be a positive integer." });
        }

        // Fetch product details
        const product = await Product.findById(productId).lean();

        if (!product) {
            return res.status(404).json({ error: "Product not found." });
        }

        // Validate size and color if applicable
        if (product.sizes.length && (!size || !product.sizes.includes(size))) {
            return res.status(400).json({ error: "Invalid or missing size selection." });
        }

        if (product.colors.length && (!color || !product.colors.includes(color))) {
            return res.status(400).json({ error: "Invalid or missing color selection." });
        }

        // Check product stock availability
        if (product.stock < quantity) {
            return res.status(400).json({ error: `Only ${product.stock} item(s) available in stock.` });
        }

        // Prepare cart item
        const cartItem = {
            productId: product._id,
            size: size || null,
            color: color || null,
            quantity,
            price: product.price - (product.price * (product.percentOff / 100))
        };


        // Update or create cart atomically
        const updatedCart = await Cart.findOneAndUpdate(
            { userId },
            {
                $inc: { totalPrice: (product.price - (product.price * (product.percentOff / 100))) * quantity },
                $setOnInsert: { items: [] },
                $set: { updatedAt: new Date() }
            },
            { new: true, upsert: true }
        );


        // Check if item already exists in cart
        const existingItemIndex = updatedCart.items.findIndex(item =>
            item.productId.equals(productId) &&
            item.size === (size || null) &&
            item.color === (color || null)
        );

        if (existingItemIndex > -1) {
            // Update existing item quantity
            updatedCart.items[existingItemIndex].quantity += quantity;
        } else {
            // Add new item to cart
            updatedCart.items.push(cartItem);
        }

        // Save updated cart
        await updatedCart.save();

        // Populate product details for response
        await updatedCart.populate({
            path: 'items.productId',
            select: 'name price images'
        });

        return res.status(200).json({
            message: "Product added to cart successfully.",
            cart: updatedCart
        });
    } catch (error) {
        return res.status(500).json({ error: "Internal server error. Please contact support." });
    }
};
