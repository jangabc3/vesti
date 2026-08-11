import {
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'

import './HistoryCreatePage.css'


function BackIcon() {
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


function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 7" />
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


function getDateValue(
  offset = 0,
) {
  const date = new Date()

  date.setDate(
    date.getDate() + offset,
  )

  const year =
    date.getFullYear()

  const month =
    String(
      date.getMonth() + 1,
    ).padStart(2, '0')

  const day =
    String(
      date.getDate(),
    ).padStart(2, '0')

  return `${year}-${month}-${day}`
}


function getReadableDate(
  dateValue,
) {
  if (!dateValue) {
    return ''
  }

  return new Intl.DateTimeFormat(
    'ko-KR',
    {
      month: 'long',
      day: 'numeric',
      weekday: 'long',
    },
  ).format(
    new Date(
      `${dateValue}T00:00:00`,
    ),
  )
}


function OutfitPreview({
  outfit,
}) {
  const outfitClothes =
    (
      Array.isArray(
        outfit.clothesIds,
      )
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


  if (
    outfitClothes.length === 0
  ) {
    return (
      <div className="history-create-outfit__empty-image">
        이미지 없음
      </div>
    )
  }


  return (
    <div
      className={[
        'history-create-outfit__visual',
        `history-create-outfit__visual--${Math.min(
          outfitClothes.length,
          4,
        )}`,
      ].join(' ')}
    >
      {outfitClothes.map(
        (item) => (
          <div
            key={item.id}
            className="history-create-outfit__visual-item"
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


function HistoryCreatePage() {
  const navigate = useNavigate()

  const today =
    useMemo(
      () => getDateValue(),
      [],
    )

  const yesterday =
    useMemo(
      () => getDateValue(-1),
      [],
    )


  const [
    wearingDate,
    setWearingDate,
  ] = useState(today)

  const [
    selectedOutfitId,
    setSelectedOutfitId,
  ] = useState(null)


  const selectedOutfit =
    outfits.find(
      (outfit) =>
        String(outfit.id) ===
        String(selectedOutfitId),
    )


  const isFormValid =
    Boolean(wearingDate) &&
    Boolean(selectedOutfitId)


  const handleSubmit = (
    event,
  ) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    /*
      현재는 Mock / UI 단계.

      실제 API 연동 단계에서는
      CoordinationRecord 생성 API에

      - 선택한 Coordination ID
      - 착용 날짜

      를 전달하면 된다.

      성공 후에는:
      navigate('/history')
    */

    console.log({
      date: wearingDate,
      outfitId:
        selectedOutfitId,
    })

    navigate(
      '/history',
      {
        state: {
          message:
            '착용 기록이 추가되었습니다.',
        },
      },
    )
  }


  return (
    <div className="history-create-page">

      {/* Header */}
      <header className="history-create-header">
        <button
          type="button"
          className="history-create-header__back"
          onClick={() =>
            navigate(-1)
          }
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>
          착용 기록
        </h1>

        <button
          type="submit"
          form="history-create-form"
          className="history-create-header__complete"
          disabled={
            !isFormValid
          }
        >
          완료
        </button>
      </header>


      <form
        id="history-create-form"
        className="history-create-form"
        onSubmit={
          handleSubmit
        }
      >

        {/* Intro */}
        <section className="history-create-intro">
          <span>
            WEARING DIARY
          </span>

          <h2>
            오늘 무엇을
            입었나요?
          </h2>

          <p>
            입었던 코디를 기록하면
            내 옷장을 더 잘 활용할 수
            있어요.
          </p>
        </section>


        {/* Date */}
        <section className="history-create-section">
          <div className="history-create-section__heading">
            <span>
              착용 날짜
              <em>*</em>
            </span>

            <span className="history-create-section__value">
              {getReadableDate(
                wearingDate,
              )}
            </span>
          </div>


          <div className="history-create-date-quick">
            <button
              type="button"
              className={[
                'history-create-date-quick__item',
                wearingDate ===
                today
                  ? 'history-create-date-quick__item--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() =>
                setWearingDate(
                  today,
                )
              }
            >
              오늘
            </button>

            <button
              type="button"
              className={[
                'history-create-date-quick__item',
                wearingDate ===
                yesterday
                  ? 'history-create-date-quick__item--active'
                  : '',
              ]
                .filter(Boolean)
                .join(' ')}
              onClick={() =>
                setWearingDate(
                  yesterday,
                )
              }
            >
              어제
            </button>
          </div>


          <label className="history-create-date-picker">
            <div>
              <CalendarIcon />

              <span>
                다른 날짜 선택
              </span>
            </div>

            <input
              type="date"
              value={
                wearingDate
              }
              max={today}
              onChange={(
                event,
              ) =>
                setWearingDate(
                  event.target
                    .value,
                )
              }
              aria-label="착용 날짜"
            />
          </label>
        </section>


        {/* Outfit */}
        <section className="history-create-outfits">
          <div className="history-create-outfits__heading">
            <div>
              <span className="history-create-outfits__eyebrow">
                OUTFITS
              </span>

              <h2>
                입은 코디
                <em>*</em>
              </h2>
            </div>

            <span>
              {outfits.length}개
            </span>
          </div>


          {outfits.length > 0 ? (
            <div className="history-create-outfit-grid">
              {outfits.map(
                (outfit) => {
                  const selected =
                    String(
                      selectedOutfitId,
                    ) ===
                    String(
                      outfit.id,
                    )


                  return (
                    <button
                      key={
                        outfit.id
                      }
                      type="button"
                      className={[
                        'history-create-outfit',
                        selected
                          ? 'history-create-outfit--selected'
                          : '',
                      ]
                        .filter(
                          Boolean,
                        )
                        .join(' ')}
                      onClick={() =>
                        setSelectedOutfitId(
                          outfit.id,
                        )
                      }
                      aria-pressed={
                        selected
                      }
                    >
                      <div className="history-create-outfit__image">
                        <OutfitPreview
                          outfit={
                            outfit
                          }
                        />

                        <span className="history-create-outfit__check">
                          {selected && (
                            <CheckIcon />
                          )}
                        </span>
                      </div>


                      <div className="history-create-outfit__info">
                        <strong>
                          {
                            outfit.name
                          }
                        </strong>

                        <span>
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
                        </span>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          ) : (
            <div className="history-create-empty">
              <h3>
                저장된 코디가 없어요.
              </h3>

              <p>
                먼저 코디를 만든 후
                착용 기록을 남겨보세요.
              </p>

              <button
                type="button"
                onClick={() =>
                  navigate(
                    '/outfits/new',
                  )
                }
              >
                코디 만들기
              </button>
            </div>
          )}
        </section>


        {/* Selected */}
        {selectedOutfit && (
          <section className="history-create-selected">
            <span>
              선택한 코디
            </span>

            <strong>
              {
                selectedOutfit.name
              }
            </strong>

            <p>
              {getReadableDate(
                wearingDate,
              )}
              에 입은 코디로
              기록할게요.
            </p>
          </section>
        )}


        {/* Bottom Action */}
        <div className="history-create-action">
          <button
            type="submit"
            className="history-create-action__button"
            disabled={
              !isFormValid
            }
          >
            착용 기록 저장
          </button>
        </div>
      </form>
    </div>
  )
}


export default HistoryCreatePage