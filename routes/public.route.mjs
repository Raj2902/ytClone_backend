import getAllVideos, {
  getUserDetails,
  getUserDetailsByUsername,
  getVideo,
} from "../controllers/public.controller.mjs";

export default function PublicRoutes(router) {
  router.get("/all-videos", getAllVideos);
  router.get("/videos/:id", getVideo);
  router.get("/user-details/:user_id", getUserDetails);
  router.get("/user-details-by-username/:username", getUserDetailsByUsername);
}
