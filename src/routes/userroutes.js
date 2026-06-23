import express from "express";
import UserController from "../controllers/user.controller.js";
import validate from "../middlewares/validate.js";
import UserValidator from "../validators/user.validator.js";
const userRouter = express.Router();
const controller = new UserController();

userRouter.post("/", UserValidator.register(), validate, controller.register);

export default userRouter
