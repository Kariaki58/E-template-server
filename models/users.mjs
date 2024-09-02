import mongoose from 'mongoose';

const { Schema, model } = mongoose;

// User Schema definition
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
        unique: true, // Ensure email is unique
        trim: true, // Remove leading and trailing spaces
        lowercase: true, // Store emails in lowercase for consistency
        match: [/.+@.+\..+/, 'Please enter a valid email address'] // Email format validation
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true });

// Create index for email
userSchema.index({ email: 1 });

const User = model('User', userSchema);

export default User;
