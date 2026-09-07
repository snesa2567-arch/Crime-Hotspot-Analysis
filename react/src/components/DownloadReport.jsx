import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

function DownloadReport({
  city,
  filters,
  safetyScore,
  measures,
  policeStations
}){

  const downloadPDF = () => {

    const doc = new jsPDF();

    // Header
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
      "Crime Hotspot Intelligence Report",
      15,
      18
    );

    // City Name
    doc.setTextColor(
      0,
      0,
      0
    );

    doc.setFontSize(26);

    doc.text(
      city,
      15,
      45
    );

    // Safety Section
    doc.setFontSize(16);

    doc.text(
      "Safety Assessment",
      15,
      60
    );

    autoTable(doc, {
      startY: 65,
      head: [
        [
          "Metric",
          "Value"
        ]
      ],
      body: [
        [
          "Safety Score",
          safetyScore?.safetyScore || "-"
        ],
        [
          "Total Crimes",
          safetyScore?.crimeCount || "-"
        ],
        [
          "Violent Crimes",
          safetyScore?.violentCrime || "-"
        ]
      ]
    });

    // Filter Analysis
    doc.setFontSize(16);

    doc.text(
      "Crime Intelligence Analysis",
      15,
      doc.lastAutoTable.finalY + 15
    );

    const filterRows =
      filters.map(
        (
          filter,
          index
        ) => [

          `Step ${index + 1}`,
          filter.field,
          filter.value,
          filter.count

        ]
      );

    autoTable(doc, {
      startY:
        doc.lastAutoTable.finalY + 20,

      head: [[
        "Step",
        "Filter",
        "Result",
        "Incidents"
      ]],

      body:
        filterRows
    });
// Safety Measures

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

    // Conclusion
    const endY =
      doc.lastAutoTable.finalY + 15;

    doc.setFontSize(14);

    doc.text(
      "Summary",
      15,
      endY
    );

    doc.setFontSize(11);


    

    // Footer
    doc.setFontSize(10);

    doc.text(
      "Crime Hotspot Analysis System",
      15,
      285
    );

    doc.save(
      `${city}_Crime_Report.pdf`
    );

  };

  return (

    <button
      onClick={
        downloadPDF
      }
      style={{
        background:
          "#2563eb",

        color:
          "white",

        border:
          "none",

        padding:
          "12px 20px",

        borderRadius:
          "8px",

        cursor:
          "pointer",

        fontWeight:
          "bold",

        fontSize:
          "15px"
      }}
    >
      Download PDF Report
    </button>

  );

}

export default DownloadReport;