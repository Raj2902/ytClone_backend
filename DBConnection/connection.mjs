export default function DBConnection(mongoose) {
  //connect to mongodb using mongoose.
  mongoose.connect(process.env.MONGODB_URL);
  const db = mongoose.connection; //making an instance of the connection to the database.

  db.on("open", () => {
    console.log("Connection made successfully with database.");
  }); //database connected successfully
  db.on("error", () => {
    console.log("Error making connection to the database.");
  }); //if there is an error connection database
}
