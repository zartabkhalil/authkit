import UserModel from "../models/user.model.js";

export default class UserRepository {
  //get a user

  async getUserByEmail(email) {
    try {
      const user = await UserModel.findOne({ email });
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
}
