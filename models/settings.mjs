import mongoose from 'mongoose';

const { Schema } = mongoose;

// Define the schema for the settings
const settingsSchema = new Schema({
  mainBannerImage: {
    type: String, // URL or file path for the image
    required: false,
  },
  logoImage: {
    type: String, // URL or file path for the image
    required: false,
  },
  paystackKey: {
    type: String,
    required: false,
  },
  aboutUs: {
    type: String,
    required: false,
  },
  location: {
    type: String,
    required: false,
  },
  storeName: {
    type: String,
    required: false,
  },
  storeDescription: {
    type: String,
    required: false,
  },
  contact: {
    type: String,
    required: false,
  },
  support: {
    type: String,
    required: false,
  },
  socialLinks: {
    facebookUrl: { type: String },
    instagramUrl: { type: String },
    whatsappUrl: { type: String },
    twitterUrl: { type: String },
    linkedinUrl: { type: String },
    tiktokUrl: { type: String },
  },
  hours: {
    monday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
    tuesday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
    wednesday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
    thursday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
    friday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
    saturday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
    sunday: {
      open: { type: String, required: false },
      close: { type: String, required: false },
    },
  },
  content: [
    {
      question: { type: String, required: true },
      answer: { type: String, required: true },
    }
  ],
  offer: {
    type: String
  }
});

// Export the model
const Settings = mongoose.model('Settings', settingsSchema);

export default Settings;
