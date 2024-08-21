import mongoose from "mongoose";
import { customAlphabet } from "nanoid";

const nanoid = customAlphabet("abcdefghijklmnopqrstuvwxyzABDEFGHIJKLMNOPQRSTUVWXYZ0123456789", 7)

const schema = new mongoose.Schema({
    shortId: {
        type: String,
        unique: true,
        required: true,
        default: () => nanoid()
    },
    destination: {
        type: String,
        required: true
    }
})

schema.set('toJSON', {
    transform: (doc, ret) => {
        delete ret._id;
        delete ret.__v;
    }
});

const shortUrl = mongoose.model("shortUrl", schema)

export default shortUrl;