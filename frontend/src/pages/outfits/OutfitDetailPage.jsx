import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '@/components/common/EmptyState'
import FavoriteButton from '@/components/common/FavoriteButton'
import PageHeader from '@/components/common/PageHeader'
import ToastMessage from '@/components/common/ToastMessage'
import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'
import './OutfitDetailPage.css'

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date))
    : ''

function OutfitDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { outfitId } = useParams()
  const menuRef = useRef(null)
  const outfit = outfits.find((item) => String(item.id) === outfitId)
  const includedClothes = outfit
    ? outfit.clothesIds
        .map((id) => clothes.find((item) => item.id === id))
        .filter(Boolean)
    : []
  const [isFavorite, setIsFavorite] = useState(outfit?.favorite ?? false)
  const [isMenuOpen, setIsMenuOpen] = useState(false)
  const [notification, setNotification] = useState(
    location.state?.message ?? '',
  )

  useEffect(() => {
    if (!isMenuOpen) return undefined

    const closeMenu = (event) => {
      if (!menuRef.current?.contains(event.target)) {
        setIsMenuOpen(false)
      }
    }

    document.addEventListener('pointerdown', closeMenu)
    return () => document.removeEventListener('pointerdown', closeMenu)
  }, [isMenuOpen])

  const handleWearToday = () => {
    if (!window.confirm('이 코디를 오늘 입은 기록으로 추가하시겠습니까?')) {
      return
    }

    navigate('/history', {
      state: { message: '오늘의 착용 기록이 추가되었습니다.' },
    })
  }

  const handleDelete = () => {
    if (!window.confirm('이 코디를 삭제하시겠습니까?')) return

    navigate('/outfits', {
      replace: true,
      state: { message: '코디가 삭제되었습니다.' },
    })
  }

  if (!outfit) {
    return (
      <EmptyState
        className="outfit-detail-empty"
        title="코디를 찾을 수 없습니다"
        description="삭제되었거나 존재하지 않는 코디입니다."
        buttonText="코디 목록으로 돌아가기"
        onButtonClick={() => navigate('/outfits')}
      />
    )
  }

  const previewClothes = includedClothes.slice(0, 4)

  return (
    <div className="outfit-detail">
      <ToastMessage
        message={notification}
        onClose={() => setNotification('')}
      />
      <PageHeader
        className="outfit-detail__header"
        title="코디 정보"
        onBack={() => navigate(-1)}
        action={
          <div className="outfit-detail__menu-wrap" ref={menuRef}>
          <button
            type="button"
            className="outfit-detail__icon-button"
            onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
            aria-label="더보기"
            aria-expanded={isMenuOpen}
            aria-haspopup="menu"
          >
            <svg
              viewBox="0 0 24 24"
              fill="currentColor"
              aria-hidden="true"
            >
              <circle cx="5" cy="12" r="1.7" />
              <circle cx="12" cy="12" r="1.7" />
              <circle cx="19" cy="12" r="1.7" />
            </svg>
          </button>
          {isMenuOpen && (
            <div className="outfit-detail__menu" role="menu">
              <button
                type="button"
                role="menuitem"
                onClick={() => navigate(`/outfits/${outfitId}/edit`)}
              >
                수정
              </button>
              <button
                type="button"
                role="menuitem"
                className="outfit-detail__delete"
                onClick={handleDelete}
              >
                삭제
              </button>
            </div>
          )}
          </div>
        }
      />

      <main className="outfit-detail__content">
        <section className="outfit-detail__hero">
          {previewClothes.length > 0 ? (
            <div
              className={`outfit-detail__preview outfit-detail__preview--${previewClothes.length}`}
            >
              {previewClothes.map((item, index) => (
                <div key={item.id} className="outfit-detail__preview-item">
                  <img src={item.image} alt={item.name} />
                  {index === 3 && includedClothes.length > 4 && (
                    <span>+{includedClothes.length - 4}</span>
                  )}
                </div>
              ))}
            </div>
          ) : (
            <div className="outfit-detail__preview-empty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <path d="m12 3-9 5 9 5 9-5-9-5Z" />
                <path d="m3 12 9 5 9-5M3 16l9 5 9-5" />
              </svg>
              <span>코디 이미지가 없습니다.</span>
            </div>
          )}
          <FavoriteButton
            className={`outfit-detail__favorite${isFavorite ? ' outfit-detail__favorite--active' : ''}`}
            active={isFavorite}
            onClick={() => setIsFavorite((current) => !current)}
            ariaLabel={`즐겨찾기 ${isFavorite ? '해제' : '추가'}`}
          />
        </section>

        <section className="outfit-detail__summary">
          <h2>{outfit.name}</h2>
          <div className="outfit-detail__tags">
            <span>{outfit.occasion}</span>
            <span>{outfit.season}</span>
          </div>
        </section>

        <section className="outfit-detail__section">
          <h2>코디 정보</h2>
          <dl className="outfit-detail__info-list">
            <div>
              <dt>등록일</dt>
              <dd>{formatDate(outfit.createdAt)}</dd>
            </div>
            <div>
              <dt>착용 횟수</dt>
              <dd>{outfit.wearCount ?? 0}회</dd>
            </div>
            <div>
              <dt>최근 착용일</dt>
              <dd>
                {outfit.lastWornAt
                  ? formatDate(outfit.lastWornAt)
                  : '아직 착용 기록이 없습니다.'}
              </dd>
            </div>
            <div>
              <dt>포함된 옷</dt>
              <dd>{includedClothes.length}개</dd>
            </div>
          </dl>
        </section>

        <section className="outfit-detail__section">
          <h2>메모</h2>
          <p className="outfit-detail__memo">
            {outfit.memo || '작성된 메모가 없습니다.'}
          </p>
        </section>

        <section className="outfit-detail__section">
          <h2>포함된 옷</h2>
          {includedClothes.length > 0 ? (
            <div className="outfit-detail__clothes-list">
              {includedClothes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="outfit-detail__clothes-card"
                  onClick={() => navigate(`/clothes/${item.id}`)}
                >
                  <img src={item.image} alt={item.name} />
                  <span className="outfit-detail__clothes-info">
                    <strong>{item.name}</strong>
                    <span>{item.brand}</span>
                    <small>{item.category} · {item.color}</small>
                  </span>
                  <svg
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.8"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    aria-hidden="true"
                  >
                    <path d="m9 18 6-6-6-6" />
                  </svg>
                </button>
              ))}
            </div>
          ) : (
            <p className="outfit-detail__empty-clothes">
              코디에 포함된 옷이 없습니다.
            </p>
          )}
        </section>
      </main>

      <div className="outfit-detail__actions">
        <button
          type="button"
          className="outfit-detail__wear-button"
          onClick={handleWearToday}
        >
          오늘 입기
        </button>
        <button
          type="button"
          className="outfit-detail__edit-button"
          onClick={() => navigate(`/outfits/${outfitId}/edit`)}
        >
          수정하기
        </button>
      </div>
    </div>
  )
}

export default OutfitDetailPage
