import { useEffect, useMemo, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { toast } from "sonner";
import { api, ApiError } from "../api/client.js";
import { generateInvoiceSchema, templateFormSchema } from "../lib/validation.js";
import InvoiceForm from "../components/InvoiceForm.jsx";
import InvoiceSummary from "../components/InvoiceSummary.jsx";
import InvoicePreview from "../components/InvoicePreview.jsx";
import PDFDownloadButton from "../components/PDFDownloadButton.jsx";

const emptyBank = {
  accountHolder: "",
  bankName: "",
  branch: "",
  accountNumber: "",
  swift: "",
};

function zodIssuesToMap(zodError) {
  const out = {};
  for (const issue of zodError.issues) {
    const key = issue.path.join(".") || "_root";
    if (!out[key]) out[key] = issue.message;
  }
  return out;
}

export default function InvoicePage() {
  const { templateId } = useParams();
  const previewRef = useRef(null);

  const [loading, setLoading] = useState(true);
  const [template, setTemplate] = useState(null);
  const [fx, setFx] = useState(null);
  const [form, setForm] = useState({
    email: "",
    hourlyRate: "",
    monthlyHours: "",
    bankDetails: { ...emptyBank },
  });
  const [errors, setErrors] = useState(null);
  const [generatedInvoice, setGeneratedInvoice] = useState(null);
  const [saving, setSaving] = useState(false);
  const [generating, setGenerating] = useState(false);
  const [loadError, setLoadError] = useState(null);

  useEffect(() => {
    setGeneratedInvoice(null);
  }, [templateId]);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      setLoading(true);
      setLoadError(null);
      setErrors(null);
      try {
        const settled = await Promise.allSettled([
          api(`/api/templates/${encodeURIComponent(templateId)}`),
          api("/api/exchange-rate/aud-lkr"),
        ]);
        if (cancelled) return;
        if (settled[0].status === "rejected") {
          throw settled[0].reason;
        }
        const tpl = settled[0].value;
        setTemplate(tpl);
        if (settled[1].status === "fulfilled") {
          setFx(settled[1].value);
        } else {
          setFx(null);
          toast.warning("Live exchange rate unavailable; totals in LKR may show as zero until it loads.");
        }
        setForm({
          email: tpl.email || "",
          hourlyRate: tpl.hourlyRate != null ? String(tpl.hourlyRate) : "",
          monthlyHours: tpl.monthlyHours != null ? String(tpl.monthlyHours) : "",
          bankDetails: { ...emptyBank, ...(tpl.bankDetails || {}) },
        });
      } catch (e) {
        const msg = e instanceof ApiError ? e.message : "Failed to load";
        setLoadError(msg);
        toast.error(msg);
      } finally {
        if (!cancelled) setLoading(false);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [templateId]);

  const parsedForm = useMemo(
    () => ({
      email: form.email,
      hourlyRate: form.hourlyRate === "" ? 0 : Number(form.hourlyRate),
      monthlyHours: form.monthlyHours === "" ? 0 : Number(form.monthlyHours),
      bankDetails: form.bankDetails,
    }),
    [form]
  );

  async function handleSave() {
    setErrors(null);
    const parsed = templateFormSchema.safeParse(parsedForm);
    if (!parsed.success) {
      setErrors(zodIssuesToMap(parsed.error));
      toast.error("Please fix validation errors");
      return;
    }
    setSaving(true);
    try {
      const body = parsed.data;
      const updated = await api(`/api/templates/${encodeURIComponent(templateId)}`, {
        method: "PUT",
        body: JSON.stringify(body),
      });
      setTemplate(updated);
      toast.success("Details saved");
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Save failed";
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  }

  async function handleGenerate() {
    setErrors(null);
    const parsed = generateInvoiceSchema.safeParse(parsedForm);
    if (!parsed.success) {
      setErrors(zodIssuesToMap(parsed.error));
      toast.error("Enter valid hours, rate, and banking details to generate");
      return;
    }
    setGenerating(true);
    try {
      const body = {
        templateSlug: templateId,
        ...parsed.data,
      };
      const inv = await api("/api/invoices", {
        method: "POST",
        body: JSON.stringify(body),
      });
      setGeneratedInvoice(inv);
      toast.success(`Invoice ${inv.invoiceNumber} created`);
    } catch (e) {
      const msg = e instanceof ApiError ? e.message : "Could not generate invoice";
      toast.error(msg);
    } finally {
      setGenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="layout">
        <div className="panel" style={{ minHeight: 320 }}>
          <div className="skeleton" style={{ height: 28, width: "50%" }} />
          <div className="skeleton" style={{ height: 200, marginTop: 24 }} />
        </div>
      </div>
    );
  }

  if (!template) {
    return (
      <div className="layout">
        <Link className="back-link" to="/">
          ← Back to users
        </Link>
        <div className="panel">
          <p style={{ margin: 0 }}>{loadError || "Template not found."}</p>
        </div>
      </div>
    );
  }

  return (
    <div className={`layout invoice-page invoice-page--${template.slug}`}>
      <Link className="back-link" to="/">
        ← Back to users
      </Link>
      <h1 className="page-title">
        {template.name} — {template.role}
      </h1>
      <p className="page-sub invoice-page-sub">{template.descriptionTitle}</p>

      <div className="invoice-layout">
        <div style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
          <InvoiceForm
            form={form}
            onChange={setForm}
            errors={errors}
            disabled={saving || generating}
          />
          <InvoiceSummary
            hourlyRate={form.hourlyRate}
            monthlyHours={form.monthlyHours}
            rate={fx?.rate}
            rateMeta={fx}
            generatedInvoice={generatedInvoice}
          />
          <div className="btn-row">
            <button
              type="button"
              className="btn btn-primary"
              onClick={handleSave}
              disabled={saving || generating}
            >
              {saving ? "Saving…" : "Save details"}
            </button>
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleGenerate}
              disabled={saving || generating}
            >
              {generating ? "Generating…" : "Generate invoice"}
            </button>
            <PDFDownloadButton
              targetRef={previewRef}
              userName={template.name}
              invoiceNumber={generatedInvoice?.invoiceNumber}
              disabled={!generatedInvoice}
            />
          </div>
        </div>

        <div className={`invoice-preview-column invoice-preview-column--${template.slug}`}>
          <h2 className="invoice-preview-heading">Invoice preview</h2>
          <InvoicePreview
            ref={previewRef}
            template={template}
            form={{
              email: form.email,
              hourlyRate: form.hourlyRate,
              monthlyHours: form.monthlyHours,
              bankDetails: form.bankDetails,
            }}
            generatedInvoice={generatedInvoice}
            liveRate={fx}
          />
        </div>
      </div>
    </div>
  );
}
