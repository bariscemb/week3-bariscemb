import express from "express";
import mongoose from "mongoose";
import authRoutes from "./routes/authRoutes";
import cookieParser from "cookie-parser";
import { requireAuth, checkUser } from "./middleware/authMiddleware";
import { config } from "dotenv";

const app = express();

// middleware
app.use(express.static('public'));
app.use(express.json());
app.use(cookieParser());

// view engine
app.set('view engine', 'ejs');

// database connection
const dbURI = 'mongodb://localhost:27017/AuthHmw';

mongoose.connect(dbURI, { useNewUrlParser: true, 
  useUnifiedTopology: true, 
  useCreateIndex:true })
  .then((result) => app.listen(3000))
  .catch((err) => console.log(err));

// routes
app.get('*', checkUser);
app.get('/', (req, res) => res.render('home'));
app.use(authRoutes);