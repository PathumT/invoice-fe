/**
 * Kushan (kushan-dev) — Studio: dark header band, address strip, card line row, definition-list banking.
 */
export default function StudioInvoiceLayout({ derived }) {
  const { slug } = derived;

  return (
    <>
      <div className={`invoice-top-bar invoice-top-bar--${slug}`} aria-hidden />
      <div className="invoice-sheet-body inv-studio">
        <header className="inv-studio-hero">
          <div className="inv-studio-hero-left">
            <div className="inv-studio-logo-wrap">
              <img
                className="inv-studio-logo"
                src={derived.logoSrc}
                alt="Ethyx"
                width={180}
                height={40}
                decoding="async"
              />
            </div>
            <span className="inv-studio-invoice-label">Invoice</span>
          </div>
          <div className="inv-studio-hero-right">
            <span className={`status-pill status-pill--${slug} inv-studio-status`}>UNPAID</span>
            <dl className="inv-studio-meta-dl">
              <div>
                <dt>#</dt>
                <dd>{derived.invNo}</dd>
              </div>
              <div>
                <dt>Issue</dt>
                <dd>{derived.issueFormatted}</dd>
              </div>
              <div>
                <dt>Due</dt>
                <dd>{derived.dueFormatted}</dd>
              </div>
            </dl>
          </div>
        </header>

        <p className="inv-studio-tagline">Professional services invoice</p>

        <div className="inv-studio-address-strip">
          <div className="inv-studio-strip-pane">
            <span className="inv-studio-strip-label">Bill to</span>
            <strong>{derived.billToName}</strong>
            <span>{derived.billToEmail}</span>
          </div>
          <div className="inv-studio-strip-divider" aria-hidden />
          <div className="inv-studio-strip-pane">
            <span className="inv-studio-strip-label">From</span>
            <strong>{derived.fromLine}</strong>
            <span>{derived.fromEmail}</span>
          </div>
        </div>

        <section className="inv-studio-line-card" aria-label="Line items">
          <div className="inv-studio-line-card-head">
            <span>Description</span>
            <span className="inv-studio-line-metric">Hrs</span>
            <span className="inv-studio-line-metric">Rate</span>
            <span className="inv-studio-line-metric">Amount</span>
          </div>
          <div className="inv-studio-line-card-body">
            <div className="inv-studio-line-desc">
              <div className="inv-studio-line-title">{derived.descriptionTitle}</div>
              <div className="inv-studio-line-sub">{derived.descriptionSubTitle}</div>
            </div>
            <span className="inv-studio-line-metric">{derived.hoursDisplay}</span>
            <span className="inv-studio-line-metric">{derived.fmtHourly}</span>
            <span className="inv-studio-line-metric inv-studio-line-amount">{derived.fmtSubtotal}</span>
          </div>
        </section>

        <div className="inv-studio-totals">
          <div className="inv-studio-total-row">
            <span>Subtotal AUD</span>
            <span>{derived.fmtSubtotal}</span>
          </div>
          <div className="inv-studio-total-row">
            <span>Tax AUD (0%)</span>
            <span>{derived.fmtTax}</span>
          </div>
          <div className="inv-studio-total-row inv-studio-total-strong">
            <span>Total AUD</span>
            <span>{derived.fmtTotalAud}</span>
          </div>
          <div className="inv-studio-total-row inv-studio-total-note">
            <span>AUD → LKR</span>
            <span>{derived.fmtRate}</span>
          </div>
          <div className="inv-studio-total-row inv-studio-total-lkr">
            <span>Total LKR</span>
            <span>{derived.fmtTotalLkr}</span>
          </div>
        </div>

        <section className="inv-studio-bank" aria-label="Banking details">
          <h3 className="inv-studio-bank-title">Payment details</h3>
          <dl className="inv-studio-bank-dl">
            <div>
              <dt>Account holder</dt>
              <dd>{derived.bank.accountHolder}</dd>
            </div>
            <div>
              <dt>Bank</dt>
              <dd>{derived.bank.bankName}</dd>
            </div>
            <div>
              <dt>Branch</dt>
              <dd>{derived.bank.branch}</dd>
            </div>
            <div>
              <dt>Account number</dt>
              <dd>{derived.bank.accountNumber}</dd>
            </div>
            <div className="inv-studio-bank-span">
              <dt>SWIFT</dt>
              <dd>{derived.bank.swift}</dd>
            </div>
          </dl>
        </section>

        <footer className="inv-studio-footer">{derived.footerText}</footer>
      </div>
    </>
  );
}
