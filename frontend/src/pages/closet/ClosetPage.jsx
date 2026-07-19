import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FavoriteButton from '@/components/common/FavoriteButton'
import FilterChip from '@/components/common/FilterChip'
import SearchBar from '@/components/common/SearchBar'
import { CLOTHES_CATEGORIES } from '@/constants/clothesOptions'
import { clothes } from '@/mocks/clothes'
import './ClosetPage.css'

const categories = ['전체', ...CLOTHES_CATEGORIES]

function ClosetPage() {
  const navigate = useNavigate()
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedCategory, setSelectedCategory] = useState('전체')
  const [favoriteIds, setFavoriteIds] = useState(
    clothes.filter((item) => item.isFavorite).map((item) => item.id),
  )

  const normalizedSearchTerm = searchTerm.trim().toLocaleLowerCase()
  const filteredClothes = clothes.filter((item) => {
    const matchesCategory =
      selectedCategory === '전체' || item.category === selectedCategory
    const matchesSearch =
      !normalizedSearchTerm ||
      item.name.toLocaleLowerCase().includes(normalizedSearchTerm) ||
      item.brand.toLocaleLowerCase().includes(normalizedSearchTerm)

    return matchesCategory && matchesSearch
  })

  const toggleFavorite = (id) => {
    setFavoriteIds((currentIds) =>
      currentIds.includes(id)
        ? currentIds.filter((itemId) => itemId !== id)
        : [...currentIds, id],
    )
  }

  return (
    <div className="closet-page">
      <header className="closet-page__header">
        <h1>옷장</h1>
        <button
          type="button"
          className="closet-page__add-button"
          onClick={() => navigate('/clothes/new')}
          aria-label="새 옷 등록"
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

      <SearchBar
        className="closet-page__search"
        value={searchTerm}
        onChange={(event) => setSearchTerm(event.target.value)}
        placeholder="옷 이름이나 브랜드 검색"
        ariaLabel="옷 검색"
      />

      <div className="closet-page__filters" aria-label="카테고리 필터">
        {categories.map((category) => (
          <FilterChip
            key={category}
            className={`closet-page__filter${selectedCategory === category ? ' closet-page__filter--active' : ''}`}
            label={category}
            selected={selectedCategory === category}
            onClick={() => setSelectedCategory(category)}
          />
        ))}
      </div>

      {filteredClothes.length > 0 ? (
        <div className="closet-page__grid">
          {filteredClothes.map((item) => {
            const isFavorite = favoriteIds.includes(item.id)

            return (
              <article
                key={item.id}
                className="closet-card"
                role="link"
                tabIndex={0}
                onClick={() => navigate(`/clothes/${item.id}`)}
                onKeyDown={(event) => {
                  if (event.key === 'Enter') navigate(`/clothes/${item.id}`)
                }}
              >
                <div className="closet-card__image-wrap">
                  <img src={item.image} alt={`${item.name} 이미지`} />
                  <FavoriteButton
                    className={`closet-card__favorite${isFavorite ? ' closet-card__favorite--active' : ''}`}
                    active={isFavorite}
                    onClick={() => toggleFavorite(item.id)}
                    ariaLabel={`${item.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`}
                    stopPropagation
                  />
                </div>
                <div className="closet-card__content">
                  <h2>{item.name}</h2>
                  <p className="closet-card__brand">{item.brand}</p>
                  <p className="closet-card__meta">
                    {item.color} · {item.category}
                  </p>
                </div>
              </article>
            )
          })}
        </div>
      ) : (
        <div className="closet-page__empty">
          <p>등록된 옷이 없습니다.</p>
        </div>
      )}

      <button
        type="button"
        className="closet-page__fab"
        onClick={() => navigate('/clothes/new')}
        aria-label="새 옷 등록"
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

export default ClosetPage
