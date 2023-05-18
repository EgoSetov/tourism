import dotenv from "dotenv";
import express from "express";
import bodyParser from "body-parser";
import userRouter from "./routers/users.router.js";
import cors from "cors";
import path from "path";
import { PATH_BUILD, PATH_UPLOADS } from "./utils/path.js";
import citysRouter from "./routers/citys.router.js";
import hotelsRouter from "./routers/hotels.router.js";
import questionRouter from "./routers/questions.router.js";
import newsRouter from "./routers/news.router.js";
dotenv.config();

const app = express();

app.use(bodyParser.json());
app.use(cors());

app.use("/", express.static(PATH_BUILD));
app.use("/users", userRouter);
app.use("/citys", citysRouter);
app.use("/hotels", hotelsRouter);
app.use("/questions", questionRouter);
app.use("/news", newsRouter);

app.use("/uploads", express.static(path.join(PATH_UPLOADS)));

const PORT = process.env.PORT || 3000;
const MODE = process.env.MODE || "development";

app.listen(PORT, (error) => {
  if (error) console.log(error);

  console.log("app starting on port: " + PORT);
  console.log("mode: " + MODE);
});
