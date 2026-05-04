function sanitizeDecimal(raw) {
  let s = String(raw).replace(/[^\d.]/g, "");
  const i = s.indexOf(".");
  if (i === -1) return s;
  return s.slice(0, i + 1) + s.slice(i + 1).replace(/\./g, "");
}

function sanitizeDigitsOnly(raw) {
  return String(raw).replace(/\D/g, "");
}

export default function InvoiceForm({ form, onChange, errors, disabled }) {
  function setField(key, value) {
    onChange({ ...form, [key]: value });
  }

  function setBank(key, value) {
    onChange({
      ...form,
      bankDetails: { ...form.bankDetails, [key]: value },
    });
  }

  const err = (path) => (errors ? errors[path] : null);

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
        Your details
      </h2>

      <div className="field">
        <label htmlFor="email">Email</label>
        <input
          id="email"
          type="email"
          autoComplete="email"
          value={form.email}
          onChange={(e) => setField("email", e.target.value)}
          disabled={disabled}
        />
        {err("email") && <span className="field-error">{err("email")}</span>}
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "0 1rem" }}>
        <div className="field">
          <label htmlFor="hourlyRate">Hour rate (AUD)</label>
        <input
          id="hourlyRate"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0.00"
          value={form.hourlyRate}
          onChange={(e) => setField("hourlyRate", sanitizeDecimal(e.target.value))}
          disabled={disabled}
        />
          {err("hourlyRate") && <span className="field-error">{err("hourlyRate")}</span>}
        </div>
        <div className="field">
          <label htmlFor="monthlyHours">Monthly hours</label>
        <input
          id="monthlyHours"
          type="text"
          inputMode="decimal"
          autoComplete="off"
          placeholder="0"
          value={form.monthlyHours}
          onChange={(e) => setField("monthlyHours", sanitizeDecimal(e.target.value))}
          disabled={disabled}
        />
          {err("monthlyHours") && <span className="field-error">{err("monthlyHours")}</span>}
        </div>
      </div>

      <h3 style={{ fontSize: "0.95rem", margin: "1.25rem 0 0.5rem", color: "var(--muted)" }}>
        Banking details
      </h3>

      {[
        ["accountHolder", "Account holder"],
        ["bankName", "Bank name"],
        ["branch", "Branch"],
        ["accountNumber", "Account number"],
        ["swift", "SWIFT code"],
      ].map(([key, label]) => (
        <div className="field" key={key}>
          <label htmlFor={key}>{label}</label>
          <input
            id={key}
            type="text"
            inputMode={key === "accountNumber" ? "numeric" : "text"}
            value={form.bankDetails[key]}
            onChange={(e) =>
              setBank(key, key === "accountNumber" ? sanitizeDigitsOnly(e.target.value) : e.target.value)
            }
            disabled={disabled}
            autoComplete="off"
          />
          {err(`bankDetails.${key}`) ? (
            <span className="field-error">{err(`bankDetails.${key}`)}</span>
          ) : null}
        </div>
      ))}
    </div>
  );
}
