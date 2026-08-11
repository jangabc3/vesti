import {
  useEffect,
  useRef,
  useState,
} from 'react'
import {
  useNavigate,
  useParams,
} from 'react-router-dom'

import { clothes } from '@/mocks/clothes'

import './ClothesEditPage.css'


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


function ClothesEditPage() {
  const navigate = useNavigate()
  const params = useParams()

  const fileInputRef = useRef(null)


  const clothingId =
    params.id ??
    params.clothesId ??
    params.clothingId


  const clothing = clothes.find(
    (item) =>
      String(item.id) === String(clothingId),
  )


  const [name, setName] = useState(
    clothing?.name ?? '',
  )

  const [brand, setBrand] = useState(
    clothing?.brand ?? '',
  )

  const [category, setCategory] = useState(
    clothing?.category ?? '',
  )

  const [color, setColor] = useState(
    clothing?.color ?? '',
  )

  const [season, setSeason] = useState(
    clothing?.season ?? '',
  )

  const [imageFile, setImageFile] =
    useState(null)

  const [imagePreview, setImagePreview] =
    useState(clothing?.image ?? '')

  const [originalImage] = useState(
    clothing?.image ?? '',
  )

  const [imageRemoved, setImageRemoved] =
    useState(false)

  const [imageError, setImageError] =
    useState('')


  const isFormValid =
    name.trim().length > 0 &&
    category &&
    color &&
    season


  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview !== originalImage &&
        imagePreview.startsWith('blob:')
      ) {
        URL.revokeObjectURL(imagePreview)
      }
    }
  }, [imagePreview, originalImage])


  if (!clothing) {
    return (
      <div className="clothes-edit-page">
        <header className="clothes-edit-header">
          <button
            type="button"
            className="clothes-edit-header__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
          >
            <BackIcon />
          </button>

          <h1>
            옷 수정
          </h1>

          <span />
        </header>

        <div className="clothes-edit-not-found">
          <h2>
            옷을 찾을 수 없어요.
          </h2>

          <p>
            삭제되었거나 존재하지 않는 옷이에요.
          </p>

          <button
            type="button"
            onClick={() => navigate('/closet')}
          >
            옷장으로 돌아가기
          </button>
        </div>
      </div>
    )
  }


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


    if (
      imagePreview &&
      imagePreview !== originalImage &&
      imagePreview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(imagePreview)
    }


    const previewUrl =
      URL.createObjectURL(file)

    setImageFile(file)
    setImagePreview(previewUrl)
    setImageRemoved(false)
  }


  const handleRemoveImage = () => {
    if (
      imagePreview &&
      imagePreview !== originalImage &&
      imagePreview.startsWith('blob:')
    ) {
      URL.revokeObjectURL(imagePreview)
    }

    setImageFile(null)
    setImagePreview('')
    setImageRemoved(true)
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
      현재는 UI 디자인 단계.

      실제 API 연결 단계에서는:

      1. PUT /api/clothes/{id}
         name / category / color / season 수정

      2. 새로운 imageFile이 있다면
         POST /api/clothes/{id}/image

      3. 완료 후
         /clothes/{id}

      로 이동한다.

      기존 이미지 자체 삭제 API는
      백엔드 정책을 확인한 뒤 연결한다.
    */

    console.log({
      id: clothingId,
      name,
      brand,
      category,
      color,
      season,
      imageFile,
      imageRemoved,
    })

    navigate(`/clothes/${clothingId}`)
  }


  return (
    <div className="clothes-edit-page">
      {/* Header */}
      <header className="clothes-edit-header">
        <button
          type="button"
          className="clothes-edit-header__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>
          옷 수정
        </h1>

        <button
          type="submit"
          form="clothes-edit-form"
          className="clothes-edit-header__complete"
          disabled={!isFormValid}
        >
          저장
        </button>
      </header>


      <form
        id="clothes-edit-form"
        className="clothes-edit-form"
        onSubmit={handleSubmit}
      >
        {/* Photo */}
        <section className="clothes-edit-section clothes-edit-photo-section">
          <div className="clothes-edit-section__heading">
            <span>
              사진
            </span>

            <span className="clothes-edit-section__optional">
              선택
            </span>
          </div>


          <input
            ref={fileInputRef}
            type="file"
            accept="image/jpeg,image/png,image/webp"
            className="clothes-edit-photo__input"
            onChange={handleImageChange}
          />


          {imagePreview ? (
            <div className="clothes-edit-photo clothes-edit-photo--selected">
              <img
                src={imagePreview}
                alt={`${name || '옷'} 미리보기`}
              />

              <div className="clothes-edit-photo__overlay">
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
              className="clothes-edit-photo"
              onClick={() =>
                fileInputRef.current?.click()
              }
            >
              <span className="clothes-edit-photo__icon">
                <CameraIcon />
              </span>

              <strong>
                옷 사진 추가
              </strong>

              <span>
                사진을 추가하면 옷장에서
                더 쉽게 확인할 수 있어요.
              </span>
            </button>
          )}


          {imageError && (
            <p className="clothes-edit-photo__error">
              {imageError}
            </p>
          )}
        </section>


        {/* Basic Information */}
        <section className="clothes-edit-section">
          <div className="clothes-edit-section__heading">
            <span>
              기본 정보
            </span>
          </div>


          <div className="clothes-edit-fields">
            <label className="clothes-edit-field">
              <span className="clothes-edit-field__label">
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


            <label className="clothes-edit-field">
              <span className="clothes-edit-field__label">
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
        <section className="clothes-edit-section">
          <div className="clothes-edit-section__heading">
            <span>
              카테고리
              <em>
                *
              </em>
            </span>
          </div>

          <div className="clothes-edit-options">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'clothes-edit-option',
                  category === item
                    ? 'clothes-edit-option--active'
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
        <section className="clothes-edit-section">
          <div className="clothes-edit-section__heading">
            <span>
              색상
              <em>
                *
              </em>
            </span>
          </div>

          <div className="clothes-edit-color-list">
            {colors.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'clothes-edit-color',
                  color === item
                    ? 'clothes-edit-color--active'
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
                  className={`clothes-edit-color__swatch clothes-edit-color__swatch--${item}`}
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
        <section className="clothes-edit-section">
          <div className="clothes-edit-section__heading">
            <span>
              계절
              <em>
                *
              </em>
            </span>
          </div>

          <div className="clothes-edit-options clothes-edit-options--season">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  'clothes-edit-option',
                  season === item
                    ? 'clothes-edit-option--active'
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


        {/* Current Selection */}
        <section className="clothes-edit-summary">
          <span>
            현재 선택
          </span>

          <strong>
            {[category, color, season]
              .filter(Boolean)
              .join(' · ')}
          </strong>
        </section>


        {/* Bottom Action */}
        <div className="clothes-edit-action">
          <button
            type="submit"
            className="clothes-edit-action__button"
            disabled={!isFormValid}
          >
            변경사항 저장
          </button>
        </div>
      </form>
    </div>
  )
}


export default ClothesEditPage