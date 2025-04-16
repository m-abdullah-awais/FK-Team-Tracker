import mongoose from "mongoose";
import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

class UserModel {
    constructor() {
        this.userSchema = new mongoose.Schema(
            {
                username: {
                    type: String,
                    required: true,
                    unique: true
                },
                email: {
                    type: String,
                    required: true,
                    unique: true
                },
                password: {
                    type: String,
                    required: true
                },
                role: {
                    type: String,
                    enum: ["admin", "team"],
                    required: true
                },
                service: {
                    type: String,
                    enum: ["job", "intern"],
                    required: true
                },
                profilePic: {
                    type: String,
                    default: ""
                },
                phone: {
                    type: String,
                    default: ""
                },
                gender: {
                    type: String,
                    enum: ["male", "female", "other"],
                    default: "other"
                },
                address: {
                    type: String,
                    default: ""
                },
                // skills:{
                //     type: [String],
                //     default: []
                // },
                // socialLinks:{
                //     type: Object,
                //     default: {}
                // },
                verification: {
                    type: String,
                    enum: ["pending", "approved", "declined"],
                    default: "pending"
                },
                refreshToken: {
                    type: String
                },
                otp: {
                    type: String
                },
                otpExpiry: {
                    type: Date
                },
                passwordResetToken: {
                    type: String
                },
                passwordResetExpires: {
                    type: Date
                }
            },
            {
                timestamps: true,
            }
        );

        this.userSchema.pre("save", async function (next) {
            if (!this.isModified("password")) {
                return next();
            }
            this.password = await bcrypt.hash(this.password, 10);
            next();
        });

        this.userSchema.methods.isPasswordCorrect = async function (password) {
            return await bcrypt.compare(password, this.password);
        };

        this.userSchema.methods.generateAccessToken = function () {
            return jwt.sign(
                {
                    _id: this._id,
                    username: this.username,
                    email: this.email,
                    role: this.role,
                    service: this.service,
                    verification: this.verification,
                    profilePic: this.profilePic,
                },
                process.env.ACCESS_TOKEN_SECRET,
                { expiresIn: process.env.ACCESS_TOKEN_EXPIRY }
            );
        };

        this.userSchema.methods.generateRefreshToken = function () {
            return jwt.sign(
                { _id: this._id, role: this.role },
                process.env.REFRESH_TOKEN_SECRET,
                { expiresIn: process.env.REFRESH_TOKEN_EXPIRY }
            );
        };

        this.User = mongoose.model("User", this.userSchema);
    }
}

const userModel = new UserModel();
export default userModel;