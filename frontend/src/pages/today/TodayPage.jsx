import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'
import { todayData } from '@/mocks/today'
import './TodayPage.css'

const getWeatherMessage = (temperature) => {
  if (temperature >= 28) {
    return '가볍고 통풍이 잘되는 옷을 추천해요.'
  }

  if (temperature >= 20) {
    return '얇은 겉옷을 준비하면 좋아요.'
  }

  return '따뜻한 아우터를 챙겨주세요.'
}

const getRecommendedOutfit = (temperature) => {
  const recommendedSeasons =
    temperature >= 28
      ? ['여름']
      : temperature >= 20
        ? ['봄', '가을']
        : ['겨울']

  return (
    outfits.find((outfit) => recommendedSeasons.includes(outfit.season)) ??
    outfits[0]
  )
}

const formatDate = (date, includeWeekday = false) =>
  new Intl.DateTimeFormat('ko-KR', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    ...(includeWeekday && { weekday: 'long' }),
  }).format(date)

function OutfitPreview({ outfit }) {
  const previewClothes = outfit.clothesIds
    .map((id) => clothes.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4)

  if (previewClothes.length === 0) {
    return (
      <div className="today-outfit__preview today-outfit__preview--empty">
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
    )
  }

  return (
    <div
      className={`today-outfit__preview today-outfit__preview--${previewClothes.length}`}
    >
      {previewClothes.map((item) => (
        <img key={item.id} src={item.image} alt="" />
      ))}
    </div>
  )
}

