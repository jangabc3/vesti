import { useState } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import EmptyState from '@/components/common/EmptyState'
import FavoriteButton from '@/components/common/FavoriteButton'
import FilterChip from '@/components/common/FilterChip'
import SearchBar from '@/components/common/SearchBar'
import ToastMessage from '@/components/common/ToastMessage'
import {
  OUTFIT_OCCASIONS,
  OUTFIT_SEASONS,
  OUTFIT_SORT_OPTIONS,
} from '@/constants/outfitOptions'
import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'
import './OutfitPage.css'

const occasions = ['전체', ...OUTFIT_OCCASIONS]
const seasons = ['전체', ...OUTFIT_SEASONS]

const getTime = (date) => (date ? new Date(date).getTime() : 0)

function OutfitPreview({ clothesIds, name }) {
  const previewClothes = clothesIds
    .map((id) => clothes.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4)

  if (previewClothes.length === 0) {
    return (
      <div className="outfit-card__preview outfit-card__preview--empty">
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
        <span>이미지 없음</span>
      </div>
    )
  }

  return (
    <div
      className={`outfit-card__preview outfit-card__preview--${previewClothes.length}`}
    >
      {previewClothes.map((item) => (
        <img key={item.id} src={item.image} alt={`${name}에 포함된 ${item.name}`} />
      ))}
    </div>
  )
}

