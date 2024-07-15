import { Schema, model } from "mongoose";
const userSchema = new Schema({
    email: {
        type: String,
        required: true,
    },
    fullName: {
        type: String,
        required: true,
    },
    dateOfBirth: {
        type: Date,
        required: false,
    },
    password: {
        type: String,
        required: true,
    },
    refreshTokens: {
        type: [String],
        required: false,
    },
    createdAt: {
        type: Date,
        default: Date.now,
    },
    profileImage: {
        type: String,
        required: false,
    },
});
const UserModel = model("User", userSchema);
export default UserModel;
//# sourceMappingURL=user_model.js.map