function TodayPage() {
  const navigate = useNavigate()
  const { weather } = todayData
  const initialRecommendation = getRecommendedOutfit(weather.temperature)
  const [recommendedOutfitId, setRecommendedOutfitId] = useState(
    initialRecommendation?.id ?? null,
  )

  const currentDate = new Date()
  const recommendedOutfit =
    outfits.find((outfit) => outfit.id === recommendedOutfitId) ?? outfits[0]
  const recentClothes = [...clothes]
    .sort((a, b) => {
      const aTime = a.createdAt ? new Date(a.createdAt).getTime() : 0
      const bTime = b.createdAt ? new Date(b.createdAt).getTime() : 0
      return bTime - aTime
    })
    .slice(0, 5)
  const recentlyWornOutfits = [...outfits]
    .filter((outfit) => outfit.lastWornAt)
    .sort(
      (a, b) =>
        new Date(b.lastWornAt).getTime() - new Date(a.lastWornAt).getTime(),
    )
    .slice(0, 3)

  const showAnotherOutfit = () => {
    if (outfits.length <= 1) return

    const currentIndex = outfits.findIndex(
      (outfit) => outfit.id === recommendedOutfit?.id,
    )
    const nextOutfit = outfits[(currentIndex + 1) % outfits.length]
    setRecommendedOutfitId(nextOutfit.id)
  }

  const handleWearToday = () => {
    if (!window.confirm('이 코디를 오늘 입은 기록으로 추가하시겠습니까?')) {
      return
    }

    navigate('/history', {
      state: { message: '오늘의 착용 기록이 추가되었습니다.' },
    })
  }

  return (
    <div className="today-page">
      <header className="today-page__header">
        <p className="today-page__date">{formatDate(currentDate, true)}</p>
        <h1>좋은 아침이에요</h1>
        <p className="today-page__subtitle">오늘 입을 옷을 골라볼까요?</p>
      </header>

      <section className="today-page__weather" aria-labelledby="weather-title">
        <div className="today-page__section-heading">
          <h2 id="weather-title">오늘의 날씨</h2>
          <span>{weather.location}</span>
        </div>
        <div className="today-weather__main">
          <div>
            <strong>{weather.temperature}°</strong>
            <span>{weather.condition}</span>
          </div>
          <dl>
            <div>
              <dt>최고·최저</dt>
              <dd>{weather.high}° / {weather.low}°</dd>
            </div>
            <div>
              <dt>강수 확률</dt>
              <dd>{weather.precipitation}%</dd>
            </div>
          </dl>
        </div>
        <p className="today-weather__message">
          {getWeatherMessage(weather.temperature)}
        </p>
      </section>

      <section className="today-page__section" aria-labelledby="recommendation-title">
        <div className="today-page__section-heading">
          <h2 id="recommendation-title">오늘의 추천 코디</h2>
          <span>{recommendedOutfit?.season}</span>
        </div>
        {recommendedOutfit ? (
          <>
            <article
              className="today-outfit"
              role="link"
              tabIndex={0}
              onClick={() => navigate(`/outfits/${recommendedOutfit.id}`)}
              onKeyDown={(event) => {
                if (event.key === 'Enter') {
                  navigate(`/outfits/${recommendedOutfit.id}`)
                }
              }}
            >
              <OutfitPreview outfit={recommendedOutfit} />
              <div className="today-outfit__content">
                <div>
                  <h3>{recommendedOutfit.name}</h3>
                  {recommendedOutfit.favorite && (
                    <svg
                      viewBox="0 0 24 24"
                      fill="currentColor"
                      aria-label="즐겨찾기"
                    >
                      <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                    </svg>
                  )}
                </div>
                <p>{recommendedOutfit.occasion} · {recommendedOutfit.season}</p>
                <span>옷 {recommendedOutfit.clothesIds.length}개</span>
              </div>
            </article>
            <div className="today-outfit__actions">
              <button type="button" onClick={showAnotherOutfit}>
                다른 코디 보기
              </button>
              <button type="button" onClick={handleWearToday}>
                오늘 입기
              </button>
            </div>
          </>
        ) : (
          <p className="today-page__empty">추천할 코디가 없습니다.</p>
        )}
      </section>

      <section className="today-page__section" aria-labelledby="recent-clothes-title">
        <div className="today-page__section-heading">
          <h2 id="recent-clothes-title">최근 등록한 옷</h2>
        </div>
        <div className="today-clothes__list">
          {recentClothes.map((item) => (
            <button
              key={item.id}
              type="button"
              className="today-clothes__card"
              onClick={() => navigate(`/clothes/${item.id}`)}
            >
              <img src={item.image} alt={item.name} />
              <strong>{item.name}</strong>
              <span>{item.category}</span>
            </button>
          ))}
        </div>
      </section>

      <section className="today-page__section" aria-labelledby="recent-outfits-title">
        <div className="today-page__section-heading">
          <h2 id="recent-outfits-title">최근 입은 코디</h2>
        </div>
        {recentlyWornOutfits.length > 0 ? (
          <div className="today-recent-outfits">
            {recentlyWornOutfits.map((outfit) => (
              <button
                key={outfit.id}
                type="button"
                onClick={() => navigate(`/outfits/${outfit.id}`)}
              >
                <span>
                  <strong>{outfit.name}</strong>
                  <small>{outfit.occasion} · {outfit.season}</small>
                </span>
                <time dateTime={outfit.lastWornAt}>
                  {formatDate(new Date(outfit.lastWornAt))}
                </time>
              </button>
            ))}
          </div>
        ) : (
          <p className="today-page__empty">아직 착용 기록이 없습니다.</p>
        )}
      </section>

      <section className="today-page__section" aria-labelledby="quick-actions-title">
        <div className="today-page__section-heading">
          <h2 id="quick-actions-title">빠른 실행</h2>
        </div>
        <div className="today-quick-actions">
          <button type="button" onClick={() => navigate('/clothes/new')}>
            <span>+</span>
            옷 등록
          </button>
          <button type="button" onClick={() => navigate('/outfits/new')}>
            <span>+</span>
            코디 만들기
          </button>
          <button type="button" onClick={() => navigate('/history')}>
            <span>↗</span>
            착용 기록 보기
          </button>
        </div>
      </section>
    </div>
  )
}

export default TodayPage
