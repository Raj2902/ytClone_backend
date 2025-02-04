import mongoose from "mongoose";
const channelSchema = mongoose.Schema({
  user_id: {
    type: String,
    required: true,
  },
  channel_name: {
    type: String,
    required: true,
  },
  image: {
    type: String,
    required: true,
    unique: true,
  },
  banner_image: {
    type: String,
    required: true,
    unique: true,
  },
  username: {
    type: String,
    required: true,
    unique: true,
  },
  channel_description: {
    type: String,
    required: true,
  },
  about: {
    type: String,
    required: true,
  },
  subscribers: {
    type: Number,
    default: 0,
    required: true,
  },
  total_videos: {
    type: Number,
    default: 0,
    required: true,
  },
  total_views: {
    type: Number,
    default: 0,
    required: true,
  },
  createAt: {
    type: String,
    default: () => {
      const date = new Date();
      return date.toLocaleString("en-US", {
        year: "numeric",
        month: "long",
        day: "numeric",
      });
    },
  },
});

export default mongoose.model("channels", channelSchema);
