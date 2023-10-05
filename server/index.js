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
  //const meterReadingsMappedAndChecked = [...aData];
  /* I don't know what does [...Array] mean, and I'm not sure if I should keep using
    this const meterRMAC. here. 
     Because I can't do any modification to it if it's const, at least I believe so,
    so I decided not to use it.*/

  //[Done]TODO Implement this function to detect malicious meter readings in aData
  /* The current test shows that the specified function has been implemented. */

  /* [Note]:
     This is based on a stupid idea, 'cause I don't know whether the same meter can be
    used by more than one user(id), so I used "user_id+meter_id" as prime-key and make
    different lists for each of them.
     Then I sort() them by data and check if there's suspicious data.
     After a suspicious data found, I use a list to save their 'id' of recorder, and
    search origenal aData array and Tag them with "Warning"-status.
     I know it's quite an inefficient approach. As the warning_list of id become longer
    the system will check the whole warning_list for each recording. But based on my
    lack of understanding and experience with Js, I decided to implement its functionality
    like this first.
     I know I forgot quite a few semicolons(;) in the second half of the code.
    I also know they are not necessary for Js.
    I should use them based on overall style uniformity.
    But it's too late as I noticed. And I'm too lazy too hahahaha :(
  */

  /* [Questions]:
   1. about [...aData]
   2. If this function returns meterReadingsMappedAndChecked, should I change the const into
     var to achieve the function, or there's other way?
     ('cause I understand that using aData directly(do changes on origenal data) is not a good idea)
   3. Will it be smarter, if I use index(or "id" of rec.) to save and read each data?
     (If I didn't make this clear, we could talk about it later :) )
     Otherwise, is there a approch with sth. like pointer in C/C++ ?
  */
  var meter_list = {};

  len_aData = aData.length;

  for (i=0; i<len_aData; i++)
  {
    var meter_name = aData[i].customer_id + aData[i].meter_id;
    if( meter_list.hasOwnProperty(meter_name) ) {
      meter_list[meter_name].push(aData[i]);
    }
    else {
      meter_list[meter_name] = [aData[i]];
    }
  }

  var warning_list = [];

  for (l_meter in meter_list) {
    meter_list[l_meter].sort(function(a,b){return a.reading_data - b.reading_data;});
    len_l_meter = meter_list[l_meter].length
    for (i=0; i<len_l_meter-1; i++)
    {
      if(meter_list[l_meter][i].meter_reading > meter_list[l_meter][i+1].meter_reading){
        warning_list.push(meter_list[l_meter][i+1].id);
      }
    }
  }

  for (i=0; i<len_aData; i++) {
    if (warning_list.includes(aData[i].id) ) {
      aData[i].status = "Warning";
    }
  }

  const meterReadingsMappedAndChecked = [...aData];

  return meterReadingsMappedAndChecked;
}
