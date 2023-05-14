import { dataBase } from "./index.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "./users.db.js";
import { Hotel } from "./hotels.db.js";

export const ModelCitys = dataBase.collection("Citys");
export const ModelComments = dataBase.collection("Comments");

export const City = {
  async getCityes() {
    try {
      const model = await ModelCitys.get();

      const citys = model.docs.map((doc) => doc.data());

      const citysWithHotels = await Promise.all(
        citys.map(async (n) => {
          const cityId = n.id;
          const hotels = await Hotel.getHotels(cityId);
          return {
            ...n,
            hotels,
          };
        })
      );

      return citysWithHotels;
    } catch (error) {
      console.log(error);
      return [];
    }
  },

  async getCityById(cityId) {
    try {
      const model = await ModelCitys.where("id", "==", cityId).get();
      const citys = model.docs.map((doc) => doc.data());
      return citys[0];
    } catch (error) {
      console.log(error);
    }
  },

  async createCity(data) {
    try {
      const id = uuidv4();

      const newCity = {
        id,
        likes: [],
        ...data,
      };

      await ModelCitys.doc(id).set(newCity);

      return newCity;
    } catch (error) {
      console.log(error);
    }
  },

  async updateCity(cityId, data) {
    try {
      const city = ModelCitys.doc(cityId);

      await city.update(data);

      return city;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteCity(cityId) {
    try {
      await ModelCitys.doc(cityId).delete();

      // * удаление всех комментариев поста
      const commentsCity = await this.getCommentsCity(cityId);

      await Promise.all(
        commentsCity.map(async (comment) => {
          await ModelComments.doc(comment.id).delete();
        })
      );
    } catch (error) {
      console.log(error);
    }
  },

  async like(cityId, data) {
    try {
      const news = ModelCitys.doc(cityId);

      await news.update(data);

      return news;
    } catch (error) {
      console.log(error);
    }
  },

  async getCommentsCity(cityId, options = {}) {
    try {
      const model = await ModelComments.where("city", "==", cityId).get();

      if (options?.lookup?.creator) {
        const comments = model.docs.map((doc) => doc.data());

        const commentsWithCreator = await Promise.all(
          comments.map(async (comment) => {
            const creator = await User.getUserById(comment.creator);

            return {
              ...comment,
              creator,
            };
          })
        );

        return commentsWithCreator;
      }

      const comments = model.docs.map((doc) => doc.data());

      return comments;
    } catch (error) {
      console.log(error);
    }
  },

  async getCommentsUser(userId) {
    try {
      const model = await ModelComments.where("creator", "==", userId).get();

      const comments = model.docs.map((doc) => doc.data());

      return comments;
    } catch (error) {
      console.log(error);
    }
  },

  async getCommentById(commentId) {
    try {
      const model = await ModelComments.where("id", "==", commentId).get();
      const comments = model.docs.map((doc) => doc.data());
      return comments[0];
    } catch (error) {
      console.log(error);
    }
  },

  async createCommentCity(data) {
    try {
      const id = uuidv4();

      const dataComment = {
        id,
        ...data,
      };

      await ModelComments.doc(id).set(dataComment);

      return dataComment;
    } catch (error) {
      console.log(error);
    }
  },

  async deleteComment(commentId) {
    try {
      await ModelComments.doc(commentId).delete();
    } catch (error) {
      console.log(error);
    }
  },
};
