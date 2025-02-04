import ServerError from "../../Errors/serverError.mjs";
import assets from "../../Schemas/assets.mjs";
import channel from "../../Schemas/channel.mjs";

export default async function validateChannelExists(req, res, next) {
  // Check if the channel exists
  try {
    const channelData = await channel.find({ user_id: req.user });
    if (!channelData) {
      return res.status(400).json({ message: "Please create a channel first" });
    }
    let validate = 0;
    channelData.map((data) => {
      if (data._id.toString() === req.params.channel_id) {
        validate = 1;
      }
    });
    if (!validate) {
      return res
        .status(400)
        .json({ message: "Can't upload video to others channel." });
    }
    next();
  } catch (error) {
    ServerError(res, error);
  }
}

export async function validateChannelExists_updating(req, res, next) {
  // Check if the channel exists
  try {
    const channelData = await channel.find({ user_id: req.user });
    if (!channelData) {
      return res
        .status(400)
        .json({ message: "No channel found for the user provided" });
    }
    let validate = 0;
    channelData.map((data) => {
      if (data._id.toString() === req.params.channel_id) {
        validate = 1;
      }
    });
    if (!validate) {
      return res
        .status(400)
        .json({ message: "Can't update video to others channel." });
    }
    //check if the video that is trying to edit belong to the same channel or not
    const thumbnail = await assets.findOne({
      channel_id: req.params.channel_id,
      _id: req.params.video_id,
    });
    if (!thumbnail) {
      return res
        .status(400)
        .json({ message: "Video not found in the channel" });
    }
    req.body.prev_thumbnail_url = thumbnail.thumbnail_url;
    next();
  } catch (error) {
    ServerError(res, error);
  }
}
