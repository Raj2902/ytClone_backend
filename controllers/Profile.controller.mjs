import ServerError from "../Errors/serverError.mjs";
import User from "../Schemas/user.mjs";
import cloudinary from "cloudinary";

export default async function ProfileController(req, res) {
  try {
    //find the public id of the image for the current id
    const foundUser = await User.findById(req.user);
    const str = foundUser.image;
    const splitArr = str.split("/");
    const imageName = splitArr[splitArr.length - 1];
    const public_id = imageName.split(".")[0];

    const deleteImage = new Promise((resolve, reject) => {
      //delete that image from the cloudinary using the public id
      cloudinary.uploader.destroy(public_id, function (error, result) {
        if (error) {
          console.error("Error deleting image:", error);
          reject(error);
        } else {
          console.log("Image deleted successfully:", result);
          resolve(result);
        }
      });
    });

    deleteImage
      .then((res) => console.log("data from delete image::", res))
      .catch((err) => console.log(err));

    //check if the image is sended as an request if yes upload that image to the cloudinary

    let updatedProfile = {};

    if (Object.keys(req.body).includes("image")) {
      //after prev image deleted successfully upload the new image.
      const uploadImageResult = await cloudinary.uploader
        .upload(req.body.image.filepath)
        .catch((error) => {
          throw error;
        });
      //update image_url and changed username to mongoAtlas database
      uploadImageResult.secure_url;
      updatedProfile = await User.findByIdAndUpdate(
        req.user,
        {
          username: req.body.username,
          image: uploadImageResult.secure_url,
        },
        { new: true }
      );
    } else {
      //update only the username to mongoAtlas database
      updatedProfile = await User.findByIdAndUpdate(
        req.user,
        {
          username: "@" + req.body.username,
        },
        { new: true }
      );
    }
    const { username, email, image, _id } = updatedProfile;
    const result = { username, email, image, _id };
    res
      .status(200)
      .json({ message: "Profile updated successfully.", data: result });
  } catch (err) {
    ServerError(res, err);
  }
}
