import multer from "multer";
import { v4 as uuidv4 } from "uuid";

const MAX_SIZE_PHOTO = 10 * 1024 * 1024; // 10MB

const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "temp");
  },
  filename: (req, file, cb) => cb(null, uuidv4() + "." + file.originalname.split(".").pop()),
});

const fileFilterForImage = (req, file, cb) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpeg" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/svg+xml"
  ) {
    cb(null, true);
  } else {
    req.forbidden_format = true;
    cb(null, false);
  }
};

const uploadImage = multer({ storage, fileFilter: fileFilterForImage, limits: { fileSize: MAX_SIZE_PHOTO } });

export { uploadImage };
