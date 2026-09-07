const express =
require("express");

const router =
express.Router();

const {
  getSafetyMeasures
}
=
require(
"../services/safetyService"
);

router.post(
"/recommendation",
(req,res)=>{

  const measures =
  getSafetyMeasures(
    req.body.filters || []
  );

  res.json(measures);

}
);

module.exports =
router;