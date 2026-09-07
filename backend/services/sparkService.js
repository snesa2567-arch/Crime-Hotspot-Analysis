const fs = require("fs");
const path = require("path");

const FILE =
path.join(
  __dirname,
  "../../outputs/spark_crime_trend/part-00000"
);

function getCrimeTrend() {

  const rows =
    fs.readFileSync(
      FILE,
      "utf8"
    )
    .trim()
    .split("\n");

  return rows
    .slice(1)
    .map(row => {

      const data =
        row.split(",");

      return {

        city:
          data[0],

        crimeCount:
          Number(data[1])

      };

    });

}

module.exports = {
  getCrimeTrend
};