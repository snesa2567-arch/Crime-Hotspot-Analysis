import pandas as pd
import math

# Load files
hotspots = pd.read_csv("crime_hotspots.csv")
police = pd.read_csv("../data/police_stations_india.csv")

results = []

for _, city_row in hotspots.iterrows():

    city = city_row["City"]
    cluster = city_row["Cluster"]

    if cluster == -1:
        continue

    city_police = police[police["City"] == city]

    if len(city_police) == 0:
        continue

    nearest_station = city_police.iloc[0]

    results.append({
        "City": city,
        "Cluster": cluster,
        "Police_Station": nearest_station["Police_Station"],
        "Latitude": nearest_station["Latitude"],
        "Longitude": nearest_station["Longitude"],
        "Contact_Number": nearest_station["Contact_Number"]
    })

result_df = pd.DataFrame(results)

result_df.to_csv(
    "hotspot_police_mapping.csv",
    index=False
)

print(result_df)
print("\nSaved as hotspot_police_mapping.csv")