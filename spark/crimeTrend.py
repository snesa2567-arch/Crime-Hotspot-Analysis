from pyspark.sql import SparkSession
from pyspark.sql.functions import count

spark = SparkSession.builder \
    .appName("CrimeTrendAnalysis") \
    .getOrCreate()

df = spark.read.csv(
    "/app/data/crime_dataset_india.csv",
    header=True,
    inferSchema=True
)

trend = (
    df.groupBy("City")
      .agg(count("*").alias("crime_count"))
      .orderBy("crime_count", ascending=False)
)

trend.write \
    .mode("overwrite") \
    .option("header", True) \
    .csv("/app/outputs/spark_crime_trend")

print("Crime Trend Analysis Completed")

spark.stop()