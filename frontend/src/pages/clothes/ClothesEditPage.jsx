import { useEffect, useRef, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  getClothing,
  updateClothing,
  uploadClothingImage,
} from "@/api/clothingApi";

import "./ClothesEditPage.css";

const categories = [
  "상의",
  "하의",
  "아우터",
  "원피스",
  "신발",
  "가방",
  "액세서리",
];

const colors = [
  "블랙",
  "화이트",
  "그레이",
  "네이비",
  "베이지",
  "브라운",
  "블루",
  "그린",
  "레드",
  "기타",
];

const seasons = ["봄", "여름", "가을", "겨울"];

const ALLOWED_IMAGE_TYPES = ["image/jpeg", "image/png", "image/webp"];

const MAX_IMAGE_SIZE = 5 * 1024 * 1024;

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
  );
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
  );
}

function ClothesEditPage() {
  const navigate = useNavigate();

  const params = useParams();

  const fileInputRef = useRef(null);

  const clothingId = params.id ?? params.clothesId ?? params.clothingId;

  const [clothing, setClothing] = useState(null);

  const [name, setName] = useState("");

  const [category, setCategory] = useState("");

  const [color, setColor] = useState("");

  const [season, setSeason] = useState("");

  const [originalImage, setOriginalImage] = useState("");

  const [imageFile, setImageFile] = useState(null);

  const [imagePreview, setImagePreview] = useState("");

  const [imageError, setImageError] = useState("");

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [submitError, setSubmitError] = useState("");

  const isFormValid = name.trim().length > 0 && category && color && season;

  useEffect(() => {
    let ignore = false;

    async function loadClothing() {
      setLoading(true);

      setLoadError(false);

      try {
        const data = await getClothing(clothingId);

        if (ignore) {
          return;
        }

        setClothing(data);

        setName(data.name ?? "");

        setCategory(data.categoryLabel ?? data.category ?? "");

        setColor(data.color ?? "");

        setSeason(data.season ?? "");

        setOriginalImage(data.image ?? "");

        setImagePreview(data.image ?? "");
      } catch (error) {
        console.error("수정할 옷을 불러오지 못했습니다.", error);

        if (!ignore) {
          setClothing(null);

          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadClothing();

    return () => {
      ignore = true;
    };
  }, [clothingId]);

  useEffect(() => {
    return () => {
      if (
        imagePreview &&
        imagePreview !== originalImage &&
        imagePreview.startsWith("blob:")
      ) {
        URL.revokeObjectURL(imagePreview);
      }
    };
  }, [imagePreview, originalImage]);

  const handleImageChange = (event) => {
    const file = event.target.files?.[0];

    if (!file) {
      return;
    }

    setImageError("");

    if (!ALLOWED_IMAGE_TYPES.includes(file.type)) {
      setImageError("JPG, PNG, WEBP 이미지만 등록할 수 있어요.");

      event.target.value = "";

      return;
    }

    if (file.size > MAX_IMAGE_SIZE) {
      setImageError("이미지는 5MB 이하로 등록해주세요.");

      event.target.value = "";

      return;
    }

    if (
      imagePreview &&
      imagePreview !== originalImage &&
      imagePreview.startsWith("blob:")
    ) {
      URL.revokeObjectURL(imagePreview);
    }

    const previewUrl = URL.createObjectURL(file);

    setImageFile(file);

    setImagePreview(previewUrl);
  };

  /*
   * 새로 선택한 이미지만 취소할 수 있다.
   *
   * 서버에 저장된 기존 이미지 삭제 API는
   * 아직 없기 때문에 실제 기존 이미지를
   * 삭제하는 기능은 제공하지 않는다.
   */
  const handleCancelNewImage = () => {
    if (imagePreview?.startsWith("blob:")) {
      URL.revokeObjectURL(imagePreview);
    }

    setImageFile(null);

    setImagePreview(originalImage);

    setImageError("");

    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || submitting) {
      return;
    }

    setSubmitting(true);

    setSubmitError("");

    try {
      /*
       * 1. 기본 정보 수정
       */
      await updateClothing(clothingId, {
        name: name.trim(),

        category,

        color,

        season,
      });

      /*
       * 2. 새 이미지가 선택된 경우에만 업로드
       */
      if (imageFile) {
        await uploadClothingImage(clothingId, imageFile);
      }

      /*
       * 3. 실제 상세 페이지로 이동
       */
      navigate(`/clothes/${clothingId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("옷 수정에 실패했습니다.", error);

      setSubmitError("변경사항을 저장하지 못했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
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

          <h1>옷 수정</h1>

          <span />
        </header>

        <div className="clothes-edit-not-found">
          <h2>옷 정보를 불러오고 있어요.</h2>

          <p>잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (loadError || !clothing) {
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

          <h1>옷 수정</h1>

          <span />
        </header>

        <div className="clothes-edit-not-found">
          <h2>옷을 찾을 수 없어요.</h2>

          <p>삭제되었거나 존재하지 않는 옷이에요.</p>

          <button type="button" onClick={() => navigate("/closet")}>
            옷장으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="clothes-edit-page">
      <header className="clothes-edit-header">
        <button
          type="button"
          className="clothes-edit-header__back"
          disabled={submitting}
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>옷 수정</h1>

        <button
          type="submit"
          form="clothes-edit-form"
          className="clothes-edit-header__complete"
          disabled={!isFormValid || submitting}
        >
          {submitting ? "저장 중" : "저장"}
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
            <span>사진</span>

            <span className="clothes-edit-section__optional">선택</span>
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
              <img src={imagePreview} alt={`${name || "옷"} 미리보기`} />

              <div className="clothes-edit-photo__overlay">
                <button
                  type="button"
                  disabled={submitting}
                  onClick={() => fileInputRef.current?.click()}
                >
                  사진 변경
                </button>

                {imageFile && (
                  <button
                    type="button"
                    disabled={submitting}
                    onClick={handleCancelNewImage}
                  >
                    변경 취소
                  </button>
                )}
              </div>
            </div>
          ) : (
            <button
              type="button"
              className="clothes-edit-photo"
              disabled={submitting}
              onClick={() => fileInputRef.current?.click()}
            >
              <span className="clothes-edit-photo__icon">
                <CameraIcon />
              </span>

              <strong>옷 사진 추가</strong>

              <span>사진을 추가하면 옷장에서 더 쉽게 확인할 수 있어요.</span>
            </button>
          )}

          {imageError && (
            <p className="clothes-edit-photo__error">{imageError}</p>
          )}
        </section>

        {/* Basic Information */}

        <section className="clothes-edit-section">
          <div className="clothes-edit-section__heading">
            <span>기본 정보</span>
          </div>

          <div className="clothes-edit-fields">
            <label className="clothes-edit-field">
              <span className="clothes-edit-field__label">
                이름
                <em>*</em>
              </span>

              <input
                type="text"
                value={name}
                maxLength={100}
                disabled={submitting}
                onChange={(event) => setName(event.target.value)}
                placeholder="예: 화이트 코튼 셔츠"
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
              <em>*</em>
            </span>
          </div>

          <div className="clothes-edit-options">
            {categories.map((item) => (
              <button
                key={item}
                type="button"
                disabled={submitting}
                className={[
                  "clothes-edit-option",

                  category === item ? "clothes-edit-option--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setCategory(item)}
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
              <em>*</em>
            </span>
          </div>

          <div className="clothes-edit-color-list">
            {colors.map((item) => (
              <button
                key={item}
                type="button"
                disabled={submitting}
                className={[
                  "clothes-edit-color",

                  color === item ? "clothes-edit-color--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setColor(item)}
                aria-pressed={color === item}
              >
                <span
                  className={`clothes-edit-color__swatch clothes-edit-color__swatch--${item}`}
                  aria-hidden="true"
                />

                <span>{item}</span>
              </button>
            ))}
          </div>
        </section>

        {/* Season */}

        <section className="clothes-edit-section">
          <div className="clothes-edit-section__heading">
            <span>
              계절
              <em>*</em>
            </span>
          </div>

          <div className="clothes-edit-options clothes-edit-options--season">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                disabled={submitting}
                className={[
                  "clothes-edit-option",

                  season === item ? "clothes-edit-option--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSeason(item)}
                aria-pressed={season === item}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="clothes-edit-summary">
          <span>현재 선택</span>

          <strong>{[category, color, season].filter(Boolean).join(" ")}</strong>
        </section>

        {submitError && (
          <p
            style={{
              padding: "0 20px",
              color: "#d34d55",
              fontSize: "11px",
              lineHeight: 1.5,
            }}
          >
            {submitError}
          </p>
        )}

        <div className="clothes-edit-action">
          <button
            type="submit"
            className="clothes-edit-action__button"
            disabled={!isFormValid || submitting}
          >
            {submitting
              ? imageFile
                ? "정보와 사진 저장 중..."
                : "변경사항 저장 중..."
              : "변경사항 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default ClothesEditPage;
