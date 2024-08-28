import Product from "../../models/products.mjs";

export const editProduct = async (req, res) => {
    try {
        let { _id: productId, name, description, gender, percentOff, sizes, colors, price, 
            currency, stock, images, materials, features, rating, category 
        } = req.body;
        if (!productId) {
            return res.status(400).send({ error: "Product ID is required" });
        }
        if (!name || !description || !price || !stock || !images || !category || images.length === 0) {
            return res.status(400).send({ error: "Name, description, price, stock, images, and category are required" });
        }

        if (typeof name !== 'string' || typeof description !== 'string') {
            return res.status(400).send({ error: "Name and description must be strings" });
        }
        try {
            price = Number(price)
        } catch (err) {
            return res.status(400).end({error: "price must be a number"})
        }
        if (typeof price !== 'number' || price <= 0) {
            return res.status(400).send({ error: "Price must be a positive number" });
        }
        try {
            stock = Number(stock);
        } catch (err) {
            return res.status(400).send({error: "stock must be a number"})
        }
        if (typeof stock !== 'number' || stock < 0) {
            return res.status(400).send({ error: "Stock must be a non-negative number" });
        }

        if (!Array.isArray(images) || images.some(img => typeof img !== 'string')) {
            return res.status(400).send({ error: "Images must be an array of strings" });
        }

        if (sizes && (!Array.isArray(sizes) || sizes.some(size => typeof size !== 'string'))) {
            return res.status(400).send({ error: "Sizes must be an array of strings" });
        }

        if (colors && (!Array.isArray(colors) || colors.some(color => typeof color !== 'string'))) {
            return res.status(400).send({ error: "Colors must be an array of strings" });
        }

        if (materials && (!Array.isArray(materials) || materials.some(material => typeof material !== 'string'))) {
            return res.status(400).send({ error: "Materials must be an array of strings" });
        }

        if (gender && typeof gender !== 'string') {
            return res.status(400).send({ error: "Gender must be a string" });
        }

        if (currency && typeof currency !== 'string') {
            return res.status(400).send({ error: "Currency must be a string" });
        }

        if (features && (!Array.isArray(features) || features.some(feature => typeof feature !== 'string'))) {
            return res.status(400).send({ error: "Features must be an array of strings" });
        }

        if (rating && (typeof rating !== 'object' || typeof rating.average !== 'number' || typeof rating.count !== 'number')) {
            return res.status(400).send({ error: "Rating must be an object with numeric average and count" });
        }

        if (percentOff && (typeof percentOff !== 'number' || percentOff < 0 || percentOff > 100)) {
            return res.status(400).send({ error: "PercentOff must be a number between 0 and 100" });
        }

        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            { $set: req.body },
            { new: true }
        );

        if (!updatedProduct) {
            return res.status(404).send({ error: "Product not found" });
        }
        res.status(200).send({ product: updatedProduct });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
