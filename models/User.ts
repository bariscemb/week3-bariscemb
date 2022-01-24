import mongoose from "mongoose";
import bcrypt from 'bcrypt';

export type UserDocument = mongoose.Document & {
  id?: any
  email: string
  password: string
  token: string

}

const userSchema = new mongoose.Schema <UserDocument,any> ({
  email: {
    type: String,
    required: [true, 'Please enter an email'],
    unique: true,
  },
  password: {
    type: String,
    required: [true, 'Please enter a password']
  }
});


//adding salt and preparing hash of password
userSchema.pre('save', async function(next) {
 const salt = await bcrypt.genSalt();
 this.password = await bcrypt.hash(this.password, salt);
  next();
});

// user login authentication
userSchema.statics.login = async function(email,password) {
  const user = await this.findOne({ email });
  if (user) {
    const auth = await bcrypt.compare(password, user.password);
    if (auth) {
      return user;
    }
    throw Error ('incorrect password');
  }
  throw Error ('incorrect email');
};

const User = mongoose.model('user', userSchema);

export default User;