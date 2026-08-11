import {
  Outlet,
  useLocation,
} from 'react-router-dom'

import BottomNavigation from '@/components/navigation/BottomNavigation'

import './AppLayout.css'


function AppLayout() {
  const location =
    useLocation()


  /*
    등록 / 상세 / 수정처럼
    하나의 작업에 집중하는 화면에서는
    Bottom Navigation을 숨긴다.
  */
  const isFocusPage =
    location.pathname.startsWith('/clothes/') ||
    location.pathname.startsWith('/outfits/') ||
    location.pathname.startsWith('/styles/') ||
    location.pathname.startsWith('/users/') ||
    location.pathname.startsWith('/posts/') ||
    location.pathname === '/history/new'


  return (
    <div className="app-frame">

      <div className="app-shell">

        <main
          className={[
            'app-main',

            isFocusPage
              ? 'app-main--focus'
              : '',
          ]
            .filter(
              Boolean,
            )
            .join(' ')}
        >
          <Outlet />
        </main>


        {!isFocusPage && (
          <BottomNavigation />
        )}

      </div>

    </div>
  )
}


export default AppLayout