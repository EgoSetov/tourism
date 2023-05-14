import { dataBase } from "./index.js";
import { v4 as uuidv4 } from "uuid";
import { User } from "./users.db.js";

export const ModelQuestions = dataBase.collection("Questions");

export const Question = {
  async get(creator) {
    try {
      let model;

      if (creator) {
        model = await ModelQuestions.where("creator", "==", creator).get();
      } else {
        model = await ModelQuestions.get();
      }

      const questions = model.docs.map((doc) => doc.data());

      const citysquestionsWithCreator = await Promise.all(
        questions.map(async (q) => {
          const userId = q.creator;
          const creator = await User.getUserById(userId);
          return {
            ...q,
            creator: creator || null,
          };
        })
      );

      return citysquestionsWithCreator;
    } catch (error) {
      console.log(error);
      return {
        news: [],
        count: 0,
      };
    }
  },

  async getById(id) {
    try {
      const model = await ModelQuestions.where("id", "==", id).get();

      const questions = model.docs.map((doc) => doc.data());

      return questions[0];
    } catch (error) {
      console.log(error);
    }
  },

  async create(data) {
    try {
      const id = uuidv4();

      const newQuestion = {
        id,
        ...data,
      };

      await ModelQuestions.doc(id).set(newQuestion);

      return newQuestion;
    } catch (error) {
      console.log(error);
    }
  },

  async update(quetionId, data) {
    try {
      const quetion = ModelQuestions.doc(quetionId);

      await quetion.update(data);

      return quetion;
    } catch (error) {
      console.log(error);
    }
  },

  async delete(quetionId) {
    try {
      await ModelQuestions.doc(quetionId).delete();
    } catch (error) {
      console.log(error);
    }
  },
};
