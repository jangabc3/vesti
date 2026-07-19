import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import './ClosetPage.css'

const categories = ['전체', '상의', '하의', '아우터', '신발', '가방', '액세서리']

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

      <div className="closet-page__search">
        <svg
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="1.8"
          strokeLinecap="round"
          aria-hidden="true"
        >
          <circle cx="11" cy="11" r="7" />
          <path d="m20 20-4-4" />
        </svg>
        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="옷 이름이나 브랜드 검색"
          aria-label="옷 검색"
        />
      </div>

      <div className="closet-page__filters" aria-label="카테고리 필터">
        {categories.map((category) => (
          <button
            key={category}
            type="button"
            className={`closet-page__filter${selectedCategory === category ? ' closet-page__filter--active' : ''}`}
            onClick={() => setSelectedCategory(category)}
            aria-pressed={selectedCategory === category}
          >
            {category}
          </button>
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
                  <button
                    type="button"
                    className={`closet-card__favorite${isFavorite ? ' closet-card__favorite--active' : ''}`}
                    onClick={(event) => {
                      event.stopPropagation()
                      toggleFavorite(item.id)
                    }}
                    aria-label={`${item.name} 즐겨찾기 ${isFavorite ? '해제' : '추가'}`}
                    aria-pressed={isFavorite}
                  >
                    <svg
                      viewBox="0 0 24 24"
                      fill={isFavorite ? 'currentColor' : 'none'}
                      stroke="currentColor"
                      strokeWidth="1.8"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      aria-hidden="true"
                    >
                      <path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" />
                    </svg>
                  </button>
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
