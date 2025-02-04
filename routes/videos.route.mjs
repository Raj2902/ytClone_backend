import validateJWT from "../middlewares/JWT/validate.mjs";
import { validateChannelExists_updating } from "../middlewares/Channel/channel.middleware.mjs";

//importing all the controllers
import { UpdateContent } from "../controllers/Cloudinary.controller.mjs";
import formidableData from "../middlewares/formidable/formidable.middleware.mjs";
import { validateFormFields_updating } from "../middlewares/FormFields/validate.mjs";

export default function VideoRoutes(router) {
  //update video content.
  router.patch(
    "/update-video-data/:channel_id/:video_id",
    validateJWT,
    formidableData,
    validateFormFields_updating,
    validateChannelExists_updating,
    UpdateContent
  );
}
