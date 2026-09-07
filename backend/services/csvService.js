const fs = require("fs");
const path = require("path");

const OUTPUT_PATH = path.join(__dirname, "../../outputs");

function readFile(filePath) {
  return fs
    .readFileSync(filePath, "utf8")
    .trim()
    .split("\n")
    .map(line => line.split("\t"));
}

function getCities() {
  const data = readFile(
    path.join(OUTPUT_PATH, "city_count", "part-r-00000")
  );

  return data.map(row => ({
    city: row[0],
    crimeCount: Number(row[1])
  }));
}

function getCrimeCount(city) {
  const data = readFile(
    path.join(OUTPUT_PATH, "city_count", "part-r-00000")
  );

  const row = data.find(r => r[0] === city);

  return row
    ? {
        city: row[0],
        crimeCount: Number(row[1])
      }
    : null;
}

function getViolentCrime(city) {
  const data = readFile(
    path.join(
      OUTPUT_PATH,
      "city_violent_output",
      "part-r-00000"
    )
  );

  const row = data.find(
    r => r[0] === city
  );

  return row
    ? {
        city: row[0],
        violentCrime: Number(row[1])
      }
    : null;
}

function getWeapons(city) {
  const data = readFile(
    path.join(OUTPUT_PATH, "city_weapon_output", "part-r-00000")
  );

  return data
    .filter(row => row[0] === city)
    .map(row => ({
      weapon: row[1],
      count: Number(row[2])
    }));
}

function getAgeGroups(city) {
  const data = readFile(
    path.join(OUTPUT_PATH, "city_age_output", "part-r-00000")
  );

  return data
    .filter(row => row[0] === city)
    .map(row => ({
      ageGroup: row[1],
      count: Number(row[2])
    }));
}

function getCrimeTime(city) {
  const data = readFile(
    path.join(OUTPUT_PATH, "crime_time_output", "part-r-00000")
  );

  return data
    .filter(row => row[0] === city)
    .map(row => ({
      timeSlot: row[1],
      count: Number(row[2])
    }));
}

function calculateSafetyScore(
  crimeCount,
  violentCrime
) {

  let score =
    100 -
    crimeCount / 100 -
    violentCrime / 50;

  if (score < 0)
    score = 0;

  return score.toFixed(1);
}


module.exports = {
  getCities,
  getCrimeCount,
  getViolentCrime,
  getWeapons,
  getAgeGroups,
  getCrimeTime,
  calculateSafetyScore
};

