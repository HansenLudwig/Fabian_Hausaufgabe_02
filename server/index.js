const express = require("express");
const app = express();
const csv = require("csv-parser");
const fs = require("fs");

const port = 3000;
let internalState = [];

app.get("/server/meterReadings", (req, res) => {
  res.send(analyzeData(internalState));
});

app.use("/webapp", express.static("./webapp"));
console.log(__dirname);

app.listen(port, () => {
  fs.createReadStream(__dirname + "/data.csv")
    .pipe(csv())
    .on("data", (data) => internalState.push(data));

  console.log(`App listening on port ${port}`);
});

function analyzeData(aData) {
  const meterReadingsMappedAndChecked = [...aData];
  //TODO Implement this function to detect malicious meter readings in aData
  return meterReadingsMappedAndChecked;
}
