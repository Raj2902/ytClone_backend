import Assets from "../Schemas/assets.mjs";
import ServerError from "../Errors/serverError.mjs";
import User from "../Schemas/user.mjs";
export default async function getAllVideos(req, res) {
  try {
    const allVideos = await Assets.find();
    if (!allVideos) {
      return res.status(400).json({ message: "Getting videos failed" });
    }
    return res.status(200).json({ data: allVideos });
  } catch (error) {
    ServerError(res, error);
  }
}
export async function getVideo(req, res) {
  try {
    const Video = await Assets.findById(req.params.id);
    if (!Video) {
      return res.status(400).json({ message: "Getting video failed" });
    }
    return res.status(200).json({ data: Video });
  } catch (error) {
    ServerError(res, error);
  }
}
export async function getUserDetails(req, res) {
  try {
    const userDetails = await User.findById(req.params.user_id).select(
      "-password"
    );
    if (!userDetails) {
      return res.status(400).json({ message: "Error getting user details" });
    }
    return res.status(200).json({ data: userDetails });
  } catch (error) {
    ServerError(res, error);
  }
}
export async function getUserDetailsByUsername(req, res) {
  try {
    const userDetails = await User.findOne({
      username: req.params.username,
    }).select("-password");
    if (!userDetails) {
      return res.status(400).json({ message: "Error getting user details" });
    }
    return res.status(200).json({ data: userDetails });
  } catch (error) {
    ServerError(res, error);
  }
}
