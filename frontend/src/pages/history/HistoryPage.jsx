import {
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'

import './HistoryPage.css'


const DAY_IN_MS =
  24 * 60 * 60 * 1000


function PlusIcon() {
  return (
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
  )
}


function ChevronLeftIcon() {
  return (
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
  )
}


function ChevronRightIcon() {
  return (
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
  )
}


function CalendarIcon() {
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
        x="3.5"
        y="5"
        width="17"
        height="15.5"
        rx="2"
      />

      <path d="M8 3v4M16 3v4M3.5 10h17" />
    </svg>
  )
}


function formatDateKey(date) {
  const year = date.getFullYear()

  const month = String(
    date.getMonth() + 1,
  ).padStart(2, '0')

  const day = String(
    date.getDate(),
  ).padStart(2, '0')

  return `${year}-${month}-${day}`
}


function createMockRecords() {
  if (outfits.length === 0) {
    return []
  }

  const today = new Date()

  const offsets = [
    0,
    2,
    5,
    9,
    14,
    19,
    25,
    33,
  ]

  return offsets.map(
    (offset, index) => {
      const date = new Date(
        today.getTime() -
          offset * DAY_IN_MS,
      )

      const outfit =
        outfits[
          index % outfits.length
        ]

      return {
        id: index + 1,
        date: formatDateKey(date),
        outfitId: outfit.id,
      }
    },
  )
}


function getMonthLabel(date) {
  return new Intl.DateTimeFormat(
    'ko-KR',
    {
      year: 'numeric',
      month: 'long',
    },
  ).format(date)
}


function getDayNumber(dateString) {
  return new Date(
    `${dateString}T00:00:00`,
  ).getDate()
}


function getWeekday(dateString) {
  return new Intl.DateTimeFormat(
    'ko-KR',
    {
      weekday: 'short',
    },
  ).format(
    new Date(
      `${dateString}T00:00:00`,
    ),
  )
}


function isToday(dateString) {
  return (
    dateString ===
    formatDateKey(new Date())
  )
}


function OutfitPreview({
  outfit,
}) {
  const outfitClothes = (
    Array.isArray(outfit?.clothesIds)
      ? outfit.clothesIds
      : []
  )
    .map((clothingId) =>
      clothes.find(
        (item) =>
          String(item.id) ===
          String(clothingId),
      ),
    )
    .filter(Boolean)
    .slice(0, 4)


  if (outfitClothes.length === 0) {
    return (
      <div className="history-record__visual-empty">
        <span>
          이미지 없음
        </span>
      </div>
    )
  }


  return (
    <div
      className={[
        'history-record__visual',
        `history-record__visual--${Math.min(
          outfitClothes.length,
          4,
        )}`,
      ].join(' ')}
    >
      {outfitClothes.map(
        (item) => (
          <div
            key={item.id}
            className="history-record__visual-item"
          >
            <img
              src={item.image}
              alt=""
              loading="lazy"
            />
          </div>
        ),
      )}
    </div>
  )
}


