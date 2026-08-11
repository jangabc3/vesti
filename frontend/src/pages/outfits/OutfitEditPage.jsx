import {
  useMemo,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'

import './OutfitEditPage.css'


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


function OutfitEditPage() {
  const navigate = useNavigate()
  const params = useParams()


  const outfitId =
    params.outfitId ??
    params.id ??
    params.coordinationId


  const outfit = outfits.find(
    (item) =>
      String(item.id) ===
      String(outfitId),
  )


  const [name, setName] =
    useState(
      outfit?.name ?? '',
    )

  const [occasion, setOccasion] =
    useState(
      outfit?.occasion ?? '',
    )

  const [season, setSeason] =
    useState(
      outfit?.season ?? '',
    )

  const [
    selectedCategory,
    setSelectedCategory,
  ] = useState('전체')

  const [
    searchTerm,
    setSearchTerm,
  ] = useState('')

  const [
    selectedClothingIds,
    setSelectedClothingIds,
  ] = useState(
    Array.isArray(
      outfit?.clothesIds,
    )
      ? [...outfit.clothesIds]
      : [],
  )


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
      현재는 Mock / UI 단계.

      실제 API 연결 단계에서는:

      1. Coordination 기본 정보 수정
      2. 기존 연결 옷과
         selectedClothingIds 비교
      3. 추가된 옷 → add API
      4. 제거된 옷 → remove API
      5. 완료 후
         /outfits/{id}

      로 이동한다.
    */

    console.log({
      id: outfitId,
      name: name.trim(),
      occasion,
      season,
      clothesIds:
        selectedClothingIds,
    })

    navigate(
      `/outfits/${outfitId}`,
    )
  }


  if (!outfit) {
    return (
      <div className="outfit-edit-page">
        <header className="outfit-edit-header">
          <button
            type="button"
            className="outfit-edit-header__back"
            onClick={() =>
              navigate(-1)
            }
            aria-label="뒤로 가기"
          >
            <BackIcon />
          </button>

          <h1>
            코디 수정
          </h1>

          <span />
        </header>


        <div className="outfit-edit-not-found">
          <h2>
            코디를 찾을 수 없어요.
          </h2>

          <p>
            삭제되었거나 존재하지 않는
            코디예요.
          </p>

          <button
            type="button"
            onClick={() =>
              navigate('/outfits')
            }
          >
            코디 목록으로 돌아가기
          </button>
        </div>
      </div>
    )
  }


  return (
    <div className="outfit-edit-page">

      {/* Header */}
      <header className="outfit-edit-header">
        <button
          type="button"
          className="outfit-edit-header__back"
          onClick={() =>
            navigate(-1)
          }
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>
          코디 수정
        </h1>

        <button
          type="submit"
          form="outfit-edit-form"
          className="outfit-edit-header__complete"
          disabled={!isFormValid}
        >
          저장
        </button>
      </header>


      <form
        id="outfit-edit-form"
        className="outfit-edit-form"
        onSubmit={handleSubmit}
      >

        {/* Name */}
        <section className="outfit-edit-section">
          <div className="outfit-edit-section__heading">
            <span>
              코디 이름
              <em>*</em>
            </span>
          </div>

          <label className="outfit-edit-name">
            <input
              type="text"
              value={name}
              onChange={(event) =>
                setName(
                  event.target.value,
                )
              }
              placeholder="예: 여름 출근 룩"
              maxLength={30}
              autoComplete="off"
            />

            <span>
              {name.length}/30
            </span>
          </label>
        </section>


        {/* Occasion */}
        <section className="outfit-edit-section">
          <div className="outfit-edit-section__heading">
            <span>
              상황
              <em>*</em>
            </span>
          </div>

          <div className="outfit-edit-options">
            {occasions.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'outfit-edit-option',
                    occasion === item
                      ? 'outfit-edit-option--active'
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
        <section className="outfit-edit-section">
          <div className="outfit-edit-section__heading">
            <span>
              계절
              <em>*</em>
            </span>
          </div>

          <div className="outfit-edit-season">
            {seasons.map(
              (item) => (
                <button
                  key={item}
                  type="button"
                  className={[
                    'outfit-edit-season__item',
                    season === item
                      ? 'outfit-edit-season__item--active'
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
        <section className="outfit-edit-selected-section">
          <div className="outfit-edit-selected-heading">
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
            <div className="outfit-edit-selected-list">
              {selectedClothes.map(
                (item) => (
                  <div
                    key={item.id}
                    className="outfit-edit-selected-item"
                  >
                    <div className="outfit-edit-selected-item__image">
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
                      className="outfit-edit-selected-item__remove"
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
            <div className="outfit-edit-selected-empty">
              <p>
                코디에 사용할 옷을
                선택해주세요.
              </p>
            </div>
          )}
        </section>


        {/* Wardrobe */}
        <section className="outfit-edit-wardrobe">
          <div className="outfit-edit-wardrobe__heading">
            <div>
              <span className="outfit-edit-wardrobe__eyebrow">
                WARDROBE
              </span>

              <h2>
                구성한 옷 변경하기
              </h2>
            </div>

            <span>
              {clothes.length}벌
            </span>
          </div>


          {/* Search */}
          <div className="outfit-edit-search">
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
                className="outfit-edit-search__clear"
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
            className="outfit-edit-categories"
            aria-label="옷 카테고리"
          >
            {categories.map(
              (category) => (
                <button
                  key={category}
                  type="button"
                  className={[
                    'outfit-edit-category',
                    selectedCategory ===
                    category
                      ? 'outfit-edit-category--active'
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


          {/* Grid */}
          {filteredClothes.length > 0 ? (
            <div className="outfit-edit-grid">
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
                        'outfit-edit-clothing',
                        selected
                          ? 'outfit-edit-clothing--selected'
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
                      <div className="outfit-edit-clothing__image">
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
                          <div className="outfit-edit-clothing__empty">
                            이미지 없음
                          </div>
                        )}

                        <span className="outfit-edit-clothing__check">
                          {selected && (
                            <CheckIcon />
                          )}
                        </span>
                      </div>

                      <div className="outfit-edit-clothing__info">
                        <strong>
                          {item.name}
                        </strong>

                        <span>
                          {[
                            item.brand,
                            item.color,
                          ]
                            .filter(Boolean)
                            .join(' · ')}
                        </span>
                      </div>
                    </button>
                  )
                },
              )}
            </div>
          ) : (
            <div className="outfit-edit-empty">
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
        <div className="outfit-edit-action">
          <div className="outfit-edit-action__summary">
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
            className="outfit-edit-action__button"
            disabled={!isFormValid}
          >
            변경사항 저장
          </button>
        </div>
      </form>
    </div>
  )
}


export default OutfitEditPage