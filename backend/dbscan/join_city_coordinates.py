import pandas as pd

crime_df = pd.read_csv("city_crime_count.csv")

police_df = pd.read_csv("../data/police_stations_india.csv")

city_coords = (
    police_df
    .groupby("City")[["Latitude", "Longitude"]]
    .mean()
    .reset_index()
)

merged_df = pd.merge(
    crime_df,
    city_coords,
    on="City",
    how="inner"
)

merged_df.to_csv(
    "city_crime_coordinates.csv",
    index=False
)

print("File created: city_crime_coordinates.csv")
print(merged_df.head())