import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadGeneralReport({
  city,
  report,
  safetyScore,
  measures,
  policeStations
}){

  const downloadPDF = () => {

    const doc =
      new jsPDF();

    doc.setFillColor(
      30,
      41,
      59
    );

    doc.rect(
      0,
      0,
      210,
      30,
      "F"
    );

    doc.setTextColor(
      255,
      255,
      255
    );

    doc.setFontSize(22);

    doc.text(
      "General Crime Intelligence Report",
      15,
      18
    );

    doc.setTextColor(
      0,
      0,
      0
    );

    doc.setFontSize(28);

    doc.text(
      city,
      15,
      45
    );

    autoTable(doc,{
      startY:60,
      head:[[
        "Metric",
        "Value"
      ]],
      body:[
        [
          "Safety Score",
          safetyScore?.safetyScore
        ],
        [
          "Total Crimes",
          safetyScore?.crimeCount
        ],
        [
          "Violent Crimes",
          safetyScore?.violentCrime
        ],
        [
          "Most Dangerous Time",
          report?.dangerousTime
        ],
        [
          "Most Used Weapon",
          report?.weapon
        ],
        [
          "Most Affected Age Group",
          report?.ageGroup
        ]
      ]
    });
doc.setFontSize(16);

doc.text(
  "Recommended Safety Measures",
  15,
  doc.lastAutoTable.finalY + 15
);

const measureRows =
  measures?.map(
    item => [item]
  ) || [];

autoTable(doc,{
  startY:
    doc.lastAutoTable.finalY + 20,

  head:[[
    "Recommendations"
  ]],

  body:
    measureRows
});

doc.setFontSize(16);

doc.text(
  "Police Stations",
  15,
  doc.lastAutoTable.finalY + 15
);

const stationRows =
  policeStations?.map(
    station => [

      station.policeStation,

      station.landmark,

      station.contact

    ]
  ) || [];

autoTable(doc,{
  startY:
    doc.lastAutoTable.finalY + 20,

  head:[[
    "Police Station",
    "Landmark",
    "Contact"
  ]],

  body:
    stationRows
});



    doc.save(
      `${city}_General_Report.pdf`
    );

  };

  return (

    <button
      onClick={
        downloadPDF
      }
      style={{
        background:"#f59e0b",
        color:"white",
        border:"none",
        padding:"12px 20px",
        borderRadius:"8px",
        cursor:"pointer",
        fontWeight:"bold"
      }}
    >
      Download General Report
    </button>

  );

}

export default DownloadGeneralReport;