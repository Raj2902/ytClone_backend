import express from "express"; //import express to make the sever
import TestRoutes from "./routes/test.route.mjs";
import "dotenv/config"; // Add this line
import mongoose from "mongoose"; //use mongoose for db connection to mongoAtlas
import DBConnection from "./DBConnection/connection.mjs";
import UserRoutes from "./routes/authentication.route.mjs";
import Cloudinary from "./Cloudinary/configure.cjs";
import CloudinaryRoutes from "./routes/cloudinary.route.mjs";
import ChannelRoutes from "./routes/channel.routes.mjs";
import cors from "cors";
import PublicRoutes from "./routes/public.route.mjs";
import CommentRoutes from "./routes/comments.routes.mjs";
import ProfileRoutes from "./routes/profile.routes.mjs";
import VideoRoutes from "./routes/videos.route.mjs";

//first we need to setup the configuration of the cloudinary
Cloudinary();

const app = express();

// Serve static files from the 'public' directory
app.use(express.static("public"));

app.use(cors());
app.use(express.json()); //to parse the body from the request
const router = express.Router(); //creating router for the api's

//send mongoose as a parameter to make conection with the db
DBConnection(mongoose);

app.use("/", router); //mounts the router at the root path (/)

//sending router to the test router for making api's.
TestRoutes(router);
UserRoutes(router);
CloudinaryRoutes(router);
ChannelRoutes(router);
PublicRoutes(router);
CommentRoutes(router);
ProfileRoutes(router);
VideoRoutes(router);

app
  .listen(process.env.PORT, () => {
    //creating a server, using eviroment variables.
    console.log(`Server is running on port ${process.env.PORT}`); //print this in the console on a successfull server creation
  })
  .on("error", (err) => {
    console.log(`Error starting the server ${err}`); //print this in the console if there is a erorr in the creation of the server
  });
