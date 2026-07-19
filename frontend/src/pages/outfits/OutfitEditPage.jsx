import { useState } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import FilterChip from '@/components/common/FilterChip'
import EmptyState from '@/components/common/EmptyState'
import PageHeader from '@/components/common/PageHeader'
import { CLOTHES_CATEGORIES as categories } from '@/constants/clothesOptions'
import { OUTFIT_OCCASIONS as occasions, OUTFIT_SEASONS as seasons } from '@/constants/outfitOptions'
import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'
import './OutfitEditPage.css'

function OutfitEditPage() {
  const navigate = useNavigate()
  const { outfitId } = useParams()
  const outfit = outfits.find((item) => String(item.id) === outfitId)

  const initialValues = {
    name: outfit?.name ?? '',
    occasion: outfit?.occasion ?? '',
    season: outfit?.season ?? '',
    clothesIds: outfit?.clothesIds ?? [],
    memo: outfit?.memo ?? '',
    favorite: outfit?.favorite ?? false,
  }

  const [name, setName] = useState(initialValues.name)
  const [occasion, setOccasion] = useState(initialValues.occasion)
  const [season, setSeason] = useState(initialValues.season)
  const [selectedClothesIds, setSelectedClothesIds] = useState([
    ...initialValues.clothesIds,
  ])
  const [memo, setMemo] = useState(initialValues.memo)
  const [favorite, setFavorite] = useState(initialValues.favorite)
  const [isSaving, setIsSaving] = useState(false)

  const selectedClothes = clothes.filter((item) =>
    selectedClothesIds.includes(item.id),
  )
  const isDirty =
    name !== initialValues.name ||
    occasion !== initialValues.occasion ||
    season !== initialValues.season ||
    memo !== initialValues.memo ||
    favorite !== initialValues.favorite ||
    selectedClothesIds.length !== initialValues.clothesIds.length ||
    selectedClothesIds.some((id) => !initialValues.clothesIds.includes(id))
  const isSaveDisabled =
    !isDirty ||
    isSaving ||
    !name.trim() ||
    !occasion ||
    !season ||
    selectedClothesIds.length === 0

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
      navigate(`/outfits/${outfitId}`, {
        replace: true,
        state: { message: '코디가 수정되었습니다.' },
      })
    }, 700)
  }

  if (!outfit) {
    return (
      <EmptyState
        className="outfit-edit-empty"
        title="수정할 코디를 찾을 수 없습니다."
        description="삭제되었거나 존재하지 않는 코디입니다."
        buttonText="코디 목록으로 돌아가기"
        onButtonClick={() => navigate('/outfits')}
      />
    )
  }

  return (
    <div className="outfit-edit">
      <PageHeader
        className="outfit-edit__header"
        title="코디 수정"
        onBack={handleBack}
        action={
          <button
            type="submit"
            form="outfit-edit-form"
            className="outfit-edit__save-button"
            disabled={isSaveDisabled}
          >
            {isSaving ? '저장 중' : '저장'}
          </button>
        }
      />

      <form
        id="outfit-edit-form"
        className="outfit-edit__form"
        onSubmit={handleSubmit}
      >
        <label className="outfit-edit__field outfit-edit__section">
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

        <fieldset className="outfit-edit__section outfit-edit__fieldset">
          <legend>상황 <span aria-hidden="true">*</span></legend>
          <div className="outfit-edit__chips">
            {occasions.map((item) => (
              <FilterChip
                key={item}
                className={`outfit-edit__chip${occasion === item ? ' outfit-edit__chip--selected' : ''}`}
                label={item}
                selected={occasion === item}
                onClick={() => setOccasion(item)}
              />
            ))}
          </div>
        </fieldset>

        <fieldset className="outfit-edit__section outfit-edit__fieldset">
          <legend>계절 <span aria-hidden="true">*</span></legend>
          <div className="outfit-edit__chips">
            {seasons.map((item) => (
              <FilterChip
                key={item}
                className={`outfit-edit__chip${season === item ? ' outfit-edit__chip--selected' : ''}`}
                label={item}
                selected={season === item}
                onClick={() => setSeason(item)}
              />
            ))}
          </div>
        </fieldset>

        <section className="outfit-edit__section">
          <div className="outfit-edit__section-heading">
            <h2>선택한 옷</h2>
            <span>{selectedClothes.length}개</span>
          </div>
          {selectedClothes.length === 0 ? (
            <div className="outfit-edit__preview-empty">
              코디에 사용할 옷을 선택해주세요.
            </div>
          ) : (
            <div className="outfit-edit__preview-grid">
              {selectedClothes.slice(0, 4).map((item, index) => (
                <div key={item.id} className="outfit-edit__preview-item">
                  <img src={item.image} alt={item.name} />
                  {index === 3 && selectedClothes.length > 4 && (
                    <span>+{selectedClothes.length - 4}</span>
                  )}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="outfit-edit__section outfit-edit__clothes-section">
          <div className="outfit-edit__section-heading">
            <h2>옷 선택 <span aria-hidden="true">*</span></h2>
          </div>
          {categories.map((category) => (
            <div key={category} className="outfit-edit__category">
              <h3>{category}</h3>
              <div className="outfit-edit__clothes-list">
                {clothes
                  .filter((item) => item.category === category)
                  .map((item) => {
                    const isSelected = selectedClothesIds.includes(item.id)

                    return (
                      <button
                        key={item.id}
                        type="button"
                        className={`outfit-edit-card${isSelected ? ' outfit-edit-card--selected' : ''}`}
                        onClick={() => toggleClothes(item.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="outfit-edit-card__image">
                          <img src={item.image} alt="" />
                          {isSelected && (
                            <span className="outfit-edit-card__check" aria-hidden="true">
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
          ))}
        </section>

        <label className="outfit-edit__field outfit-edit__section">
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

        <label className="outfit-edit__favorite">
          <input
            type="checkbox"
            checked={favorite}
            onChange={(event) => setFavorite(event.target.checked)}
          />
          <span className="outfit-edit__switch" aria-hidden="true" />
          <span>즐겨찾기에 추가</span>
        </label>
      </form>
    </div>
  )
}

export default OutfitEditPage
