const app = require("./app");
const mongoose = require("mongoose");
const dotenv = require("dotenv");

let DBConnection = process.env.DATABASE_CONNECTION.replace(
  "<PASSWORD>",
  process.env.DATABASE_PASSWORD
);

DBConnection = DBConnection.replace(
  "<USERNAME>",
  process.env.DATABASE_USERNAME
);

//console.log(DBConnection);

//mongoose connection ---
mongoose
  .connect(DBConnection)
  .then((conn) => {
    //console.log(conn);
    console.log("connected to mongodb successfully..");
  });

let port = 3000;

const server = app.listen(port, () => {
  console.log(`app is listening on port number: ${port}`);
});

//used for catching async errors in server.js
process.on("unhandledRejection", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});

//used for catching sync errors in server.js
process.on("uncaughtException", (err) => {
  console.log(err.name, err.message);
  server.close(() => {
    process.exit(1);
  });
});
