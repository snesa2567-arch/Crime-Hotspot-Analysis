import pandas as pd
from sklearn.cluster import DBSCAN

# Load data
df = pd.read_csv("city_crime_coordinates.csv")

# Features for clustering
X = df[["Latitude", "Longitude"]]

# DBSCAN model
dbscan = DBSCAN(
    eps=2,
    min_samples=2
)

df["Cluster"] = dbscan.fit_predict(X)

# Save output
df.to_csv("crime_hotspots.csv", index=False)

print(df[["City", "CrimeCount", "Cluster"]])
print("\nOutput saved as crime_hotspots.csv")