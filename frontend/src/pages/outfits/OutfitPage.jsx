import {
  useMemo,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'

import './OutfitPage.css'


const occasions = [
  '전체',
  '일상',
  '출근',
  '학교',
  '데이트',
  '운동',
  '여행',
]


const seasons = [
  '전체',
  '봄',
  '여름',
  '가을',
  '겨울',
]


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


function HeartIcon({
  filled = false,
}) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? 'currentColor' : 'none'}
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8Z" />
    </svg>
  )
}


function OutfitPreview({
  outfit,
}) {
  const outfitClothes = (
    Array.isArray(outfit.clothesIds)
      ? outfit.clothesIds
      : []
  )
    .map((clothingId) =>
      clothes.find(
        (item) =>
          item.id === clothingId,
      ),
    )
    .filter(Boolean)
    .slice(0, 4)


  if (outfitClothes.length === 0) {
    return (
      <div className="outfit-card__empty-image">
        <span>
          코디 이미지
        </span>
      </div>
    )
  }


  return (
    <div
      className={[
        'outfit-card__visual',
        `outfit-card__visual--${Math.min(
          outfitClothes.length,
          4,
        )}`,
      ].join(' ')}
    >
      {outfitClothes.map((item) => (
        <div
          key={item.id}
          className="outfit-card__visual-item"
        >
          <img
            src={item.image}
            alt={item.name}
            loading="lazy"
          />
        </div>
      ))}
    </div>
  )
}


