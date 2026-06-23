import UserRepository from "../repositories/User.repository.js";
import bcrypt from "bcryptjs";
export default class UserController {
  constructor() {
    this.userRep = new UserRepository();
  }
  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;
      console.log("body is", req.body);
      //check user already exist
      const existingUser = await this.userRep.getUserByEmail(email);
      if (existingUser) {
        return res.status(409).json({
          message: "User already exists",
        });
      }


      //hasing password using bycrptjs
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = this.userRep.createNewUser(email, hashedPassword, name)
      return res.status(201).json({
        message: "User registered successfully",
        user: newUser
      })
    } catch (err) {
      next(err);
    }
  };
}
