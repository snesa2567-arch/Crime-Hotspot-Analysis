const express =
require("express");

const router =
express.Router();

const {
  getStations
}
=
require(
"../services/policeService"
);

router.get(
"/:city",
(req,res)=>{

  const result =
    getStations(
      req.params.city
    );

  res.json(
    result
  );

}
);

module.exports =
router;