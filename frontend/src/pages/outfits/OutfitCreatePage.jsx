import {
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { clothes } from '@/mocks/clothes'

import './OutfitCreatePage.css'


const occasions = [
  '일상',
  '출근',
  '학교',
  '데이트',
  '운동',
  '여행',
]


const seasons = [
  '봄',
  '여름',
  '가을',
  '겨울',
]


const categories = [
  '전체',
  '상의',
  '하의',
  '아우터',
  '신발',
  '가방',
  '액세서리',
]


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


function SearchIcon() {
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
      <circle
        cx="11"
        cy="11"
        r="6.5"
      />

      <path d="m16 16 4 4" />
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


function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  )
}


function OutfitCreatePage() {
  const navigate = useNavigate()

  const [name, setName] =
    useState('')

  const [occasion, setOccasion] =
    useState('')

  const [season, setSeason] =
    useState('')

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('전체')

  const [searchTerm, setSearchTerm] =
    useState('')

  const [
    selectedClothingIds,
    setSelectedClothingIds,
  ] = useState([])


  const filteredClothes =
    useMemo(() => {
      const keyword =
        searchTerm
          .trim()
          .toLowerCase()

      return clothes.filter(
        (item) => {
          const matchesCategory =
            selectedCategory === '전체' ||
            item.category ===
              selectedCategory

          const matchesSearch =
            keyword.length === 0 ||
            item.name
              ?.toLowerCase()
              .includes(keyword) ||
            item.brand
              ?.toLowerCase()
              .includes(keyword) ||
            item.color
              ?.toLowerCase()
              .includes(keyword)

          return (
            matchesCategory &&
            matchesSearch
          )
        },
      )
    }, [
      searchTerm,
      selectedCategory,
    ])


  const selectedClothes =
    selectedClothingIds
      .map((id) =>
        clothes.find(
          (item) =>
            String(item.id) ===
            String(id),
        ),
      )
      .filter(Boolean)


  const isFormValid =
    name.trim().length > 0 &&
    occasion &&
    season &&
    selectedClothingIds.length > 0


  const toggleClothing = (
    clothingId,
  ) => {
    setSelectedClothingIds(
      (currentIds) => {
        const alreadySelected =
          currentIds.some(
            (id) =>
              String(id) ===
              String(clothingId),
          )

        if (alreadySelected) {
          return currentIds.filter(
            (id) =>
              String(id) !==
              String(clothingId),
          )
        }

        return [
          ...currentIds,
          clothingId,
        ]
      },
    )
  }


  const removeSelectedClothing = (
    clothingId,
  ) => {
    setSelectedClothingIds(
      (currentIds) =>
        currentIds.filter(
          (id) =>
            String(id) !==
            String(clothingId),
        ),
    )
  }


  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    /*
      현재는 UI / Mock 단계.

      실제 API 연결 단계에서는 대략:

      1. Coordination 생성
      2. 생성된 coordinationId 획득
      3. selectedClothingIds 각각을
         Coordination에 추가
      4. /outfits/{id}로 이동

      형태로 연결한다.

      occasion / season 필드는
      실제 백엔드 Coordination DTO와
      최종 API 연결 단계에서 다시 맞춘다.
    */

    console.log({
      name: name.trim(),
      occasion,
      season,
      clothesIds:
        selectedClothingIds,
    })
  }


  return (
    <div className="outfit-create-page">
      {/* Header */}
      <header className="outfit-create-header">
        <button
          type="button"
          className="outfit-create-header__back"
          onClick={() =>
            navigate(-1)
          }
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>
          코디 만들기
        </h1>

        <button
          type="submit"
          form="outfit-create-form"
          className="outfit-create-header__complete"
          disabled={!isFormValid}
        >
          완료
        </button>
      </header>


      <form
        id="outfit-create-form"
        className="outfit-create-form"
        onSubmit={handleSubmit}
      >
        {/* Name */}
        <section className="outfit-create-section">
          <div className="outfit-create-section__heading">
            <span>
              코디 이름
              <em>*</em>
            </span>
          </div>

          <label className="outfit-create-name">
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="예: 여름 출근 룩"
              autoComplete="off"
              maxLength={30}
            />

            <span>
              {name.length}/30
            </span>
          </label>
        </section>


        {/* Occasion */}
        <section className="outfit-create-section">
          <div className="outfit-create-section__heading">
            <span>
              상황
              <em>*</em>
            </span>
          </div>

          <div className="outfit-create-options">
            {occasions.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'outfit-create-option',
                    occasion === item
                      ? 'outfit-create-option--active'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() =>
                    setOccasion(item)
                  }
                  aria-pressed={
                    occasion === item
                  }
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </section>


        {/* Season */}
        <section className="outfit-create-section">
          <div className="outfit-create-section__heading">
            <span>
              계절
              <em>*</em>
            </span>
          </div>

          <div className="outfit-create-season">
            {seasons.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'outfit-create-season__item',
                    season === item
                      ? 'outfit-create-season__item--active'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() =>
                    setSeason(item)
                  }
                  aria-pressed={
                    season === item
                  }
                >
                  {item}
                </button>
              ),
            )}
          </div>
        </section>


        {/* Selected Clothes */}
        <section className="outfit-create-selected-section">
          <div className="outfit-create-selected-heading">
            <div>
              <h2>
                선택한 옷
              </h2>

              <span>
                {
                  selectedClothingIds.length
                }개
              </span>
            </div>

            {selectedClothingIds.length >
              0 && (
              <button
                type="button"
                onClick={() =>
                  setSelectedClothingIds(
                    [],
                  )
                }
              >
                전체 해제
              </button>
            )}
          </div>


          {selectedClothes.length > 0 ? (
            <div className="outfit-create-selected-list">
              {selectedClothes.map(
                (item) => (
                  <div
                    key={item.id}
                    className="outfit-create-selected-item"
                  >
                    <div className="outfit-create-selected-item__image">
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
                          이미지 없음
                        </span>
                      )}
                    </div>

                    <button
                      type="button"
                      className="outfit-create-selected-item__remove"
                      onClick={() =>
                        removeSelectedClothing(
                          item.id,
                        )
                      }
                      aria-label={`${item.name} 선택 해제`}
                    >
                      <CloseIcon />
                    </button>
                  </div>
                ),
              )}
            </div>
          ) : (
            <div className="outfit-create-selected-empty">
              <p>
                아래 옷장에서 코디에
                사용할 옷을 선택해주세요.
              </p>
            </div>
          )}
        </section>


        {/* Wardrobe */}
        <section className="outfit-create-wardrobe">
          <div className="outfit-create-wardrobe__heading">
            <div>
              <span className="outfit-create-wardrobe__eyebrow">
                WARDROBE
              </span>

              <h2>
                내 옷장에서 고르기
              </h2>
            </div>

            <span>
              {clothes.length}벌
            </span>
          </div>


          {/* Search */}
          <div className="outfit-create-search">
            <SearchIcon />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) =>
                setSearchTerm(
                  event.target.value,
                )
              }
              placeholder="옷 이름이나 색상 검색"
              aria-label="옷 검색"
            />

            {searchTerm && (
              <button
                type="button"
                className="outfit-create-search__clear"
                onClick={() =>
                  setSearchTerm('')
                }
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
          </div>


          {/* Category */}
          <nav
            className="outfit-create-categories"
            aria-label="옷 카테고리"
          >
            {categories.map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  className={[
                    'outfit-create-category',
                    selectedCategory ===
                    category
                      ? 'outfit-create-category--active'
                      : '',
                  ]
                    .filter(Boolean)
                    .join(' ')}
                  onClick={() =>
                    setSelectedCategory(
                      category,
                    )
                  }
                  aria-pressed={
                    selectedCategory ===
                    category
                  }
                >
                  {category}
                </button>
              ),
            )}
          </nav>


          {/* Clothing Grid */}
          {filteredClothes.length > 0 ? (
            <div className="outfit-create-grid">
              {filteredClothes.map(
                (item) => {
                  const selected =
                    selectedClothingIds.some(
                      (id) =>
                        String(id) ===
                        String(
                          item.id,
                        ),
                    )

                  return (
                    <button
                      key={item.id}
                      type="button"
                      className={[
                        'outfit-create-clothing',
                        selected
                          ? 'outfit-create-clothing--selected'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={() =>
                        toggleClothing(
                          item.id,
                        )
                      }
                      aria-pressed={
                        selected
                      }
                    >
                      <div className="outfit-create-clothing__image">
                        {item.image ? (
                          <img
                            src={
                              item.image
                            }
                            alt={
                              item.name
                            }
                            loading="lazy"
                          />
                        ) : (
                          <div className="outfit-create-clothing__empty">
                            이미지 없음
                          </div>
                        )}

                        <span className="outfit-create-clothing__check">
                          {selected && (
                            <CheckIcon />
                          )}
                        </span>
                      </div>

                      <div className="outfit-create-clothing__info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {[
                            item.brand,
                            item.color,
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
            <div className="outfit-create-empty">
              <p>
                조건에 맞는 옷이
                없어요.
              </p>

              <button
                type="button"
                onClick={() => {
                  setSearchTerm('')
                  setSelectedCategory(
                    '전체',
                  )
                }}
              >
                검색 초기화
              </button>
            </div>
          )}
        </section>


        {/* Bottom Action */}
        <div className="outfit-create-action">
          <div className="outfit-create-action__summary">
            <strong>
              {
                selectedClothingIds.length
              }
            </strong>

            <span>
              개 선택
            </span>
          </div>

          <button
            type="submit"
            className="outfit-create-action__button"
            disabled={!isFormValid}
          >
            코디 저장하기
          </button>
        </div>
      </form>
    </div>
  )
}


export default OutfitCreatePage