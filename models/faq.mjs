import mongoose from "mongoose";

const { Schema, model } = mongoose

const faqSchema = new Schema({
    faq: [
        {
            question: String,
            answer: String
        }
    ],
    
    productId: {
        type: Schema.Types.ObjectId,
        ref: 'Product',
        required: true,
        index: true
    }
})

const Faq = model('Faq', faqSchema)

export default Faq;
