import express from "express";
import UserController from "../controllers/user.controller.js";
import validate from "../middlewares/validate.js";
import UserValidator from "../validators/user.validator.js";
import auth from "../middlewares/auth.middleware.js";
const userRouter = express.Router();
const controller = new UserController();

userRouter.post("/register", UserValidator.register(), validate, controller.register);
userRouter.post("/login", UserValidator.login(), validate, controller.login);
userRouter.get('/me', auth, controller.getUser)
export default userRouter
