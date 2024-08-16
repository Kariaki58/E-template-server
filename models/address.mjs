import mongoose from "mongoose";


const address = mongoose.Schema({
    userId: {
        type: mongoose.Schema.ObjectId,
        required: true
    },
    street: {
        type: String,
        required: true
    },
    city: {
        type: String,
        required: true
    },
    state: {
        type: String,
        required: true
    },
    zipCode: {
        type: String,
    },
    country: {
        type: String,
        required: true
    },
    phoneNumber: {
        type: String,
        required: true
    },
    countryCode: {
        type: String,
        required: true
    }
}, { timestampes: true })


const Address = mongoose.model('Address', address)

export default Address
