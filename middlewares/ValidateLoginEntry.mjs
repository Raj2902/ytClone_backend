import ServerError from "../Errors/serverError.mjs";
import User from "../Schemas/user.mjs";

export default async function checkUserExists(req, res, next) {
  try {
    const { email } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return res.status(400).json({ message: "User not found" });
    }
    next();
  } catch (err) {
    ServerError(res, err);
  }
}
