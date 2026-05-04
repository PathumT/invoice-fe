/** Public logo path — file must live in `client/public/`. */
export const INVOICE_LOGO_SRC = "/ethyx-logo.png";

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

function fmtDate(iso) {
  if (!iso) return "—";
  const d = new Date(iso);
  return d.toLocaleDateString("en-AU", {
    year: "numeric",
    month: "short",
    day: "numeric",
  });
}

/**
 * Single source of truth for invoice numbers, formatting, and bank snapshot
 * used by all layout components + PDF capture.
 */
export function getInvoiceDerived({ template, form, generatedInvoice, liveRate }) {
  const hr = Number(form.hourlyRate) || 0;
  const mh = Number(form.monthlyHours) || 0;
  const subtotal = generatedInvoice ? generatedInvoice.totalAUD : hr * mh;
  const totalAud = subtotal;
  const effRate = generatedInvoice ? generatedInvoice.audToLkrRate : liveRate?.rate ?? 0;
  const totalLkr = generatedInvoice ? generatedInvoice.totalLKR : totalAud * effRate;

  const issue = generatedInvoice?.issueDate;
  const due = generatedInvoice?.dueDate;

  return {
    slug: template?.slug ?? "default",
    logoSrc: INVOICE_LOGO_SRC,
    billToName: "Ethyx",
    billToEmail: "info@ethyx.com",
    fromLine: `${template?.name ?? ""} — ${template?.role ?? ""}`.trim(),
    fromEmail: form.email?.trim() || "—",
    descriptionTitle: template?.descriptionTitle ?? "",
    descriptionSubTitle: template?.descriptionSubTitle ?? "",
    invNo: generatedInvoice?.invoiceNumber ?? "—",
    issueFormatted: fmtDate(issue),
    dueFormatted: fmtDate(due),
    hoursDisplay: mh || "—",
    hourlyRateNum: hr,
    subtotalNum: subtotal,
    totalAudNum: totalAud,
    totalLkrNum: totalLkr,
    effRateNum: effRate,
    fmtHourly: fmtAud(hr),
    fmtSubtotal: fmtAud(subtotal),
    fmtTax: fmtAud(0),
    fmtTotalAud: fmtAud(totalAud),
    fmtTotalLkr: fmtLkr(totalLkr),
    fmtRate: effRate ? effRate.toFixed(4) : "—",
    bank: {
      accountHolder: form.bankDetails?.accountHolder || "—",
      bankName: form.bankDetails?.bankName || "—",
      branch: form.bankDetails?.branch || "—",
      accountNumber: form.bankDetails?.accountNumber || "—",
      swift: form.bankDetails?.swift || "—",
    },
    footerText:
      "Thank you for your business! Please include the invoice number in your payment reference.",
  };
}
