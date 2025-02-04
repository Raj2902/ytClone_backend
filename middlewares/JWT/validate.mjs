import jwt from "jsonwebtoken";
import ServerError from "../../Errors/serverError.mjs";

export default function validateJWT(req, res, next) {
  //using this middleware to create JWT token
  try {
    const token = req.header("authorization");
    if (!token) {
      const error = new Error();
      error.message = "Unauthorized access";
      throw error;
    }
    var verifiedToken = jwt.verify(token.split(" ")[1], process.env.SECRET_KEY);
    req.user = verifiedToken.user_id;
    next();
  } catch (err) {
    ServerError(res, err);
  }
}
