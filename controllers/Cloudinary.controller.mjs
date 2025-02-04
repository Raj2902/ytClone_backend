import ServerError from "../Errors/serverError.mjs";
import uploadImage, {
  uploadVideo,
  updateImage,
} from "../middlewares/Cloudinary/upload.mjs";
import Assets from "../Schemas/assets.mjs";
import cloudinary from "cloudinary";

export async function UpdateContent(req, res) {
  try {
    //calling updateImage function to upload the image to cloudinary and update image path to database and delete the previous image from
    //the cloudinary
    const updateImageResult = await updateImage(req, res);
    return res.status(201).json(updateImageResult);
  } catch (err) {
    ServerError(res, err);
  }
}

export default async function UploadContent(req, res) {
  try {
    //calling uploadImage function to upload the image to cloudinary and image path to database
    const uploadImageResult = await uploadImage(req, res);
    //calling uploadVideo function to upload the video to cloudinary and video path to database
    const totalResult = await uploadVideo(req, res);
    //no need to upload video data seprately through any function calls as its already in the body and
    //will be added to the assets in the uploadVideo function call along with the rest of the data.

    return res.status(201).send(totalResult);
  } catch (err) {
    ServerError(res, err);
  }
}

export async function DeleteContent(req, response) {
  try {
    //first check if the user in the owner of the channel provided and video is of the same channel
    const userChannelCheck = await Assets.findOne({
      user_id: req.user,
      _id: req.params.video_id,
      channel_id: req.params.channel_id,
    });
    if (!userChannelCheck) {
      return response
        .status(401)
        .json({ message: "You are not the owner of this channel or video" });
    }
    //delete the video and thumbnail from cloudinary

    //get the public id of the thumbnail
    const splitImgArr = userChannelCheck.thumbnail_url.split("/");
    const imageName = splitImgArr[splitImgArr.length - 1];
    const public_thumbnail_id = imageName.split(".")[0];

    //get the public id of the video
    const splitVideoArr = userChannelCheck.video_url.split("/");
    const VideoName = splitVideoArr[splitVideoArr.length - 1];
    const public_video_id = VideoName.split(".")[0];

    //delete video thumbnail
    const deleteImage = new Promise((resolve, reject) => {
      //delete that image from the cloudinary using the public id
      cloudinary.uploader.destroy(
        public_thumbnail_id,
        function (result, error) {
          if (error) {
            reject(error);
          } else {
            resolve(result);
          }
        }
      );
    });

    deleteImage
      .then((res) => {
        //delete video
        cloudinary.v2.api
          .delete_resources([public_video_id], {
            type: "upload",
            resource_type: "video",
          })
          .then(async (data) => {
            //delete the rest of the data
            const deleteAsset = await Assets.deleteOne({
              user_id: req.user,
              _id: req.params.video_id,
              channel_id: req.params.channel_id,
            });
            if (!deleteAsset) {
              return response
                .status(404)
                .json({ message: "Video not deleted" });
            }
            return response
              .status(200)
              .json({ message: "Video deleted successfully" });
          })
          .catch((err) => console.log(err));
      })
      .catch((err) => console.log(err));
  } catch (err) {
    ServerError(res, err);
  }
}
