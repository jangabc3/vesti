import {
  useMemo,
  useState,
} from 'react'

import {
  useNavigate,
} from 'react-router-dom'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'

import './AiPage.css'


const quickPrompts = [
  '출근',
  '데이트',
  '여행',
  '학교',
  '운동',
]


const quickMessages = {
  출근:
    '내일 출근할 때 깔끔하면서 편하게 입고 싶어.',

  데이트:
    '저녁 데이트가 있는데 너무 꾸민 느낌은 싫어.',

  여행:
    '많이 걸어도 편한 여행 코디를 추천해줘.',

  학교:
    '학교 갈 때 자연스럽고 센스 있게 입고 싶어.',

  운동:
    '운동 전후로 입기 좋은 편한 코디를 추천해줘.',
}


function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.8c.6 3.5 2.7 5.6 6.2 6.2-3.5.6-5.6 2.7-6.2 6.2-.6-3.5-2.7-5.6-6.2-6.2 3.5-.6 5.6-2.7 6.2-6.2Z" />

      <path d="M18.5 15c.25 1.5 1.2 2.45 2.7 2.7-1.5.25-2.45 1.2-2.7 2.7-.25-1.5-1.2-2.45-2.7-2.7 1.5-.25 2.45-1.2 2.7-2.7Z" />
    </svg>
  )
}


function CameraIcon() {
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
      <path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4v-10Z" />

      <circle
        cx="12"
        cy="13.5"
        r="3.2"
      />
    </svg>
  )
}


function ArrowUpIcon() {
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
      <path d="m7 11 5-5 5 5" />
      <path d="M12 6v12" />
    </svg>
  )
}


function BookmarkIcon() {
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
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5Z" />
    </svg>
  )
}


function getOutfitClothes(
  outfit,
) {
  if (
    !Array.isArray(
      outfit?.clothesIds,
    )
  ) {
    return []
  }


  return outfit.clothesIds
    .map(
      (clothingId) =>
        clothes.find(
          (item) =>
            String(
              item.id,
            ) ===
            String(
              clothingId,
            ),
        ),
    )
    .filter(Boolean)
    .slice(0, 4)
}


