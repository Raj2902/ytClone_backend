import cloudinary from "cloudinary";

import Assets from "../../Schemas/assets.mjs";
import ServerError from "../../Errors/serverError.mjs";

//upload the thumbnail image
export default function uploadImage(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      // Upload an image
      const uploadResult = await cloudinary.uploader
        .upload(req.body.thumbnail_url)
        .catch((error) => {
          console.log(error);
        });
      if (!uploadResult) {
        return reject(new ServerError("Failed to upload image", 500));
      } else {
        //upload thumbnail_url to mongoAtlas database
        req.body.userId = req.user;
        req.body.thumbnail_url = uploadResult.secure_url;
        resolve(uploadResult);
      }
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
}

//update the thumbnail image
export function updateImage(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      if (req.body && req.body.thumbnail_url) {
        // Upload new image
        const updateResult = await cloudinary.uploader
          .upload(req.body.thumbnail_url)
          .catch((error) => {
            console.log(error);
          });

        //delete the previous thumbnail image from cloudinary
        const str = req.body.prev_thumbnail_url;
        const splitArr = str.split("/");
        const imageName = splitArr[splitArr.length - 1];
        const public_id = imageName.split(".")[0];

        const deleteImage = new Promise((resolve, reject) => {
          //delete that image from the cloudinary using the public id
          cloudinary.uploader.destroy(public_id, function (error, result) {
            if (error) {
              reject(error);
            } else {
              resolve(result);
            }
          });
        });

        deleteImage
          .then((res) => console.log("data from delete image::", res))
          .catch((err) => console.log(err));

        //update thumbnail_url of the video into mongoAtlas database
        req.body.userId = req.user;
        req.body.thumbnail_url = updateResult.secure_url;
      }

      const thumbnail = await Assets.findByIdAndUpdate(
        req.params.video_id,
        { ...req.body },
        { new: true }
      );
      if (!thumbnail) {
        reject({ message: "Failed to update video data" });
      }
      resolve({
        message: "updated video data Successfully",
        data: thumbnail,
      });
    } catch (error) {
      reject(error); // Reject the promise with the error
    }
  });
}

//upload the channel + banner image
export async function uploadCBImage(req, res, next) {
  try {
    // Upload a channel image
    const uploadCResult = await cloudinary.uploader
      .upload(req.body.image.filepath)
      .catch((error) => {
        error.message += " for channel image field image";
        throw error;
      });

    //upload image_url to mongoAtlas database
    req.body.userId = req.user;
    req.body.image = uploadCResult.secure_url;

    // Upload a banner image
    const uploadBResult = await cloudinary.uploader
      .upload(req.body.banner_image.filepath)
      .catch((error) => {
        error.message += " for channel banner image field banner_image";
        throw error;
      });

    //upload banner_image_url to mongoAtlas database
    req.body.userId = req.user;
    req.body.banner_image = uploadBResult.secure_url;
    next();
  } catch (error) {
    ServerError(res, error); // Reject the promise with the error
  }
}

//upload the video

export function uploadVideo(req, res) {
  return new Promise(async (resolve, reject) => {
    try {
      const uploadResult = await cloudinary.v2.uploader
        .upload(req.body.video_url, {
          resource_type: "video",
        })
        .catch((error) => {
          console.log(error);
        });

      //upload video_url to mongoAtlas database
      req.body.userId = req.user;
      req.body.video_url = uploadResult.secure_url;

      const thumbnail = await Assets.create(req.body);
      if (!thumbnail) {
        reject({ message: "Failed to add video" });
      }
      resolve({ message: "Video uploaded Successfully", data: thumbnail });
    } catch (err) {
      reject(err);
    }
  });
}
