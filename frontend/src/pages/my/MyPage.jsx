import { useNavigate } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import { histories } from '@/mocks/history'
import { outfits } from '@/mocks/outfits'
import { user } from '@/mocks/user'
import './MyPage.css'

const menuItems = [
  { label: '내 옷장', path: '/closet' },
  { label: '내 코디', path: '/outfits' },
  { label: '착용 기록', path: '/history' },
  { label: '즐겨찾기', path: '/favorites' },
  { label: '알림 설정', path: '/settings/notifications' },
  { label: '앱 정보', path: '/about' },
]

const formatJoinedAt = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
  }).format(new Date(`${date}T00:00:00`)) + ' 가입'

function OutfitPreview({ outfit }) {
  const previewClothes = outfit.clothesIds
    .map((id) => clothes.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4)

  if (previewClothes.length === 0) {
    return (
      <span className="my-outfit-preview my-outfit-preview--empty">
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
      </span>
    )
  }

  return (
    <span className={`my-outfit-preview my-outfit-preview--${previewClothes.length}`}>
      {previewClothes.map((item) => (
        <img key={item.id} src={item.image} alt="" />
      ))}
    </span>
  )
}

function MyPage() {
  const navigate = useNavigate()
  const outfitWearCounts = histories.reduce((counts, history) => {
    counts.set(history.outfitId, (counts.get(history.outfitId) ?? 0) + 1)
    return counts
  }, new Map())
  const frequentlyWornOutfits = [...outfitWearCounts.entries()]
    .map(([outfitId, wearCount]) => ({
      outfit: outfits.find((item) => item.id === outfitId),
      wearCount,
    }))
    .filter((item) => item.outfit)
    .sort((a, b) => b.wearCount - a.wearCount)
    .slice(0, 3)
  const clothesWearCounts = histories.reduce((counts, history) => {
    const outfit = outfits.find((item) => item.id === history.outfitId)

    outfit?.clothesIds.forEach((clothesId) => {
      counts.set(clothesId, (counts.get(clothesId) ?? 0) + 1)
    })
    return counts
  }, new Map())
  const frequentlyWornClothes = [...clothesWearCounts.entries()]
    .map(([clothesId, wearCount]) => ({
      clothes: clothes.find((item) => item.id === clothesId),
      wearCount,
    }))
    .filter((item) => item.clothes)
    .sort((a, b) => b.wearCount - a.wearCount)
    .slice(0, 5)
  const statistics = [
    { label: '등록한 옷', value: clothes.length },
    { label: '등록한 코디', value: outfits.length },
    { label: '착용 기록', value: histories.length },
    {
      label: '즐겨찾기한 옷',
      value: clothes.filter((item) => item.isFavorite).length,
    },
  ]

  const handleLogout = () => {
    if (!window.confirm('로그아웃하시겠습니까?')) return

    navigate('/today', {
      replace: true,
      state: { message: '로그아웃되었습니다.' },
    })
  }

  return (
    <div className="my-page">
      <header className="my-page__header">
        <h1>마이</h1>
        <button
          type="button"
          onClick={() => navigate('/settings')}
          aria-label="설정"
        >
          <svg
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.7"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <circle cx="12" cy="12" r="3" />
            <path d="M19.4 15a1.7 1.7 0 0 0 .3 1.9l.1.1-2.8 2.8-.1-.1a1.7 1.7 0 0 0-1.9-.3 1.7 1.7 0 0 0-1 1.6v.2h-4V21a1.7 1.7 0 0 0-1-1.6 1.7 1.7 0 0 0-1.9.3l-.1.1L4.2 17l.1-.1a1.7 1.7 0 0 0 .3-1.9A1.7 1.7 0 0 0 3 14H2.8v-4H3a1.7 1.7 0 0 0 1.6-1 1.7 1.7 0 0 0-.3-1.9L4.2 7 7 4.2l.1.1A1.7 1.7 0 0 0 9 4.6 1.7 1.7 0 0 0 10 3v-.2h4V3a1.7 1.7 0 0 0 1 1.6 1.7 1.7 0 0 0 1.9-.3l.1-.1L19.8 7l-.1.1a1.7 1.7 0 0 0-.3 1.9 1.7 1.7 0 0 0 1.6 1h.2v4H21a1.7 1.7 0 0 0-1.6 1Z" />
          </svg>
        </button>
      </header>

      <section className="my-profile">
        {user.profileImage ? (
          <img src={user.profileImage} alt={`${user.name} 프로필`} />
        ) : (
          <div className="my-profile__avatar" aria-label={`${user.name} 기본 프로필`}>
            {user.name.charAt(0)}
          </div>
        )}
        <div className="my-profile__info">
          <h2>{user.name}</h2>
          <p>{user.email}</p>
          <span>{formatJoinedAt(user.joinedAt)}</span>
        </div>
        <button type="button" onClick={() => navigate('/my/edit')}>
          프로필 수정
        </button>
      </section>

      <section className="my-page__section">
        <h2>전체 현황</h2>
        <div className="my-statistics">
          {statistics.map((item) => (
            <div key={item.label}>
              <strong>{item.value}</strong>
              <span>{item.label}</span>
            </div>
          ))}
        </div>
      </section>

      <section className="my-page__section my-style">
        <h2>스타일 정보</h2>
        <div>
          <h3>선호 스타일</h3>
          {user.stylePreference.length > 0 ? (
            <div className="my-style__chips">
              {user.stylePreference.map((style) => (
                <span key={style}>{style}</span>
              ))}
            </div>
          ) : (
            <p>아직 설정된 스타일이 없습니다.</p>
          )}
        </div>
        <div>
          <h3>선호 색상</h3>
          {user.favoriteColors.length > 0 ? (
            <div className="my-style__chips">
              {user.favoriteColors.map((color) => (
                <span key={color}>{color}</span>
              ))}
            </div>
          ) : (
            <p>아직 설정된 색상이 없습니다.</p>
          )}
        </div>
      </section>

      <section className="my-page__section">
        <h2>자주 입은 코디</h2>
        {frequentlyWornOutfits.length > 0 ? (
          <div className="my-frequent-outfits">
            {frequentlyWornOutfits.map(({ outfit, wearCount }) => (
              <button
                key={outfit.id}
                type="button"
                onClick={() => navigate(`/outfits/${outfit.id}`)}
              >
                <OutfitPreview outfit={outfit} />
                <span>
                  <strong>{outfit.name}</strong>
                  <small>{outfit.occasion} · {outfit.season}</small>
                </span>
                <b>{wearCount}회</b>
              </button>
            ))}
          </div>
        ) : (
          <p className="my-page__empty">아직 자주 입은 코디가 없습니다.</p>
        )}
      </section>

      <section className="my-page__section">
        <h2>자주 입은 옷</h2>
        {frequentlyWornClothes.length > 0 ? (
          <div className="my-frequent-clothes">
            {frequentlyWornClothes.map(({ clothes: item, wearCount }) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/clothes/${item.id}`)}
              >
                <img src={item.image} alt={item.name} />
                <strong>{item.name}</strong>
                <span>{item.category}</span>
                <small>{wearCount}회 착용</small>
              </button>
            ))}
          </div>
        ) : (
          <p className="my-page__empty">아직 자주 입은 옷이 없습니다.</p>
        )}
      </section>

      <nav className="my-menu" aria-label="마이페이지 메뉴">
        {menuItems.map((item) => (
          <button
            key={item.path}
            type="button"
            onClick={() => navigate(item.path)}
          >
            <span>{item.label}</span>
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
      </nav>

      <button type="button" className="my-page__logout" onClick={handleLogout}>
        로그아웃
      </button>
      <p className="my-page__version">VESTI v1.0.0</p>
    </div>
  )
}

export default MyPage
