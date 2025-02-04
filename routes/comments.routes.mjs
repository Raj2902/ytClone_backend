import createComment, {
  EditComment,
  videoComments,
} from "../controllers/comments.controller.mjs";
import validateJWT from "../middlewares/JWT/validate.mjs";

export default function CommentRoutes(router) {
  router.post("/create-comment/:video_id", validateJWT, createComment);
  router.get("/video-comments/:video_id", videoComments);
  router.patch("/update-comment/:comment_id", validateJWT, EditComment);
}
