import {
  useEffect,
  useState
}
from "react";

import API from "../api";

function NearestStation({
  city
}) {

  const [
    stations,
    setStations
  ] = useState([]);

  useEffect(() => {

    if (!city)
      return;

    API.get(
      `/police/${city}`
    )
    .then(res => {

      setStations(
        res.data
      );

    })
    .catch(err => {

      console.log(err);

    });

  }, [city]);

  if (
    !stations.length
  )
    return null;

  return (

    <div
      style={{
        background:"#1e293b",
        padding:"20px",
        borderRadius:"12px",
        marginTop:"20px"
      }}
    >

      <h2>
        Police Stations
      </h2>

      {

        stations.map(
          station => (

            <div
              key={
                station.stationId
              }
              style={{
                padding:"10px",
                marginBottom:"10px",
                borderBottom:
                "1px solid #334155"
              }}
            >

              <h3>
                {
                  station.policeStation
                }
              </h3>

              <p>
                Landmark:
                {" "}
                {
                  station.landmark
                }
              </p>

              <p>
                Contact:
                {" "}
                {
                  station.contact
                }
              </p>

            </div>

          )
        )

      }

    </div>

  );

}

export default NearestStation;