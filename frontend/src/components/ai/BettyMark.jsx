import "./BettyMark.css";

function BettyMark({ size = "medium", className = "" }) {
  return (
    <span
      className={`betty-mark betty-mark--${size} ${className}`.trim()}
      role="img"
      aria-label="VESTI 코디메이트 베티"
    >
      <img src="/images/ai/betty-mark.png" alt="" aria-hidden="true" />
    </span>
  );
}

export default BettyMark;
