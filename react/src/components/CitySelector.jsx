import { useEffect, useState } from "react";
import API from "../api";

function CitySelector({ selectedCity, setSelectedCity }) {

  const [cities, setCities] = useState([]);

  useEffect(() => {

    API.get("/cities")
      .then(res => setCities(res.data))
      .catch(err => console.log(err));

  }, []);

  return (

    <div>

      <h3>Select City</h3>

      <select
        value={selectedCity}
        onChange={(e) => setSelectedCity(e.target.value)}
      >

        <option value="">Select City</option>

        {cities.map((cityObj) => (

          <option
            key={cityObj.city}
            value={cityObj.city}
          >
            {cityObj.city}
          </option>

        ))}

      </select>

    </div>

  );
}

export default CitySelector;