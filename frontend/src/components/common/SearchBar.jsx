import './SearchBar.css'

function SearchBar({ value, onChange, placeholder, ariaLabel, className = '' }) {
  return (
    <div className={`search-bar ${className}`.trim()}>
      <svg
        viewBox="0 0 24 24"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        aria-hidden="true"
      >
        <circle cx="11" cy="11" r="7" />
        <path d="m20 20-4-4" />
      </svg>
      <input
        type="search"
        value={value}
        onChange={onChange}
        placeholder={placeholder}
        aria-label={ariaLabel}
      />
    </div>
  )
}

export default SearchBar
