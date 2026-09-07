const fs = require("fs");
const path = require("path");

const FILE =
path.join(
  __dirname,
  "../../data/police_stations_india.csv"
);

function getStations(city) {

  const rows =
    fs.readFileSync(
      FILE,
      "utf8"
    )
    .trim()
    .split("\n");

  const stations =
    rows
      .slice(1)
      .map(row => row.split(","));

  return stations
    .filter(
      row =>
        row[2]
          .trim()
          .toLowerCase()
        ===
        city
          .trim()
          .toLowerCase()
    )
    .map(row => ({

      stationId:
        row[0],

      policeStation:
        row[1],

      city:
        row[2],

      state:
        row[3],

      latitude:
        row[4],

      longitude:
        row[5],

      landmark:
        row[6],

      contact:
        row[7]

    }));

}

module.exports = {
  getStations
};