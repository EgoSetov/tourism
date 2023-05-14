import { Router } from "express";
import { User } from "../dataBase/users.db.js";
import { uploadImage } from "../middleware/multer.js";
import fse from "fs-extra";
import path from "path";
import { PATH_AVATARS, PATH_TEMP, PATH_UPLOADS } from "../utils/path.js";
import { comparePasswords, generatePassword } from "../utils/password.js";
import jwt from "jsonwebtoken";
import { isAuth } from "../middleware/isAuth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";

const userRouter = Router();

// * авторизация
userRouter.post(
  "/login",
  asyncWrapper(async (req, res) => {
    const { email, password } = req.body;
    const user = await User.getUserByEmail(email);

    if (!user) {
      return res.status(400).json({
        message: "Пользователя с такой почтой не существуют",
      });
    }

    // * проверка соответствия пароля
    const compare = await comparePasswords(password, user.password);

    if (!compare) {
      return res.status(400).json({
        message: "Неверный логил или пароль",
      });
    }

    const token = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "1d" });
    const refresh = jwt.sign(user, process.env.SECRET_KEY, { expiresIn: "8d" });

    res.send({
      id: user.id,
      token,
      refresh,
    });
  })
);

// * регистрация
userRouter.post(
  "/signup",
  uploadImage.single("avatar"),
  asyncWrapper(async (req, res) => {
    const { body, file } = req;

    // * проверка email
    const checkEmail = await User.getUserByEmail(body.email);

    if (checkEmail) {
      file && await fse.remove(path.join(PATH_TEMP, file.filename));
      return res.status(400).json({
        message: "Аккаунт с такой почтой уже существует",
      });
    }

    let avatar = null;

    if (file) {
      const filePath = path.join(PATH_TEMP, file.filename);
      const avatarPath = path.join(PATH_AVATARS, file.filename);
      await fse.move(filePath, avatarPath);
      avatar = avatarPath.split("uploads")[1];
    }

    const hashPassword = await generatePassword(body.password);

    const user = await User.createUser({
      ...body,
      avatar,
      type: "user",
      password: hashPassword,
    });

    res.status(201).json(user);
  })
);

// * получение данных пользователя по токену
userRouter.get(
  "/connect",
  isAuth,
  asyncWrapper(async (req, res) => {
    const { userId } = req;

    const user = await User.getUserById(userId);

    if (!user) return res.status(403).json("invalid token");

    res.send(user);
  })
);

// * получение данных пользователя
userRouter.get(
  "/info/:userId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { userId },
      userId: currentUserId,
      userType,
    } = req;

    const user = await User.getUserById(userId);
    delete user.password;

    if (!user) {
      return res.status(400).json({
        message: "Пользователь не найден",
      });
    }

    // * если данные пользователь не соответствуют запрашиваемым данным
    if (userType !== "admin") {
      if (user.id !== currentUserId) {
        return res.status(403).json({
          message: "Недостаточно прав",
        });
      }
    }

    res.send(user);
  })
);

// * получение пользователей
userRouter.get(
  "/get/",
  isAuth,
  asyncWrapper(async (req, res) => {
    const users = await User.getUsers();

    res.send({
      users,
      count: users.length,
    });
  })
);

// * изменение данных пользователя
userRouter.patch(
  "/update/:userId",
  isAuth,
  uploadImage.single("avatar"),
  asyncWrapper(async (req, res) => {
    const {
      params: { userId },
      userId: currentUserId,
      body,
      userType,
      file,
    } = req;
    const userData = body;

    const user = await User.getUserById(userId);

    if (!user) return res.status(400).json({ message: "Пользователь не найден" });

    if (userType !== "admin") {
      if (currentUserId !== userId) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }
    }

    if (file) {
      const filePath = path.join(PATH_TEMP, file.filename);
      const avatarPath = path.join(PATH_AVATARS, file.filename);
      await fse.move(filePath, avatarPath);
      userData.avatar = avatarPath.split("uploads")[1];
    }

    if (userData.avatar === "delete" && user.avatar) {
      await fse.remove(path.join(PATH_UPLOADS, user.avatar));
      userData.avatar = null;
    }

    await User.updateUser(userId, userData);

    res.sendStatus(200);
  })
);

// * удаление пользователя
userRouter.delete(
  "/delete/:userId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { userId: userForDelete },
      userType,
      userId,
    } = req;

    if (userType !== "admin") {
      return res.status(403).json({ message: "Недостаточно прав" });
    }

    const user = await User.getUserById(userForDelete);

    if (!user) return res.status(400).json({ message: "Пользователь не найден" });

    if (userId === user.id) return res.status(400).json({ message: "Невозможно удалить себя" });

    // * удаление аватарки пользователя
    if (user.avatar) await fse.remove(path.join(PATH_TEMP, user.avatar));

    await User.deleteUser(user.id);

    res.sendStatus(200);
  })
);

export default userRouter;
