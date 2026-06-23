import { body } from "express-validator";

export default class UserValidator {
  static register() {
    return [
      body("name").notEmpty().withMessage("Name is required"),

      body("email")
        .trim()
        .notEmpty()
        .withMessage("Email is required")
        .isEmail()
        .withMessage("Invalid email format")
        .normalizeEmail(),
      body("password").notEmpty().withMessage("Password is required"),
    ];
  }
}
