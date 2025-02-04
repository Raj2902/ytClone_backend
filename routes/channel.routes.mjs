import createdChannel, {
  channelDetailsById,
  channelDetailsByUsername,
  channels,
  channelVideos,
  updateChannelDetails,
} from "../controllers/channel.controller.mjs";
import { uploadCBImage } from "../middlewares/Cloudinary/upload.mjs";
import validateJWT from "../middlewares/JWT/validate.mjs";
import formidableData from "../middlewares/formidable/formidable.middleware.mjs";

export default function ChannelRoutes(router) {
  router.post(
    "/create-channel",
    validateJWT,
    formidableData,
    uploadCBImage,
    createdChannel
  );
  router.get("/channel-details-byUsername/:username", channelDetailsByUsername);
  router.get("/channel-details-byChannelId/:channelId", channelDetailsById);
  router.get("/channel-videos/:username", channelVideos);
  router.get("/get-channels/:user_id", channels);
  router.patch(
    "/update-channel-details/:channel_id",
    validateJWT,
    formidableData,
    updateChannelDetails
  );
}
