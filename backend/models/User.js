const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true,
        required: [true, "Username must be provided"],
        minlength: [3, "Username must be atleast 3 characters"],
        maxlength: [20, "Username can only contain a maximum of 20 characters"]
    },
    password: {
        type: String,
        required: [true, "Password must be provided"],
        minlength: [8, "Password must be atleast 8 characters"]
    },
    email: {
        type: String,
        unique: true,
        required: [true, "Email must be provided"],
        unique: true,
    },
    role: {
        type: String,
        enum: ["administrator", "analyst"],
        default: "analyst"
    }
}, { timestamps: true });


UserSchema.pre("save", async function(next) {
    if (!this.isModified("password")) { return next(); };
    try {
        const cryptSalt = await bcrypt.genSalt(10);
        this.password = await bcrypt.hash(this.password, cryptSalt);
        return next();
    }
    catch (error) { return next(error); };
});

UserSchema.methods.doesPasswordMatch = async function (givenPassword) {
    const isMatch = await bcrypt.compare(givenPassword, this.password);
    return isMatch;
};

module.exports = mongoose.model("User", UserSchema);