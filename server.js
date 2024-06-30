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
  .connect(DBConnection, {
    useNewUrlParser: true,
  })
  .then((conn) => {
    //console.log(conn);
    console.log("connected to mongodb successfully..");
  })
  .catch((err) => {
    console.log(err);
  });

let port = 3000;

app.listen(port, () => {
  console.log(`app is listening on port number: ${port}`);
});
