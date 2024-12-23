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
        type: String
    },
    lastname: {
        type: String
    },
    email: {
        type: String,
        required: true
    },
    password: {
        type: String
    },
    avator_color: {
        type: String,
        require: true
    },
    time_stamp: {
        type: Date,
        default: Date.now
    }
});

export default mongoose.model('User', userSchema);