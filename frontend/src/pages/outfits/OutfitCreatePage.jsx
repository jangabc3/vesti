import { useState } from 'react'
import { useNavigate, useSearchParams } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import './OutfitCreatePage.css'

const occasions = ['일상', '출근', '학교', '데이트', '운동', '여행', '모임']
const seasons = ['봄', '여름', '가을', '겨울']
const categories = ['상의', '하의', '아우터', '신발', '가방', '액세서리']

function OutfitCreatePage() {
  const navigate = useNavigate()
  const [searchParams] = useSearchParams()
  const initialClothesId = searchParams.get('clothesId')
  const initialClothes = clothes.find(
    (item) => String(item.id) === initialClothesId,
  )

  const [name, setName] = useState('')
  const [occasion, setOccasion] = useState('')
  const [season, setSeason] = useState('')
  const [selectedClothesIds, setSelectedClothesIds] = useState(
    initialClothes ? [initialClothes.id] : [],
  )
  const [memo, setMemo] = useState('')
  const [favorite, setFavorite] = useState(false)
  const [isSaving, setIsSaving] = useState(false)

  const selectedClothes = clothes.filter((item) =>
    selectedClothesIds.includes(item.id),
  )
  const isDirty =
    Boolean(name || occasion || season || memo || favorite) ||
    selectedClothesIds.length > 0
  const isSaveDisabled =
    !name.trim() ||
    !occasion ||
    !season ||
    selectedClothesIds.length === 0 ||
    isSaving

  const handleBack = () => {
    if (
      isDirty &&
      !window.confirm(
        '작성 중인 코디가 저장되지 않았습니다. 화면을 나가시겠습니까?',
      )
    ) {
      return
    }

    navigate(-1)
  }

  const toggleClothes = (clothesId) => {
    setSelectedClothesIds((currentIds) =>
      currentIds.includes(clothesId)
        ? currentIds.filter((id) => id !== clothesId)
        : [...currentIds, clothesId],
    )
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isSaveDisabled) return

    setIsSaving(true)
    window.setTimeout(() => {
      navigate('/outfits', {
        replace: true,
        state: { message: '코디가 생성되었습니다.' },
      })
    }, 700)
  }

  return (
    <div className="outfit-create">
      <header className="outfit-create__header">
        <button
          type="button"
          className="outfit-create__back-button"
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
        <h1>코디 만들기</h1>
        <button
          type="submit"
          form="outfit-create-form"
          className="outfit-create__save-button"
          disabled={isSaveDisabled}
        >
          {isSaving ? '저장 중' : '저장'}
        </button>
      </header>

      <form
        id="outfit-create-form"
        className="outfit-create__form"
        onSubmit={handleSubmit}
      >
        <label className="outfit-create__field outfit-create__section">
          <span>코디 이름 <span aria-hidden="true">*</span></span>
          <input
            type="text"
            value={name}
            onChange={(event) => setName(event.target.value)}
            placeholder="코디 이름을 입력해주세요"
            maxLength={50}
            required
          />
          <small>{name.length}/50</small>
        </label>

        <fieldset className="outfit-create__section outfit-create__fieldset">
          <legend>상황 <span aria-hidden="true">*</span></legend>
          <div className="outfit-create__chips">
            {occasions.map((item) => (
              <button
                key={item}
                type="button"
                className={`outfit-create__chip${occasion === item ? ' outfit-create__chip--selected' : ''}`}
                onClick={() => setOccasion(item)}
                aria-pressed={occasion === item}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <fieldset className="outfit-create__section outfit-create__fieldset">
          <legend>계절 <span aria-hidden="true">*</span></legend>
          <div className="outfit-create__chips">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                className={`outfit-create__chip${season === item ? ' outfit-create__chip--selected' : ''}`}
                onClick={() => setSeason(item)}
                aria-pressed={season === item}
              >
                {item}
              </button>
            ))}
          </div>
        </fieldset>

        <section className="outfit-create__section">
          <div className="outfit-create__section-heading">
            <h2>선택한 옷</h2>
            <span>{selectedClothes.length}개</span>
          </div>
          {selectedClothes.length === 0 ? (
            <div className="outfit-create__preview-empty">
              코디에 사용할 옷을 선택해주세요.
            </div>
          ) : (
            <div className="outfit-create__preview-grid">
              {selectedClothes.slice(0, 4).map((item, index) => (
                <div key={item.id} className="outfit-create__preview-item">
                  <img src={item.image} alt={item.name} />
                  {index === 3 && selectedClothes.length > 4 && (
                    <span>+{selectedClothes.length - 4}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="outfit-create__section outfit-create__clothes-section">
          <div className="outfit-create__section-heading">
            <h2>옷 선택 <span aria-hidden="true">*</span></h2>
          </div>
          {categories.map((category) => {
            const categoryClothes = clothes.filter(
              (item) => item.category === category,
            )

            return (
              <div key={category} className="outfit-create__category">
                <h3>{category}</h3>
                <div className="outfit-create__clothes-list">
                  {categoryClothes.map((item) => {
                    const isSelected = selectedClothesIds.includes(item.id)

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`outfit-clothes-card${isSelected ? ' outfit-clothes-card--selected' : ''}`}
                        onClick={() => toggleClothes(item.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="outfit-clothes-card__image">
                          <img src={item.image} alt="" />
                          {isSelected && (
                            <span className="outfit-clothes-card__check" aria-hidden="true">
                              <svg
                                viewBox="0 0 24 24"
                                fill="none"
                                stroke="currentColor"
                                strokeWidth="2.2"
                                strokeLinecap="round"
                                strokeLinejoin="round"
                              >
                                <path d="m5 12 4 4L19 6" />
                              </svg>
                            </span>
                          )}
                        </span>
                        <strong>{item.name}</strong>
                        <small>{item.brand}</small>
                      </button>
                    )
                  })}
                </div>
              </div>
            )
          })}
        </section>

        <label className="outfit-create__field outfit-create__section">
          <span>메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="이 코디에 대한 메모를 남겨보세요."
            maxLength={300}
            rows={5}
          />
          <small>{memo.length}/300</small>
        </label>

        <label className="outfit-create__favorite">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(event) => setFavorite(event.target.checked)}
          />
          <span className="outfit-create__switch" aria-hidden="true" />
          <span>즐겨찾기에 추가</span>
        </label>
      </form>
    </div>
  )
}

export default OutfitCreatePage
