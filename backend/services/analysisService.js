const {
  getCrimeCount,
  getViolentCrime,
  getWeapons,
  getAgeGroups,
  getCrimeTime,
  calculateSafetyScore
} = require("./csvService");

function getIntelligence(city) {

  const crimeTimes = getCrimeTime(city);

  if (!crimeTimes.length) {
    return null;
  }

  const dangerousTime =
    crimeTimes.sort(
      (a, b) => b.count - a.count
    )[0];

  const weapons =
    getWeapons(city);

  const topWeapon =
    weapons.sort(
      (a, b) => b.count - a.count
    )[0];

  const ages =
    getAgeGroups(city);

  const topAge =
    ages.sort(
      (a, b) => b.count - a.count
    )[0];

  const crime =
    getCrimeCount(city);

  const violent =
    getViolentCrime(city);

  const safetyScore =
    calculateSafetyScore(
      crime.crimeCount,
      violent.violentCrime
    );

  return {

    city,

    dangerousTime:
      dangerousTime.timeSlot,

    dangerousTimeCount:
      dangerousTime.count,

    weapon:
      topWeapon.weapon,

    weaponCount:
      topWeapon.count,

    ageGroup:
      topAge.ageGroup,

    ageCount:
      topAge.count,

    crimeCount:
      crime.crimeCount,

    violentCrime:
      violent.violentCrime,

    safetyScore

  };
}


function getDangerousTime(city) {

  const timeData = getCrimeTime(city);

  if (!timeData || timeData.length === 0)
    return null;

  const dangerous = timeData.sort(
    (a, b) => b.count - a.count
  )[0];

  return {
    city,
    time: dangerous.timeSlot,
    count: dangerous.count
  };
}

function getMostUsedWeapon(city) {

  const weaponData = getWeapons(city);

  if (!weaponData || weaponData.length === 0)
    return null;

  const weapon = weaponData.sort(
    (a, b) => b.count - a.count
  )[0];

  return {
    city,
    weapon: weapon.weapon,
    count: weapon.count
  };
}

function getMostAffectedAge(city) {

  const ageData = getAgeGroups(city);

  if (!ageData || ageData.length === 0)
    return null;

  const age = ageData.sort(
    (a, b) => b.count - a.count
  )[0];

  return {
    city,
    ageGroup: age.ageGroup,
    count: age.count
  };
}

function getSafetyScore(city) {

  const crimeData = getCrimeCount(city);

  const violentData =
    getViolentCrime(city);

  if (
    !crimeData ||
    !violentData
  )
    return null;

  const score =
    calculateSafetyScore(
      crimeData.crimeCount,
      violentData.violentCrime
    );

  return {
    city,
    crimeCount:
      crimeData.crimeCount,
    violentCrime:
      violentData.violentCrime,
    safetyScore: score
  };
}

module.exports = {

  getDangerousTime,
  getMostUsedWeapon,
  getMostAffectedAge,
  getSafetyScore,
  getCrimeCount,
  getViolentCrime,
  getIntelligence

};