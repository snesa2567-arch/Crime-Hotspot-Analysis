const express = require("express");
const cors = require("cors");

const cityRoutes = require("./routes/cityRoutes");
const crimeRoutes = require("./routes/crimeRoutes");
const analysisRoutes = require("./routes/analysisRoutes");
const policeRoutes = require("./routes/policeRoutes");
const safetyRoutes = require("./routes/safetyRoutes");


const app = express();

app.use(cors());
app.use(express.json());

app.use("/cities", cityRoutes);

app.use("/crime", crimeRoutes);

app.use("/analysis", analysisRoutes);


app.use(
"/safety",
safetyRoutes
);

app.use(
"/police",
policeRoutes
);
app.get("/", (req, res) => {
  res.send("Crime Analysis Backend Running");
});

const PORT = 5000;

app.listen(PORT, () => {
  console.log(`Server Running on Port ${PORT}`);
});