const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
const jwt = require('jsonwebtoken');

//New user registeration schema
const registerUserSchema = new mongoose.Schema({
  name: {
    type: String,
    required: true
  },
  email: {
    type: String,
    required: true
  },
  number: {
    type: Number,
    required: true
  },
  password: {
    type: String,
    required: true
  },
  tokens: [{
    token: {
      type: String,
      require: true
    }
  }]
});

registerUserSchema.methods.generateAuthToken = async function () {
  try {
    const token = jwt.sign({ _id: this._id }, process.env.SECRET_KEY);
    this.tokens = this.tokens.concat({ token: token })
    await this.save();
    return token;
  } catch (error) {
    console.log("the error part" + error);
  }
}

//password hashing using bcrypt
registerUserSchema.pre('save', async function (next) {
  if (this.isModified('password')) {
    this.password = await bcrypt.hash(this.password, 10);
  }
  next();
})

//model object of collection with defines schema
const register = mongoose.model('RegisteredUserInformations', registerUserSchema);

//export of module register 
module.exports = register;
