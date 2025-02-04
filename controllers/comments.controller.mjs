import ServerError from "../Errors/serverError.mjs";
import Comment from "../Schemas/comment.mjs";
import User from "../Schemas/user.mjs";

export default async function createComment(req, res) {
  try {
    req.body.video_id = req.params.video_id;
    const response = await User.findById(req.user);
    req.body.username = response.username;
    req.body.image = response.image;
    const commentRes = await Comment.create(req.body);
    if (!commentRes) {
      return res.status(400).json({ message: "Unable to create comment" });
    }
    return res
      .status(201)
      .json({ message: "Comment created successfully", data: commentRes });
  } catch (error) {
    ServerError(res, error);
  }
}

export async function videoComments(req, res) {
  try {
    const commentRes = await Comment.find({ video_id: req.params.video_id });
    if (!commentRes) {
      return res.status(400).json({ message: "Unable to retrive comments" });
    }
    return res
      .status(200)
      .json({ message: "Comments retrived successfully", data: commentRes });
  } catch (error) {
    ServerError(res, error);
  }
}
//controller that handles editing comments
export async function EditComment(req, res) {
  try {
    //first find the comment using comment id
    const commentRes = await Comment.findById(req.params.comment_id);
    if (!commentRes) {
      return res.status(400).json({ message: "Unable to retrive comments" });
    }
    //check the user who made the comment by using the username in the found document
    //match the username found in the document with the username of the person that sended the request
    const user = await User.findById(req.user);
    if (!user) {
      //user not found
      const error = new Error();
      error.message = "User not found";
      throw error;
    } else if (user && user.username != commentRes.username) {
      //not the owner of the comment
      const error = new Error();
      error.message = "You are not the owner of this comment";
      throw error;
    } else if (user && user.username == commentRes.username) {
      //if the text field is not empty
      if (!req.body.text) {
        return res.status(400).json({ message: "Text field is required" });
      }
      //update the comment
      const updatedComment = await Comment.findByIdAndUpdate(
        req.params.comment_id,
        { text: req.body.text },
        { new: true }
      );
      return res.status(200).json({
        message: "Comment updated successfully",
        data: updatedComment,
      });
    }
  } catch (error) {
    ServerError(res, error);
  }
}
