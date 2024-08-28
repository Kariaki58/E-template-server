import mongoose, { model, Schema } from "mongoose";


const emailList = new Schema({
    email: {
        type: String,
        required: true
    }
}, { timestamps: true })

const Email = model('Email', emailList)

export default Email
