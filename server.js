import cors from "cors";
import dotenv from "dotenv";
import express from "express";
import connectDb from "./src/config/db.js";
import userRouter from "./src/routes/userroutes.js";
const app = express();

dotenv.config();
connectDb();
const PORT = process.env.PORT || 8086;
app.use(cors());
app.use(express.json());

//register routes
app.use("/api/user/", userRouter);

app.listen(PORT, () => {
  console.log(`Server running on http:localhost:${PORT}`);
});



app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({ message: "Internal Server Error" });
});