import UserRepository from "../repositories/User.repository.js";
import bcrypt from "bcryptjs";
import JwtService from "../services/jwt.service.js";
export default class UserController {
  constructor() {
    this.userRep = new UserRepository();
    this.jwtService = new JwtService()
  }
  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      //check user already exist
      const existingUser = await this.userRep.getUserByEmail(email);
      if (existingUser) {
        const error = new Error("User already exists")
        error.status = 409
        next(error)

      }


      //hasing password using bycrptjs
      const hashedPassword = await bcrypt.hash(password, 10)

      const newUser = await this.userRep.createNewUser(email, hashedPassword, name)
      const userObj = newUser.toObject();
      delete userObj.password;
      return res.status(201).json({
        message: "User registered successfully",
        user: userObj
      })
    } catch (err) {
      next(err);
    }
  };

  //login method
  login = async (req, res, next) => {
    try {
      const { email, password } = req.body


      //check if user exist with mail
      const user = await this.userRep.getUserByEmail(email);
      if (!user) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }
      //comparing password 
      const isMatch = await bcrypt.compare(password, user.password)

      if (!isMatch) {
        return res.status(401).json({
          message: "Invalid email or password",
        });
      }

      //generate token
      const token = this.jwtService.generateToken({
        userId: user._id,
        role: user.role
      });
      //remove password form object 

      const { password: _, ...userWithoutPassword } = user.toObject()
      return res.status(200).json({
        message: "Login successful",
        token,
        user: userWithoutPassword,
      });
    } catch (error) {
      next(error)
    }
  }
  getUser = async (req, res, next) => {

    try {
      const { userId } = req.user

      const user = await this.userRep.getUserById(userId)

      if (!user) {
        return res.status(401).json({
          message: "User Not Found",
        });
      }
      const { password: _, ...withPassword } = user.toObject()

      return res.status(200).json({
        message: "Success",
        user: user.toObject()
      });
    } catch (error) {

      next(error)
    }
  }
}
