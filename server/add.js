const express = require("express");
const app = express();
const csv = require("csv-parser");
const fs = require("fs");

const port = 3000;
let internalState = [];

app.get("/server/meterReadings", (req, res) => {
  res.send(analyzeData(internalState));
});
