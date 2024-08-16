import mongoose from "mongoose";


const user = mongoose.Schema({
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    isAdmin: {
        type: Boolean,
        default: false
    }
}, { timestamps: true })


const User = mongoose.model('User', user)

export default User
