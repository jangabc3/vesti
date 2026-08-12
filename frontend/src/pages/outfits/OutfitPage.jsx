import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getCoordination, getCoordinations } from "@/api/coordinationApi";

import "./OutfitPage.css";

const occasions = ["전체", "일상", "출근", "학교", "데이트", "운동", "여행"];

const seasons = ["전체", "봄", "여름", "가을", "겨울"];

function SearchIcon() {
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
      <circle cx="11" cy="11" r="6.5" />

      <path d="m16 16 4 4" />
    </svg>
  );
}

function PlusIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M12 5v14M5 12h14" />
    </svg>
  );
}

function OutfitImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item?.image || failed) {
    return (
      <div className="outfit-card__empty-image">
        <span>이미지 없음</span>
      </div>
    );
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

function OutfitPreview({ outfit }) {
  const outfitClothes = Array.isArray(outfit.clothes)
    ? outfit.clothes.slice(0, 4)
    : [];

  if (outfitClothes.length === 0) {
    return (
      <div className="outfit-card__empty-image">
        <span>등록된 옷 없음</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "outfit-card__visual",
        `outfit-card__visual--${Math.min(outfitClothes.length, 4)}`,
      ].join(" ")}
    >
      {outfitClothes.map((item) => (
        <div key={item.id} className="outfit-card__visual-item">
          <OutfitImage item={item} />
        </div>
      ))}
    </div>
  );
}

function OutfitPage() {
  const navigate = useNavigate();

  const [outfits, setOutfits] = useState([]);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedOccasion, setSelectedOccasion] = useState("전체");

  const [selectedSeason, setSelectedSeason] = useState("전체");

  useEffect(() => {
    let ignore = false;

    async function loadOutfits() {
      setLoading(true);

      setLoadError(false);

      try {
        const basicOutfits = await getCoordinations();

        /*
         * 목록 응답에는 clothes가 없으므로
         * 각 코디 상세를 조회해서 미리보기에
         * 필요한 실제 옷 데이터를 가져온다.
         */
        const results = await Promise.allSettled(
          basicOutfits.map((outfit) => getCoordination(outfit.id)),
        );

        if (ignore) {
          return;
        }

        const detailed = results.map((result, index) =>
          result.status === "fulfilled" ? result.value : basicOutfits[index],
        );

        setOutfits(detailed.filter(Boolean));
      } catch (error) {
        console.error("코디 목록을 불러오지 못했습니다.", error);

        if (!ignore) {
          setOutfits([]);

          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadOutfits();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredOutfits = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return outfits.filter((outfit) => {
      const matchesSearch =
        keyword.length === 0 ||
        [outfit.name, outfit.description, outfit.occasion, outfit.season]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      const matchesOccasion =
        selectedOccasion === "전체" || outfit.occasion === selectedOccasion;

      const matchesSeason =
        selectedSeason === "전체" || outfit.season === selectedSeason;

      return matchesSearch && matchesOccasion && matchesSeason;
    });
  }, [outfits, searchTerm, selectedOccasion, selectedSeason]);

  const resetFilters = () => {
    setSearchTerm("");

    setSelectedOccasion("전체");

    setSelectedSeason("전체");
  };

  return (
    <div className="outfits-page">
      <header className="outfits-header">
        <div className="outfits-header__content">
          <span className="outfits-header__eyebrow">OUTFITS</span>

          <h1>코디</h1>

          <p>저장한 코디 {loading ? "..." : `${outfits.length}개`}</p>
        </div>

        <button
          type="button"
          className="outfits-header__add"
          onClick={() => navigate("/outfits/new")}
          aria-label="코디 만들기"
        >
          <PlusIcon />
        </button>
      </header>

      <div className="outfits-search">
        <SearchIcon />

        <input
          type="search"
          value={searchTerm}
          onChange={(event) => setSearchTerm(event.target.value)}
          placeholder="코디 이름 검색"
          aria-label="코디 검색"
        />

        {searchTerm && (
          <button
            type="button"
            className="outfits-search__clear"
            onClick={() => setSearchTerm("")}
            aria-label="검색어 지우기"
          >
            ×
          </button>
        )}
      </div>

      <section className="outfits-filter-section">
        <span className="outfits-filter-section__label">상황</span>

        <div className="outfits-filter-scroll">
          {occasions.map((occasion) => (
            <button
              key={occasion}
              type="button"
              className={[
                "outfits-filter",

                selectedOccasion === occasion ? "outfits-filter--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedOccasion(occasion)}
            >
              {occasion}
            </button>
          ))}
        </div>
      </section>

      <section className="outfits-season-section">
        <div className="outfits-season">
          {seasons.map((season) => (
            <button
              key={season}
              type="button"
              className={[
                "outfits-season__item",

                selectedSeason === season ? "outfits-season__item--active" : "",
              ]
                .filter(Boolean)
                .join(" ")}
              onClick={() => setSelectedSeason(season)}
            >
              {season}
            </button>
          ))}
        </div>
      </section>

      <div className="outfits-result-header">
        <div className="outfits-result-header__count">
          <strong>모든 코디</strong>

          <span>{filteredOutfits.length}</span>
        </div>
      </div>

      {loading ? (
        <div className="outfits-empty">
          <h2>코디를 불러오고 있어요.</h2>

          <p>저장한 코디를 확인하는 중입니다.</p>
        </div>
      ) : loadError ? (
        <div className="outfits-empty">
          <h2>코디를 불러오지 못했어요.</h2>

          <p>서버와 로그인 상태를 확인해주세요.</p>
        </div>
      ) : filteredOutfits.length > 0 ? (
        <div className="outfits-grid">
          {filteredOutfits.map((outfit) => {
            const clothesCount = Array.isArray(outfit.clothes)
              ? outfit.clothes.length
              : 0;

            return (
              <article
                key={outfit.id}
                className="outfit-card"
                onClick={() => navigate(`/outfits/${outfit.id}`)}
              >
                <div className="outfit-card__image">
                  <OutfitPreview outfit={outfit} />
                </div>

                <div className="outfit-card__info">
                  <h2>{outfit.name}</h2>

                  <p>
                    {[outfit.occasion, outfit.season]
                      .filter(Boolean)
                      .join(" · ")}
                  </p>

                  <span>옷 {clothesCount}개</span>
                </div>
              </article>
            );
          })}
        </div>
      ) : (
        <div className="outfits-empty">
          <div className="outfits-empty__icon">
            <PlusIcon />
          </div>

          <h2>
            {outfits.length === 0
              ? "아직 저장한 코디가 없어요."
              : "조건에 맞는 코디가 없어요."}
          </h2>

          <p>
            {outfits.length === 0
              ? "내 옷으로 첫 번째 코디를 만들어보세요."
              : "다른 조건으로 찾아보세요."}
          </p>

          {outfits.length === 0 ? (
            <button type="button" onClick={() => navigate("/outfits/new")}>
              코디 만들기
            </button>
          ) : (
            <button type="button" onClick={resetFilters}>
              필터 초기화
            </button>
          )}
        </div>
      )}
    </div>
  );
}

export default OutfitPage;
