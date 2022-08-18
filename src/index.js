const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
require("dotenv").config();

const routes = require("./routes/routes");

const app = express();
console.log(process.env.MONGO_URL);

mongoose.connect(`${process.env.MONGO_URL}`, {
  useNewUrlParser: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

const porta = process.env.PORT || 3000;
app.listen(porta, () => {
  console.log(`🚀  Express started at ${porta}`);
});
