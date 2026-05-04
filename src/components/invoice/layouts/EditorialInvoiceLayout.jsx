/**
 * Pasan (pasan-dev) — Editorial: asymmetric header, left-border blocks, borderless line, full-width totals.
 */
export default function EditorialInvoiceLayout({ derived }) {
  const { slug } = derived;

  return (
    <>
      <div className={`invoice-top-bar invoice-top-bar--${slug}`} aria-hidden />
      <div className="invoice-sheet-body inv-editorial">
        <header className="inv-editorial-header">
          <div className="inv-editorial-header-left">
            <div className="inv-editorial-logo-wrap">
              <img
                className="inv-editorial-logo"
                src={derived.logoSrc}
                alt="Ethyx"
                width={160}
                height={38}
                decoding="async"
              />
            </div>
            <p className="inv-editorial-lede">Professional services invoice</p>
          </div>
          <div className="inv-editorial-header-right">
            <div className="inv-editorial-inv-no">{derived.invNo}</div>
            <span className={`status-pill status-pill--${slug}`}>UNPAID</span>
          </div>
        </header>

        <div className="inv-editorial-meta-strip">
          <span>
            <strong>Issue</strong> {derived.issueFormatted}
          </span>
          <span className="inv-editorial-meta-dot" aria-hidden>
            ·
          </span>
          <span>
            <strong>Due</strong> {derived.dueFormatted}
          </span>
          <span className="inv-editorial-meta-dot" aria-hidden>
            ·
          </span>
          <span>
            <strong>Rate</strong> {derived.fmtRate}
          </span>
        </div>

        <div className="inv-editorial-blocks">
          <div className="inv-editorial-block">
            <h4>Bill to</h4>
            <p className="inv-editorial-block-strong">{derived.billToName}</p>
            <p>{derived.billToEmail}</p>
          </div>
          <div className="inv-editorial-block">
            <h4>From</h4>
            <p className="inv-editorial-block-strong">{derived.fromLine}</p>
            <p>{derived.fromEmail}</p>
          </div>
        </div>

        <section className="inv-editorial-linesection" aria-label="Services">
          <div className="inv-editorial-linehead">
            <span>Service</span>
            <span>Hrs</span>
            <span>Rate</span>
            <span>Amount</span>
          </div>
          <div className="inv-editorial-linerow">
            <div>
              <div className="inv-editorial-line-title">{derived.descriptionTitle}</div>
              <div className="inv-editorial-line-sub">{derived.descriptionSubTitle}</div>
            </div>
            <span>{derived.hoursDisplay}</span>
            <span>{derived.fmtHourly}</span>
            <span className="inv-editorial-line-amt">{derived.fmtSubtotal}</span>
          </div>
        </section>

        <div className="inv-editorial-totals">
          <div className="inv-editorial-total-line">
            <span>Subtotal AUD</span>
            <span>{derived.fmtSubtotal}</span>
          </div>
          <div className="inv-editorial-total-line">
            <span>Tax AUD (0%)</span>
            <span>{derived.fmtTax}</span>
          </div>
          <div className="inv-editorial-total-line inv-editorial-total-aud">
            <span>Total AUD</span>
            <span>{derived.fmtTotalAud}</span>
          </div>
          <div className="inv-editorial-total-line inv-editorial-total-muted">
            <span>Exchange rate (AUD → LKR)</span>
            <span>{derived.fmtRate}</span>
          </div>
          <div className="inv-editorial-total-line inv-editorial-total-lkr">
            <span>Total LKR</span>
            <span>{derived.fmtTotalLkr}</span>
          </div>
        </div>

        <section className="inv-editorial-bank" aria-label="Banking">
          <h3 className="inv-editorial-bank-heading">Banking</h3>
          <div className="inv-editorial-bank-grid">
            <div>
              <span className="inv-editorial-bank-k">Holder</span>
              <span>{derived.bank.accountHolder}</span>
            </div>
            <div>
              <span className="inv-editorial-bank-k">Bank</span>
              <span>{derived.bank.bankName}</span>
            </div>
            <div>
              <span className="inv-editorial-bank-k">Branch</span>
              <span>{derived.bank.branch}</span>
            </div>
            <div>
              <span className="inv-editorial-bank-k">Account</span>
              <span>{derived.bank.accountNumber}</span>
            </div>
            <div className="inv-editorial-bank-wide">
              <span className="inv-editorial-bank-k">SWIFT</span>
              <span>{derived.bank.swift}</span>
            </div>
          </div>
        </section>

        <footer className="inv-editorial-footer">{derived.footerText}</footer>
      </div>
    </>
  );
}
