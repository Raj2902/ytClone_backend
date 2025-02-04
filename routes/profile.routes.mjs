import ProfileController from "../controllers/Profile.controller.mjs";
import formidableData from "../middlewares/formidable/formidable.middleware.mjs";
import validateJWT from "../middlewares/JWT/validate.mjs";

export default function ProfileRoutes(router) {
  router.post(
    "/update-profile",
    validateJWT,
    formidableData,
    ProfileController
  );
}
