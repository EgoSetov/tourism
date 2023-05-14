import { dataBase } from "./index.js";
import { v4 as uuidv4 } from "uuid";
import { ModelComments, ModelCitys, City } from "./citys.db.js";

export const ModelUsers = dataBase.collection("Users");

export const User = {
  async getUserByEmail(email) {
    try {
      const model = await ModelUsers.where("email", "==", email).get();
      const user = model.docs.map((doc) => doc.data());
      return user[0];
    } catch (error) {
      console.log("[error]", error);
    }
  },

  async getUserById(userId) {
    try {
      const model = await ModelUsers.where("id", "==", userId).get();
      const user = model.docs.map((doc) => doc.data());
      if (user[0]) {
        delete user[0].password;
      }
      return user[0];
    } catch (error) {
      console.log("[error]", error);
    }
  },

  async getUsers() {
    try {
      const model = await ModelUsers.get();

      const users = model.docs.map((doc) => doc.data());

      return users.map((user) => {
        delete user.password;
        return user;
      });
    } catch (error) {
      console.log(error);
    }
  },

  async createUser(data) {
    try {
      const id = uuidv4();

      const user = {
        id,
        ...data,
      };

      await ModelUsers.doc(id).set(user);

      return user;
    } catch (error) {
      console.log(error);
    }
  },

  async updateUser(userId, data) {
    try {
      const user = ModelUsers.doc(userId);

      await user.update(data);

      return user;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteUser(userId) {
    try {
      await ModelUsers.doc(userId).delete();

      // * удаление постов пользователя
      const userNews = await City.getNews(1, userId);

      console.log("удалено постов пользователя", userNews.news.length);

      await Promise.all(
        userNews?.news?.map(async (news) => {
          await ModelCitys.doc(news.id).delete();
        })
      );

      // * удаление комментариев пользователя
      const userComments = await City.getCommentsUser(userId);

      console.log(userComments);

      console.log("удалено комментариев пользователя", userComments.length);

      await Promise.all(
        userComments.map(async (comment) => {
          await ModelComments.doc(comment.id).delete();
        })
      );
    } catch (error) {
      console.log(error);
    }
  },
};
