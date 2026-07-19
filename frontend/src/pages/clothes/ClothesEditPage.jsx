import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import './ClothesEditPage.css'

const categories = ['상의', '하의', '아우터', '신발', '가방', '액세서리']
const seasons = ['봄', '여름', '가을', '겨울']

function ClothesEditPage() {
  const navigate = useNavigate()
  const { clothesId } = useParams()
  const selectedClothes = clothes.find((item) => String(item.id) === clothesId)

  const initialValues = {
    image: selectedClothes?.image ?? '',
    name: selectedClothes?.name ?? '',
    brand: selectedClothes?.brand ?? '',
    color: selectedClothes?.color ?? '',
    category: selectedClothes?.category ?? '',
    seasons: selectedClothes?.seasons ?? [],
    memo: selectedClothes?.memo ?? '',
  }

  const [imagePreview, setImagePreview] = useState(initialValues.image)
  const [name, setName] = useState(initialValues.name)
  const [brand, setBrand] = useState(initialValues.brand)
  const [color, setColor] = useState(initialValues.color)
  const [category, setCategory] = useState(initialValues.category)
  const [selectedSeasons, setSelectedSeasons] = useState([
    ...initialValues.seasons,
  ])
  const [memo, setMemo] = useState(initialValues.memo)
  const [isSaving, setIsSaving] = useState(false)

  const isDirty =
    imagePreview !== initialValues.image ||
    name !== initialValues.name ||
    brand !== initialValues.brand ||
    color !== initialValues.color ||
    category !== initialValues.category ||
    memo !== initialValues.memo ||
    selectedSeasons.length !== initialValues.seasons.length ||
    selectedSeasons.some(
      (season) => !initialValues.seasons.includes(season),
    )

  const isSaveDisabled =
    !name.trim() || !color.trim() || !category || !isDirty || isSaving

  const handleBack = () => {
    if (
      isDirty &&
      !window.confirm(
        '수정한 내용이 저장되지 않았습니다. 화면을 나가시겠습니까?',
      )
    ) {
      return
    }

    navigate(-1)
  }

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

    if (isSaveDisabled) return

    setIsSaving(true)
    window.setTimeout(() => {
      navigate(`/clothes/${clothesId}`, {
        replace: true,
        state: { message: '옷 정보가 수정되었습니다.' },
      })
    }, 700)
  }

  if (!selectedClothes) {
    return (
      <div className="clothes-edit-empty">
        <div>
          <h1>수정할 옷을 찾을 수 없습니다</h1>
          <p>삭제되었거나 존재하지 않는 옷입니다.</p>
          <button type="button" onClick={() => navigate('/closet')}>
            옷장으로 돌아가기
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="clothes-edit">
      <header className="clothes-edit__header">
        <button
          type="button"
          className="clothes-edit__back-button"
          onClick={handleBack}
          aria-label="뒤로가기"
        >
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
        </button>
        <h1>옷 수정</h1>
        <button
          type="submit"
          form="clothes-edit-form"
          className="clothes-edit__save-button"
          disabled={isSaveDisabled}
        >
          {isSaving ? '저장 중' : '저장'}
        </button>
      </header>

      <form
        id="clothes-edit-form"
        className="clothes-edit__form"
        onSubmit={handleSubmit}
      >
        <section className="clothes-edit__section">
          <label className="clothes-edit__image-field">
            <input
              className="clothes-edit__file-input"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              aria-label="옷 사진 변경"
            />
            {imagePreview ? (
              <>
                <img
                  className="clothes-edit__preview"
                  src={imagePreview}
                  alt="옷 이미지 미리보기"
                />
                <span className="clothes-edit__image-change">사진 변경</span>
              </>
            ) : (
              <span className="clothes-edit__image-placeholder">
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

        <section className="clothes-edit__section clothes-edit__fields">
          <label className="clothes-edit__field">
            <span>이름 <span aria-hidden="true">*</span></span>
            <input
              type="text"
              value={name}
              onChange={(event) => setName(event.target.value)}
              placeholder="옷 이름을 입력해주세요"
              required
            />
          </label>

          <label className="clothes-edit__field">
            <span>브랜드</span>
            <input
              type="text"
              value={brand}
              onChange={(event) => setBrand(event.target.value)}
              placeholder="브랜드를 입력해주세요"
            />
          </label>

          <label className="clothes-edit__field">
            <span>색상 <span aria-hidden="true">*</span></span>
            <input
              type="text"
              value={color}
              onChange={(event) => setColor(event.target.value)}
              placeholder="색상을 입력해주세요"
              required
            />
          </label>

          <label className="clothes-edit__field">
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

        <fieldset className="clothes-edit__section clothes-edit__fieldset">
          <legend>계절</legend>
          <div className="clothes-edit__chips">
            {seasons.map((season) => {
              const isSelected = selectedSeasons.includes(season)

              return (
                <button
                  key={season}
                  type="button"
                  className={`clothes-edit__chip${isSelected ? ' clothes-edit__chip--selected' : ''}`}
                  onClick={() => toggleSeason(season)}
                  aria-pressed={isSelected}
                >
                  {season}
                </button>
              )
            })}
          </div>
        </fieldset>

        <label className="clothes-edit__section clothes-edit__field">
          <span>메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="소재, 핏 등 기억할 내용을 적어주세요"
            maxLength={300}
            rows={5}
          />
          <span className="clothes-edit__memo-count">{memo.length}/300</span>
        </label>
      </form>
    </div>
  )
}

export default ClothesEditPage
