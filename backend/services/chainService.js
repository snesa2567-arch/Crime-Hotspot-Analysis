
const fs   = require("fs");
const path = require("path");
const csv  = require("csv-parse/sync");
const CSV_PATH = path.join(__dirname, "../../data/crime_dataset_india.csv");
let ALL_RECORDS = [];

try {
  const raw = fs.readFileSync(CSV_PATH, "utf8");
  ALL_RECORDS = csv.parse(raw, {
    columns: true,           
    skip_empty_lines: true,
    trim: true,
  });
  console.log(`[chainService] Loaded ${ALL_RECORDS.length} records from crime_dataset_india.csv`);
} catch (err) {
  console.error("[chainService] Failed to load CSV:", err.message);
}

const FIELD_TO_COLUMN = {
  time_slot:         "Time of Occurrence",  
  weapon_used:       "Weapon Used",         
  age_group:         "Victim Age",          
  crime_domain:      "Crime Domain",         
  crime_description: "Crime Description",    
};


function getAgeGroup(age) {
  const n = parseInt(age, 10);
  if (isNaN(n)) return null;
  if (n <= 18)  return "0-18";
  if (n <= 25)  return "19-25";
  if (n <= 40)  return "26-40";
  if (n <= 60)  return "41-60";
  return "60+";
}

function getTimeSlot(rawTime) {

  if (!rawTime)
    return null;

  const match =
    rawTime.match(
      /(\d{2}):(\d{2})$/
    );

  if (!match)
    return null;

  const hour =
    parseInt(
      match[1],
      10
    );

  const nextHour =
    (hour + 1) % 24;

  const formatHour =
    (h) => {

      const suffix =
        h >= 12
          ? "PM"
          : "AM";

      let display =
        h % 12;

      if (display === 0)
        display = 12;

      return (
        String(display)
          .padStart(2, "0")
        + " "
        + suffix
      );

    };

  return (
    formatHour(hour)
    + " - "
    + formatHour(nextHour)
  );

}

function getNormalizedValue(record, field) {
  if (field === "age_group") {
    return getAgeGroup(record["Victim Age"]);
  }
  if (field === "time_slot") {
    return getTimeSlot(record["Time of Occurrence"]);
  }
  const col = FIELD_TO_COLUMN[field];
  return col ? record[col]?.trim() || null : null;
}

/**
 * getChainedInsight
 *
 * @param {string} city           - e.g. "Chennai"
 * @param {Array}  appliedFilters - filters already resolved before this one
 *                                  e.g. [{ field: "time_slot", value: "01:00 - 02:00" }]
 * @param {string} targetField    - the new filter to resolve e.g. "weapon_used"
 *
 * @returns {object} { field, value, count, recordsBeforeFilter, recordsAfterFilter, totalCityRecords }
 */

function getChainedInsight(city, appliedFilters = [], targetField) {
  if (!FIELD_TO_COLUMN[targetField]) {
    throw new Error(`Unknown field: ${targetField}`);
  }

  let filteredRecords = ALL_RECORDS.filter(
    (r) => r["City"]?.trim().toLowerCase() === city.trim().toLowerCase()
  );
  const totalCityRecords = filteredRecords.length;
  console.log(`[chainService] City="${city}" → ${totalCityRecords} records`);

  for (const f of appliedFilters) {
    if (!f.value) continue;

    const before = filteredRecords.length;
    filteredRecords = filteredRecords.filter((record) => {
      const val = getNormalizedValue(record, f.field);
      return val?.toLowerCase() === f.value.toLowerCase();
    });

    console.log(
      `[chainService] Filter ${f.field}="${f.value}": ${before} → ${filteredRecords.length} records`
    );
  }

  const recordsBeforeThisFilter = filteredRecords.length;

  const counts = {};
  for (const record of filteredRecords) {
    const val = getNormalizedValue(record, targetField);
    if (!val) continue;
    counts[val] = (counts[val] || 0) + 1;
  }

  if (Object.keys(counts).length === 0) {
    return {
      field:               targetField,
      value:               null,
      count:               0,
      recordsBeforeFilter: recordsBeforeThisFilter,
      recordsAfterFilter:  0,
      totalCityRecords,
      message:             "No data found after applying filters",
    };
  }

  const [topValue, topCount] = Object.entries(counts).sort((a, b) => b[1] - a[1])[0];
  const recordsAfterFilter = filteredRecords.filter(
    (r) => getNormalizedValue(r, targetField) === topValue
  ).length;

  console.log(
    `[chainService] Target="${targetField}" → top value="${topValue}" (${topCount} hits)`
  );

  return {
    field:               targetField,
    value:               topValue,
    count:               topCount,
    recordsBeforeFilter: recordsBeforeThisFilter,
    recordsAfterFilter,
    totalCityRecords,
  };
}

module.exports = { getChainedInsight };