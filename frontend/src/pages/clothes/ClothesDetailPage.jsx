import { useEffect, useRef, useState } from 'react'
import { useLocation, useNavigate, useParams } from 'react-router-dom'
import EmptyState from '@/components/common/EmptyState'
import FavoriteButton from '@/components/common/FavoriteButton'
import PageHeader from '@/components/common/PageHeader'
import ToastMessage from '@/components/common/ToastMessage'
import { clothes } from '@/mocks/clothes'
import './ClothesDetailPage.css'

const formatDate = (date) =>
  date
    ? new Intl.DateTimeFormat('ko-KR', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      }).format(new Date(date))
    : ''

function ClothesDetailPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const { clothesId } = useParams()
  const menuRef = useRef(null)
  const clothesItem = clothes.find((item) => item.id === Number(clothesId))
  const [isFavorite, setIsFavorite] = useState(
    clothesItem?.favorite ?? clothesItem?.isFavorite ?? false,
  )
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

  if (!clothesItem) {
    return (
      <EmptyState
        className="clothes-detail-empty"
        title="옷을 찾을 수 없습니다"
        description="삭제되었거나 존재하지 않는 옷입니다."
        buttonText="옷장으로 돌아가기"
        onButtonClick={() => navigate('/closet', { replace: true })}
      />
    )
  }

  const seasons = Array.isArray(clothesItem.seasons)
    ? clothesItem.seasons
    : clothesItem.season
      ? [clothesItem.season]
      : []

  const handleDelete = () => {
    if (!window.confirm('이 옷을 삭제하시겠습니까?')) return

    navigate('/closet', {
      replace: true,
      state: { message: '옷이 삭제되었습니다.' },
    })
  }

  const moreMenu = (
    <div className="clothes-detail__menu-wrap" ref={menuRef}>
      <button
        type="button"
        className="clothes-detail__more-button"
        onClick={() => setIsMenuOpen((isOpen) => !isOpen)}
        aria-label="더보기"
        aria-expanded={isMenuOpen}
        aria-haspopup="menu"
      >
        <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
          <circle cx="5" cy="12" r="1.7" />
          <circle cx="12" cy="12" r="1.7" />
          <circle cx="19" cy="12" r="1.7" />
        </svg>
      </button>
      {isMenuOpen && (
        <div className="clothes-detail__menu" role="menu">
          <button
            type="button"
            role="menuitem"
            onClick={() => navigate(`/clothes/${clothesId}/edit`)}
          >
            수정
          </button>
          <button
            type="button"
            role="menuitem"
            className="clothes-detail__delete"
            onClick={handleDelete}
          >
            삭제
          </button>
        </div>
      )}
    </div>
  )

  return (
    <div className="clothes-detail">
      <ToastMessage
        message={notification}
        onClose={() => setNotification('')}
      />
      <PageHeader
        className="clothes-detail__header"
        title="옷 정보"
        onBack={() => navigate(-1)}
        action={moreMenu}
      />

      <main className="clothes-detail__content">
        <section className="clothes-detail__hero">
          {clothesItem.image ? (
            <img src={clothesItem.image} alt={clothesItem.name} />
          ) : (
            <div className="clothes-detail__image-empty">
              <svg
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="1.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                aria-hidden="true"
              >
                <rect x="3" y="4" width="18" height="16" rx="2" />
                <circle cx="8.5" cy="9" r="1.5" />
                <path d="m4 17 5-5 4 4 2-2 5 5" />
              </svg>
              <span>등록된 이미지가 없습니다.</span>
            </div>
          )}
          <FavoriteButton
            className="clothes-detail__favorite"
            active={isFavorite}
            onClick={() => setIsFavorite((current) => !current)}
            ariaLabel={`즐겨찾기 ${isFavorite ? '해제' : '추가'}`}
          />
        </section>

        <section className="clothes-detail__summary">
          <h2>{clothesItem.name}</h2>
          <p>{clothesItem.brand || '브랜드 정보 없음'}</p>
          <div className="clothes-detail__tags">
            <span>{clothesItem.category}</span>
            <span>{clothesItem.color}</span>
          </div>
        </section>

        <section className="clothes-detail__section">
          <h2>계절</h2>
          {seasons.length > 0 ? (
            <div className="clothes-detail__seasons">
              {seasons.map((season) => (
                <span key={season}>{season}</span>
              ))}
            </div>
          ) : (
            <p className="clothes-detail__muted">계절 정보가 없습니다.</p>
          )}
        </section>

        <section className="clothes-detail__section">
          <h2>메모</h2>
          <p className="clothes-detail__memo">
            {clothesItem.memo || '작성된 메모가 없습니다.'}
          </p>
        </section>

        <section className="clothes-detail__section">
          <h2>착용 정보</h2>
          <dl className="clothes-detail__info-list">
            <div>
              <dt>등록일</dt>
              <dd>
                {clothesItem.createdAt
                  ? formatDate(clothesItem.createdAt)
                  : '등록일 정보 없음'}
              </dd>
            </div>
            <div>
              <dt>착용 횟수</dt>
              <dd>{clothesItem.wearCount ?? 0}회</dd>
            </div>
            <div>
              <dt>최근 착용일</dt>
              <dd>
                {clothesItem.lastWornAt
                  ? formatDate(clothesItem.lastWornAt)
                  : '아직 착용 기록이 없습니다.'}
              </dd>
            </div>
          </dl>
        </section>
      </main>

      <div className="clothes-detail__actions">
        <button
          type="button"
          className="clothes-detail__edit-button"
          onClick={() => navigate(`/clothes/${clothesId}/edit`)}
        >
          수정하기
        </button>
        <button
          type="button"
          className="clothes-detail__outfit-button"
          onClick={() => navigate(`/outfits/new?clothesId=${clothesId}`)}
        >
          코디에 추가
        </button>
      </div>
    </div>
  )
}

export default ClothesDetailPage
