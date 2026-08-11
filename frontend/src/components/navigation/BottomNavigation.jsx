import {
  NavLink,
} from 'react-router-dom'

import './BottomNavigation.css'


const navigationItems = [
  {
    label: '오늘',
    path: '/today',
    icon: 'home',
  },
  {
    label: '발견',
    path: '/discover',
    icon: 'discover',
  },
  {
    label: 'AI',
    path: '/ai',
    icon: 'sparkles',
  },
  {
    label: '옷장',
    path: '/closet',
    icon: 'wardrobe',
  },
  {
    label: '마이',
    path: '/my',
    icon: 'user',
  },
]


function NavigationIcon({
  name,
}) {
  const icons = {
    home: (
      <>
        <path d="M4 10.5 12 4l8 6.5" />
        <path d="M6.5 9.5V20h11V9.5" />
        <path d="M10 20v-6h4v6" />
      </>
    ),

    discover: (
      <>
        <circle
          cx="12"
          cy="12"
          r="8.5"
        />

        <path d="m15.4 8.6-2.1 4.7-4.7 2.1 2.1-4.7 4.7-2.1Z" />
      </>
    ),

    sparkles: (
      <>
        <path d="M12 2.8c.6 3.5 2.7 5.6 6.2 6.2-3.5.6-5.6 2.7-6.2 6.2-.6-3.5-2.7-5.6-6.2-6.2 3.5-.6 5.6-2.7 6.2-6.2Z" />

        <path d="M18.7 14.5c.3 1.8 1.4 2.9 3.2 3.2-1.8.3-2.9 1.4-3.2 3.2-.3-1.8-1.4-2.9-3.2-3.2 1.8-.3 2.9-1.4 3.2-3.2Z" />

        <path d="M5.1 15.5c.2 1.2.9 1.9 2.1 2.1-1.2.2-1.9.9-2.1 2.1-.2-1.2-.9-1.9-2.1-2.1 1.2-.2 1.9-.9 2.1-2.1Z" />
      </>
    ),

    wardrobe: (
      <>
        <rect
          x="4.5"
          y="3.5"
          width="15"
          height="17"
          rx="2.4"
        />

        <path d="M12 4v16" />

        <path d="M9.5 11h.01" />
        <path d="M14.5 11h.01" />
      </>
    ),

    user: (
      <>
        <circle
          cx="12"
          cy="8"
          r="3.4"
        />

        <path d="M5.2 20.5a6.8 6.8 0 0 1 13.6 0" />
      </>
    ),
  }


  return (
    <svg
      className="bottom-nav__icon"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.65"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      {icons[name]}
    </svg>
  )
}


function BottomNavigation() {
  return (
    <nav
      className="bottom-nav"
      aria-label="주요 메뉴"
    >
      {navigationItems.map(
        ({
          label,
          path,
          icon,
        }) => (
          <NavLink
            key={path}
            to={path}
            className={({
              isActive,
            }) =>
              [
                'bottom-nav__item',
                isActive
                  ? 'bottom-nav__item--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')
            }
          >
            <span
              className={[
                'bottom-nav__icon-wrap',
                icon === 'sparkles'
                  ? 'bottom-nav__icon-wrap--ai'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
            >
              <NavigationIcon
                name={icon}
              />
            </span>

            <span className="bottom-nav__label">
              {label}
            </span>
          </NavLink>
        ),
      )}
    </nav>
  )
}


export default BottomNavigation