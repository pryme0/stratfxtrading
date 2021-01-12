const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const crypto = require("crypto");
const jwt = require("jsonwebtoken");
const config = require("../../config");

const SALT_WORK_FACTOR = 12;

//define the user schema
const userSchema = new mongoose.Schema(
  {
    role: { type: String, default: "user" },
    firstName: { type: String, default: null },
    lastName: { type: String, default: null },
    profileImg: { type: String, default: null },
    email: { type: String, default: null },
    houseNumber: { type: String, default: null },
    accountNumber: { type: String, default: null },
    buildingNumber: { type: String, default: null },
    password: { type: String, default: null },
    country: { type: String, default: null },
    state: { type: String, default: null },
    city: { type: String, default: null },
    street: { type: String, default: null },
    zipCode: { type: String, default: null },
    lastName: { type: String, default: null },
    mobile: { type: String, default: null },
    phone: { type: String, default: null },
    isEmailVerified: { type: String, default: false },
    createdAt: { type: Date, default: Date.now() },
    userTokens: { type: String, default: null },
    refreshToken: { type: String, default: null },
    passwordResetToken: { type: String, default: null },
  },
  {
    timestamps: true,
  }
);

/**
 * Before saving the user password generate the salt and create the hash
 */
userSchema.pre("save", function (next) {
  if (!this.isNew) return next();
  bcrypt.hash(this.password, 8, (err, hash) => {
    if (err) return next(err);
    this.password = hash;
    next();
  });
});
/**
 * Decrypts the encrypted password and compares it to the provided password during login
 * @param candidatePassword String - plain password
 */
userSchema.methods.comparePassword = async function (candidatePassword) {
  //bcrypt.compare() comapres the passed password with the one in our database it returns a true or false
  try {
    let result = await bcrypt.compare(candidatePassword, this.password);
    return result;
  } catch (err) {
    return { error: err };
  }
};

/**
 * creates jwt token for users
 * @paran userID string -plain id
 *
 */
userSchema.methods.createToken = async function () {
  try {
    const token = await jwt.sign(
      {
        _id: this._id.toString(),
        audience: "user",
        issuer: "Tfxtrading",
        role: this.role,
      },
      config.JWT_SECRET_KEY,
      { expiresIn: "1H" }
    );
    this.userTokens = token;
    await this.save();
    return token;
  } catch (err) {
    return err;
  }
};

/**
 * creates a refresh token for the user
 */
userSchema.methods.createPassworResetToken = async function () {
  try {
    const token = await jwt.sign(
      { _id: this._id.toString() },
      config.JWT_SECRET_KEY,
      { expiresIn: "5m" }
    );
    this.passwordResetToken = token;
    await this.save();
    return token;
  } catch (err) {
    return err;
  }
};

/**
 * Create a static method on the plan schema to find a plan by a given refresh token. Notice that this method
 * is a static method (schema.statics) because you want to query for a specific document from the plan model.
 * The refresh token in the database is a hashed value. The plan receives the plain token value. That’s why
 * you need to hash the incoming refresh token before querying the database for it.
 * @param refreshToken
 * @returns {*}
 */
userSchema.statics.findByRefreshToken = function (refreshToken) {
  return this.findOne({
    refreshToken: crypto
      .createHash("sha512")
      .update(refreshToken)
      .digest("hex"),
  });
};

module.exports = mongoose.model("User", userSchema);
