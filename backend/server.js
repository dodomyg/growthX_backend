require("dotenv").config();
const express = require("express");
const cors = require("cors");
const cookieParser = require("cookie-parser");
const mongoose = require("mongoose");

const app = express();

app.use(express.json());
app.use(cookieParser());
app.use(cors());

const PORT = process.env.PORT || 5000;

app.use("/",require('./routes/authRoutes'));
app.use("/admin",require('./routes/adminRoutes'));
app.use("/user",require('./routes/userRoutes'));

mongoose
  .connect(process.env.MONGO_URI)
  .then(() => {
    app.listen(PORT, () => {
      console.log("server is running on 5000 port and Mongodb connected ...");
    });
  })
  .catch((err) => {
    console.log(err);
  });
