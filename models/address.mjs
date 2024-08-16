import mongoose from "mongoose";


const address = mongoose.Schema({
    userId: ObjectId,
    street: String,
    city: String,
    state: String,
    zipCode: String,
    country: String,
    phoneNumber: String,
    countryCode: String
}, { timestampes: true })


const Address = mongoose.model('Address', address)

export default Address