function OutfitPage() {
  const navigate = useNavigate()
  const location = useLocation()
  const [searchTerm, setSearchTerm] = useState('')
  const [occasionFilter, setOccasionFilter] = useState('전체')
  const [seasonFilter, setSeasonFilter] = useState('전체')
  const [favoritesOnly, setFavoritesOnly] = useState(false)
  const [sortBy, setSortBy] = useState('latest')
  const [favoriteIds, setFavoriteIds] = useState(
    outfits.filter((item) => item.favorite).map((item) => item.id),
  )
  const [notification, setNotification] = useState(
    location.state?.message ?? '',
  )

  const normalizedSearch = searchTerm.trim().toLocaleLowerCase()
  const filteredOutfits = outfits
    .filter((outfit) => {
      const isFavorite = favoriteIds.includes(outfit.id)
      const matchesSearch =
        !normalizedSearch ||
        [outfit.name, outfit.occasion, outfit.season].some((value) =>
          value.toLocaleLowerCase().includes(normalizedSearch),
        )
      const matchesOccasion =
        occasionFilter === '전체' || outfit.occasion === occasionFilter
      const matchesSeason =
        seasonFilter === '전체' || outfit.season === seasonFilter

      return (
        matchesSearch &&
        matchesOccasion &&
        matchesSeason &&
        (!favoritesOnly || isFavorite)
      )
    })
    .sort((a, b) => {
      if (sortBy === 'worn') {
        return getTime(b.lastWornAt) - getTime(a.lastWornAt)
      }

      if (sortBy === 'name') {
        return a.name.localeCompare(b.name, 'ko')
      }

      if (sortBy === 'favorite') {
        const favoriteDifference =
          Number(favoriteIds.includes(b.id)) - Number(favoriteIds.includes(a.id))
        return favoriteDifference || getTime(b.createdAt) - getTime(a.createdAt)
      }

      return getTime(b.createdAt) - getTime(a.createdAt)
    })

  const toggleFavorite = (outfitId) => {
    setFavoriteIds((currentIds) =>
      currentIds.includes(outfitId)
        ? currentIds.filter((id) => id !== outfitId)
        : [...currentIds, outfitId],
    )
  }

  const resetConditions = () => {
    setSearchTerm('')
    setOccasionFilter('전체')
    setSeasonFilter('전체')
    setFavoritesOnly(false)
    setSortBy('latest')
  }

  return (
    <div className="outfit-page">
      <ToastMessage
        className="outfit-page__notification"
        message={notification}
        onClose={() => setNotification('')}
      />

      <header className="outfit-page__header">
        <div>
          <h1>코디</h1>
          <p>등록된 코디 {filteredOutfits.length}개</p>
        </div>
        <button
          type="button"
          className="outfit-page__add-button"
          onClick={() => navigate('/outfits/new')}
          aria-label="새 코디 만들기"
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
      </header>

      {outfits.length === 0 ? (
        <EmptyState
          className="outfit-page__empty"
          title="아직 등록된 코디가 없습니다"
          description="첫 번째 코디를 만들어보세요."
          buttonText="코디 만들기"
          onButtonClick={() => navigate('/outfits/new')}
        />
      ) : (
        <>
          <SearchBar
            className="outfit-page__search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="코디 이름 검색"
            ariaLabel="코디 검색"
          />

          <section className="outfit-page__filter-section">
            <h2>상황</h2>
            <div className="outfit-page__chips">
              {occasions.map((item) => (
                <FilterChip
                  key={item}
                  className={`outfit-page__chip${occasionFilter === item ? ' outfit-page__chip--active' : ''}`}
                  label={item}
                  selected={occasionFilter === item}
                  onClick={() => setOccasionFilter(item)}
                />
              ))}
            </div>
          </section>

          <section className="outfit-page__filter-section">
            <h2>계절</h2>
            <div className="outfit-page__chips">
              {seasons.map((item) => (
                <FilterChip
                  key={item}
                  className={`outfit-page__chip${seasonFilter === item ? ' outfit-page__chip--active' : ''}`}
                  label={item}
                  selected={seasonFilter === item}
                  onClick={() => setSeasonFilter(item)}
                />
              ))}
            </div>
          </section>

          <div className="outfit-page__controls">
            <label className="outfit-page__favorite-filter">
              <input
                type="checkbox"
                checked={favoritesOnly}
                onChange={(event) => setFavoritesOnly(event.target.checked)}
              />
              <span>즐겨찾기만</span>
            </label>
            <label className="outfit-page__sort">
              <span className="outfit-page__visually-hidden">정렬</span>
              <select
                value={sortBy}
                onChange={(event) => setSortBy(event.target.value)}
              >
                {OUTFIT_SORT_OPTIONS.map((option) => (
                  <option key={option.value} value={option.value}>
                    {option.label}
                  </option>
                ))}
              </select>
            </label>
          </div>

          {filteredOutfits.length > 0 ? (
            <div className="outfit-page__grid">
              {filteredOutfits.map((outfit) => {
                const isFavorite = favoriteIds.includes(outfit.id)

                return (
                  <article
                    key={outfit.id}
                    className="outfit-card"
                    role="link"
                    tabIndex={0}
                    onClick={() => navigate(`/outfits/${outfit.id}`)}
                    onKeyDown={(event) => {
                      if (event.key === 'Enter') {
                        navigate(`/outfits/${outfit.id}`)
                      }
                    }}
                  >
                    <div className="outfit-card__media">
                      <OutfitPreview
                        clothesIds={outfit.clothesIds}
                        name={outfit.name}
                      />
                      <FavoriteButton
                        className={`outfit-card__favorite${isFavorite ? ' outfit-card__favorite--active' : ''}`}
                        active={isFavorite}
                        onClick={() => toggleFavorite(outfit.id)}
                        ariaLabel={`${outfit.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`}
                        stopPropagation
                      />
                    </div>
                    <div className="outfit-card__content">
                      <h2>{outfit.name}</h2>
                      <p>{outfit.occasion} · {outfit.season}</p>
                      <span>옷 {outfit.clothesIds.length}개</span>
                    </div>
                  </article>
                )
              })}
            </div>
          ) : (
            <EmptyState
              className="outfit-page__empty"
              title="조건에 맞는 코디가 없습니다"
              description="검색어나 필터를 변경해보세요."
              buttonText="조건 초기화"
              onButtonClick={resetConditions}
            />
          )}
        </>
      )}

      <button
        type="button"
        className="outfit-page__fab"
        onClick={() => navigate('/outfits/new')}
        aria-label="새 코디 만들기"
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

export default OutfitPage