function OutfitPage() {
  const navigate = useNavigate()

  const [searchTerm, setSearchTerm] =
    useState('')

  const [
    selectedOccasion,
    setSelectedOccasion,
  ] = useState('전체')

  const [
    selectedSeason,
    setSelectedSeason,
  ] = useState('전체')

  const [
    showFavoritesOnly,
    setShowFavoritesOnly,
  ] = useState(false)

  const [
    favoriteIds,
    setFavoriteIds,
  ] = useState(
    () =>
      new Set(
        outfits
          .filter(
            (outfit) =>
              outfit.favorite,
          )
          .map(
            (outfit) =>
              outfit.id,
          ),
      ),
  )


  const filteredOutfits =
    useMemo(() => {
      const keyword =
        searchTerm
          .trim()
          .toLowerCase()

      return outfits.filter(
        (outfit) => {
          const matchesSearch =
            keyword.length === 0 ||
            outfit.name
              ?.toLowerCase()
              .includes(keyword) ||
            outfit.occasion
              ?.toLowerCase()
              .includes(keyword) ||
            outfit.season
              ?.toLowerCase()
              .includes(keyword)

          const matchesOccasion =
            selectedOccasion === '전체' ||
            outfit.occasion ===
              selectedOccasion

          const matchesSeason =
            selectedSeason === '전체' ||
            outfit.season ===
              selectedSeason

          const matchesFavorite =
            !showFavoritesOnly ||
            favoriteIds.has(
              outfit.id,
            )

          return (
            matchesSearch &&
            matchesOccasion &&
            matchesSeason &&
            matchesFavorite
          )
        },
      )
    }, [
      searchTerm,
      selectedOccasion,
      selectedSeason,
      showFavoritesOnly,
      favoriteIds,
    ])


  const toggleFavorite = (
    event,
    outfitId,
  ) => {
    event.stopPropagation()

    setFavoriteIds(
      (currentIds) => {
        const nextIds =
          new Set(currentIds)

        if (
          nextIds.has(
            outfitId,
          )
        ) {
          nextIds.delete(
            outfitId,
          )
        } else {
          nextIds.add(
            outfitId,
          )
        }

        return nextIds
      },
    )
  }


  const resetFilters = () => {
    setSearchTerm('')
    setSelectedOccasion('전체')
    setSelectedSeason('전체')
    setShowFavoritesOnly(false)
  }


  return (
    <div className="outfits-page">

      {/* Header */}
      <header className="outfits-header">
        <div className="outfits-header__content">
          <span className="outfits-header__eyebrow">
            OUTFITS
          </span>

          <h1>
            코디
          </h1>

          <p>
            저장한 코디 {outfits.length}개
          </p>
        </div>

        <button
          type="button"
          className="outfits-header__add"
          onClick={() =>
            navigate('/outfits/new')
          }
          aria-label="코디 만들기"
        >
          <PlusIcon />
        </button>
      </header>


      {/* Search */}
      <div className="outfits-search">
        <SearchIcon />

        <input
          type="search"
          value={searchTerm}
          onChange={(event) =>
            setSearchTerm(
              event.target.value,
            )
          }
          placeholder="코디 이름 검색"
          aria-label="코디 검색"
        />

        {searchTerm && (
          <button
            type="button"
            className="outfits-search__clear"
            onClick={() =>
              setSearchTerm('')
            }
            aria-label="검색어 지우기"
          >
            ×
          </button>
        )}
      </div>


      {/* Occasion */}
      <section className="outfits-filter-section">
        <span className="outfits-filter-section__label">
          상황
        </span>

        <div className="outfits-filter-scroll">
          {occasions.map(
            (occasion) => (
              <button
                key={occasion}
                type="button"
                className={[
                  'outfits-filter',
                  selectedOccasion ===
                  occasion
                    ? 'outfits-filter--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  setSelectedOccasion(
                    occasion,
                  )
                }
                aria-pressed={
                  selectedOccasion ===
                  occasion
                }
              >
                {occasion}
              </button>
            ),
          )}
        </div>
      </section>


      {/* Season */}
      <section className="outfits-season-section">
        <div className="outfits-season">
          {seasons.map(
            (season) => (
              <button
                key={season}
                type="button"
                className={[
                  'outfits-season__item',
                  selectedSeason ===
                  season
                    ? 'outfits-season__item--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  setSelectedSeason(
                    season,
                  )
                }
                aria-pressed={
                  selectedSeason ===
                  season
                }
              >
                {season}
              </button>
            ),
          )}
        </div>
      </section>


      {/* Result Header */}
      <div className="outfits-result-header">
        <div className="outfits-result-header__count">
          <strong>
            {showFavoritesOnly
              ? '즐겨찾는 코디'
              : '모든 코디'}
          </strong>

          <span>
            {filteredOutfits.length}
          </span>
        </div>

        <button
          type="button"
          className={[
            'outfits-favorite-filter',
            showFavoritesOnly
              ? 'outfits-favorite-filter--active'
              : '',
          ]
            .filter(Boolean)
            .join(' ')}
          onClick={() =>
            setShowFavoritesOnly(
              (current) =>
                !current,
            )
          }
          aria-pressed={
            showFavoritesOnly
          }
        >
          <HeartIcon
            filled={
              showFavoritesOnly
            }
          />

          <span>
            즐겨찾기
          </span>
        </button>
      </div>


      {/* Outfit Grid */}
      {filteredOutfits.length > 0 ? (
        <div className="outfits-grid">
          {filteredOutfits.map(
            (outfit) => {
              const isFavorite =
                favoriteIds.has(
                  outfit.id,
                )

              const clothesCount =
                Array.isArray(
                  outfit.clothesIds,
                )
                  ? outfit
                      .clothesIds
                      .length
                  : 0

              return (
                <article
                  key={outfit.id}
                  className="outfit-card"
                  onClick={() =>
                    navigate(
                      `/outfits/${outfit.id}`,
                    )
                  }
                >
                  <div className="outfit-card__image">
                    <OutfitPreview
                      outfit={
                        outfit
                      }
                    />

                    <button
                      type="button"
                      className={[
                        'outfit-card__favorite',
                        isFavorite
                          ? 'outfit-card__favorite--active'
                          : '',
                      ]
                        .filter(Boolean)
                        .join(' ')}
                      onClick={(
                        event,
                      ) =>
                        toggleFavorite(
                          event,
                          outfit.id,
                        )
                      }
                      aria-label={
                        isFavorite
                          ? '즐겨찾기 해제'
                          : '즐겨찾기 추가'
                      }
                    >
                      <HeartIcon
                        filled={
                          isFavorite
                        }
                      />
                    </button>
                  </div>


                  <div className="outfit-card__info">
                    <h2>
                      {outfit.name}
                    </h2>

                    <p>
                      {[
                        outfit.occasion,
                        outfit.season,
                      ]
                        .filter(Boolean)
                        .join(' · ')}
                    </p>

                    <span>
                      옷 {clothesCount}개
                    </span>
                  </div>
                </article>
              )
            },
          )}
        </div>
      ) : (
        <div className="outfits-empty">
          <div className="outfits-empty__icon">
            <PlusIcon />
          </div>

          <h2>
            조건에 맞는 코디가 없어요.
          </h2>

          <p>
            다른 조건으로 찾아보거나
            새로운 코디를 만들어보세요.
          </p>

          <button
            type="button"
            onClick={resetFilters}
          >
            필터 초기화
          </button>
        </div>
      )}
    </div>
  )
}


export default OutfitPage