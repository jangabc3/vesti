import './FavoriteButton.css'

function FavoriteButton({
  active,
  onClick,
  ariaLabel,
  className = '',
  stopPropagation = false,
}) {
  const handleClick = (event) => {
    if (stopPropagation) event.stopPropagation()
    onClick?.(event)
  }

  return (
    <button
      type="button"
      className={`favorite-button${active ? ' favorite-button--active' : ''} ${className}`.trim()}
      onClick={handleClick}
      aria-label={ariaLabel}
      aria-pressed={active}
    >
      <svg
        viewBox="0 0 24 24"
        fill={active ? 'currentColor' : 'none'}
        stroke="currentColor"
        strokeWidth="1.8"
        strokeLinecap="round"
        strokeLinejoin="round"
        aria-hidden="true"
      >
        <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
      </svg>
    </button>
  )
}

export default FavoriteButton
