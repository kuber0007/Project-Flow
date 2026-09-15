import "dotenv/config";

import app from "./app.js";
import connectDB from "./config/db.js";

connectDB()
  .then(() => {
    app.on("error", (error) => {
      console.log("ERR: ", error);
      throw error;
    });

    app.listen(
      process.env.PORT || 8000,
      () => {
        console.log(
          `Server is running at Port ${
            process.env.PORT || 8000
          }`
        );
      }
    );
  })
  .catch((err) => {
    console.log(
      "MongoDB connection Failed!!",
      err
    );
  });