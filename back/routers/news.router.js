import { Router } from "express";
import { User } from "../dataBase/users.db.js";
import { uploadImage } from "../middleware/multer.js";
import fse from "fs-extra";
import path from "path";
import { PATH_NEWS, PATH_TEMP, PATH_UPLOADS } from "../utils/path.js";
import { isAuth } from "../middleware/isAuth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { News } from "../dataBase/news.db.js";

const newsRouter = Router();

// * вывод всех постов
newsRouter.get(
  "/get/:page",
  asyncWrapper(async (req, res) => {
    const {
      query,
      params: { page },
    } = req;

    const news = await News.getNews(page, query.creator);

    res.status(200).json({
      news: news.news,
      count: news.count,
    });
  })
);

// * создание поста
newsRouter.post(
  "/create",
  isAuth,
  uploadImage.any(),
  asyncWrapper(async (req, res) => {
    const { body, userId, files } = req;

    const dataNews = body;

    // * проверка creator
    const creator = await User.getUserById(userId);

    if (!creator) {
      return res.status(400).json({
        message: "Автор не найден",
      });
    }

    const photos = [];

    if (files && Array.isArray(files) && files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const filePath = path.join(PATH_TEMP, file.filename);

        const photoPath = path.join(PATH_NEWS, file.filename);

        await fse.move(filePath, photoPath);

        const photo = photoPath.split("uploads")[1];

        photos.push(photo);
      }
    }

    dataNews.photos = photos;
    dataNews.creator = creator.id;

    const news = await News.createNews(dataNews);

    res.status(201).json(news);
  })
);

// * изменение поста
newsRouter.patch(
  "/update/:newsId",
  isAuth,
  uploadImage.any(),
  asyncWrapper(async (req, res) => {
    const {
      params: { newsId },
      userId,
      body,
      userType,
      files,
    } = req;

    const dataNews = body;

    const news = await News.getNewsById(newsId);

    if (!news) return res.status(400).json({ message: "Пост не найден" });

    if (userType !== "admin") {
      if (userId !== news.creator) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }
    }

    const photos = [];

    if (files && Array.isArray(files) && files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const filePath = path.join(PATH_TEMP, file.filename);

        const photoPath = path.join(PATH_NEWS, file.filename);

        await fse.move(filePath, photoPath);

        const photo = photoPath.split("uploads")[1];

        photos.push(photo);
      }
    }

    dataNews.photos = JSON.parse(dataNews.photos);

    // * удаленные фотографии
    const remote_photos = [];

    for (let i = 0; i < news.photos.length; i++) {
      if (!dataNews.photos.includes(news.photos[i])) {
        remote_photos.push(news.photos[i]);
      }
    }

    console.log("новых фотографий", photos);
    console.log("удалено фотографий", remote_photos);

    dataNews.photos = [...photos, ...dataNews.photos];

    if (remote_photos.length) {
      for (let i = 0; i < remote_photos.length; i++) {
        await fse.remove(path.join(PATH_UPLOADS, remote_photos[i]));
      }
    }

    await News.updateNews(newsId, dataNews);

    res.sendStatus(201);
  })
);

// * удаление поста
newsRouter.delete(
  "/delete/:newsId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { newsId },
      userId,
      userType,
    } = req;

    const news = await News.getNewsById(newsId);

    if (!news) return res.status(400).json({ message: "Пост не найден" });

    if (userType !== "admin") {
      if (userId !== news.creator) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }
    }

    // * удаление фотографий поста
    if (news.photos.length) {
      for (let i = 0; i < news.photos.length; i++) {
        await fse.remove(path.join(PATH_UPLOADS, news.photos[i]));
      }
    }

    await News.deleteNews(newsId);

    res.sendStatus(200);
  })
);

// * лайк поста
newsRouter.patch(
  "/like/:newsId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { newsId },
      userId,
    } = req;

    const news = await News.getNewsById(newsId);

    if (!news) return res.status(400).json({ message: "Пост не найден" });

    let likes = news.likes;

    if (likes.includes(userId)) {
      likes = likes.filter((id) => id !== userId);
    } else {
      likes.push(userId);
    }

    await News.like(newsId, { likes });

    res.sendStatus(200);
  })
);

// * вывод всех комментариев поста
newsRouter.get(
  "/comments/get/:newsId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { newsId },
    } = req;

    const news = await News.getNewsById(newsId);

    if (!news) return res.status(400).json({ message: "Пост не найден" });

    const comments = await News.getCommentsNews(news.id, { lookup: { creator: true } });

    res.send(comments);
  })
);

// * создание комментария
newsRouter.post(
  "/comments/create/:newsId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      userId,
      params: { newsId },
      body: { text },
    } = req;

    if (!text.trim()) return res.sendStatus(400);

    const news = await News.getNewsById(newsId);

    if (!news) return res.status(400).json({ message: "Пост не найден" });

    const dataComment = {
      news: news.id,
      creator: userId,
      text,
    };

    const comment = await News.createCommentNews(dataComment);

    res.status(201).json(comment);
  })
);

// * удаление комментария поста
newsRouter.delete(
  "/comments/delete/:commentId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { commentId },
      userId,
      userType,
    } = req;

    const comment = await News.getCommentById(commentId);

    if (!commentId) return res.status(400).json({ message: "Комментарий не найден" });

    if (userType !== "admin") {
      if (userId !== comment.creator) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }
    }

    await News.deleteComment(comment.id);

    res.sendStatus(200);
  })
);

export default newsRouter;
