import mongoose from "mongoose";


const brands = mongoose.Schema({
    name: String,
    logo: {
        url: String,
        alt: String
    },
})


export default brands
