import Product from "../../models/products.mjs";

export const getUploads = async (req, res) => {
    const { page = 1, limit = 10 } = req.query;

    // Validate page and limit parameters
    const pageNum = parseInt(page, 10);
    const limitNum = parseInt(limit, 10);
    if (isNaN(pageNum) || pageNum < 1 || isNaN(limitNum) || limitNum < 1) {
        return res.status(400).send({ error: "Invalid pagination parameters" });
    }

    try {
        // Fetch paginated products with selected fields
        const products = await Product.find({})
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum)
        

        const total = await Product.countDocuments();

        return res.status(200).send({
            message: products,
            total,
            page: pageNum,
            limit: limitNum
        });
    } catch (err) {
        return res.status(500).send({ error: "Server error, please contact staff" });
    }
};
