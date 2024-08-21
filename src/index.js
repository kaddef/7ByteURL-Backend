import express from "express";
import dotenv from 'dotenv';
import cors from "cors"
import routes from "./routes/routes.js";
import bodyParser from "body-parser";
import connectDB from "./db.js";
import { globalErrorHandler } from "./controller/errorController.js";

dotenv.config({});

const PORT = process.env.PORT || 3000;
const FEORIGIN = process.env.FEORIGIN || "http://localhost:3000";

const app = express();

app.use(cors({
    origin: FEORIGIN
}))

connectDB()

// app.use(bodyParser.json())
app.use(express.json());

app.use(routes)

app.use(globalErrorHandler)

app.listen(PORT, () => {
    console.log("SERVER STARTED")
})