import Product from "../../models/products.mjs";

// Utility function to validate arrays
const validateArray = (arr, type) => 
  Array.isArray(arr) && arr.every(item => typeof item === type);

export const uploadProducts = async (req, res) => {
  const {
    productName: name,
    description,
    gender,
    percentOff,
    size: sizes,
    color: colors,
    price,
    stock,
    images,
    materials,
    features,
    category
  } = req.body;

  try {
    // Input validation
    if (!name || !description || !price || !stock || !images || !category || images.length === 0) {
      return res.status(400).send({ error: "Name, description, price, stock, images, and category are required" });
    }

    if (typeof name !== 'string' || typeof description !== 'string') {
      return res.status(400).send({ error: "Name and description must be strings" });
    }

    if (typeof price !== 'number' || price <= 0) {
      return res.status(400).send({ error: "Price must be a positive number" });
    }

    if (typeof stock !== 'number' || stock < 0) {
      return res.status(400).send({ error: "Stock must be a non-negative number" });
    }

    if (!validateArray(images, 'string')) {
      return res.status(400).send({ error: "Images must be an array of strings" });
    }

    if (typeof category !== 'string') {
      return res.status(400).send({ error: "Category must be a string" });
    }

    if (gender && typeof gender !== 'string') {
      return res.status(400).send({ error: "Gender must be a string" });
    }

    if (sizes && !validateArray(sizes, 'string')) {
      return res.status(400).send({ error: "Sizes must be an array of strings" });
    }

    if (colors && !validateArray(colors, 'string')) {
      return res.status(400).send({ error: "Colors must be an array of strings" });
    }

    if (materials && !validateArray(materials, 'string')) {
      return res.status(400).send({ error: "Materials must be an array of strings" });
    }

    if (features && !validateArray(features, 'string')) {
      return res.status(400).send({ error: "Features must be an array of strings" });
    }

    if (percentOff !== undefined && (typeof percentOff !== 'number' || percentOff < 0 || percentOff > 100)) {
      return res.status(400).send({ error: "PercentOff must be a number between 0 and 100" });
    }

    // Create and save product
    const product = new Product({
      name,
      description,
      gender,
      percentOff,
      sizes,
      colors,
      price,
      stock,
      images,
      materials,
      features,
      category
    });

    await product.save();

    res.status(201).send({ message: "Product uploaded successfully", product });
  } catch (err) {
    console.error('Server error during product upload:', err);
    res.status(500).send({ error: "Server error, please contact staff" });
  }
};
