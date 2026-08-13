import { NavLink } from "react-router-dom";

import "./BottomNavigation.css";

const navigationItems = [
  {
    label: "오늘",
    path: "/today",
    icon: "home",
  },
  {
    label: "발견",
    path: "/discover",
    icon: "compass",
  },
  {
    label: "AI",
    path: "/ai",
    icon: "sparkles",
  },
  {
    label: "옷장",
    path: "/closet",
    icon: "hanger",
  },
  {
    label: "마이",
    path: "/my",
    icon: "user",
  },
];

function NavigationIcon({ name }) {
  const icons = {
    home: (
      <>
        <path d="M3.8 10.7 12 4l8.2 6.7" />
        <path d="M6.2 9.7v10.1h11.6V9.7" />
        <path d="M9.5 19.8v-5.5h5v5.5" />
      </>
    ),

    compass: (
      <>
        <circle cx="12" cy="12" r="8.5" />
        <path d="m15.6 8.4-2.2 5-5 2.2 2.2-5 5-2.2Z" />
        <circle cx="12" cy="12" r=".8" fill="currentColor" stroke="none" />
      </>
    ),

    sparkles: (
      <>
        <path d="M12.2 3c.55 3.35 2.45 5.25 5.8 5.8-3.35.55-5.25 2.45-5.8 5.8-.55-3.35-2.45-5.25-5.8-5.8 3.35-.55 5.25-2.45 5.8-5.8Z" />
        <path d="M18.2 14.7c.28 1.65 1.25 2.62 2.9 2.9-1.65.28-2.62 1.25-2.9 2.9-.28-1.65-1.25-2.62-2.9-2.9 1.65-.28 2.62-1.25 2.9-2.9Z" />
        <path d="M5.2 15.7c.18 1.05.8 1.67 1.85 1.85-1.05.18-1.67.8-1.85 1.85-.18-1.05-.8-1.67-1.85-1.85 1.05-.18 1.67-.8 1.85-1.85Z" />
      </>
    ),

    hanger: (
      <>
        <path d="M9.8 7.5A2.3 2.3 0 1 1 12 10v1.3" />
        <path d="m12 11.3 8.1 6.1a1.2 1.2 0 0 1-.7 2.1H4.6a1.2 1.2 0 0 1-.7-2.1l8.1-6.1Z" />
      </>
    ),

    user: (
      <>
        <circle cx="12" cy="8" r="3.35" />
        <path d="M5.2 20.3a6.8 6.8 0 0 1 13.6 0" />
      </>
    ),
  };

  return (
    <svg
      className="bottom-nav__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  );
}

function BottomNavigation() {
  return (
    <nav className="bottom-nav" aria-label="주요 메뉴">
      {navigationItems.map(({ label, path, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            ["bottom-nav__item", isActive ? "bottom-nav__item--active" : ""]
              .filter(Boolean)
              .join(" ")
          }
        >
          <span className="bottom-nav__icon-wrap">
            <NavigationIcon name={icon} />
          </span>

          <span className="bottom-nav__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  );
}

export default BottomNavigation;
