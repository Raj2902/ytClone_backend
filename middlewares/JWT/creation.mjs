import jwt from "jsonwebtoken";
import ServerError from "../../Errors/serverError.mjs";

export default function createJWT(req, res, next) {
  //using this middleware to create JWT token
  try {
    const authToken = jwt.sign(
      {
        user_id: req.user,
      },
      process.env.SECRET_KEY,
      { expiresIn: "1h" }
    );
    res.authToken = authToken;
    next();
  } catch (err) {
    ServerError(err);
  }
}
