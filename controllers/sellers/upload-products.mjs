import Product from "../../models/products.mjs";
import Category from "../../models/categories.mjs";
import Faq from "../../models/faq.mjs";
import {removeFromCloudinary} from "../../utils/cloudinary.mjs";


// Utility function to validate arrays
const validateArray = (arr, type) => 
  Array.isArray(arr) && arr.every(item => typeof item === type);

const validateFaqItems = (faqItems) => {
  if (!Array.isArray(faqItems)) return false;

  return faqItems.every(item => 
    typeof item.question === 'string' &&
    item.question.trim() !== '' &&
    typeof item.answer === 'string' &&
    item.answer.trim() !== ''
  );
};

export const uploadProducts = async (req, res) => {
  const { productName, description, size: sizes, color: colors, price, stock, category, faqItems } = req.body;

  const images = req.files?.map(file => ({
    url: file.path,
    public_id: file.filename,
  })) || [];


  if (!Array.isArray(images) || images.length < 1) {
    return res.status(400).json({ error: "At least one image must be uploaded" });
  }

  try {
    if (!productName) throw new Error("Name is required");
    if (!description) throw new Error("Description is required");
    if (description.length < 20) throw new Error("Detailed description is required");
    
    if (sizes && sizes.length > 0 && !validateArray(sizes, "string")) {
      throw new Error("Sizes must be an array of strings");
    }
    if (colors && colors.length > 0 && !validateArray(colors, "string")) {
      throw new Error("Colors must be an array of strings");
    }
    
    if (!price || isNaN(parseFloat(price)) || parseFloat(price) <= 0) {
      throw new Error("Price must be a valid number greater than 0");
    }

    if (!stock || isNaN(parseInt(stock)) || parseInt(stock) < 0) {
      throw new Error("Stock must be a valid integer greater than 0");
    }
    
    if (!category || typeof category !== "string") {
      throw new Error("Category must be a string");
    }

    if (faqItems && faqItems.length > 0 && !validateFaqItems(faqItems)) {
      throw new Error("Please check your FAQ items");
    }

    let existingCategory = await Category.findOne({ name: category });
    if (!existingCategory) {
      existingCategory = await Category.create({ name: category });
    }


    const product = new Product({
      name: productName,
      description,
      sizes,
      colors,
      price,
      stock,
      category: existingCategory.name,
      images: images.map(image => image.url),
    });

    

    await product.save();

    try {
      const productFaq = new Faq({ faq: faqItems, productId: product.id });
      await productFaq.save();
    } catch (faqError) {
      await Product.findByIdAndDelete(product.id);
      throw new Error("Error saving FAQ. Product upload rolled back.");
    }

    res.status(201).json({ message: "Product uploaded successfully" });
  } catch (err) {
    await Promise.all(images.map(image => removeFromCloudinary(image.url)));
    res.status(500).json({ error: err.message || "Server error, please contact staff" });
  }
};
