import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { deleteClothing, getClothing } from "@/api/clothingApi";

import "./ClothesDetailPage.css";

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
  );
}

function ImagePlaceholderIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <rect x="7" y="9" width="34" height="30" rx="4" />

      <circle cx="18" cy="19" r="3" />

      <path d="m11 34 8-8 6 6 5-5 7 7" />
    </svg>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="clothes-detail-row">
      <span className="clothes-detail-row__label">{label}</span>

      <span className="clothes-detail-row__value">{value || "정보 없음"}</span>
    </div>
  );
}

function ClothesDetailPage() {
  const navigate = useNavigate();

  const params = useParams();

  const clothingId = params.id ?? params.clothesId ?? params.clothingId;

  const [clothing, setClothing] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [imageFailed, setImageFailed] = useState(false);

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

        setImageFailed(false);
      } catch (error) {
        console.error("옷 상세 정보를 불러오지 못했습니다.", error);

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

  const handleEdit = () => {
    navigate(`/clothes/${clothingId}/edit`);
  };

  const handleDelete = async () => {
    if (deleting) {
      return;
    }

    const confirmed = window.confirm("이 옷을 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await deleteClothing(clothingId);

      navigate("/closet", {
        replace: true,
      });
    } catch (error) {
      console.error("옷 삭제에 실패했습니다.", error);

      window.alert("옷을 삭제하지 못했어요.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="clothes-detail-page">
        <header className="clothes-detail-header">
          <button
            type="button"
            className="clothes-detail-header__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
          >
            <BackIcon />
          </button>

          <h1>옷 상세</h1>

          <span className="clothes-detail-header__spacer" />
        </header>

        <div className="clothes-detail-not-found">
          <h2>옷 정보를 불러오고 있어요.</h2>

          <p>잠시만 기다려주세요.</p>
        </div>
      </div>
    );
  }

  if (loadError || !clothing) {
    return (
      <div className="clothes-detail-page">
        <header className="clothes-detail-header">
          <button
            type="button"
            className="clothes-detail-header__back"
            onClick={() => navigate(-1)}
            aria-label="뒤로 가기"
          >
            <BackIcon />
          </button>

          <h1>옷 상세</h1>

          <span className="clothes-detail-header__spacer" />
        </header>

        <div className="clothes-detail-not-found">
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
    <div className="clothes-detail-page">
      <header className="clothes-detail-header">
        <button
          type="button"
          className="clothes-detail-header__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>옷 상세</h1>

        <span className="clothes-detail-header__spacer" aria-hidden="true" />
      </header>

      {/* Hero Image */}

      <section className="clothes-detail-hero">
        {clothing.image && !imageFailed ? (
          <img
            src={clothing.image}
            alt={clothing.name}
            onError={() => setImageFailed(true)}
          />
        ) : (
          <div className="clothes-detail-hero__empty">
            <ImagePlaceholderIcon />

            <span>등록된 사진이 없어요.</span>
          </div>
        )}
      </section>

      {/* Main Information */}

      <section className="clothes-detail-main">
        <div className="clothes-detail-main__category">
          {clothing.categoryLabel}
        </div>

        <h2>{clothing.name}</h2>

        <p className="clothes-detail-main__brand">
          {clothing.color} · {clothing.season}
        </p>
      </section>

      {/* Information */}

      <section className="clothes-detail-section">
        <h3>옷 정보</h3>

        <div className="clothes-detail-info">
          <DetailRow label="카테고리" value={clothing.categoryLabel} />

          <DetailRow label="색상" value={clothing.color} />

          <DetailRow label="계절" value={clothing.season} />
        </div>
      </section>

      {/* Wardrobe */}

      <section className="clothes-detail-section">
        <button
          type="button"
          className="clothes-detail-link"
          onClick={() => navigate("/closet")}
        >
          <div>
            <strong>내 옷장</strong>

            <span>등록한 다른 옷 둘러보기</span>
          </div>

          <ChevronIcon />
        </button>
      </section>

      {/* Delete */}

      <section className="clothes-detail-danger">
        <button type="button" disabled={deleting} onClick={handleDelete}>
          {deleting ? "삭제 중..." : "옷 삭제하기"}
        </button>
      </section>

      {/* Bottom Action */}

      <div className="clothes-detail-action">
        <button
          type="button"
          className="clothes-detail-action__button"
          disabled={deleting}
          onClick={handleEdit}
        >
          수정하기
        </button>
      </div>
    </div>
  );
}

export default ClothesDetailPage;
