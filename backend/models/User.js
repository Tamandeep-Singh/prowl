const mongoose = require("mongoose");
const bcrypt = require("bcrypt");

const UserSchema = mongoose.Schema({
    username: {
        type: String,
        unique: true
    },
    password: String,
    email: String
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
    const result = await bcrypt.compare(givenPassword, this.password);
    return result;
};

module.exports = mongoose.model("User", UserSchema);