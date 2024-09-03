import mongoose, { model, Schema } from 'mongoose';

// Schema definition
const emailSchema = new Schema({
    email: {
        type: String,
        required: true,
        trim: true,
        lowercase: true, // Ensure the email is stored in lowercase
        unique: true, // Ensure each email is unique
        validate: {
            validator: (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v),
            message: props => `${props.value} is not a valid email!`
        }
    },
    isSubscribed: {
        type: Boolean,
        default: true
    },
    unsubscribeToken: {
        type: String
    },
    unsubscribeTokenExpiry: {
        type: Date
    }
}, { timestamps: true });

// Create model
const Email = model('Email', emailSchema);

export default Email;
