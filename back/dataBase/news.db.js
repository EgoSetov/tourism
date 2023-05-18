import { dataBase } from "./index.js";
import { v4 as uuidv4 } from "uuid"; // * позволяет генерировать уникальные id
import { User } from "./users.db.js";

export const ModelNews = dataBase.collection("News");
export const ModelComments = dataBase.collection("Comments");

// * объект, который имеет методы, которые позволят работать с firebase более удобно
export const News = {
  // * получение всех постов
  // * creator - переменная, в которую нужно передать id пользователя
  async getNews(page, creator = null) {
    try {
      if (creator) {
        const user = await User.getUserById(creator);
        if (!user) return { news: [], count: 0 };

        const model = await ModelNews.where("creator", "==", creator).get();

        let news = model.docs.map((doc) => doc.data());

        news = news.map((n) => ({
          ...n,
          creator: user,
        }));

        return {
          news: news,
          count: news.length,
        };
      }

      const model = await ModelNews.get();

      const news = model.docs.map((doc) => doc.data());

      // * расширение постов, путем добавления поля creator
      const newsWithCreator = await Promise.all(
        news.map(async (n) => {
          const newsCreator = n.creator;
          // * получение пользователя по id
          const user = await User.getUserById(newsCreator);
          return {
            ...n,
            creator: user,
          };
        })
      );

      return {
        news: newsWithCreator,
        count: newsWithCreator.length,
      };
    } catch (error) {
      console.log(error);
      return {
        news: [],
        count: 0,
      };
    }
  },

  // * получение поста по id
  async getNewsById(newsId) {
    try {
      const model = await ModelNews.where("id", "==", newsId).get();
      const news = model.docs.map((doc) => doc.data());
      return news[0];
    } catch (error) {
      console.log(error);
    }
  },

  // * создание поста
  async createNews(data) {
    try {
      const id = uuidv4();

      const newNews = {
        id,
        likes: [],
        comments: [],
        ...data,
      };

      await ModelNews.doc(id).set(newNews);

      return newNews;
    } catch (error) {
      console.log(error);
    }
  },

  // * изменение поста
  async updateNews(newsId, data) {
    try {
      const news = ModelNews.doc(newsId);

      await news.update(data);

      return news;
    } catch (error) {
      console.log(error);
    }
  },

  // * удаление поста
  async deleteNews(newsId) {
    try {
      await ModelNews.doc(newsId).delete();

      // * удаление всех комментариев поста
      const commentsNews = await this.getCommentsNews(newsId);

      await Promise.all(
        commentsNews.map(async (comment) => {
          await ModelComments.doc(comment.id).delete();
        })
      );
    } catch (error) {
      console.log(error);
    }
  },

  // * лайк поста
  async like(newsId, data) {
    try {
      const news = ModelNews.doc(newsId);

      await news.update(data);

      return news;
    } catch (error) {
      console.log(error);
    }
  },

  // * получение комментарий поста
  async getCommentsNews(newsId, options = {}) {
    try {
      const model = await ModelComments.where("news", "==", newsId).get();

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

  // * получение комментариев пользователя
  async getCommentsUser(userId) {
    try {
      const model = await ModelComments.where("creator", "==", userId).get();

      const comments = model.docs.map((doc) => doc.data());

      return comments;
    } catch (error) {
      console.log(error);
    }
  },

  // * получение комментария поста по id
  async getCommentById(commentId) {
    try {
      const model = await ModelComments.where("id", "==", commentId).get();
      const comments = model.docs.map((doc) => doc.data());
      return comments[0];
    } catch (error) {
      console.log(error);
    }
  },

  // * создание комментария к посту
  async createCommentNews(data) {
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

  // * удаление комментария
  async deleteComment(commentId) {
    try {
      await ModelComments.doc(commentId).delete();
    } catch (error) {
      console.log(error);
    }
  },
};

export const getUsers = async () => {};
