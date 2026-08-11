import {
  useEffect,
  useRef,
  useState,
} from 'react'
import { useNavigate } from 'react-router-dom'

import './ClothesCreatePage.css'


const categories = [
  '상의',
  '하의',
  '아우터',
  '신발',
  '가방',
  '액세서리',
]


const colors = [
  '블랙',
  '화이트',
  '그레이',
  '네이비',
  '베이지',
  '브라운',
  '블루',
  '그린',
  '레드',
  '기타',
]


const seasons = [
  '봄',
  '여름',
  '가을',
  '겨울',
]


const ALLOWED_IMAGE_TYPES = [
  'image/jpeg',
  'image/png',
  'image/webp',
]

const MAX_IMAGE_SIZE = 5 * 1024 * 1024


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


function CameraIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M9 5.5 10.2 4h3.6L15 5.5h3.5A2.5 2.5 0 0 1 21 8v9.5a2.5 2.5 0 0 1-2.5 2.5h-13A2.5 2.5 0 0 1 3 17.5V8a2.5 2.5 0 0 1 2.5-2.5H9Z" />
      <circle cx="12" cy="12.5" r="3.5" />
    </svg>
  )
}


function ChevronIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.7"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m9 18 6-6-6-6" />
    </svg>
  )
}


function ClothesCreatePage() {
  const navigate = useNavigate()
  const fileInputRef = useRef(null)

  const [name, setName] = useState('')
  const [brand, setBrand] = useState('')

  const [category, setCategory] = useState('')
  const [color, setColor] = useState('')
  const [season, setSeason] = useState('')

  const [imageFile, setImageFile] =
    useState(null)

  const [imagePreview, setImagePreview] =
    useState('')

  const [imageError, setImageError] =
    useState('')


  const isFormValid =
    name.trim().length > 0 &&
    category &&
    color &&
    season


  useEffect(() => {
    return () => {
      if (imagePreview) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview])


  const handleImageChange = (event) => {
    const file = event.target.files?.[0]

    if (!file) {
      return
    }

    setImageError('')


    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError(
        'JPG, PNG, WEBP 이미지만 등록할 수 있어요.',
      )

      event.target.value = ''

      return
    }


    if (file.size > MAX_IMAGE_SIZE) {
      setImageError(
        '이미지는 5MB 이하로 등록해주세요.',
      )

      event.target.value = ''

      return
    }


    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }


    const previewUrl =
      URL.createObjectURL(file)

    setImageFile(file)
    setImagePreview(previewUrl)
  }


  const handleRemoveImage = () => {
    if (imagePreview) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(null)
    setImagePreview('')
    setImageError('')

    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }


  const handleSubmit = (event) => {
    event.preventDefault()

    if (!isFormValid) {
      return
    }

    /*
      현재는 프론트 UI 디자인 단계.

      추후 실제 API 연동 단계에서:

      1. POST /api/clothes
      2. 생성된 clothing.id 확인
      3. 이미지가 있다면
         POST /api/clothes/{id}/image
      4. /closet 이동

      순서로 연결한다.
    */

    console.log({
      name,
      brand,
      category,
      color,
      season,
      imageFile,
    })
  }


  return (
    <div className="clothes-create-page">
      {/* Header */}
      <header className="clothes-create-header">
        <button
          type="button"
          className="clothes-create-header__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>
          옷 등록
        </h1>

        <button
          type="submit"
          form="clothes-create-form"
          className="clothes-create-header__complete"
          disabled={!isFormValid}
        >
          완료
        </button>
      </header>


      <form
        id="clothes-create-form"
        className="clothes-create-form"
        onSubmit={handleSubmit}
      >
        {/* Photo */}
        <section className="clothes-create-section clothes-create-photo-section">
          <div className="clothes-create-section__heading">
            <span>
              사진
            </span>

            <span className="clothes-create-section__optional">
              선택
            </span>
          </div>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="clothes-create-photo__input"
            onChange={handleImageChange}
          />


          {imagePreview ? (
            <div className="clothes-create-photo clothes-create-photo--selected">
              <img
                src={imagePreview}
                alt="등록할 옷 미리보기"
              />

              <div className="clothes-create-photo__overlay">
                <button
                  type="button"
                  onClick={() =>
                    fileInputRef.current?.click()
                  }
                >
                  사진 변경
                </button>

                <button
                  type="button"
                  onClick={handleRemoveImage}
                >
                  삭제
                </button>
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="clothes-create-photo"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <span className="clothes-create-photo__icon">
                <CameraIcon />
              </span>

              <strong>
                옷 사진 추가
              </strong>

              <span>
                사진을 추가하면 옷장을 더 쉽게
                확인할 수 있어요.
              </span>
            </button>
          )}


          {imageError && (
            <p className="clothes-create-photo__error">
              {imageError}
            </p>
          )}
        </section>


        {/* Basic Information */}
        <section className="clothes-create-section">
          <div className="clothes-create-section__heading">
            <span>
              기본 정보
            </span>
          </div>


          <div className="clothes-create-fields">
            <label className="clothes-create-field">
              <span className="clothes-create-field__label">
                이름
                <em>
                  *
                </em>
              </span>

              <input
                type="text"
                value={name}
                onChange={(event) =>
                  setName(event.target.value)
                }
                placeholder="예: 화이트 코튼 셔츠"
                autoComplete="off"
              />
            </label>


            <label className="clothes-create-field">
              <span className="clothes-create-field__label">
                브랜드
              </span>

              <input
                type="text"
                value={brand}
                onChange={(event) =>
                  setBrand(event.target.value)
                }
                placeholder="예: COS"
                autoComplete="off"
              />
            </label>
          </div>
        </section>


        {/* Category */}
        <section className="clothes-create-section">
          <div className="clothes-create-section__heading">
            <span>
              카테고리
              <em>
                *
              </em>
            </span>
          </div>

          <div className="clothes-create-options">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'clothes-create-option',
                  category === item
                    ? 'clothes-create-option--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  setCategory(item)
                }
                aria-pressed={category === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>


        {/* Color */}
        <section className="clothes-create-section">
          <div className="clothes-create-section__heading">
            <span>
              색상
              <em>
                *
              </em>
            </span>
          </div>

          <div className="clothes-create-color-list">
            {colors.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'clothes-create-color',
                  color === item
                    ? 'clothes-create-color--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  setColor(item)
                }
                aria-pressed={color === item}
              >
                <span
                  className={`clothes-create-color__swatch clothes-create-color__swatch--${item}`}
                  aria-hidden="true"
                />

                <span>
                  {item}
                </span>
              </button>
            ))}
          </div>
        </section>


        {/* Season */}
        <section className="clothes-create-section">
          <div className="clothes-create-section__heading">
            <span>
              계절
              <em>
                *
              </em>
            </span>
          </div>

          <div className="clothes-create-options clothes-create-options--season">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'clothes-create-option',
                  season === item
                    ? 'clothes-create-option--active'
                    : '',
                ]
                  .filter(Boolean)
                  .join(' ')}
                onClick={() =>
                  setSeason(item)
                }
                aria-pressed={season === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>


        {/* Summary */}
        <section className="clothes-create-summary">
          <div className="clothes-create-summary__row">
            <span>
              선택한 정보
            </span>

            <ChevronIcon />
          </div>

          <p>
            {[category, color, season]
              .filter(Boolean)
              .join(' · ') ||
              '카테고리, 색상, 계절을 선택해주세요.'}
          </p>
        </section>


        {/* Bottom Action */}
        <div className="clothes-create-action">
          <button
            type="submit"
            className="clothes-create-action__button"
            disabled={!isFormValid}
          >
            옷 등록하기
          </button>
        </div>
      </form>
    </div>
  )
}


export default ClothesCreatePage