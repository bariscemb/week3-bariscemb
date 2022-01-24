import User from "../models/User";
import jwt from 'jsonwebtoken';
import { RequestHandler } from "express";


// handle errors
export const handleErrors = (err:any) => {
  console.log(err.message , err.code)
  let errors = { email: '', password: '' }

  // incorrect email
  if (err.message === 'incorrect email') {
    err.email = 'That email is not registered';
  }

  // incorrect password
  if (err.message === 'incorrect password') {
    err.password = 'That password is incorrect';
  }

  // duplicate email error
  if (err.code === 11000) {
    err.email = 'that email is already registered';
    return err;
    }
  
    return err;
  }



const maxAge = 3 * 24 * 60 * 60;
//creating jwt
const createToken = (id: any): any => {
  return jwt.sign({ id }, "baris", {
    expiresIn: maxAge
  });
};

// controller actions
export const signup_get: RequestHandler = (req, res) => {
  res.render('signup');
}

export const login_get: RequestHandler = (req, res) => {
  res.render('login');
}

export const signup_post: RequestHandler =  async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.create({ email, password });
    const token = createToken(user._id);
    res.cookie('jwt', token, { httpOnly: true,maxAge: maxAge * 1000});
    res.status(201).json({ user: user._id });
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
 
}

export const login_post: RequestHandler = async (req, res) => {
  const { email, password } = req.body;

  try {
    const user = await User.login(email,password);
    const token = createToken(user._id);
    res.cookie('jwt', token, {httpOnly: true, maxAge: maxAge * 1000})
    res.status(200).json({ user: user._id });
  } 
  catch (err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }

}

export const logout_get: RequestHandler = (req, res) => {
  res.cookie('jwt', '', { maxAge: 1 });
  res.redirect('/');
}
