from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
import pandas as pd
from math import radians, sin, cos, sqrt, atan2

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

crime_df = pd.read_csv("crime_hotspots.csv")
police_df = pd.read_csv("hotspot_police_mapping.csv")


@app.get("/")
def home():
    return {"message": "Crime Hotspot API Running"}


@app.get("/hotspots")
def hotspots():
    return crime_df.to_dict(orient="records")


@app.get("/crime/{city}")
def crime_by_city(city: str):

    result = crime_df[
        crime_df["City"].str.lower() == city.lower()
    ]

    if result.empty:
        return {"error": "City not found"}

    return result.to_dict(orient="records")[0]


def haversine(lat1, lon1, lat2, lon2):

    R = 6371

    dlat = radians(lat2 - lat1)
    dlon = radians(lon2 - lon1)

    a = (
        sin(dlat / 2) ** 2
        + cos(radians(lat1))
        * cos(radians(lat2))
        * sin(dlon / 2) ** 2
    )

    c = 2 * atan2(sqrt(a), sqrt(1 - a))

    return R * c


@app.get("/nearest-station")
def nearest_station(lat: float, lon: float):

    nearest = None
    min_distance = float("inf")

    for _, row in police_df.iterrows():

        distance = haversine(
            lat,
            lon,
            row["Latitude"],
            row["Longitude"]
        )

        if distance < min_distance:
            min_distance = distance
            nearest = row

    return {
        "station": nearest["Police_Station"],
        "city": nearest["City"],
        "distance_km": round(min_distance, 2)
    }

@app.get("/cities")
def cities():
    return sorted(crime_df["City"].unique().tolist())

@app.get("/report/{city}")
def report(city: str):

    crime = crime_df[
        crime_df["City"].str.lower() == city.lower()
    ]

    police = police_df[
        police_df["City"].str.lower() == city.lower()
    ]

    return {
        "city": city,
        "crime": crime.to_dict(orient="records"),
        "police": police.to_dict(orient="records")
    }