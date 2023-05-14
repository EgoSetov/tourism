import { Router } from "express";
import { User } from "../dataBase/users.db.js";
import { uploadImage } from "../middleware/multer.js";
import fse from "fs-extra";
import path from "path";
import { PATH_PHOTOS, PATH_TEMP, PATH_UPLOADS } from "../utils/path.js";
import { isAuth } from "../middleware/isAuth.js";
import { asyncWrapper } from "../middleware/asyncWrapper.js";
import { City } from "../dataBase/citys.db.js";
import { Hotel } from "../dataBase/hotels.db.js";

const hotelsRouter = Router();

// * вывод всех отелей
hotelsRouter.get(
  "/get/:cityId",
  asyncWrapper(async (req, res) => {
    const { cityId } = req.params;

    const hotels = await Hotel.getHotels(cityId);

    res.send(hotels);
  })
);

// * создание отеля
hotelsRouter.post(
  "/create/:cityId",
  isAuth,
  uploadImage.any(),
  asyncWrapper(async (req, res) => {
    const {
      body,
      files,
      params: { cityId },
    } = req;

    const dataHotel = body;

    const city = City.getCityById(cityId);

    if (!city) {
      return res.status(400).json({
        message: "Город не найден",
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

    dataHotel.photos = photos;
    dataHotel.price = JSON.parse(dataHotel.price);
    dataHotel.city = cityId;

    const hotel = await Hotel.createHotel(dataHotel);

    res.status(201).json(hotel);
  })
);

// * изменение отеля
hotelsRouter.patch(
  "/update/:hotelId",
  isAuth,
  uploadImage.any(),
  asyncWrapper(async (req, res) => {
    const {
      params: { hotelId },
      body,
      userType,
      files,
    } = req;

    const dataHotel = body;

    const hotel = await Hotel.getHotelById(hotelId);

    if (!hotel) return res.status(400).json({ message: "Отдель не найден" });

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

    dataHotel.photos = JSON.parse(dataHotel.photos);
    dataHotel.price = JSON.parse(dataHotel.price);
    
    // * удаленные фотографии
    const remote_photos = [];

    for (let i = 0; i < hotel.photos.length; i++) {
      if (!dataHotel.photos.includes(hotel.photos[i])) {
        remote_photos.push(hotel.photos[i]);
      }
    }

    console.log("новых фотографий", photos);
    console.log("удалено фотографий", remote_photos);

    dataHotel.photos = [...photos, ...dataHotel.photos];

    if (remote_photos.length) {
      for (let i = 0; i < remote_photos.length; i++) {
        await fse.remove(path.join(PATH_UPLOADS, remote_photos[i]));
      }
    }

    await Hotel.updateHotel(hotelId, dataHotel);

    res.sendStatus(200);
  })
);

// * удаление отеля
hotelsRouter.delete(
  "/delete/:hotelId",
  isAuth,
  asyncWrapper(async (req, res) => {
    const {
      params: { hotelId },
      userType,
    } = req;

    const hotel = await Hotel.getHotelById(hotelId);

    if (!hotel) return res.status(400).json({ message: "Отель не найден" });

    if (userType !== "admin") {
      return res.status(403).json({ message: "Недостаточно прав" });
    }

    // * удаление фотографий поста
    if (hotel?.photos?.length) {
      for (let i = 0; i < hotel.photos.length; i++) {
        await fse.remove(path.join(PATH_UPLOADS, hotel.photos[i]));
      }
    }

    await Hotel.deleteHotel(hotelId);

    res.sendStatus(200);
  })
);

export default hotelsRouter;
