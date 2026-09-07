import { useState, useEffect } from "react";
import API from "../api";

import CitySelector from "../components/CitySelector";
import FilterBuilder from "../components/FilterBuilder";
import DownloadReport from "../components/DownloadReport";
import DownloadGeneralReport from "../components/DownloadGeneralReport";
import NearestStation from "../components/NearestStation";
import "../styles/dashboard.css";
const FIELD_SQL_MAP = {
  time_slot:         { label: "Most Dangerous Time",     column: "time_slot"         },
  weapon_used:       { label: "Most Used Weapon",        column: "weapon_used"       },
  age_group:         { label: "Most Affected Age Group", column: "age_group"         },
  crime_domain:      { label: "Crime Domain",            column: "crime_domain"      },
  crime_description: { label: "Crime Type",              column: "crime_description" },
};

function Dashboard() {
  const [selectedCity, setSelectedCity]   = useState("");
  const [filters, setFilters]             = useState([]);
  const [resolvedFilters, setResolvedFilters] = useState([]);
  const [loading, setLoading]             = useState(false);
  const [error, setError]                 = useState(null);
  const [safetyScore, setSafetyScore] =  useState(null);
  const [generalReport, setGeneralReport] =  useState(null);
  const [measures,setMeasures] = useState([]);
  const [stations, setStations] = useState([]);

  useEffect(() => {

  if (!selectedCity)
    return;

  setFilters([]);

  setResolvedFilters([]);

  setMeasures([]);

  setGeneralReport(null);

  setSafetyScore(null);

  setStations([]);

  setError(null);

}, [selectedCity]);


  useEffect(() => {

  if (!selectedCity)
    return;

  API.get(
    `/police/${selectedCity}`
  )
  .then((res) => {

    setStations(
      res.data
    );

  })
  .catch((err) => {

    console.log(err);

  });

}, [selectedCity]);


  useEffect(() => {
    if (!selectedCity || filters.length === 0) {

  setResolvedFilters([]);

  setMeasures([]);

  return;
}

    const resolveChain = async () => {
      setLoading(true);
      setError(null);

      const resolved = [];

      for (let i = 0; i < filters.length; i++) {
        const city = selectedCity;
        const targetField = filters[i].field;
        const appliedFilters = resolved.map((r) => ({
          field: r.field,
          value: r.value,
        }));

        try {
          const res = await API.post("/analysis/chained-insight", {
  city: selectedCity,
  appliedFilters,
  targetField,
});

          resolved.push({
            field:               targetField,
            value:               res.data.value,
            count:               res.data.count,
            recordsBeforeFilter: res.data.recordsBeforeFilter,
            recordsAfterFilter:  res.data.recordsAfterFilter,
            totalCityRecords:    res.data.totalCityRecords,
          });

        } catch (err) {
          console.error(`Failed to resolve filter ${targetField}:`, err);
          setError(`Failed to resolve: ${FIELD_SQL_MAP[targetField]?.label}`);
          break;
        }
      }

      setResolvedFilters(resolved);
 
      try {

  const response =
    await API.post(
      "/safety/recommendation",
      {
        filters: resolved
      }
    );

  setMeasures(
    response.data
  );

}
catch(err){

  console.log(
    "Safety recommendation failed",
    err
  );

}

      setLoading(false);
    };

    resolveChain();
  }, [selectedCity, filters]);

  useEffect(() => {

  if (!selectedCity)
    return;

  API.get(
    `/analysis/safety-score/${selectedCity}`
  )
  .then((res) => {

    setSafetyScore(
      res.data
    );

  })
  .catch((err) => {

    console.log(err);

  });

}, [selectedCity]);



  // ── Build the SQL string to display (for verification) ────────────────────
  const buildSQL = () => {
    if (!selectedCity || filters.length === 0) return null;

    if (filters.length === 1) {
      const meta = FIELD_SQL_MAP[filters[0].field];
      return `SELECT
  '${meta.label}' AS insight_type,
  ${meta.column} AS value,
  COUNT(*) AS count
FROM crime_records
WHERE city = '${selectedCity}'
GROUP BY ${meta.column}
ORDER BY count DESC
LIMIT 1`;
    }

    const cteLines = [];
    const cteNames = [];

    filters.forEach((f, index) => {
      const meta = FIELD_SQL_MAP[f.field];
      if (!meta) return;

      const cteName = `step_${index + 1}_${f.field}`;
      cteNames.push({ name: cteName, meta });

      const prevConditions = cteNames
        .slice(0, index)
        .map((prev) => `  AND ${prev.meta.column} = (SELECT value FROM ${prev.name})`)
        .join("\n");

      cteLines.push(
`${cteName} AS (
  SELECT
    '${meta.label}' AS insight_type,
    ${meta.column} AS value,
    COUNT(*) AS count
  FROM crime_records
  WHERE city = '${selectedCity}'
${prevConditions}
  GROUP BY ${meta.column}
  ORDER BY count DESC
  LIMIT 1
)`
      );
    });

    const withBlock = `WITH\n${cteLines.join(",\n\n")}`;
    const finalSelect = cteNames
      .map((c) => `SELECT insight_type, value, count FROM ${c.name}`)
      .join("\nUNION ALL\n");

    return `${withBlock}\n\n${finalSelect}`;
  };

  const generatedSQL = buildSQL();

  // ── Syntax highlight SQL ──────────────────────────────────────────────────
  const highlightSQL = (sql) =>
    sql.split("\n").map((line, i) => (
      <div key={i}>
        {line
          .split(/\b(WITH|SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|UNION ALL|AS|AND|COUNT|DESC)\b/)
          .map((part, j) =>
            /^(WITH|SELECT|FROM|WHERE|GROUP BY|ORDER BY|LIMIT|UNION ALL|AS|AND|COUNT|DESC)$/.test(part) ? (
              <span key={j} style={{ color: "#60a5fa", fontWeight: "bold" }}>{part}</span>
            ) : /^step_\d+_/.test(part) ? (
              <span key={j} style={{ color: "#f59e0b" }}>{part}</span>
            ) : part.startsWith("'") ? (
              <span key={j} style={{ color: "#86efac" }}>{part}</span>
            ) : (
              <span key={j} style={{ color: "#e2e8f0" }}>{part}</span>
            )
          )}
      </div>
    ));

  return (
    <div style={{ minHeight: "100vh", background: "#0f172a", color: "white", padding: "30px" }}>
      <h1 className="dashboard-title">
  Crime Hotspot Intelligence 
</h1>

      {/* City Selector */}
      <div className="glass-card">

  <div className="top-controls">

    <CitySelector
      selectedCity={selectedCity}
      setSelectedCity={setSelectedCity}
    />

    <button
      className="success-btn"
      onClick={async () => {

        try {
          
          if (!selectedCity) {

    alert(
      "Please select a city first"
    );

    return;
  }

          const res =
            await API.get(
              `/analysis/intelligence/${selectedCity}`
            );

          setGeneralReport(
            res.data
          );

        } catch(err){

          console.log(err);

        }

      }}
    >
      General Report
    </button>
    {generalReport && (

<DownloadGeneralReport
  city={selectedCity}
  report={generalReport}
  safetyScore={safetyScore}
  measures={measures}
  policeStations={stations}
/>

)}

  </div>

</div>


{safetyScore && (

<div className="glass-card score-card">

 <h2 className="score-title">
  Safety Score
</h2>

  <div className="score-value"  >
    {safetyScore.safetyScore}
  </div>
<div className="score-stats">

  <div>
    Total Crimes :
    {" "}
    {safetyScore.crimeCount}
  </div>

  <div>
    Violent Crimes :
    {" "}
    {safetyScore.violentCrime}
  </div>

</div>

</div>

)}

{generalReport && (

<div className="glass-card">

  <h2>
    General Crime Intelligence
  </h2>

  <div className="intelligence-grid">

  <div className="intelligence-item">

    <div className="intelligence-label">
      Dangerous Time
    </div>

    <div className="intelligence-value">
      {generalReport.dangerousTime}
    </div>

  </div>

  <div className="intelligence-item">

    <div className="intelligence-label">
      Most Weapon
    </div>

    <div className="intelligence-value">
      {generalReport.weapon}
    </div>

  </div>

  <div className="intelligence-item">

    <div className="intelligence-label">
      Age Group
    </div>

    <div className="intelligence-value">
      {generalReport.ageGroup}
    </div>

  </div>

  <div className="intelligence-item">

    <div className="intelligence-label">
      Safety Score
    </div>

    <div className="intelligence-value">
      {generalReport.safetyScore}
    </div>

  </div>

</div>

</div>

)}
      {/* Filter Builder */}
      <div className="glass-card">
        <FilterBuilder filters={filters} setFilters={setFilters} />
      </div>

      {/* ── SQL Preview Panel ── */}
      {generatedSQL && (
        <div style={{ background: "#0d1117", border: "1px solid #30363d", borderRadius: "12px", padding: "20px", marginBottom: "24px" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px" }}>
            <span style={{ width: "10px", height: "10px", borderRadius: "50%", background: "#22c55e", display: "inline-block" }} />
            <h3 style={{ margin: 0, color: "#e2e8f0", fontSize: "15px" }}>Generated SQL Query</h3>
            <span style={{ marginLeft: "auto", fontSize: "12px", color: "#64748b" }}>
              {filters.length} filter{filters.length !== 1 ? "s" : ""} · City: {selectedCity}
            </span>
          </div>

          {/* Chain explanation */}
          {filters.length > 1 && (
            <div style={{ background: "#1e3a5f", border: "1px solid #1d4ed8", borderRadius: "8px", padding: "10px 14px", marginBottom: "14px", fontSize: "13px", color: "#93c5fd" }}>
              <span style={{ color: "#60a5fa", fontWeight: "bold" }}>🔗 Query Chain: </span>
              {filters.map((f, i) => {
                const label = FIELD_SQL_MAP[f.field]?.label;
                return i === 0 ? `Find the ${label}` : ` → Within that, find the ${label}`;
              })}
            </div>
          )}

          <pre style={{ margin: 0, padding: "16px", background: "#161b22", borderRadius: "8px", overflowX: "auto", fontSize: "13px", lineHeight: "1.7", fontFamily: "'Courier New', monospace", whiteSpace: "pre-wrap", wordBreak: "break-word" }}>
            {highlightSQL(generatedSQL)}
          </pre>

          <div style={{ marginTop: "12px" }}>
            <span style={{ fontSize: "12px", color: "#64748b" }}>Filter order: </span>
            {filters.map((f, i) => (
              <span key={f.field} style={{ fontSize: "12px", background: "#1e3a5f", color: "#93c5fd", padding: "2px 8px", borderRadius: "4px", marginRight: "6px" }}>
                {i + 1}. {FIELD_SQL_MAP[f.field]?.label}
              </span>
            ))}
          </div>
        </div>
      )}

      {loading && <h3 style={{ color: "#94a3b8" }}>Resolving filter chain...</h3>}
      {error   && <p  style={{ color: "#f87171" }}> {error}</p>}

      {/* ── Resolved Filter Cards — shows chain narrowing ── */}
      {!loading && resolvedFilters.length > 0 && (
        <div style={{ display: "grid", gap: "16px" }}>
          {resolvedFilters.map((rf, index) => {
            const meta = FIELD_SQL_MAP[rf.field];

            return (
              <div key={rf.field} style={{ background: "#1e293b", borderRadius: "12px", padding: "20px", borderLeft: "4px solid #3b82f6" }}>

                {/* Record narrowing trail */}
                <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "8px" }}>
                  {index === 0 ? (
                    // First filter: shows total → after
                    <span>
                      All {selectedCity} records:&nbsp;
                      <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{rf.totalCityRecords}</span>
                      &nbsp;- After this filter:&nbsp;
                      <span style={{ color: "#22c55e", fontWeight: "bold" }}>{rf.recordsAfterFilter}</span>
                      &nbsp;records
                    </span>
                  ) : (
                    // Chain filter: shows narrowed → after
                    <span>
                      Records from previous filter:&nbsp;
                      <span style={{ color: "#f59e0b", fontWeight: "bold" }}>{rf.recordsBeforeFilter}</span>
                      &nbsp;-  After this filter:&nbsp;
                      <span style={{ color: "#22c55e", fontWeight: "bold" }}>{rf.recordsAfterFilter}</span>
                      &nbsp;records
                    </span>
                  )}
                </div>

                {/* Insight */}
                <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                  <div>
                    <div style={{ fontSize: "12px", color: "#64748b", marginBottom: "4px" }}>
                      Step {index + 1} — {meta?.label}
                    </div>
                    <div style={{ fontSize: "22px", fontWeight: "bold", color: "#f1f5f9" }}>
                      {rf.value ?? "N/A"}
                    </div>
                  </div>
                  <div style={{ textAlign: "right" }}>
                    <div style={{ fontSize: "28px", fontWeight: "bold", color: "#3b82f6" }}>
                      {rf.count}
                    </div>
                    <div style={{ fontSize: "12px", color: "#64748b" }}>incidents</div>
                  </div>
                </div>

              </div>
            );
          })}

          
        </div>
      )}
{selectedCity &&
 resolvedFilters.length > 0 && (

  <NearestStation
    city={selectedCity}
  />

)}

      {measures.length > 0 && (

  <div
    style={{
      background:"#1e293b",
      padding:"20px",
      borderRadius:"12px",
      marginTop:"20px",
      marginBottom:"20px"
    }}
  >

    <h2
      style={{
        marginBottom:"15px",
        color:"#fbbf24"
      }}
    >

      
      Recommended Safety Measures
    </h2>

    <ul
      style={{
        lineHeight:"2"
      }}
    >

      {measures.map(
        (item,index) => (

          <li
            key={index}
          >
            {item}
          </li>

        )
      )}

    </ul>

  </div>

)}

{resolvedFilters.length > 0 && (

  <div
    style={{
      marginTop:"20px"
    }}
  >

  <DownloadReport
  city={selectedCity}
  filters={resolvedFilters}
  safetyScore={safetyScore}
  measures={measures}
  policeStations={stations}
/>

  </div>

)}
      {/* Empty states */}
      {!loading && selectedCity && filters.length === 0 && (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>
        
          <strong>{selectedCity}</strong>.
        </p>
      )}
      {!selectedCity && !loading && (
        <p style={{ color: "#94a3b8", textAlign: "center" }}>
          
          </p>
      )}
    </div>
  );
}

export default Dashboard;