import mongoose from "mongoose";

const CommentSchema = mongoose.Schema({
  video_id: {
    type: "String",
    required: true,
  },
  text: {
    type: "String",
    required: true,
  },
  username: {
    type: "String",
    required: true,
  },
  image: {
    type: "String",
    required: true,
  },
  createdAt: {
    type: "String",
    required: true,
    default: (() => {
      const date = new Date();
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    })(),
  },
});
export default mongoose.model("comments", CommentSchema);
