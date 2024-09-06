import Product from "../../models/products.mjs";

export const editProduct = async (req, res) => {
    try {
        let {
            _id: productId,
            name,
            description,
            gender,
            percent,
            sizes,
            colors,
            price,
            currency,
            stock,
            images,
            materials,
            features,
            rating,
            category
        } = req.body;

        // Early return if required fields are missing
        if (!productId) return res.status(400).json({ error: "Product ID is required" });
        if (!name || !description || !price || !stock || !images || !category || images.length === 0) {
            return res.status(400).json({ error: "Name, description, price, stock, images, and category are required" });
        }

        // Validate and parse inputs
        if (typeof name !== 'string' || typeof description !== 'string') {
            return res.status(400).json({ error: "Name and description must be strings" });
        }
        const parsedPrice = parseFloat(price);
        if (isNaN(parsedPrice) || parsedPrice <= 0) {
            return res.status(400).json({ error: "Price must be a positive number" });
        }

        const parsedStock = parseInt(stock, 10);
        if (isNaN(parsedStock) || parsedStock < 0) {
            return res.status(400).json({ error: "Stock must be a non-negative number" });
        }

        const validateArrayOfStrings = (arr, name) => Array.isArray(arr) && arr.every(item => typeof item === 'string');
        if (!validateArrayOfStrings(images, 'images')) return res.status(400).json({ error: "Images must be an array of strings" });
        if (sizes && !validateArrayOfStrings(sizes, 'sizes')) return res.status(400).json({ error: "Sizes must be an array of strings" });
        if (colors && !validateArrayOfStrings(colors, 'colors')) return res.status(400).json({ error: "Colors must be an array of strings" });
        if (materials && !validateArrayOfStrings(materials, 'materials')) return res.status(400).json({ error: "Materials must be an array of strings" });
        if (features && !validateArrayOfStrings(features, 'features')) return res.status(400).json({ error: "Features must be an array of strings" });

        if (gender && typeof gender !== 'string') return res.status(400).json({ error: "Gender must be a string" });
        if (currency && typeof currency !== 'string') return res.status(400).json({ error: "Currency must be a string" });

        if (rating) {
            if (typeof rating !== 'object' || typeof rating.average !== 'number' || typeof rating.count !== 'number') {
                return res.status(400).json({ error: "Rating must be an object with numeric average and count" });
            }
        }

        if (percent) {
            try {
                percent = Number(percent)
            } catch (err) {
                return res.status(400).send({ error: "percent must be an integer" })
            }
            if (typeof percent !== 'number' || percent < 0 || percent > 100) {
                return res.status(400).json({ error: "PercentOff must be a number between 0 and 100" });
            }
        }

        // Batch update in a single MongoDB operation
        const updatedProduct = await Product.findByIdAndUpdate(
            productId,
            {
                $set: {
                    name,
                    description,
                    gender,
                    percentOff: percent,
                    sizes,
                    colors,
                    price: parsedPrice,
                    currency,
                    stock: parsedStock,
                    images,
                    materials,
                    features,
                    rating,
                    category
                }
            },
            { new: true, runValidators: true }
        );

        if (!updatedProduct) return res.status(404).json({ error: "Product not found" });

        res.status(200).json({ product: updatedProduct });
    } catch (err) {
        res.status(500).json({ error: "Server error, please contact staff" });
    }
};
