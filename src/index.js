const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const routes = require("./routes/routes");

const app = express();

mongoose.connect(process.env.MONGO_URL, {
  useNewUrlParser: true,
});

app.use(cors());
app.use(express.json());
app.use(routes);

const porta = 3333;
app.listen(porta, () => {
  console.log(`🚀  Express started at ${porta}`);
});
