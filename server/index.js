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
  const meterReadingsMappedAndChecked = aData
    .map((reading) => {
      reading.reading_date = new Date(reading.reading_date);
      return reading;
    })
    .map((reading, index, meterReadings) => {
      const sortedMeterReadingOfSameCustomer = meterReadings
        .filter((x) => x.customer_id === reading.customer_id)
        .sort((a, b) => a.reading_date - b.reading_date);
      const earlierReadings = sortedMeterReadingOfSameCustomer.slice(
        0,
        sortedMeterReadingOfSameCustomer.indexOf(reading)
      );
      if (
        earlierReadings.some(
          (otherReading) => otherReading.meter_reading >= reading.meter_reading
        )
      ) {
        reading.status = "Warning";
      } else {
        reading.status = "Okay";
      }
      return reading;
    });
  return meterReadingsMappedAndChecked;
}
