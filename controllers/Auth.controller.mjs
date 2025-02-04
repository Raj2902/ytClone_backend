import ServerError from "../Errors/serverError.mjs";
import jwt from "jsonwebtoken";
import User from "../Schemas/user.mjs";
import bcrypt from "bcrypt";
const saltRounds = 10;
import cloudinary from "cloudinary";

export default async function RegisterController(req, res) {
  //api for registering the user
  try {
    const { password } = req.body;
    //creating an encrypted hashed password.
    bcrypt.hash(password, saltRounds, async function (err, hash) {
      // Store hash in your password DB.
      try {
        req.body.password = hash;
        req.body.username = "@" + req.body.username;

        //upload profile image to cloudinary.
        const uploadResult = await cloudinary.uploader
          .upload(req.body.image.filepath)
          .catch((error) => {
            error.message += " for profile image, field image";
            throw error;
          });
        req.body.image = uploadResult.secure_url;

        const user = await User.create(req.body);
        if (!user) {
          return res.status(400).json({ message: "User not created" });
        }
        return res.status(201).json({ message: "User created successfully" });
      } catch (error) {
        res.status(500).json({ message: error.message });
      }
    });
  } catch (err) {
    ServerError(res, err);
  }
}

export async function LoginController(req, res) {
  //api for logging in the user
  try {
    const { password, email } = req.body;
    const regex =
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&].{7,14}$/;
    if (!regex.test(password)) {
      //check for the password correct format if its valid
      const error = new Error();
      error.status = 400;
      error.message = `Password must contain at least one lowercase letter, one uppercase letter, one number,length 8-15 characters,
         and one special character (@,$,!,%,*,?,&).`;
      throw error;
    }
    //this will validate the password if the password is correct or not
    let foundUser = await User.findOne({ email: email });
    bcrypt.compare(password, foundUser.password, function (err, result) {
      if (!result) {
        return res.status(400).json({ message: "Invalid Password" });
      }
      //This will create a JWT token
      const authToken = jwt.sign(
        {
          user_id: foundUser._id,
        },
        process.env.SECRET_KEY,
        { expiresIn: "1h" }
      );
      foundUser = {
        _id: foundUser._id,
        username: foundUser.username,
        email: foundUser.email,
        image: foundUser.image,
      };
      return res.status(200).json({
        message: "User loggged in successfully",
        token: authToken,
        user: foundUser,
      });
    });
  } catch (err) {
    ServerError(res, err);
  }
}
