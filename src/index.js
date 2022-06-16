const express = require("express");
const mongoose = require("mongoose");

const routes = require("./routes/routes");

const app = express();

mongoose.connect("mongodb://127.0.0.1:27017", {
  useNewUrlParser: true,
});

app.use(express.json());
app.use(routes);

const porta = 3333;
app.listen(porta, () => {
  console.log(`🚀 - Express started at ${porta}`);
});
