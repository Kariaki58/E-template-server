import Product from "../models/products.mjs";
import Category from "../models/categories.mjs";

export const categories = async (req, res) => {
  try {
    // Fetch all categories with their product counts
    const categories = await Category.find({});

    // Collect category IDs to be deleted
    const categoriesToDelete = [];

    // Iterate over categories to check if there are any associated products
    for (const category of categories) {
      const productsCount = await Product.countDocuments({ categoryId: category._id });
      
      // If no products are associated with the category, add to deletion list
      if (productsCount === 0) {
        categoriesToDelete.push(category._id);
      }
    }

    // Perform batch delete operation for categories with no products
    if (categoriesToDelete.length > 0) {
      await Category.deleteMany({ _id: { $in: categoriesToDelete } });
    }

    // Fetch the updated list of categories
    const updatedCategories = await Category.find({});
    return res.status(200).send({ message: updatedCategories });

  } catch (err) {
    console.error('Server error during category cleanup:', err);
    return res.status(500).send({ error: "Server error, please contact staff" });
  }
};
