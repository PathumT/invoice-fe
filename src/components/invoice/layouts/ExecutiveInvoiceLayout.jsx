/**
 * Pathum (pathum-qa) — Executive: classic table, card addresses, right totals.
 */
export default function ExecutiveInvoiceLayout({ derived }) {
  const { slug } = derived;

  return (
    <>
      <div className={`invoice-top-bar invoice-top-bar--${slug}`} aria-hidden />
      <div className="invoice-sheet-body inv-executive">
        <div className="invoice-sheet-header">
          <div>
            <div className="invoice-logo-wrap">
              <img
                className="invoice-logo"
                src={derived.logoSrc}
                alt="Ethyx"
                width={200}
                height={48}
                decoding="async"
              />
            </div>
            <p className="invoice-tagline">Professional services invoice</p>
          </div>
          <div className="invoice-sheet-header-meta">
            <div className="invoice-meta">
              <div>
                <strong>Invoice #</strong> {derived.invNo}
              </div>
              <div>
                <strong>Issue date</strong> {derived.issueFormatted}
              </div>
              <div>
                <strong>Due date</strong> {derived.dueFormatted}
              </div>
            </div>
          </div>
        </div>

        <div className="invoice-columns">
          <div className="invoice-box">
            <h4>Bill to</h4>
            <div className="invoice-box-strong">{derived.billToName}</div>
            <div>{derived.billToEmail}</div>
          </div>
          <div className="invoice-box">
            <h4>From</h4>
            <div className="invoice-box-strong">{derived.fromLine}</div>
            <div>{derived.fromEmail}</div>
          </div>
        </div>

        <table className="invoice-table">
          <thead>
            <tr>
              <th>Description</th>
              <th className="invoice-th-narrow">Hours</th>
              <th className="invoice-th-narrow">Rate (AUD)</th>
              <th className="invoice-th-narrow">Amount (AUD)</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>
                <div className="invoice-desc-title">{derived.descriptionTitle}</div>
                <div className="invoice-desc-sub">{derived.descriptionSubTitle}</div>
              </td>
              <td>{derived.hoursDisplay}</td>
              <td>{derived.fmtHourly}</td>
              <td>{derived.fmtSubtotal}</td>
            </tr>
          </tbody>
        </table>

        <div className="totals inv-executive-totals">
          <div className="totals-row">
            <span>Subtotal AUD</span>
            <span>{derived.fmtSubtotal}</span>
          </div>
          <div className="totals-row">
            <span>Tax AUD (0%)</span>
            <span>{derived.fmtTax}</span>
          </div>
          <div className="totals-row total totals-row-highlight">
            <span>Total AUD</span>
            <span>{derived.fmtTotalAud}</span>
          </div>
          <div className="totals-row totals-row-note">
            <span>Exchange rate (AUD → LKR)</span>
            <span>{derived.fmtRate}</span>
          </div>
          <div className="totals-row total totals-row-lkr">
            <span>Total LKR</span>
            <span>{derived.fmtTotalLkr}</span>
          </div>
        </div>

        <div className="invoice-columns invoice-bank-grid">
          <div className="invoice-box">
            <h4>Bank account holder</h4>
            <div>{derived.bank.accountHolder}</div>
          </div>
          <div className="invoice-box">
            <h4>Bank name</h4>
            <div>{derived.bank.bankName}</div>
          </div>
          <div className="invoice-box">
            <h4>Branch</h4>
            <div>{derived.bank.branch}</div>
          </div>
          <div className="invoice-box">
            <h4>Account number</h4>
            <div>{derived.bank.accountNumber}</div>
          </div>
          <div className="invoice-box invoice-box-full">
            <h4>SWIFT</h4>
            <div>{derived.bank.swift}</div>
          </div>
        </div>

        <div className="invoice-footer">{derived.footerText}</div>
      </div>
    </>
  );
}
