import UserModel from "../models/user.model.js";

export default class UserRepository {
  //get a user

  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email }).select("-password");
      return user;
    } catch (error) {
      console.error("Error fetching user By email:", error);
      throw error;
    }
  }

  async createNewUser(email, password, name) {
    try {
      const user = await UserModel.create({ email, password, name });
      return user;
    } catch (error) {
      console.error("Error while creating new  user :", error);
      throw error;
    }
  }

  async getUserById(id) {
    try {
      return await UserModel.findById(id).select("-password");
    }
    catch (error) {
      console.error("Error while fetching user by id :", error).select("-password");
      throw error;
    }
  }
}
