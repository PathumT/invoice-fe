import { useState } from "react";
import html2pdf from "html2pdf.js";

function sanitizeFilePart(s) {
  return String(s || "user")
    .replace(/[^a-zA-Z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 80) || "user";
}

export default function PDFDownloadButton({ targetRef, userName, invoiceNumber, disabled }) {
  const [busy, setBusy] = useState(false);

  async function handleClick() {
    const el = targetRef?.current;
    if (!el || !invoiceNumber) return;
    setBusy(true);
    try {
      const name = sanitizeFilePart(userName);
      const inv = sanitizeFilePart(invoiceNumber);
      const filename = `invoice-${name}-${inv}.pdf`;
      const opt = {
        margin: [10, 10, 10, 10],
        filename,
        image: { type: "jpeg", quality: 0.95 },
        html2canvas: { scale: 2, useCORS: true, logging: false },
        jsPDF: { unit: "mm", format: "a4", orientation: "portrait" },
        pagebreak: { mode: ["css", "legacy"] },
      };
      await html2pdf().set(opt).from(el).save();
    } finally {
      setBusy(false);
    }
  }

  return (
    <button
      type="button"
      className="btn btn-secondary"
      onClick={handleClick}
      disabled={disabled || busy}
    >
      {busy ? "Preparing PDF…" : "Download PDF"}
    </button>
  );
}
