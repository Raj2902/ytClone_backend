import validateJWT from "../middlewares/JWT/validate.mjs";
import validateFormFields from "../middlewares/FormFields/validate.mjs";
import validateChannelExists from "../middlewares/Channel/channel.middleware.mjs";

import cloudinary from "cloudinary";

//importing all the controllers
import UploadContent, {
  DeleteContent,
} from "../controllers/Cloudinary.controller.mjs";
import formidableData from "../middlewares/formidable/formidable.middleware.mjs";

export default function CloudinaryRoutes(router) {
  //upload content.
  router.post(
    "/upload-content/:channel_id",
    validateJWT,
    formidableData,
    validateFormFields,
    validateChannelExists,
    UploadContent
  );
  router.delete(
    "/delete-content/:channel_id/:video_id",
    validateJWT,
    DeleteContent
  );
  router.delete("/delete-video/:video_id", async (req, res) => {
    cloudinary.v2.api
      .delete_resources([req.params.video_id], {
        type: "upload",
        resource_type: "video",
      })
      .then((data) => console.log(data));
  });
}
