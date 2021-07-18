const express = require("express");
const axios = require("axios");
const cors = require("cors");
const path = require("path");
require("dotenv").config();
const app = express();
app.use(cors());
app.use(express.static(path.join(__dirname, "/client/build")));

app.get("/api/v2/covid19", async (req, res) => {
  const response = await axios.get("http://corona-api.com/countries");

  return res.json({
    data: response.data,
  });
});

app.get("*", function (req, res) {
  res.sendFile(path.join(__dirname, "/client/build", "index.html"));
});

app.listen(
  process.env.PORT,
  console.log(`Listening on port: ${process.env.PORT}`)
);
