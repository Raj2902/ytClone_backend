import mongoose from "mongoose";
import "dotenv/config"; // Add this line
const AssetSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  channel_id: {
    type: String,
    required: true,
  },
  thumbnail_url: {
    type: String,
    required: true,
    unique: true,
  },
  video_url: {
    type: String,
    required: true,
    unique: true,
  },
  categories: {
    type: [String],
    required: true,
  },
  title: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  tags: {
    type: [String],
    required: true,
  },
  comments: {
    type: [String],
    default: [],
  },
  likes: {
    type: Number,
    default: 0,
  },
  dislikes: {
    type: Number,
    default: 0,
  },
  createdAt: {
    type: String,
    required: true,
  },
});
export default mongoose.model("assets", AssetSchema);
