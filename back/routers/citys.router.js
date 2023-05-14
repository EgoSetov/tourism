import { Router } from "express";
import { User } from "../dataBase/users.db.js";
import { uploadImage } from "../middleware/multer.js";
import fse from "fs-extra";
import path from "path";
import { PATH_PHOTOS, PATH_TEMP, PATH_UPLOADS } from "../utils/path.js";
import { isAuth } from "../middleware/isAuth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { City } from "../dataBase/citys.db.js";

const citysRouter = Router();

// * вывод всех городов
citysRouter.get(
  "/get",
  asyncWrapper(async (req, res) => {
    const { query } = req;

    let citys = await City.getCityes();

    if (query.recommendation) {
      citys = citys.filter((c) => !!c.recommendation);
    }

    res.status(200).json({
      citys: citys,
      count: citys.length,
    });
  })
);

// * создание города
citysRouter.post(
  "/create",
  isAuth,
  uploadImage.any(),
  asyncWrapper(async (req, res) => {
    const { body, userId, files } = req;

    const dataCity = body;

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

        const photoPath = path.join(PATH_PHOTOS, file.filename);

        await fse.move(filePath, photoPath);

        const photo = photoPath.split("uploads")[1];

        photos.push(photo);
      }
    }

    dataCity.photos = photos;
    dataCity.creator = creator.id;
    dataCity.recommendation = dataCity.recommendation === "false" || !dataCity.recommendation ? false : true;

    const city = await City.createCity(dataCity);

    res.status(201).json(city);
  })
);

// * изменение города
citysRouter.patch(
  "/update/:cityId",
  isAuth,
  uploadImage.any(),
  asyncWrapper(async (req, res) => {
    const {
      params: { cityId },
      body,
      userType,
      files,
    } = req;

    const dataCity = body;

    const city = await City.getCityById(cityId);

    if (!city) return res.status(400).json({ message: "Пост не найден" });

    if (userType !== "admin") {
      return res.status(403).json({ message: "Недостаточно прав" });
    }

    const photos = [];

    if (files && Array.isArray(files) && files.length) {
      for (let i = 0; i < files.length; i++) {
        const file = files[i];

        const filePath = path.join(PATH_TEMP, file.filename);

        const photoPath = path.join(PATH_PHOTOS, file.filename);

        await fse.move(filePath, photoPath);

        const photo = photoPath.split("uploads")[1];

        photos.push(photo);
      }
    }

    dataCity.photos = JSON.parse(dataCity.photos);

    // * удаленные фотографии
    const remote_photos = [];

    for (let i = 0; i < city.photos.length; i++) {
      if (!dataCity.photos.includes(city.photos[i])) {
        remote_photos.push(city.photos[i]);
      }
    }

    console.log("новых фотографий", photos);
    console.log("удалено фотографий", remote_photos);

    dataCity.photos = [...photos, ...dataCity.photos];

    if (remote_photos.length) {
      for (let i = 0; i < remote_photos.length; i++) {
        await fse.remove(path.join(PATH_UPLOADS, remote_photos[i]));
      }
    }

    await City.updateCity(cityId, dataCity);

    res.sendStatus(200);
  })
);

// * удаление города
citysRouter.delete(
  "/delete/:cityId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { cityId },
      userType,
    } = req;

    const city = await City.getCityById(cityId);

    if (!city) return res.status(400).json({ message: "Пост не найден" });

    if (userType !== "admin") {
      return res.status(403).json({ message: "Недостаточно прав" });
    }

    // * удаление фотографий поста
    if (city?.photos?.length) {
      for (let i = 0; i < city.photos.length; i++) {
        await fse.remove(path.join(PATH_UPLOADS, city.photos[i]));
      }
    }

    await City.deleteCity(cityId);

    res.sendStatus(200);
  })
);

// * лайк города
citysRouter.patch(
  "/like/:cityId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { cityId },
      userId,
    } = req;

    const city = await City.getCityById(cityId);

    if (!city) return res.status(400).json({ message: "Пост не найден" });

    let likes = city.likes;

    if (likes.includes(userId)) {
      likes = likes.filter((id) => id !== userId);
    } else {
      likes.push(userId);
    }

    await City.like(cityId, { likes });

    res.sendStatus(200);
  })
);

// * вывод всех комментариев города
citysRouter.get(
  "/comments/get/:cityId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { cityId },
    } = req;

    const city = await City.getCityById(cityId);

    if (!city) return res.status(400).json({ message: "Пост не найден" });

    const comments = await City.getCommentsCity(city.id, { lookup: { creator: true } });

    res.send(comments);
  })
);

// * создание комментария
citysRouter.post(
  "/comments/create/:cityId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      userId,
      params: { cityId },
      body: { text },
    } = req;

    if (!text.trim()) return res.sendStatus(400);

    const city = await City.getCityById(cityId);

    if (!city) return res.status(400).json({ message: "Пост не найден" });

    const dataComment = {
      city: city.id,
      creator: userId,
      text,
    };

    const comment = await City.createCommentCity(dataComment);

    res.status(201).json(comment);
  })
);

// * удаление комментария города
citysRouter.delete(
  "/comments/delete/:commentId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { commentId },
      userId,
      userType,
    } = req;

    const comment = await City.getCommentById(commentId);

    if (!commentId) return res.status(400).json({ message: "Комментарий не найден" });

    if (userType !== "admin") {
      if (userId !== comment.creator) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }
    }

    await City.deleteComment(comment.id);

    res.sendStatus(200);
  })
);

export default citysRouter;
