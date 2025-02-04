import Channel from "../Schemas/channel.mjs";
import ServerError from "../Errors/serverError.mjs";
import Assets from "../Schemas/assets.mjs";
import cloudinary from "cloudinary";

export default async function createdChannel(req, res) {
  try {
    req.body.user_id = req.user;

    //username can't have spaces
    const regex = /\s/; //regex to check if there are spaces
    if (regex.test(req.body.username)) {
      //if it has spaces return and error response
      return res.status(400).json({ message: "Username cannot have spaces" });
    }

    req.body.username = "@" + req.body.username;
    const createdChannel = await Channel.create(req.body);
    if (!createdChannel) {
      return res.status(400).json({ message: "Channel creation failed" });
    }
    return res.status(201).json({ message: "Channel created successfully" });
  } catch (error) {
    ServerError(res, error);
  }
}
export async function channelDetailsById(req, res) {
  try {
    const detailsChannelId = await Channel.findById(req.params.channelId);
    if (!detailsChannelId) {
      return res
        .status(400)
        .json({ message: "Getting Channel details failed" });
    }
    return res.status(200).json(detailsChannelId);
  } catch (error) {
    ServerError(res, error);
  }
}
export async function channelDetailsByUsername(req, res) {
  try {
    const detailsUsername = await Channel.findOne({
      username: req.params.username,
    });
    if (!detailsUsername) {
      return res
        .status(400)
        .json({ message: "Getting Channel details failed" });
    }
    return res.status(200).json(detailsUsername);
  } catch (error) {
    ServerError(res, error);
  }
}
export async function channels(req, res) {
  try {
    const channels = await Channel.find({ user_id: req.params.user_id });
    if (!channels) {
      return res
        .status(400)
        .json({ message: "Getting Channels of the user failed" });
    }
    return res.status(200).json(channels);
  } catch (error) {
    ServerError(res, error);
  }
}
//getting all the channel videos related to the channel username
export async function channelVideos(req, res) {
  try {
    const channel = await Channel.findOne({
      username: req.params.username,
    });
    if (!channel) {
      const error = new Error();
      error.message = "Unable to get channel details";
      throw error;
    }
    const channelVideos = await Assets.find({ channel_id: channel._id });
    if (!channelVideos) {
      const error = new Error();
      error.message = "Unable to get channel Videos";
      throw error;
    }
    return res.status(200).json({
      message: "Videos fetched successfully",
      data: channelVideos,
    });
  } catch (error) {
    console.error("Error fetching videos:", error);
    ServerError(res, error);
  }
}

//update channel details controller

export async function updateChannelDetails(req, res) {
  try {
    const channel = await Channel.findOne({
      _id: req.params.channel_id,
      user_id: req.user,
    });

    if (!channel) {
      const error = new Error();
      error.message = "No such channel found";
      throw error;
    }
    if (req.body.image && req.body.image.filepath) {
      const str = channel.image;
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
            resolve(result);
          }
        });
      });

      deleteImage
        .then((res) => console.log("data from delete image::", res))
        .catch((err) => console.log(err));

      //after prev image deleted successfully upload the new image.
      const uploadImageResult = await cloudinary.uploader
        .upload(req.body.image.filepath)
        .catch((error) => {
          throw error;
        });
      //update image_url to mongoAtlas database
      uploadImageResult.secure_url;
      const updatedChannelImage = await Channel.findOneAndUpdate(
        { _id: req.params.channel_id, user_id: req.user },
        {
          image: uploadImageResult.secure_url,
        },
        { new: true }
      );
    }
    if (req.body.banner_image && req.body.banner_image.filepath) {
      const str = channel.banner_image;
      const splitArr = str.split("/");
      const imageName = splitArr[splitArr.length - 1];
      const public_id = imageName.split(".")[0];

      const deleteBannerImage = new Promise((resolve, reject) => {
        //delete that banner image from the cloudinary using the public id
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

      deleteBannerImage
        .then((res) => console.log("data from delete banner image::", res))
        .catch((err) => console.log(err));

      //after prev banner image deleted successfully upload the new banner image.
      const uploadBannerImageResult = await cloudinary.uploader
        .upload(req.body.banner_image.filepath)
        .catch((error) => {
          throw error;
        });
      //update banner image to mongoAtlas database
      uploadBannerImageResult.secure_url;
      const updatedChannelBannerImage = await Channel.findOneAndUpdate(
        { _id: req.params.channel_id, user_id: req.user },
        {
          banner_image: uploadBannerImageResult.secure_url,
        },
        { new: true }
      );
    }
    //update the rest of the data in the body other than image and banner_image.
    const { channel_name, username, channel_description, about } = req.body;
    let updateBody = {};
    if (channel_name) {
      updateBody.channel_name = channel_name;
    }
    if (username) {
      if (username[0] == "@") updateBody.username = username;
      else updateBody.username = "@" + username;
    }
    if (channel_description) {
      updateBody.channel_description = channel_description;
    }
    if (about) {
      updateBody.about = about;
    }
    const updatedChannelDetails = await Channel.findOneAndUpdate(
      { _id: req.params.channel_id, user_id: req.user },
      updateBody,
      { new: true }
    );

    return res.status(200).json({
      message: "Channel updated successfully",
      ...updatedChannelDetails._doc,
    });
  } catch (error) {
    ServerError(res, error);
  }
}
