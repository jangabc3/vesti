import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import FilterChip from '@/components/common/FilterChip'
import PageHeader from '@/components/common/PageHeader'
import { CLOTHES_CATEGORIES as categories, CLOTHES_SEASONS as seasons } from '@/constants/clothesOptions'
import './ClothesCreatePage.css'

function ClothesCreatePage() {
  const navigate = useNavigate()
  const [imagePreview, setImagePreview] = useState('')
  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')
  const [color, setColor] = useState('')
  const [category, setCategory] = useState('')
  const [selectedSeasons, setSelectedSeasons] = useState([])
  const [memo, setMemo] = useState('')

  const isSubmitDisabled =
    !imagePreview || !name.trim() || !color.trim() || !category

  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) return

    const reader = new FileReader()
    reader.onload = () => setImagePreview(reader.result)
    reader.readAsDataURL(file)
  }

  const toggleSeason = (season) => {
    setSelectedSeasons((currentSeasons) =>
      currentSeasons.includes(season)
        ? currentSeasons.filter((item) => item !== season)
        : [...currentSeasons, season],
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()
  }

  return (
    <div className="clothes-create">
      <PageHeader
        className="clothes-create__header"
        title="옷 등록"
        onBack={() => navigate(-1)}
      />

      <form className="clothes-create__form" onSubmit={handleSubmit}>
        <section className="clothes-create__section">
          <label className="clothes-create__image-field">
            <input
              className="clothes-create__file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-label="옷 사진 추가"
            />
            {imagePreview ? (
              <img
                className="clothes-create__preview"
                src={imagePreview}
                alt="선택한 옷 미리보기"
              />
            ) : (
              <span className="clothes-create__image-placeholder">
                <svg
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="currentColor"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  aria-hidden="true"
                >
                  <path d="M12 5v14M5 12h14" />
                </svg>
                <span>사진 추가</span>
              </span>
            )}
          </label>
        </section>

        <section className="clothes-create__section clothes-create__fields">
          <label className="clothes-create__field">
            <span>이름 <span aria-hidden="true">*</span></span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="옷 이름을 입력해주세요"
              required
            />
          </label>

          <label className="clothes-create__field">
            <span>브랜드</span>
            <input
              type="text"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              placeholder="브랜드를 입력해주세요"
            />
          </label>

          <label className="clothes-create__field">
            <span>색상 <span aria-hidden="true">*</span></span>
            <input
              type="text"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="색상을 입력해주세요"
              required
            />
          </label>

          <label className="clothes-create__field">
            <span>카테고리 <span aria-hidden="true">*</span></span>
            <select
              value={category}
              onChange={(event) => setCategory(event.target.value)}
              required
            >
              <option value="" disabled>
                카테고리를 선택해주세요
              </option>
              {categories.map((item) => (
                <option key={item} value={item}>
                  {item}
                </option>
              ))}
            </select>
          </label>
        </section>

        <fieldset className="clothes-create__section clothes-create__fieldset">
          <legend>계절</legend>
          <div className="clothes-create__chips">
            {seasons.map((season) => {
              const isSelected = selectedSeasons.includes(season)

              return (
                <FilterChip
                  key={season}
                  className={`clothes-create__chip${isSelected ? ' clothes-create__chip--selected' : ''}`}
                  label={season}
                  selected={isSelected}
                  onClick={() => toggleSeason(season)}
                />
              )
            })}
          </div>
        </fieldset>

        <label className="clothes-create__section clothes-create__field">
          <span>메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="소재, 핏 등 기억할 내용을 적어주세요"
            maxLength={300}
            rows={5}
          />
          <span className="clothes-create__memo-count">{memo.length}/300</span>
        </label>

        <div className="clothes-create__actions">
          <button
            type="submit"
            className="clothes-create__submit"
            disabled={isSubmitDisabled}
          >
            등록
          </button>
        </div>
      </form>
    </div>
  )
}

export default ClothesCreatePage
