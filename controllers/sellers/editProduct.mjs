import Product from "../../models/products.mjs";
import Category from "../../models/categories.mjs";

export const editProduct = async (req, res) => {
    try {
        const { productId, name, description, gender, percentOff, sizes, colors, price, 
            currency, stock, images, materials, features, rating, category 
        } = req.body;

        if (!productId) {
            return res.status(400).send({ error: "Product ID is required" });
        }
        if (!name || !description || !price || !stock || !images || !category || images.length === 0) {
            return res.status(400).send({ error: "name, description, price, stock, images, and category are required" });
        }

        if (typeof name !== 'string' || typeof description !== 'string') {
            return res.status(400).send({ error: "name and description must be strings" });
        }

        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).send({ error: "price must be a positive number" });
        }

        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).send({ error: "stock must be a non-negative number" });
        }

        if (!Array.isArray(images) || images.some(img => typeof img !== 'string')) {
            return res.status(400).send({ error: "images must be an array of strings" });
        }

        if (typeof category !== 'string') {
            return res.status(400).send({ error: "category must be a string" });
        }

        if (sizes && (!Array.isArray(sizes) || sizes.some(size => typeof size !== 'string'))) {
            return res.status(400).send({ error: "sizes must be an array of strings" });
        }

        if (colors && (!Array.isArray(colors) || colors.some(color => typeof color !== 'string'))) {
            return res.status(400).send({ error: "colors must be an array of strings" });
        }
        if (materials && (!Array.isArray(materials) || materials.some(material => typeof material !== 'string'))) {
            return res.status(400).send({ error: "materials must be an array of strings" });
        }
        if (typeof category !== 'string') {
            return res.status(400).send({ error: "category must be a string" });
        }
        if (gender && typeof gender !== 'string') {
            return res.status(400).send({ error: "gender must be a string" })
        }
        if (currency && typeof currency !== "string") {
            return res.status(400).send({ error: "currency must be a string" })
        }
        if (features && (!Array.isArray(features) || features.some(feature => typeof feature !== 'string'))) {
            return res.status(400).send({ error: "features must be an array of strings" });
        }

        if (rating && (typeof rating !== 'object' || typeof rating.average !== 'number' || typeof rating.count !== 'number')) {
            return res.status(400).send({ error: "rating must be an object with numeric average and count" });
        }

        if (percentOff && (typeof percentOff !== 'number' || percentOff < 0 || percentOff > 100)) {
            return res.status(400).send({ error: "percentOff must be a number between 0 and 100" });
        }
        if (category) {
            let checkCategory = await Category.findOne({ name: category });

            if (!checkCategory) {
                checkCategory = new Category({ name: category });
                await checkCategory.save();
            }

            req.body.categoryId = checkCategory._id;
            delete req.body.category; // Remove the old category name from update data
        }

        // Update the product
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: req.body },
            { new: true } // Return the updated document
        );

        if (!updatedProduct) {
            return res.status(404).send({ error: "Product not found" });
        }

        res.status(200).send({ message: "Product updated successfully", product: updatedProduct });
    } catch (err) {
        console.error(err);
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
