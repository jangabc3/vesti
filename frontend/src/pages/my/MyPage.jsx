import { useNavigate } from 'react-router-dom'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'

import './MyPage.css'


/*
  HistoryPage의 착용 기록이 아직
  공통 API / Mock Store로 분리되지 않았기 때문에
  디자인 단계에서만 사용하는 임시 값이다.

  실제 API 연동 시 CoordinationRecord
  조회 결과의 개수로 교체한다.
*/
const MOCK_WEARING_RECORD_COUNT = 8


function ChevronRightIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function UserIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="8"
        r="3.5"
      />

      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  )
}


function LockIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect
        x="5"
        y="10"
        width="14"
        height="10"
        rx="2"
      />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  )
}


function InfoIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <circle
        cx="12"
        cy="12"
        r="9"
      />

      <path d="M12 11v6" />

      <path d="M12 7.5h.01" />
    </svg>
  )
}


function LogoutIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />

      <path d="m15 8 4 4-4 4" />

      <path d="M9 12h10" />
    </svg>
  )
}


function MenuRow({
  icon,
  title,
  description,
  value,
  onClick,
}) {
  const content = (
    <>
      <div className="my-menu__icon">
        {icon}
      </div>

      <div className="my-menu__content">
        <strong>
          {title}
        </strong>

        {description && (
          <span>
            {description}
          </span>
        )}
      </div>

      {value ? (
        <span className="my-menu__value">
          {value}
        </span>
      ) : (
        <ChevronRightIcon />
      )}
    </>
  )


  if (!onClick) {
    return (
      <div className="my-menu my-menu--static">
        {content}
      </div>
    )
  }


  return (
    <button
      type="button"
      className="my-menu"
      onClick={onClick}
    >
      {content}
    </button>
  )
}


function MyPage() {
  const navigate = useNavigate()


  const handleMyInfo = () => {
    /*
      실제 API 연결 단계에서
      GET /users/me 결과를 표시하는
      화면 또는 Bottom Sheet로 연결한다.
    */

    window.alert(
      '내 정보 화면은 API 연결 단계에서 연결할게요.',
    )
  }


  const handlePasswordChange = () => {
    /*
      백엔드 비밀번호 변경 API와
      연결할 예정.
    */

    window.alert(
      '비밀번호 변경 화면은 API 연결 단계에서 연결할게요.',
    )
  }


  const handleLogout = () => {
    const confirmed =
      window.confirm(
        '로그아웃하시겠습니까?',
      )

    if (!confirmed) {
      return
    }

    /*
      실제 인증 연결 단계에서는:

      1. 저장된 JWT 제거
      2. 인증 상태 초기화
      3. 로그인 화면 이동

      으로 변경한다.
    */

    window.alert(
      '로그아웃은 인증 API 연결 단계에서 연결할게요.',
    )
  }


  return (
    <div className="my-page">

      {/* Header */}
      <header className="my-header">
        <span className="my-header__eyebrow">
          MY
        </span>

        <h1>
          마이
        </h1>

        <p>
          내 옷장과 계정을
          한곳에서 관리하세요.
        </p>
      </header>


      {/* Profile */}
      <section className="my-profile">
        <div className="my-profile__avatar">
          <span>
            V
          </span>
        </div>

        <div className="my-profile__content">
          <span className="my-profile__label">
            MY PROFILE
          </span>

          <h2>
            내 프로필
          </h2>

          <p>
            회원 정보는 로그인 연동 후
            표시됩니다.
          </p>
        </div>

        <button
          type="button"
          className="my-profile__button"
          onClick={handleMyInfo}
          aria-label="내 정보 보기"
        >
          <ChevronRightIcon />
        </button>
      </section>


      {/* VESTI Summary */}
      <section className="my-summary">
        <div className="my-section-heading">
          <span>
            나의 VESTI
          </span>
        </div>

        <div className="my-summary__grid">
          <button
            type="button"
            className="my-summary__item"
            onClick={() =>
              navigate('/closet')
            }
          >
            <strong>
              {clothes.length}
            </strong>

            <span>
              등록한 옷
            </span>
          </button>


          <button
            type="button"
            className="my-summary__item"
            onClick={() =>
              navigate('/outfits')
            }
          >
            <strong>
              {outfits.length}
            </strong>

            <span>
              저장한 코디
            </span>
          </button>


          <button
            type="button"
            className="my-summary__item"
            onClick={() =>
              navigate('/history')
            }
          >
            <strong>
              {MOCK_WEARING_RECORD_COUNT}
            </strong>

            <span>
              착용 기록
            </span>
          </button>
        </div>
      </section>


      {/* Account */}
      <section className="my-section">
        <div className="my-section-heading">
          <span>
            계정
          </span>
        </div>

        <div className="my-menu-list">
          <MenuRow
            icon={<UserIcon />}
            title="내 정보"
            description="계정 정보를 확인해요."
            onClick={handleMyInfo}
          />

          <MenuRow
            icon={<LockIcon />}
            title="비밀번호 변경"
            description="계정 비밀번호를 변경해요."
            onClick={handlePasswordChange}
          />
        </div>
      </section>


      {/* Service */}
      <section className="my-section">
        <div className="my-section-heading">
          <span>
            서비스
          </span>
        </div>

        <div className="my-menu-list">
          <MenuRow
            icon={<InfoIcon />}
            title="VESTI"
            description="나의 옷장을 더 잘 활용하는 방법"
            value="0.1.0"
          />
        </div>
      </section>


      {/* Logout */}
      <section className="my-logout">
        <button
          type="button"
          onClick={handleLogout}
        >
          <LogoutIcon />

          <span>
            로그아웃
          </span>
        </button>
      </section>


      <footer className="my-footer">
        <span>
          VESTI
        </span>

        <p>
          Your wardrobe, better used.
        </p>
      </footer>
    </div>
  )
}


export default MyPage