import { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { clothes } from '@/mocks/clothes'
import { outfits } from '@/mocks/outfits'
import './HistoryCreatePage.css'

const occasions = ['전체', '일상', '출근', '학교', '데이트', '운동', '여행', '모임']
const seasons = ['전체', '봄', '여름', '가을', '겨울']
const weatherConditions = ['맑음', '흐림', '비', '눈', '바람', '기타']

const toDateInputValue = (date) => {
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

function OutfitPreview({ outfit, className = '' }) {
  const previewClothes = outfit.clothesIds
    .map((id) => clothes.find((item) => item.id === id))
    .filter(Boolean)
    .slice(0, 4)

  if (previewClothes.length === 0) {
    return (
      <span className={`history-create-preview history-create-preview--empty ${className}`}>
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
      </span>
    )
  }

  return (
    <span
      className={`history-create-preview history-create-preview--${previewClothes.length} ${className}`}
    >
      {previewClothes.map((item) => (
        <img key={item.id} src={item.image} alt="" />
      ))}
    </span>
  )
}

function HistoryCreatePage() {
  const navigate = useNavigate()
  const today = toDateInputValue(new Date())
  const [date, setDate] = useState(today)
  const [selectedOutfitId, setSelectedOutfitId] = useState(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [occasionFilter, setOccasionFilter] = useState('전체')
  const [seasonFilter, setSeasonFilter] = useState('전체')
  const [temperature, setTemperature] = useState('')
  const [weatherCondition, setWeatherCondition] = useState('')
  const [memo, setMemo] = useState('')
  const [isSaving, setIsSaving] = useState(false)

  const selectedOutfit = outfits.find((item) => item.id === selectedOutfitId)
  const normalizedSearch = searchTerm.trim().toLocaleLowerCase()
  const filteredOutfits = outfits.filter((outfit) => {
    const matchesSearch =
      !normalizedSearch ||
      [outfit.name, outfit.occasion, outfit.season].some((value) =>
        value.toLocaleLowerCase().includes(normalizedSearch),
      )
    const matchesOccasion =
      occasionFilter === '전체' || outfit.occasion === occasionFilter
    const matchesSeason =
      seasonFilter === '전체' || outfit.season === seasonFilter

    return matchesSearch && matchesOccasion && matchesSeason
  })
  const isDirty =
    date !== today ||
    selectedOutfitId !== null ||
    Boolean(temperature || weatherCondition || memo)
  const isSaveDisabled = !date || !selectedOutfit || isSaving

  const handleBack = () => {
    if (
      isDirty &&
      !window.confirm(
        '작성 중인 기록이 저장되지 않았습니다. 화면을 나가시겠습니까?',
      )
    ) {
      return
    }

    navigate(-1)
  }

  const resetConditions = () => {
    setSearchTerm('')
    setOccasionFilter('전체')
    setSeasonFilter('전체')
  }

  const handleSubmit = (event) => {
    event.preventDefault()

    if (isSaveDisabled) return

    setIsSaving(true)
    window.setTimeout(() => {
      navigate('/history', {
        replace: true,
        state: { message: '착용 기록이 추가되었습니다.' },
      })
    }, 700)
  }

  return (
    <div className="history-create">
      <header className="history-create__header">
        <button
          type="button"
          className="history-create__back-button"
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
        <h1>기록 추가</h1>
        <button
          type="submit"
          form="history-create-form"
          className="history-create__save-button"
          disabled={isSaveDisabled}
        >
          {isSaving ? '저장 중' : '저장'}
        </button>
      </header>

      <form
        id="history-create-form"
        className="history-create__form"
        onSubmit={handleSubmit}
      >
        <label className="history-create__field history-create__section">
          <span>착용 날짜 <span aria-hidden="true">*</span></span>
          <input
            type="date"
            value={date}
            max={today}
            onChange={(event) => setDate(event.target.value)}
            required
          />
        </label>

        <section className="history-create__section">
          <div className="history-create__section-heading">
            <h2>선택한 코디</h2>
          </div>
          {selectedOutfit ? (
            <div className="history-create__selected">
              <OutfitPreview
                outfit={selectedOutfit}
                className="history-create__selected-preview"
              />
              <div>
                <strong>{selectedOutfit.name}</strong>
                <p>{selectedOutfit.occasion} · {selectedOutfit.season}</p>
                <span>옷 {selectedOutfit.clothesIds.length}개</span>
              </div>
            </div>
          ) : (
            <div className="history-create__selected-empty">
              기록할 코디를 선택해주세요.
            </div>
          )}
        </section>

        <section className="history-create__section history-create__outfit-section">
          <div className="history-create__section-heading">
            <h2>코디 선택 <span aria-hidden="true">*</span></h2>
          </div>

          {outfits.length === 0 ? (
            <div className="history-create__empty">
              <h3>등록된 코디가 없습니다</h3>
              <p>먼저 코디를 만들어주세요.</p>
              <button type="button" onClick={() => navigate('/outfits/new')}>
                코디 만들기
              </button>
            </div>
          ) : (
            <>
              <div className="history-create__search">
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
                  placeholder="코디 이름 검색"
                  aria-label="코디 검색"
                />
              </div>

              <div className="history-create__filter-group">
                <span>상황</span>
                <div className="history-create__chips">
                  {occasions.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`history-create__chip${occasionFilter === item ? ' history-create__chip--active' : ''}`}
                      onClick={() => setOccasionFilter(item)}
                      aria-pressed={occasionFilter === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              <div className="history-create__filter-group">
                <span>계절</span>
                <div className="history-create__chips">
                  {seasons.map((item) => (
                    <button
                      key={item}
                      type="button"
                      className={`history-create__chip${seasonFilter === item ? ' history-create__chip--active' : ''}`}
                      onClick={() => setSeasonFilter(item)}
                      aria-pressed={seasonFilter === item}
                    >
                      {item}
                    </button>
                  ))}
                </div>
              </div>

              {filteredOutfits.length > 0 ? (
                <div className="history-create__outfit-grid">
                  {filteredOutfits.map((outfit) => {
                    const isSelected = outfit.id === selectedOutfitId

                    return (
                      <button
                        key={outfit.id}
                        type="button"
                        className={`history-create-card${isSelected ? ' history-create-card--selected' : ''}`}
                        onClick={() => setSelectedOutfitId(outfit.id)}
                        aria-pressed={isSelected}
                      >
                        <span className="history-create-card__media">
                          <OutfitPreview outfit={outfit} />
                          {isSelected && (
                            <span className="history-create-card__check" aria-hidden="true">
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
                          {outfit.favorite && (
                            <svg
                              className="history-create-card__favorite"
                              viewBox="0 0 24 24"
                              fill="currentColor"
                              aria-label="즐겨찾기"
                            >
                              <path d="m12 3 2.8 5.7 6.2.9-4.5 4.4 1.1 6.2-5.6-2.9-5.6 2.9 1.1-6.2L3 9.6l6.2-.9L12 3Z" />
                            </svg>
                          )}
                        </span>
                        <strong>{outfit.name}</strong>
                        <span>{outfit.occasion} · {outfit.season}</span>
                        <small>옷 {outfit.clothesIds.length}개</small>
                      </button>
                    )
                  })}
                </div>
              ) : (
                <div className="history-create__empty">
                  <h3>조건에 맞는 코디가 없습니다</h3>
                  <p>검색어나 필터를 변경해보세요.</p>
                  <button type="button" onClick={resetConditions}>
                    조건 초기화
                  </button>
                </div>
              )}
            </>
          )}
        </section>

        <fieldset className="history-create__section history-create__weather">
          <legend>날씨 정보</legend>
          <div>
            <label className="history-create__field">
              <span>당시 온도</span>
              <span className="history-create__temperature">
                <input
                  type="number"
                  value={temperature}
                  onChange={(event) => setTemperature(event.target.value)}
                  placeholder="예: 24"
                />
                <span>°C</span>
              </span>
            </label>
            <label className="history-create__field">
              <span>날씨 상태</span>
              <select
                value={weatherCondition}
                onChange={(event) => setWeatherCondition(event.target.value)}
              >
                <option value="">선택해주세요</option>
                {weatherConditions.map((condition) => (
                  <option key={condition} value={condition}>
                    {condition}
                  </option>
                ))}
              </select>
            </label>
          </div>
        </fieldset>

        <label className="history-create__field history-create__section">
          <span>메모</span>
          <textarea
            value={memo}
            onChange={(event) => setMemo(event.target.value)}
            placeholder="오늘의 코디나 하루를 기록해보세요."
            maxLength={300}
            rows={5}
          />
          <small>{memo.length}/300</small>
        </label>
      </form>
    </div>
  )
}

export default HistoryCreatePage
