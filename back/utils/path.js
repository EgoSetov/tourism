import path from "path";
import * as url from "url";

const __dirname = url.fileURLToPath(new URL(".", import.meta.url));

const PATH_BUILD = path.join(__dirname, "..", "..", "build");

const PATH_TEMP = path.join(__dirname, "..", "temp");

const PATH_AVATARS = path.join(__dirname, "..", "uploads", "avatars");

const PATH_PHOTOS = path.join(__dirname, "..", "uploads", "citys");

const PATH_NEWS = path.join(__dirname, "..", "uploads", "news");

const PATH_UPLOADS = path.join(__dirname, "..", "uploads");

export { PATH_TEMP, PATH_AVATARS, PATH_UPLOADS, PATH_PHOTOS, PATH_NEWS, PATH_BUILD };
