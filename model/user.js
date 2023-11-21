const { ObjectId } = require("mongodb");
const { getDb } = require("../config/mongo");
const bcrypt = require("bcrypt");

class User {
  static async findAll() {
    try {
      const users = getDb().collection("users");
      const data = await users
        .find({}, { projection: { password: 0 } })
        .toArray();
      data.map(el => {
        el.totalWins = 0
        return el
      })
      return data;
    } catch (error) {
      throw error;
    }
  }

  static async findById(_id) {
    try {
      const users = getDb().collection("users");
      const user = await users.findOne({ _id: new ObjectId(_id) });
      return user;
    } catch (error) {
      throw error;
    }
  }

  static async findByEmail(email) {
    try {
      const users = getDb().collection("users");
      const user = await users.findOne({ email: email });
      return user;
    } catch (err) {
      throw err;
    }
  }

  static async postUser(user) {
    try {
      const users = getDb().collection("users");
      user.singlePlayerWin = 0;
      user.multiPlayerWin = 0;

      const newUser = await users.insertOne(user);
      return await users.findOne({
        _id: new ObjectId(newUser.insertedId),
      });
    } catch (error) {
      throw error;
    }
  }

  static async incrementWins(_id, gameType) {
    //gameType isinya singlePlayerWin atau multiPlayerWin
    try {
      const users = getDb().collection("users");
      const columnToUpdate = gameType;

      return await users.updateOne(
        { _id: new ObjectId(_id) },
        { $inc: { [columnToUpdate]: 1 } }
      );
    } catch (error) {
      throw error;
    }
  }

  // static async deleteUser(_id) {
  //   try {
  //     const user = getDb().collection("users");
  //     const data = await user.deleteOne({
  //       _id: new ObjectId(_id),
  //     });
  //     return data;
  //   } catch (error) {
  //     console.log(error);
  //     throw error;
  //   }
  // }
}
module.exports = User;
