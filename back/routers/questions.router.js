import { Router } from "express";
import { User } from "../dataBase/users.db.js";
import { uploadImage } from "../middleware/multer.js";
import fse from "fs-extra";
import path from "path";
import { PATH_PHOTOS, PATH_TEMP, PATH_UPLOADS } from "../utils/path.js";
import { isAuth } from "../middleware/isAuth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { Question } from "../dataBase/questions.db.js";

const questionRouter = Router();

// * вывод всех вопросов
questionRouter.get(
  "/get",
  asyncWrapper(async (req, res) => {
    const { userId, userType } = req;

    let creator = null;

    if (userType !== "admin") creator = userId;

    const questions = await Question.get(creator);

    res.send(questions);
  })
);

// * создание вопроса
questionRouter.post(
  "/create",
  isAuth,
  asyncWrapper(async (req, res) => {
    const { body, userId, userType } = req;

    const dataQuestion = body;

    dataQuestion.creator = userId;
    dataQuestion.answer = dataQuestion.answer || "";

    if (userType !== "admin") dataQuestion.status = "pending";
    else dataQuestion.status = "done";

    const question = await Question.create(dataQuestion);

    res.status(201).json(question);
  })
);

// * изменение вопроса
questionRouter.patch(
  "/update/:questionId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { questionId },
      body,
      userType,
    } = req;

    const dataQuestion = body;

    const question = await Question.getById(questionId);

    if (!question) return res.status(400).json({ message: "Вопрос не найден" });

    if (userType !== "admin") {
      return res.status(403).json({ message: "Недостаточно прав" });
    }

    await Question.update(questionId, dataQuestion);

    res.sendStatus(200);
  })
);

// * удаление вопроса
questionRouter.delete(
  "/delete/:questionId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      userId,
      params: { questionId },
      userType,
    } = req;

    const question = await Question.getById(questionId);

    if (!question) return res.status(400).json({ message: "Вопрос не найден" });

    if (userType !== "admin") {
      if (question.creator !== userId) {
        return res.status(403).json({ message: "Недостаточно прав" });
      }
    }

    await Question.delete(questionId);

    res.sendStatus(200);
  })
);

export default questionRouter;
