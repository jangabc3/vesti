import { useEffect, useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import { histories } from '@/mocks/history'
import { outfits } from '@/mocks/outfits'
import './HistoryPage.css'

const weekdays = ['일', '월', '화', '수', '목', '금', '토']

const toDateKey = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const formatShortDate = (dateString) =>
  new Intl.DateTimeFormat('ko-KR', {
    month: 'long',
    day: 'numeric',
  }).format(new Date(`${dateString}T00:00:00`))

const getMostFrequent = (items) => {
  if (items.length === 0) return null

  const counts = items.reduce((result, item) => {
    result.set(item, (result.get(item) ?? 0) + 1)
    return result
  }, new Map())

  return [...counts.entries()].sort((a, b) => b[1] - a[1])[0][0]
}

function HistoryPreview({ outfit }) {
  const previewClothes = outfit
    ? outfit.clothesIds
        .map((id) => clothes.find((item) => item.id === id))
        .filter(Boolean)
        .slice(0, 4)
    : []

  if (previewClothes.length === 0) {
    return (
      <div className="history-card__preview history-card__preview--empty">
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
      </div>
    )
  }

  return (
    <div
      className={`history-card__preview history-card__preview--${previewClothes.length}`}
    >
      {previewClothes.map((item) => (
        <img key={item.id} src={item.image} alt="" />
      ))}
    </div>
  )
}

function HistoryPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const today = new Date()
  const [currentMonth, setCurrentMonth] = useState(
    new Date(today.getFullYear(), today.getMonth(), 1),
  )
  const [selectedDate, setSelectedDate] = useState(toDateKey(today))
  const [notification, setNotification] = useState(
    location.state?.message ?? '',
  )

  useEffect(() => {
    if (!notification) return undefined

    const timer = window.setTimeout(() => setNotification(''), 2000)
    return () => window.clearTimeout(timer)
  }, [notification])

  const year = currentMonth.getFullYear()
  const month = currentMonth.getMonth()
  const monthKey = `${year}-${String(month + 1).padStart(2, '0')}`
  const calendarStart = new Date(year, month, 1 - new Date(year, month, 1).getDay())
  const calendarDates = Array.from({ length: 42 }, (_, index) => {
    const date = new Date(
      calendarStart.getFullYear(),
      calendarStart.getMonth(),
      calendarStart.getDate() + index,
    )
    const key = toDateKey(date)

    return {
      date,
      key,
      isCurrentMonth: date.getMonth() === month,
      recordCount: histories.filter((history) => history.date === key).length,
    }
  })

  const selectedHistories = histories.filter(
    (history) => history.date === selectedDate,
  )
  const monthHistories = histories.filter((history) =>
    history.date.startsWith(monthKey),
  )
  const mostWornOutfitId = getMostFrequent(
    monthHistories.map((history) => history.outfitId),
  )
  const mostWornOutfit = outfits.find(
    (outfit) => outfit.id === mostWornOutfitId,
  )
  const mostCommonOccasion = getMostFrequent(
    monthHistories
      .map((history) =>
        outfits.find((outfit) => outfit.id === history.outfitId),
      )
      .filter(Boolean)
      .map((outfit) => outfit.occasion),
  )
  const uniqueOutfitCount = new Set(
    monthHistories.map((history) => history.outfitId),
  ).size
  const recentHistories = [...histories]
    .sort(
      (a, b) =>
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime(),
    )
    .slice(0, 5)

  const moveMonth = (offset) => {
    const nextMonth = new Date(year, month + offset, 1)
    setCurrentMonth(nextMonth)
    setSelectedDate(toDateKey(nextMonth))
  }

  const selectCalendarDate = (calendarDate) => {
    setSelectedDate(calendarDate.key)

    if (!calendarDate.isCurrentMonth) {
      setCurrentMonth(
        new Date(
          calendarDate.date.getFullYear(),
          calendarDate.date.getMonth(),
          1,
        ),
      )
    }
  }

  return (
    <div className="history-page">
      {notification && (
        <div className="history-page__notification" role="status">
          {notification}
        </div>
      )}

      <header className="history-page__header">
        <div>
          <h1>기록</h1>
          <p>입었던 코디를 날짜별로 확인해보세요.</p>
        </div>
        <button type="button" onClick={() => navigate('/history/new')}>
          기록 추가
        </button>
      </header>

      {histories.length === 0 ? (
        <div className="history-page__empty history-page__empty--all">
          <h2>아직 착용 기록이 없습니다</h2>
          <p>오늘 입은 코디를 기록해보세요.</p>
          <button type="button" onClick={() => navigate('/history/new')}>
            첫 기록 추가하기
          </button>
        </div>
      ) : (
        <>
          <section className="history-calendar" aria-label="착용 기록 달력">
            <div className="history-calendar__navigation">
              <button
                type="button"
                onClick={() => moveMonth(-1)}
                aria-label="이전 달"
              >
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.8"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  aria-hidden="true"
                >
                  <path d="m15 18-6-6 6-6" />
                </svg>
              </button>
              <h2>{year}년 {month + 1}월</h2>
              <button
                type="button"
                onClick={() => moveMonth(1)}
                aria-label="다음 달"
              >
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
            </div>
            <div className="history-calendar__weekdays">
              {weekdays.map((weekday) => (
                <span key={weekday}>{weekday}</span>
              ))}
            </div>
            <div className="history-calendar__grid">
              {calendarDates.map((calendarDate) => {
                const isToday = calendarDate.key === toDateKey(today)
                const isSelected = calendarDate.key === selectedDate

                return (
                  <button
                    key={calendarDate.key}
                    type="button"
                    className={`history-calendar__day${calendarDate.isCurrentMonth ? '' : ' history-calendar__day--outside'}${isToday ? ' history-calendar__day--today' : ''}${isSelected ? ' history-calendar__day--selected' : ''}`}
                    onClick={() => selectCalendarDate(calendarDate)}
                    aria-pressed={isSelected}
                    aria-label={`${calendarDate.date.getMonth() + 1}월 ${calendarDate.date.getDate()}일${calendarDate.recordCount ? `, 기록 ${calendarDate.recordCount}개` : ''}`}
                  >
                    <span>{calendarDate.date.getDate()}</span>
                    {calendarDate.recordCount > 0 && (
                      <small>{calendarDate.recordCount}</small>
                    )}
                  </button>
                )
              })}
            </div>
          </section>

          <section className="history-page__section">
            <h2>{formatShortDate(selectedDate)}의 기록</h2>
            {selectedHistories.length > 0 ? (
              <div className="history-page__records">
                {selectedHistories.map((history) => {
                  const outfit = outfits.find(
                    (item) => item.id === history.outfitId,
                  )

                  return (
                    <article
                      key={history.id}
                      className="history-card"
                      role="link"
                      tabIndex={0}
                      onClick={() => navigate(`/outfits/${history.outfitId}`)}
                      onKeyDown={(event) => {
                        if (event.key === 'Enter') {
                          navigate(`/outfits/${history.outfitId}`)
                        }
                      }}
                    >
                      <HistoryPreview outfit={outfit} />
                      <div className="history-card__content">
                        <h3>{outfit?.name ?? '삭제된 코디'}</h3>
                        <p>{outfit ? `${outfit.occasion} · ${outfit.season}` : '코디 정보 없음'}</p>
                        <div className="history-card__weather">
                          <span>{history.weather.temperature}°</span>
                          <span>{history.weather.condition}</span>
                          <time dateTime={history.date}>{formatShortDate(history.date)}</time>
                        </div>
                        <p className="history-card__memo">
                          {history.memo || '작성된 메모가 없습니다.'}
                        </p>
                      </div>
                    </article>
                  )
                })}
              </div>
            ) : (
              <p className="history-page__empty-day">
                이날의 착용 기록이 없습니다.
              </p>
            )}
          </section>

          <section className="history-page__section">
            <h2>{month + 1}월 통계</h2>
            <div className="history-stats">
              <div>
                <span>이번 달 착용</span>
                <strong>{monthHistories.length}회</strong>
              </div>
              <div>
                <span>가장 많이 입은 코디</span>
                <strong>{mostWornOutfit?.name ?? '기록 없음'}</strong>
              </div>
              <div>
                <span>가장 많이 선택한 상황</span>
                <strong>{mostCommonOccasion ?? '기록 없음'}</strong>
              </div>
              <div>
                <span>서로 다른 코디</span>
                <strong>{uniqueOutfitCount}개</strong>
              </div>
            </div>
          </section>

          <section className="history-page__section">
            <h2>최근 착용 기록</h2>
            <div className="history-recent">
              {recentHistories.map((history) => {
                const outfit = outfits.find(
                  (item) => item.id === history.outfitId,
                )

                return (
                  <button
                    key={history.id}
                    type="button"
                    onClick={() => navigate(`/outfits/${history.outfitId}`)}
                  >
                    <time dateTime={history.date}>
                      {formatShortDate(history.date)}
                    </time>
                    <span>
                      <strong>{outfit?.name ?? '삭제된 코디'}</strong>
                      <small>{outfit ? `${outfit.occasion} · ${outfit.season}` : '코디 정보 없음'}</small>
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
                )
              })}
            </div>
          </section>
        </>
      )}

      <button
        type="button"
        className="history-page__fab"
        onClick={() => navigate('/history/new')}
        aria-label="착용 기록 추가"
      >
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <path d="M12 5v14M5 12h14" />
        </svg>
      </button>
    </div>
  )
}

export default HistoryPage
