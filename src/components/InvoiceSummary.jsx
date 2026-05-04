function fmtAud(n) {
  return new Intl.NumberFormat("en-AU", {
    style: "currency",
    currency: "AUD",
    minimumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

function fmtLkr(n) {
  return new Intl.NumberFormat("en-LK", {
    style: "currency",
    currency: "LKR",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(Number.isFinite(n) ? n : 0);
}

export default function InvoiceSummary({
  hourlyRate,
  monthlyHours,
  rate,
  rateMeta,
  generatedInvoice,
}) {
  const hr = Number(hourlyRate) || 0;
  const mh = Number(monthlyHours) || 0;
  const subtotal = generatedInvoice ? generatedInvoice.totalAUD : hr * mh;
  const tax = 0;
  const totalAud = subtotal;
  const effRate = generatedInvoice ? generatedInvoice.audToLkrRate : rate;
  const totalLkr = generatedInvoice ? generatedInvoice.totalLKR : totalAud * (effRate || 0);

  return (
    <div className="panel">
      <h2
        style={{
          margin: "0 0 1rem",
          fontFamily: "Outfit, sans-serif",
          fontSize: "1.15rem",
          fontWeight: 700,
        }}
      >
        Summary
      </h2>
      <div style={{ display: "grid", gap: "0.5rem", fontSize: "0.95rem" }}>
        <div className="totals-row">
          <span style={{ color: "var(--muted)" }}>Subtotal AUD</span>
          <span>{fmtAud(subtotal)}</span>
        </div>
        <div className="totals-row">
          <span style={{ color: "var(--muted)" }}>Tax AUD (0%)</span>
          <span>{fmtAud(tax)}</span>
        </div>
        <div className="totals-row total">
          <span>Total AUD</span>
          <span>{fmtAud(totalAud)}</span>
        </div>
        <div
          className="totals-row"
          style={{ marginTop: "0.75rem", fontSize: "0.88rem", color: "var(--muted)" }}
        >
          <span>AUD → LKR ({rateMeta?.date || "—"})</span>
          <span>{effRate ? effRate.toFixed(4) : "—"}</span>
        </div>
        {rateMeta?.warning && (
          <p style={{ margin: 0, fontSize: "0.82rem", color: "#fbbf24" }}>{rateMeta.warning}</p>
        )}
        <div className="totals-row total" style={{ marginTop: "0.35rem" }}>
          <span>Total LKR</span>
          <span>{fmtLkr(totalLkr)}</span>
        </div>
        {generatedInvoice && (
          <p style={{ margin: "0.75rem 0 0", fontSize: "0.82rem", color: "var(--muted)" }}>
            Figures locked from generated invoice ({generatedInvoice.invoiceNumber}).
          </p>
        )}
      </div>
    </div>
  );
}
