import jwt from "jsonwebtoken";
import { User } from "../dataBase/users.db.js";

const isAuth = async (req, res, next) => {
  try {
    let token = req.get("Authorization");

    if (token && token.includes("Bearer")) {
      let splitToken = token.split(" ");
      token = splitToken[1];
    }

    const decodedToken = jwt.decode(token, process.env.SECRET_KEY);

    if (!decodedToken || !decodedToken.id) return res.status(401).send("invalid token");

    const user = await User.getUserById(decodedToken.id);

    if (!user) return res.status(401).send("invalid token");

    req.userId = user.id;
    req.userType = user.type;
    next();
  } catch (error) {
    next(error);
  }
};

export { isAuth };
