import { NavLink } from 'react-router-dom'
import './BottomNavigation.css'

const navigationItems = [
  { label: '오늘', path: '/today', icon: 'home' },
  { label: '옷장', path: '/closet', icon: 'grid' },
  { label: '코디', path: '/outfits', icon: 'layers' },
  { label: '기록', path: '/history', icon: 'calendar' },
  { label: '마이', path: '/my', icon: 'user' },
]

function NavigationIcon({ name }) {
  const paths = {
    home: <path d="m3 10 9-7 9 7v10a1 1 0 0 1-1 1h-5v-7H9v7H4a1 1 0 0 1-1-1V10Z" />,
    grid: (
      <>
        <rect x="3" y="3" width="7" height="7" rx="1" />
        <rect x="14" y="3" width="7" height="7" rx="1" />
        <rect x="3" y="14" width="7" height="7" rx="1" />
        <rect x="14" y="14" width="7" height="7" rx="1" />
      </>
    ),
    layers: (
      <>
        <path d="m12 3-9 5 9 5 9-5-9-5Z" />
        <path d="m3 12 9 5 9-5" />
        <path d="m3 16 9 5 9-5" />
      </>
    ),
    calendar: (
      <>
        <rect x="3" y="5" width="18" height="16" rx="2" />
        <path d="M16 3v4M8 3v4M3 10h18" />
      </>
    ),
    user: (
      <>
        <circle cx="12" cy="8" r="4" />
        <path d="M4 21a8 8 0 0 1 16 0" />
      </>
    ),
  }

  return (
    <svg
      className="bottom-navigation__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {paths[name]}
    </svg>
  )
}

function BottomNavigation() {
  return (
    <nav className="bottom-navigation" aria-label="주요 메뉴">
      {navigationItems.map(({ label, path, icon }) => (
        <NavLink
          key={path}
          to={path}
          className={({ isActive }) =>
            `bottom-navigation__item${isActive ? ' bottom-navigation__item--active' : ''}`
          }
        >
          <span className="bottom-navigation__indicator" aria-hidden="true" />
          <NavigationIcon name={icon} />
          <span className="bottom-navigation__label">{label}</span>
        </NavLink>
      ))}
    </nav>
  )
}

export default BottomNavigation
