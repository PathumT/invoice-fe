import { forwardRef } from "react";
import { getInvoiceDerived } from "./invoice/invoiceDerived.js";
import ExecutiveInvoiceLayout from "./invoice/layouts/ExecutiveInvoiceLayout.jsx";
import StudioInvoiceLayout from "./invoice/layouts/StudioInvoiceLayout.jsx";
import EditorialInvoiceLayout from "./invoice/layouts/EditorialInvoiceLayout.jsx";

const LAYOUTS = {
  "pathum-qa": ExecutiveInvoiceLayout,
  "kushan-dev": StudioInvoiceLayout,
  "pasan-dev": EditorialInvoiceLayout,
};

const InvoicePreview = forwardRef(function InvoicePreview(props, ref) {
  const derived = getInvoiceDerived(props);
  const Layout = LAYOUTS[derived.slug] ?? ExecutiveInvoiceLayout;

  return (
    <div ref={ref} className={`invoice-sheet invoice-sheet--${derived.slug}`}>
      <Layout derived={derived} />
    </div>
  );
});

export default InvoicePreview;
