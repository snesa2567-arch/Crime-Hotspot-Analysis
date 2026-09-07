const express = require("express");

const router = express.Router();

const {
  getDangerousTime,
  getCrimeCount,
  getViolentCrime,
  getMostAffectedAge,
  getMostUsedWeapon,
  getSafetyScore
} = require("../services/analysisService");

const {
    getWeaponByTime,
  getAgeByWeapon
} = require("../services/hiveService");

const { getChainedInsight } = require("../services/chainService");

const analysisController = require("../services/analysisController");


router.post(
    "/filter",
    analysisController.getAnalysis
);

router.post(
  "/chained-insight",
  (req, res) => {

    try {

      const {
        city,
        appliedFilters,
        targetField
      } = req.body;

      if (
        !city ||
        !targetField
      ) {

        return res.status(400).json({
          error:
            "city and targetField are required"
        });

      }

      const result =
        getChainedInsight(
          city,
          appliedFilters || [],
          targetField
        );

      res.json(result);

    }

    catch(err){

      console.error(err);

      res.status(500).json({
        error:
          err.message
      });

    }

  }
);

router.get(
  "/dangerous-time/:city",
  (req, res) => {

    const result =
      getDangerousTime(
        req.params.city
      );

    if (!result)
      return res
        .status(404)
        .json({
          error:
            "City not found"
        });

    res.json(result);

  }
);

router.get(
  "/crime-count/:city",
  (req, res) => {

    const result =
      getCrimeCount(
        req.params.city
      );

    if (!result)
      return res
        .status(404)
        .json({
          error:
            "City not found"
        });

    res.json(result);

  }
);



router.get(
  "/violent-crime/:city",
  (req, res) => {

    const result =
      getViolentCrime(
        req.params.city
      );

    if (!result)
      return res
        .status(404)
        .json({
          error:
            "City not found"
        });

    res.json(result);

  }
);

router.get(
  "/weapon/:city",
  (req, res) => {

    const result =
      getMostUsedWeapon(
        req.params.city
      );

    if (!result)
      return res
        .status(404)
        .json({
          error:
            "City not found"
        });

    res.json(result);

  }
);

router.get(
  "/age/:city",
  (req, res) => {

    const result =
      getMostAffectedAge(
        req.params.city
      );

    if (!result)
      return res
        .status(404)
        .json({
          error:
            "City not found"
        });

    res.json(result);

  }
);

router.get(
  "/safety-score/:city",
  (req, res) => {

    const result =
      getSafetyScore(
        req.params.city
      );

    if (!result)
      return res
        .status(404)
        .json({
          error:
            "City not found"
        });

    res.json(result);

  }
);

const {
  getIntelligence
} = require("../services/analysisService");

router.get(
  "/intelligence/:city",
  (req, res) => {

    const result =
      getIntelligence(
        req.params.city
      );

    if (!result) {

      return res.status(404).json({
        error: "City not found"
      });

    }

    res.json(result);

  }
);

module.exports = router;
