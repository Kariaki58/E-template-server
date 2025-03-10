import Product from "../../models/products.mjs";
import Category from "../../models/categories.mjs";

export const getUploads = async (req, res) => {
    let { page = 1, limit = 10, category = "", search = "", sort = "" } = req.query;

    try {
        page = parseInt(page, 10);
        limit = parseInt(limit, 10);

        if (!Number.isInteger(page) || page < 1 || !Number.isInteger(limit) || limit < 1) {
            return res.status(400).json({ error: "Page and limit must be positive integers" });
        }
    } catch (error) {
        return res.status(400).json({ error: "Invalid pagination parameters" });
    }

    try {
        const filters = {};

        if (search) {
            filters.name = { $regex: search, $options: "i" };
        }

        if (category) {
            console.log(category)
            const categoryData = await Category.findOne({ name: category.replace("-", " ") }).lean();
            console.log({ categoryData })
            if (categoryData) {
                console.log(categoryData)
                filters.category = categoryData.name;
            }
        }

        const sortOptions = {};
        if (sort === "High to Low") {
            sortOptions.price = -1;
        } else if (sort === "Low to High") {
            sortOptions.price = 1;
        } else if (sort === "Rating") {
            sortOptions["reviews.rating"] = -1;
        }

        const products = await Product.find(filters)
            .select("name price category reviews") // Fetch only necessary fields
            .sort(sortOptions)
            .skip((page - 1) * limit)
            .limit(limit)
            .lean(); // Improves performance by returning plain JS objects

        const total = await Product.countDocuments(filters);

        return res.status(200).json({
            products,
            total,
            page,
            limit
        });
    } catch (err) {
        console.error("Error fetching products:", err);
        return res.status(500).json({ error: "Server error, please contact staff" });
    }
};
