const express = require("express");
//const cors = require('cors');
const csv = require("csv-parser");
const fs = require("fs");
const { ok } = require("assert");

const app = express();
//app.use(cors());  // ...

const port = 3000;
let internalState = [];

app.get('/webapp/sum', (req, res) => {
  const opInfo = req.query;
  const c_res = Number(opInfo.operand1) + Number(opInfo.operand2);
  const o_res = {'data': c_res}
  res.send(o_res)
})
//Problem: [object Undefined]
// res.send: can send int and str in obj.

app.get('/webapp/multiply', (req, res) => {
  const opInfo = req.query;
  const c_res = Number(opInfo.operand1) * Number(opInfo.operand2);
  const o_res = {'data': c_res}
  res.send(o_res)
})

app.post('/webapp/sum', (req, res) => {
  const opInfo = req.headers; //req.rawHeaders;
  const c_res = Number(opInfo.operand1) + Number(opInfo.operand2);
  const o_res = {'data': c_res}
  res.send(o_res)
})


app.post('/webapp/multiply', (req, res) => {
  const opInfo = req.headers; //req.rawHeaders;
  const c_res = Number(opInfo.operand1) * Number(opInfo.operand2);
  const o_res = {'data': c_res}
  res.send(o_res)
})

app.use("/webapp", express.static("./webapp"));
console.log(__dirname);

app.listen(port, () => {
  fs.createReadStream(__dirname + "/data.csv")
    .pipe(csv())
    .on("data", (data) => internalState.push(data));

  console.log(`App listening on port ${port}`);
});
