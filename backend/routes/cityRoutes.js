const express = require("express");
const router = express.Router();

const { getCities } = require("../services/csvService");

router.get("/", (req, res) => {
  res.json(getCities());
});

module.exports = router;