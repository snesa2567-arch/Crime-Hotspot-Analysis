function InsightCard({
  title,
  value,
  extra
}) {

  return (

    <div
      style={{
        background: "#1e293b",
        padding: "20px",
        borderRadius: "12px",
        marginBottom: "15px"
      }}
    >

      <h3>{title}</h3>

      <h2>{value}</h2>

      {extra && (
        <p>{extra}</p>
      )}

    </div>

  );

}

export default InsightCard;