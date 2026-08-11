import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'

import ToastMessage from '@/components/common/ToastMessage'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'
import { todayData } from '@/mocks/today'

import './TodayPage.css'


const getWeatherMessage = (temperature) => {
  if (temperature >= 28) {
    return '가볍고 통풍이 잘 되는 옷이 좋아요.'
  }

  if (temperature >= 20) {
    return '얇은 겉옷을 하나 챙기면 좋아요.'
  }

  return '따뜻하게 입고 외출하세요.'
}


const getRecommendedOutfit = (temperature) => {
  const recommendedSeasons =
    temperature >= 28
      ? ['여름']
      : temperature >= 20
        ? ['봄', '가을']
        : ['겨울']

  return (
    outfits.find((outfit) =>
      recommendedSeasons.includes(outfit.season),
    ) ?? outfits[0]
  )
}


const formatToday = (date) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
    weekday: 'long',
  }).format(date)


const getGreeting = () => {
  const hour = new Date().getHours()

  if (hour < 12) {
    return '좋은 아침이에요'
  }

  if (hour < 18) {
    return '좋은 오후예요'
  }

  return '좋은 저녁이에요'
}


function OutfitVisual({ outfit }) {
  const outfitClothes = outfit.clothesIds
    .map((id) => clothes.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4)

  if (outfitClothes.length === 0) {
    return (
      <div className="today-look__empty">
        <span>추천 코디를 준비하고 있어요.</span>
      </div>
    )
  }

  return (
    <div
      className={`today-look__visual today-look__visual--${Math.min(
        outfitClothes.length,
        4,
      )}`}
    >
      {outfitClothes.map((item) => (
        <div
          key={item.id}
          className="today-look__visual-item"
        >
          <img
            src={item.image}
            alt={item.name}
          />
        </div>
      ))}
    </div>
  )
}


function TodayPage() {
  const navigate = useNavigate()
  const location = useLocation()

  const { weather } = todayData

  const initialRecommendation =
    getRecommendedOutfit(weather.temperature)

  const [recommendedOutfitId, setRecommendedOutfitId] =
    useState(initialRecommendation?.id ?? null)

  const [notification, setNotification] =
    useState(location.state?.message ?? '')

  const today = new Date()

  const recommendedOutfit =
    outfits.find(
      (outfit) => outfit.id === recommendedOutfitId,
    ) ?? outfits[0]

  const recentClothes = [...clothes].slice(0, 5)


  const showAnotherOutfit = () => {
    if (outfits.length <= 1) {
      return
    }

    const currentIndex = outfits.findIndex(
      (outfit) =>
        outfit.id === recommendedOutfit?.id,
    )

    const nextOutfit =
      outfits[(currentIndex + 1) % outfits.length]

    setRecommendedOutfitId(nextOutfit.id)
  }


  const handleWearToday = () => {
    const confirmed = window.confirm(
      '이 코디를 오늘 입은 기록으로 추가하시겠습니까?',
    )

    if (!confirmed) {
      return
    }

    navigate('/history', {
      state: {
        message: '오늘의 착용 기록이 추가되었습니다.',
      },
    })
  }


  return (
    <div className="today-page">
      <ToastMessage
        message={notification}
        onClose={() => setNotification('')}
      />


      {/* Header */}
      <header className="today-header">
        <p className="today-header__date">
          {formatToday(today)}
        </p>

        <h1>
          {getGreeting()}
        </h1>

        <p className="today-header__description">
          오늘 입을 옷을 함께 골라볼까요?
        </p>
      </header>


      {/* Weather */}
      <section
        className="today-weather"
        aria-label="오늘의 날씨"
      >
        <div className="today-weather__top">
          <div className="today-weather__location">
            <span
              className="today-weather__location-icon"
              aria-hidden="true"
            />

            <span>
              {weather.location}
            </span>
          </div>

          <span className="today-weather__condition">
            {weather.condition}
          </span>
        </div>


        <div className="today-weather__temperature">
          <strong>
            {weather.temperature}°
          </strong>

          <div className="today-weather__detail">
            <span>
              최고 {weather.high}°
            </span>

            <span>
              최저 {weather.low}°
            </span>
          </div>
        </div>


        <div className="today-weather__message">
          <p>
            {getWeatherMessage(weather.temperature)}
          </p>

          <span>
            강수확률 {weather.precipitation}%
          </span>
        </div>
      </section>


      {/* Recommended Outfit */}
      <section
        className="today-look"
        aria-labelledby="today-look-title"
      >
        <div className="today-section-heading">
          <div>
            <span className="today-section-heading__eyebrow">
              TODAY&apos;S LOOK
            </span>

            <h2 id="today-look-title">
              오늘의 추천
            </h2>
          </div>

          <span className="today-section-heading__meta">
            {recommendedOutfit?.season}
          </span>
        </div>


        {recommendedOutfit ? (
          <>
            <button
              type="button"
              className="today-look__image-button"
              onClick={() =>
                navigate(
                  `/outfits/${recommendedOutfit.id}`,
                )
              }
              aria-label={`${recommendedOutfit.name} 상세 보기`}
            >
              <OutfitVisual
                outfit={recommendedOutfit}
              />
            </button>


            <div className="today-look__info">
              <div className="today-look__title-row">
                <div>
                  <h3>
                    {recommendedOutfit.name}
                  </h3>

                  <p>
                    {recommendedOutfit.occasion}
                    {' · '}
                    {recommendedOutfit.season}
                  </p>
                </div>
              </div>


              <div className="today-look__reason">
                <span>
                  추천 이유
                </span>

                <p>
                  {weather.temperature}°의 오늘 날씨에 맞춰
                  가볍고 편하게 입기 좋은 코디를 골랐어요.
                </p>
              </div>
            </div>


            <button
              type="button"
              className="today-look__primary-action"
              onClick={handleWearToday}
            >
              오늘 입기
            </button>


            <button
              type="button"
              className="today-look__secondary-action"
              onClick={showAnotherOutfit}
            >
              <span>
                다른 코디 추천받기
              </span>

              <span aria-hidden="true">
                →
              </span>
            </button>
          </>
        ) : (
          <div className="today-look__empty-state">
            <p>
              아직 추천할 수 있는 코디가 없어요.
            </p>

            <button
              type="button"
              onClick={() => navigate('/outfits/new')}
            >
              첫 코디 만들기
            </button>
          </div>
        )}
      </section>


      {/* Recently Added */}
      <section
        className="today-recent"
        aria-labelledby="recent-clothes-title"
      >
        <div className="today-section-heading">
          <div>
            <span className="today-section-heading__eyebrow">
              WARDROBE
            </span>

            <h2 id="recent-clothes-title">
              최근 등록한 옷
            </h2>
          </div>

          <button
            type="button"
            className="today-section-heading__link"
            onClick={() => navigate('/closet')}
          >
            전체보기
          </button>
        </div>


        <div className="today-recent__list">
          {recentClothes.map((item) => (
            <button
              key={item.id}
              type="button"
              className="today-recent__item"
              onClick={() =>
                navigate(`/clothes/${item.id}`)
              }
            >
              <div className="today-recent__image">
                <img
                  src={item.image}
                  alt={item.name}
                />
              </div>

              <strong>
                {item.name}
              </strong>

              <span>
                {item.color}
              </span>
            </button>
          ))}
        </div>
      </section>
    </div>
  )
}

export default TodayPage