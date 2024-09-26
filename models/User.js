//
//
//
import mongoose from "mongoose";

const userSchema = new mongoose.Schema({
    _id: {
        type: String,
        required: true
    },
    firstname: {
        type: String,
        required: true
    },
    lastname: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String,
        required: true
    },
    apple_id: {
        type: String,
        require: false
    },
    time_stamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);