import './EmptyState.css'

function EmptyState({ title, description, buttonText, onButtonClick, className = '' }) {
  return (
    <div className={`empty-state ${className}`.trim()}>
      <h2>{title}</h2>
      {description && <p>{description}</p>}
      {buttonText && onButtonClick && (
        <button type="button" onClick={onButtonClick}>
          {buttonText}
        </button>
      )}
    </div>
  )
}

export default EmptyState
