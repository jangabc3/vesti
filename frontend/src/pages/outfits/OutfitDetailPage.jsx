import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { deleteCoordination, getCoordination } from "@/api/coordinationApi";

import "./OutfitDetailPage.css";

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

function OutfitImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item?.image || failed) {
    return <div className="outfit-detail-clothing__empty">이미지 없음</div>;
  }

  return (
    <img
      src={item.image}
      alt={item.name}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function OutfitHero({ outfitClothes }) {
  if (outfitClothes.length === 0) {
    return (
      <div className="outfit-detail-hero__empty">
        <span>아직 등록된 옷이 없어요.</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "outfit-detail-hero__visual",

        `outfit-detail-hero__visual--${Math.min(outfitClothes.length, 4)}`,
      ].join(" ")}
    >
      {outfitClothes.slice(0, 4).map((item) => (
        <div key={item.id} className="outfit-detail-hero__item">
          <OutfitImage item={item} />
        </div>
      ))}
    </div>
  );
}

function DetailRow({ label, value }) {
  return (
    <div className="outfit-detail-row">
      <span className="outfit-detail-row__label">{label}</span>

      <span className="outfit-detail-row__value">{value || "정보 없음"}</span>
    </div>
  );
}

function OutfitDetailPage() {
  const navigate = useNavigate();

  const params = useParams();

  const outfitId = params.outfitId ?? params.id ?? params.coordinationId;

  const [outfit, setOutfit] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [deleting, setDeleting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadOutfit() {
      setLoading(true);

      setLoadError(false);

      try {
        const data = await getCoordination(outfitId);

        if (!ignore) {
          setOutfit(data);
        }
      } catch (error) {
        console.error("코디 상세를 불러오지 못했습니다.", error);

        if (!ignore) {
          setOutfit(null);

          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOutfit();

    return () => {
      ignore = true;
    };
  }, [outfitId]);

  const handleDelete = async () => {
    if (deleting) {
      return;
    }

    const confirmed = window.confirm("이 코디를 삭제하시겠습니까?");

    if (!confirmed) {
      return;
    }

    setDeleting(true);

    try {
      await deleteCoordination(outfitId);

      navigate("/outfits", {
        replace: true,
      });
    } catch (error) {
      console.error("코디 삭제에 실패했습니다.", error);

      window.alert("코디를 삭제하지 못했어요.");
    } finally {
      setDeleting(false);
    }
  };

  if (loading) {
    return (
      <div className="outfit-detail-page">
        <div className="outfit-detail-not-found">
          <h2>코디를 불러오고 있어요.</h2>
        </div>
      </div>
    );
  }

  if (loadError || !outfit) {
    return (
      <div className="outfit-detail-page">
        <div className="outfit-detail-not-found">
          <h2>코디를 찾을 수 없어요.</h2>

          <p>삭제되었거나 존재하지 않는 코디예요.</p>

          <button type="button" onClick={() => navigate("/outfits")}>
            코디 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  const outfitClothes = Array.isArray(outfit.clothes) ? outfit.clothes : [];

  return (
    <div className="outfit-detail-page">
      <header className="outfit-detail-header">
        <button
          type="button"
          className="outfit-detail-header__back"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>코디 상세</h1>

        <span className="outfit-detail-header__spacer" />
      </header>

      <section className="outfit-detail-hero">
        <OutfitHero outfitClothes={outfitClothes} />
      </section>

      <section className="outfit-detail-main">
        <span className="outfit-detail-main__eyebrow">OUTFIT</span>

        <h2>{outfit.name}</h2>

        <p>{[outfit.occasion, outfit.season].filter(Boolean).join(" · ")}</p>

        {outfit.description && <p>{outfit.description}</p>}
      </section>

      <section className="outfit-detail-section">
        <h3>코디 정보</h3>

        <div className="outfit-detail-info">
          <DetailRow label="상황" value={outfit.occasion} />

          <DetailRow label="계절" value={outfit.season} />

          <DetailRow label="구성" value={`옷 ${outfitClothes.length}개`} />
        </div>
      </section>

      <section className="outfit-detail-section outfit-detail-clothes-section">
        <div className="outfit-detail-section__heading">
          <div>
            <h3>구성한 옷</h3>

            <span>{outfitClothes.length}개</span>
          </div>
        </div>

        {outfitClothes.length > 0 ? (
          <div className="outfit-detail-clothes">
            {outfitClothes.map((item) => (
              <button
                key={item.id}
                type="button"
                className="outfit-detail-clothing"
                onClick={() => navigate(`/clothes/${item.id}`)}
              >
                <div className="outfit-detail-clothing__image">
                  <OutfitImage item={item} />
                </div>

                <div className="outfit-detail-clothing__info">
                  <strong>{item.name}</strong>

                  <span>
                    {[item.category, item.color].filter(Boolean).join(" · ")}
                  </span>
                </div>
              </button>
            ))}
          </div>
        ) : (
          <div className="outfit-detail-clothes-empty">
            <p>이 코디에 등록된 옷이 없어요.</p>
          </div>
        )}
      </section>

      <section className="outfit-detail-section">
        <button
          type="button"
          className="outfit-detail-link"
          onClick={() => navigate("/outfits")}
        >
          <div>
            <strong>내 코디</strong>

            <span>저장한 다른 코디 둘러보기</span>
          </div>

          <ChevronIcon />
        </button>
      </section>

      <section className="outfit-detail-danger">
        <button type="button" disabled={deleting} onClick={handleDelete}>
          {deleting ? "삭제 중..." : "코디 삭제하기"}
        </button>
      </section>

      <div className="outfit-detail-action">
        <button
          type="button"
          className="outfit-detail-action__button"
          disabled={deleting}
          onClick={() => navigate(`/outfits/${outfitId}/edit`)}
        >
          수정하기
        </button>
      </div>
    </div>
  );
}

export default OutfitDetailPage;
