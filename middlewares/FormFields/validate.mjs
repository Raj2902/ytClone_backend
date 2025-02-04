import ServerError from "../../Errors/serverError.mjs";
import assets from "../../Schemas/assets.mjs";
import "dotenv/config"; // Add this line

export default async function validateFormFields(req, res, next) {
  //using this middleware to create JWT token
  try {
    req.body.user_id = req.user;
    req.body.channel_id = req.params.channel_id;
    req.body.thumbnail_url = req.body.image.filepath;
    req.body.video_url = req.body.video.filepath;
    req.body.createdAt = (() => {
      const date = new Date();
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    })();
    const formData = await assets.validate(req.body);
    next();
  } catch (err) {
    ServerError(res, err);
  }
}
export async function validateFormFields_updating(req, res, next) {
  //using this middleware to create JWT token
  try {
    const newBody = {};
    for (const [key, value] of Object.entries(req.body)) {
      if (value) {
        if (key == "image") {
          newBody.thumbnail_url = value.filepath;
        } else {
          newBody[key] = value;
        }
      }
    }
    ///replace the new body with the orignal request body.
    req.body = newBody;
    next();
  } catch (err) {
    ServerError(res, err);
  }
}
