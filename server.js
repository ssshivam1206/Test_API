const express = require("express");
const dotenv = require("dotenv");
dotenv.config({ path: "./config.env" });

const mongoose = require("mongoose");
const adminRouter = require("./routes/adminRouter");

const app = express();

app.use(express.json());
app.use(express.urlencoded({ extended: true }));

const DB = process.env.DATABASE_USER;

mongoose.connect(
  DB,
  {
    useNewUrlParser: true,
    useUnifiedTopology: true,
  },
  () => {
    console.log(`Database is connected`);
  }
);

app.use("/api/admin", adminRouter);

const PORT = process.env.PORT || 8000;

app.listen(PORT, () => {
  console.log(`Server is Running on ${PORT}`);
});