function AiPage() {
  const navigate =
    useNavigate()


  const [
    message,
    setMessage,
  ] =
    useState('')


  const [
    submittedMessage,
    setSubmittedMessage,
  ] =
    useState(
      '금요일 저녁 성수동 팝업 코디 추천해줘.',
    )


  const [
    savedLookIds,
    setSavedLookIds,
  ] =
    useState(
      new Set(),
    )


  const recommendedLooks =
    useMemo(
      () =>
        outfits
          .slice(0, 3)
          .map(
            (
              outfit,
              index,
            ) => ({
              ...outfit,

              lookNumber:
                String(
                  index + 1,
                ).padStart(
                  2,
                  '0',
                ),

              items:
                getOutfitClothes(
                  outfit,
                ),
            }),
          ),
      [],
    )


  const handleQuickPrompt = (
    prompt,
  ) => {
    setSubmittedMessage(
      quickMessages[
        prompt
      ],
    )
  }


  const handleSubmit = (
    event,
  ) => {
    event.preventDefault()

    const trimmed =
      message.trim()

    if (!trimmed) {
      return
    }

    setSubmittedMessage(
      trimmed,
    )

    setMessage('')
  }


  const toggleSaved = (
    id,
  ) => {
    setSavedLookIds(
      (current) => {
        const next =
          new Set(current)

        if (next.has(id)) {
          next.delete(id)
        } else {
          next.add(id)
        }

        return next
      },
    )
  }


  return (
    <div className="ai-page">

      {/* Header */}
      <header className="ai-header">
        <div>
          <span>
            VESTI AI
          </span>

          <h1>
            AI 스타일리스트
          </h1>

          <p>
            내 옷장을 이해하는
            스타일 어시스턴트.
          </p>
        </div>

        <div className="ai-header__symbol">
          <SparkleIcon />
        </div>
      </header>


      {/* Quick Context */}
      <section className="ai-context">
        <span>
          WHAT ARE YOU
          DRESSING FOR?
        </span>

        <div className="ai-context__chips">
          {quickPrompts.map(
            (prompt) => (
              <button
                key={
                  prompt
                }
                type="button"
                onClick={() =>
                  handleQuickPrompt(
                    prompt,
                  )
                }
              >
                {prompt}
              </button>
            ),
          )}
        </div>
      </section>


      {/* Conversation */}
      <section className="ai-conversation">
        <div className="ai-conversation__user">
          <span>
            YOU
          </span>

          <p>
            {
              submittedMessage
            }
          </p>
        </div>


        <div className="ai-conversation__response">
          <div className="ai-conversation__assistant">
            <div>
              <SparkleIcon />
            </div>

            <span>
              VESTI
            </span>
          </div>


          <h2>
            가볍게 힘을 준
            스타일이 잘 어울려요.
          </h2>

          <p>
            지금 옷장에 있는
            아이템을 기준으로
            활용하기 쉬운 조합을
            골라봤어요.
          </p>
        </div>
      </section>


      {/* Look Results */}
      <section className="ai-results">
        <div className="ai-results__heading">
          <div>
            <span>
              PERSONAL EDIT
            </span>

            <h2>
              추천 스타일
            </h2>
          </div>

          <span>
            {
              recommendedLooks.length
            }
            LOOKS
          </span>
        </div>


        {recommendedLooks.length >
        0 ? (
          <div className="ai-look-list">
            {recommendedLooks.map(
              (look) => (
                <article
                  key={
                    look.id
                  }
                  className="ai-look"
                >
                  <div className="ai-look__top">
                    <span>
                      LOOK{' '}
                      {
                        look.lookNumber
                      }
                    </span>

                    <span>
                      YOUR
                      WARDROBE
                    </span>
                  </div>


                  <div
                    className={[
                      'ai-look__visual',
                      `ai-look__visual--${Math.min(
                        look.items
                          .length ||
                          1,
                        4,
                      )}`,
                    ].join(
                      ' ',
                    )}
                  >
                    {look.items
                      .length >
                    0 ? (
                      look.items.map(
                        (
                          item,
                        ) => (
                          <div
                            key={
                              item.id
                            }
                          >
                            {item.image ? (
                              <img
                                src={
                                  item.image
                                }
                                alt={
                                  item.name
                                }
                              />
                            ) : (
                              <span>
                                {
                                  item.name
                                }
                              </span>
                            )}
                          </div>
                        ),
                      )
                    ) : (
                      <div className="ai-look__visual-empty">
                        LOOK
                      </div>
                    )}
                  </div>


                  <div className="ai-look__content">
                    <h3>
                      {
                        look.name
                      }
                    </h3>

                    <p>
                      {[
                        look.occasion,
                        look.season,
                      ]
                        .filter(
                          Boolean,
                        )
                        .join(
                          ' · ',
                        ) ||
                        '내 옷장 기반 추천'}
                    </p>


                    <div className="ai-look__actions">
                      <button
                        type="button"
                        className={
                          savedLookIds.has(
                            look.id,
                          )
                            ? 'ai-look__save ai-look__save--active'
                            : 'ai-look__save'
                        }
                        onClick={() =>
                          toggleSaved(
                            look.id,
                          )
                        }
                      >
                        <BookmarkIcon />

                        <span>
                          {
                            savedLookIds.has(
                              look.id,
                            )
                              ? '저장됨'
                              : '저장'
                          }
                        </span>
                      </button>


                      <button
                        type="button"
                        className="ai-look__match"
                        onClick={() =>
                          navigate(
                            '/closet',
                          )
                        }
                      >
                        내 옷으로
                        보기
                      </button>
                    </div>
                  </div>
                </article>
              ),
            )}
          </div>
        ) : (
          <div className="ai-results__empty">
            옷장에 코디를
            먼저 만들어보세요.
          </div>
        )}
      </section>


      {/* Composer */}
      <form
        className="ai-composer"
        onSubmit={
          handleSubmit
        }
      >
        <button
          type="button"
          className="ai-composer__camera"
          aria-label="사진 첨부"
        >
          <CameraIcon />
        </button>

        <input
          type="text"
          value={
            message
          }
          onChange={(
            event,
          ) =>
            setMessage(
              event.target.value,
            )
          }
          placeholder="무엇을 입을지 물어보세요."
        />

        <button
          type="submit"
          className="ai-composer__send"
          disabled={
            !message.trim()
          }
          aria-label="전송"
        >
          <ArrowUpIcon />
        </button>
      </form>
    </div>
  )
}


export default AiPage