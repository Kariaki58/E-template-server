import Product from "../../models/products.mjs";
import Cart from "../../models/carts.mjs";
import Order from "../../models/orders.mjs";
import { removeFromCloudinary } from "../../utils/cloudinary.mjs";
import mongoose from "mongoose";


export const getAllProducts = async (req, res) => {
    try {
        let { page = 1, limit = 10 } = req.query;

        try {
            page = Number(page)
        } catch (error) {
            return res.status(400).send({ error: "page must be a number" })
        }
    
        try {
            limit = Number(limit)
        } catch (error) {
            return res.status(400).send({ error: "limit must be a number" })
        }
        
        if (!Number.isInteger(page) || !Number.isInteger(limit)) {
            return res.status(400).send({error: "page and limit must be an integer"})
        }
        const options = {
            skip: (page - 1) * limit,
            limit: parseInt(limit)
        };

        // Fetch products and total count in parallel
        const [products, total] = await Promise.all([
            Product.find({}, null, options),
            Product.countDocuments()
        ]);
        res.status(200).json({
            products,
            total,
            page: parseInt(page),
            limit: options.limit
        });
    } catch (err) {
        res.status(500).json({ error: "Server error, please contact staff" });
    }
};


export const deleteProduct = async (req, res) => {
    try {
        const { productId } = req.params;

        if (!productId) {
            return res.status(400).json({ error: "Product ID is required" });
        }

        if (!mongoose.isValidObjectId(productId)) {
            return res.status(400).send({ error: "in valid product id" })
        }

        // Find and delete the product

        const findProduct = await Product.findById(productId)
    
        findProduct.images.forEach(async(imgId) => {
            const deleteProductImage = imgId.split('/')[imgId.split('/').length - 1].split('.')[0]
            const hasResult = await removeFromCloudinary(deleteProductImage)
            if (!hasResult.result) {
                return res.status(400).send({ error: "error image formate is not correct" })
            }
        })
        const deletedProduct = await Product.findByIdAndDelete(productId);
        if (!deletedProduct) {
            return res.status(404).json({ error: "Product not found" });
        }

        // Remove the product from carts and orders in parallel
        await Promise.all([
            Cart.updateMany(
                { 'items.productId': productId },
                { $pull: { items: { productId: productId } } }
            ),
            Order.updateMany(
                { 'cartId.items.productId': productId },
                { $pull: { 'cartId.items': { productId: productId } } }
            )
        ]);

        res.status(200).json({ message: "Product and its references deleted successfully" });
    } catch (err) {
        res.status(500).json({ error: "Server error, please contact staff" });
    }
};