function HistoryPage() {
  const navigate = useNavigate()

  const [selectedMonth, setSelectedMonth] =
    useState(() => {
      const today = new Date()

      return new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      )
    })


  const records = useMemo(
    () => createMockRecords(),
    [],
  )


  const monthRecords =
    useMemo(() => {
      return records
        .filter((record) => {
          const recordDate =
            new Date(
              `${record.date}T00:00:00`,
            )

          return (
            recordDate.getFullYear() ===
              selectedMonth.getFullYear() &&
            recordDate.getMonth() ===
              selectedMonth.getMonth()
          )
        })
        .sort(
          (a, b) =>
            new Date(
              `${b.date}T00:00:00`,
            ) -
            new Date(
              `${a.date}T00:00:00`,
            ),
        )
    }, [
      records,
      selectedMonth,
    ])


  const changeMonth = (
    amount,
  ) => {
    setSelectedMonth(
      (current) =>
        new Date(
          current.getFullYear(),
          current.getMonth() +
            amount,
          1,
        ),
    )
  }


  const goToCurrentMonth = () => {
    const today = new Date()

    setSelectedMonth(
      new Date(
        today.getFullYear(),
        today.getMonth(),
        1,
      ),
    )
  }


  return (
    <div className="history-page">

      {/* Header */}
      <header className="history-header">
        <div>
          <span className="history-header__eyebrow">
            HISTORY
          </span>

          <h1>
            기록
          </h1>

          <p>
            내가 입었던 코디를
            다시 돌아보세요.
          </p>
        </div>

        <button
          type="button"
          className="history-header__add"
          onClick={() =>
            navigate('/history/new')
          }
          aria-label="착용 기록 추가"
        >
          <PlusIcon />
        </button>
      </header>


      {/* Month */}
      <section className="history-month">
        <button
          type="button"
          className="history-month__arrow"
          onClick={() =>
            changeMonth(-1)
          }
          aria-label="이전 달"
        >
          <ChevronLeftIcon />
        </button>

        <button
          type="button"
          className="history-month__current"
          onClick={
            goToCurrentMonth
          }
        >
          <CalendarIcon />

          <span>
            {getMonthLabel(
              selectedMonth,
            )}
          </span>
        </button>

        <button
          type="button"
          className="history-month__arrow"
          onClick={() =>
            changeMonth(1)
          }
          aria-label="다음 달"
        >
          <ChevronRightIcon />
        </button>
      </section>


      {/* Summary */}
      <section className="history-summary">
        <div>
          <strong>
            {monthRecords.length}
          </strong>

          <span>
            번
          </span>
        </div>

        <p>
          이번 달에 기록한
          착용 코디
        </p>
      </section>


      {/* Records */}
      <section
        className="history-records"
        aria-labelledby="history-record-title"
      >
        <div className="history-section-heading">
          <div>
            <span className="history-section-heading__eyebrow">
              WEARING DIARY
            </span>

            <h2 id="history-record-title">
              착용 기록
            </h2>
          </div>

          <span className="history-section-heading__count">
            {monthRecords.length}
          </span>
        </div>


        {monthRecords.length > 0 ? (
          <div className="history-record-list">
            {monthRecords.map(
              (record) => {
                const outfit =
                  outfits.find(
                    (item) =>
                      String(item.id) ===
                      String(
                        record.outfitId,
                      ),
                  )

                if (!outfit) {
                  return null
                }


                return (
                  <article
                    key={record.id}
                    className="history-record"
                  >
                    {/* Date */}
                    <div className="history-record__date">
                      <strong>
                        {getDayNumber(
                          record.date,
                        )}
                      </strong>

                      <span>
                        {getWeekday(
                          record.date,
                        )}
                      </span>

                      {isToday(
                        record.date,
                      ) && (
                        <em>
                          TODAY
                        </em>
                      )}
                    </div>


                    {/* Outfit */}
                    <button
                      type="button"
                      className="history-record__content"
                      onClick={() =>
                        navigate(
                          `/outfits/${outfit.id}`,
                        )
                      }
                    >
                      <div className="history-record__image">
                        <OutfitPreview
                          outfit={
                            outfit
                          }
                        />
                      </div>

                      <div className="history-record__info">
                        <span className="history-record__label">
                          {
                            isToday(
                              record.date,
                            )
                              ? '오늘 입은 코디'
                              : '입었던 코디'
                          }
                        </span>

                        <h3>
                          {outfit.name}
                        </h3>

                        <p>
                          {[
                            outfit.occasion,
                            outfit.season,
                          ]
                            .filter(
                              Boolean,
                            )
                            .join(
                              ' · ',
                            )}
                        </p>

                        <span className="history-record__detail-link">
                          코디 보기
                          <span
                            aria-hidden="true"
                          >
                            →
                          </span>
                        </span>
                      </div>
                    </button>
                  </article>
                )
              },
            )}
          </div>
        ) : (
          <div className="history-empty">
            <div className="history-empty__icon">
              <CalendarIcon />
            </div>

            <h2>
              아직 착용 기록이 없어요.
            </h2>

            <p>
              이 달에 입었던 코디를
              기록해보세요.
            </p>

            <button
              type="button"
              onClick={() =>
                navigate(
                  '/history/new',
                )
              }
            >
              첫 기록 남기기
            </button>
          </div>
        )}
      </section>
    </div>
  )
}


export default HistoryPage