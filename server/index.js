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
  aData.map(
	e => {
		e.status = "Okay";	
		return e;
	}
  )
  const grouped_by = 
		aData.reduce(
			(g, item) => {
				if (g[item.customer_id]) {
					if (g[item.customer_id][item.meter_id]) {
						g[item.customer_id][item.meter_id].push(item);
					} else {
						g[item.customer_id][item.meter_id] = [item];
					}
				} else {
					g[item.customer_id] = {};
					g[item.customer_id][item.meter_id] = [item];
				}
				return g;
			},
			{});
  for (customer_id in grouped_by) {
	for (meter_id in grouped_by[customer_id]) {
		const g = grouped_by[customer_id][meter_id].sort(
			(a, b) => {
				const x = new Date(a.reading_date);
				const y = new Date(b.reading_date);

				return x - y;
			}
		);
		console.log(g);
		for (var i = 1; i < g.length; i++) {
			if (Number(g[i].meter_reading) < Number(g[i-1].meter_reading)) {
				g[i].status = "Warning";
			}
		}
	}
  }
  const meterReadingsMappedAndChecked = [...aData];
  //TODO Implement this function to detect malicious meter readings in aData
  
  return meterReadingsMappedAndChecked;
}
