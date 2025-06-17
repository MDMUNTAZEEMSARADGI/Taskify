import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import { connectDB } from "./config/db.js";
import userRouter from "./routes/userRoute.js";
import taskRoute from "./routes/taskRoute.js";

dotenv.config();
const app = express();

//Middleware
app.use(express.json());
app.use(express.urlencoded({ extended: true }));
app.use(cors());

const port = 5000;

//DB connect
connectDB();

//Routes
app.use("/api/user", userRouter);
app.use("/api/tasks", taskRoute);

app.get("/",(req,res)=>{
  res.send("API Working")
})
 
app.listen(port, (req, res) => {
  console.log(`Server is listening on http://localhost:${port}`);
});
   