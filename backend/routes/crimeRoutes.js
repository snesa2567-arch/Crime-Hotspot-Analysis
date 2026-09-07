const express = require("express");
const router = express.Router();

const {
  getCrimeCount,
  getViolentCrime,
  getWeapons,
  getAgeGroups,
  getCrimeTime
} = require("../services/csvService");

router.get("/crime-count/:city", (req, res) => {
  res.json(getCrimeCount(req.params.city));
});

router.get("/violent/:city", (req, res) => {
  res.json(getViolentCrime(req.params.city));
});

router.get("/weapon/:city", (req, res) => {
  res.json(getWeapons(req.params.city));
});

router.get("/age/:city", (req, res) => {
  res.json(getAgeGroups(req.params.city));
});

router.get("/time/:city", (req, res) => {
  res.json(getCrimeTime(req.params.city));
});

module.exports = router;