import './PageHeader.css'

function PageHeader({
  title,
  subtitle,
  onBack,
  backAriaLabel = '뒤로가기',
  action,
  className = '',
}) {
  return (
    <header className={`page-header ${className}`.trim()}>
      <div className="page-header__side">
        {onBack && (
          <button
            type="button"
            className="page-header__icon-button"
            onClick={onBack}
            aria-label={backAriaLabel}
          >
            <svg
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.8"
              strokeLinecap="round"
              strokeLinejoin="round"
              aria-hidden="true"
            >
              <path d="m15 18-6-6 6-6" />
            </svg>
          </button>
        )}
      </div>
      <div className="page-header__text">
        <h1>{title}</h1>
        {subtitle && <p>{subtitle}</p>}
      </div>
      <div className="page-header__side page-header__side--right">{action}</div>
    </header>
  )
}

export default PageHeader
