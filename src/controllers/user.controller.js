import UserRepository from "../repositories/User.repository.js";
import bcrypt from "bcryptjs";
import JwtService from "../services/jwt.service.js";
import crypto from "crypto";
import EmailService from "../services/email.service.js";
import { Console } from "console";

export default class UserController {
  constructor() {
    this.userRep = new UserRepository();
    this.jwtService = new JwtService()
    this.emailService = new EmailService()
  }

  register = async (req, res, next) => {
    try {
      const { name, email, password } = req.body;

      //check user already exist
      const existingUser = await this.userRep.getUserByEmail(email);
      if (existingUser) {
        const error = new Error("User already exists")
        error.status = 409
        return next(error)
      }

      //hashing password using bcryptjs
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

      //check if user exist with mail — must include password for bcrypt.compare
      const user = await this.userRep.getUserByEmailWithPassword(email);

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

      //remove password from response object
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

  forgot = async (req, res, next) => {
    try {
      const { email } = req.body

      //find by email — if not found still return success (prevents email enumeration)
      const user = await this.userRep.getUserByEmail(email);
      if (!user) {
        return res.status(200).json({
          message: "If this email is registered, an OTP has been sent.",
        });
      }

      const otp = crypto.randomInt(100000, 999999).toString();
      const otpExpiry = new Date(Date.now() + 10 * 60 * 1000)
      console.log("otpt =====", otp)
      await this.userRep.saveOtp(user._id, otp, otpExpiry)

      return res.status(200).json({
        message: `OTP sent successfully ${otp}`,
      });
      //send email
      await this.emailService.sendMail(
        email,
        "Password Reset OTP",
        `
        <h2>Password Reset</h2>
        <p>Your OTP is:</p>
        <h1>${otp}</h1>
        <p>This OTP expires in 10 minutes.</p>
        `
      )

      return res.status(200).json({
        message: "OTP sent successfully",
      });

    } catch (error) {
      next(error)
    }
  }

  reset = async (req, res, next) => {
    try {
      const { email, otp, newPassword } = req.body

      //must include password fields to check OTP
      const user = await this.userRep.getUserByEmailWithPassword(email);
      if (!user) {
        return res.status(400).json({
          message: "Invalid request",
        });
      }

      if (user.resetpasswordOTP !== otp) {
        return res.status(400).json({ message: "Invalid OTP" });
      }

      if (!user.resetPasswordOTPExpiry || user.resetPasswordOTPExpiry < new Date()) {
        return res.status(400).json({ message: "OTP has expired" });
      }

      const hashedPassword = await bcrypt.hash(newPassword, 10)
      await this.userRep.resetPassword(user._id, hashedPassword)

      return res.status(200).json({
        message: "Password updated successfully",
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

      return res.status(200).json({
        message: "Success",
        user: user.toObject()
      });
    } catch (error) {
      next(error)
    }
  }
}
