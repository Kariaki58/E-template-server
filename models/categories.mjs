import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// Schema definition
const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        trim: true, // Remove leading and trailing spaces
        minlength: 1, // Ensure the category name is not empty
        maxlength: 100 // Limit the length to prevent excessively long names
    }
}, { timestamps: true });

// Create model
const Category = model('Category', categorySchema);

export default Category;
