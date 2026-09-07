function getSafetyMeasures(filters) {

  const measures = [];

  filters.forEach(filter => {

    const value =
      String(filter.value)
      .toLowerCase();

    // Time Based

    if (
      value.includes("pm") ||
      value.includes("am")
    ) {

      if (
        value.includes("10 pm") ||
        value.includes("11 pm") ||
        value.includes("12 am")
      ) {

        measures.push(
          "Avoid travelling alone late at night"
        );

        measures.push(
          "Use well-lit roads"
        );

        measures.push(
          "Share live location with family"
        );
      }
    }

    // Weapon Based

    if (
      value.includes("knife")
    ) {

      measures.push(
        "Avoid isolated areas"
      );

      measures.push(
        "Stay aware of surroundings"
      );
    }

    if (
      value.includes("firearm")
    ) {

      measures.push(
        "Avoid confrontation"
      );

      measures.push(
        "Move to secure indoor locations"
      );

      measures.push(
        "Contact police immediately"
      );
    }

    if (
      value.includes("explosives")
    ) {

      measures.push(
        "Leave area immediately"
      );

      measures.push(
        "Avoid crowded locations"
      );
    }

    // Age Group

    if (
      value.includes("60+")
    ) {

      measures.push(
        "Senior citizens should avoid solo travel at night"
      );
    }

  });

  return [
    ...new Set(measures)
  ];
}

module.exports = {
  getSafetyMeasures
};