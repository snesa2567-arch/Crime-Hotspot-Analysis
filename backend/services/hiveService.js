const client = require("../hiveConnection");

async function getWeaponByTime(
  city,
  timeSlot
) {

  const connection =
    await client.connect({
      host: "localhost",
      port: 10000
    });

  const session =
    await connection.openSession();

  const query = `
    SELECT
      weapon_used,
      COUNT(*) AS total
    FROM crime_analysis_view
    WHERE city='${city}'
    AND time_slot='${timeSlot}'
    GROUP BY weapon_used
    ORDER BY total DESC
    LIMIT 1
  `;

  const operation =
    await session.executeStatement(
      query
    );

  const result =
    await operation.fetchAll();

  await operation.close();
  await session.close();

  return result;
}

async function getAgeByWeapon(
  city,
  timeSlot,
  weapon
) {

  const connection =
    await client.connect({
      host: "localhost",
      port: 10000
    });

  const session =
    await connection.openSession();

  const query = `
    SELECT
      age_group,
      COUNT(*) AS total
    FROM crime_analysis_view
    WHERE city='${city}'
    AND time_slot='${timeSlot}'
    AND weapon_used='${weapon}'
    GROUP BY age_group
    ORDER BY total DESC
    LIMIT 1
  `;

  const operation =
    await session.executeStatement(
      query
    );

  const result =
    await operation.fetchAll();

  await operation.close();
  await session.close();

  return result;
}

async function getDangerousTime(city) {

  const connection =
    await client.connect({
      host: "localhost",
      port: 10000
    });

  const session =
    await connection.openSession();

  const query = `
    SELECT
      time_slot,
      COUNT(*) AS total
    FROM crime_analysis_view
    WHERE city='${city}'
    GROUP BY time_slot
    ORDER BY total DESC
    LIMIT 1
  `;

  const operation =
    await session.executeStatement(query);

  const result =
    await operation.fetchAll();

  await operation.close();
  await session.close();

  return result;
}
async function getCrimeDomain(
  city,
  timeSlot,
  weapon,
  ageGroup
) {

  const connection =
    await client.connect({
      host: "localhost",
      port: 10000
    });

  const session =
    await connection.openSession();

  const query = `
    SELECT
      crime_domain,
      COUNT(*) AS total
    FROM crime_analysis_view
    WHERE city='${city}'
    AND time_slot='${timeSlot}'
    AND weapon_used='${weapon}'
    AND age_group='${ageGroup}'
    GROUP BY crime_domain
    ORDER BY total DESC
    LIMIT 1
  `;

  const operation =
    await session.executeStatement(query);

  const result =
    await operation.fetchAll();

  await operation.close();
  await session.close();

  return result;
}
async function getCrimeType(
  city,
  timeSlot,
  weapon,
  ageGroup
) {

  const connection =
    await client.connect({
      host: "localhost",
      port: 10000
    });

  const session =
    await connection.openSession();

  const query = `
    SELECT
      crime_description,
      COUNT(*) AS total
    FROM crime_analysis_view
    WHERE city='${city}'
    AND time_slot='${timeSlot}'
    AND weapon_used='${weapon}'
    AND age_group='${ageGroup}'
    GROUP BY crime_description
    ORDER BY total DESC
    LIMIT 1
  `;

  const operation =
    await session.executeStatement(query);

  const result =
    await operation.fetchAll();

  await operation.close();
  await session.close();

  return result;
}


async function getNextInsight(
  city,
  filters,
  targetField
) {

  const connection =
    await client.connect({
      host: "localhost",
      port: 10000
    });

  const session =
    await connection.openSession();

  let whereClause =
    `city='${city}'`;

  Object.keys(filters).forEach(
    key => {

      if(filters[key]) {

        whereClause +=
          ` AND ${key}='${filters[key]}'`;

      }

    }
  );

  const query = `
    SELECT
      ${targetField},
      COUNT(*) AS total
    FROM crime_analysis_view
    WHERE ${whereClause}
    GROUP BY ${targetField}
    ORDER BY total DESC
    LIMIT 1
  `;

  const operation =
    await session.executeStatement(
      query
    );

  const result =
    await operation.fetchAll();

  await operation.close();
  await session.close();

  return result;

}

module.exports = {

  getDangerousTime,

  getWeaponByTime,

  getAgeByWeapon,

  getCrimeDomain,

  getCrimeType,
  getNextInsight

};