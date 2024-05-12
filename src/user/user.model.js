import mongoose, { Schema } from "mongoose";

const UserSchema = mongoose.Schema({
    email: {
        type: String,
        unique: true
    },
    username: {
        type: String
    },
    age: {
        type: Number
    },
    sex:{
        type: String,
        enum: ["MALE", "FEMALE"],
    },
    birthdate:{
        type: Date
    },
    password: {
        type: String
    },
    phone: {
        type: String,
        minLength: 8,
        maxLength: 8,
        required: true,
    },
    role: {
        type: String,
        required: true,
        enum: ["ADMINISTRADOR", "USER"],
        default: "USER"
    },
    img: {
        type: String,
    },
    state: {
        type: Boolean,
        default: true,
    }
})

UserSchema.methods.toJSON = function () {
    const { _v, password, _id, ...user } = this.toObject();
    user.uid = _id;
    return user;
}

export default mongoose.model('User', UserSchema)