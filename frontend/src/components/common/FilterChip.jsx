import './FilterChip.css'

function FilterChip({ label, selected, onClick, disabled = false, className = '' }) {
  return (
    <button
      type="button"
      className={`filter-chip${selected ? ' filter-chip--selected' : ''} ${className}`.trim()}
      onClick={onClick}
      disabled={disabled}
      aria-pressed={selected}
    >
      {label}
    </button>
  )
}

export default FilterChip
