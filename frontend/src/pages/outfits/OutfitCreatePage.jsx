import { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import { getClothes } from "@/api/clothingApi";

import {
  addClothingToCoordination,
  createCoordination,
} from "@/api/coordinationApi";

import "./OutfitCreatePage.css";

const occasions = ["일상", "출근", "학교", "데이트", "운동", "여행"];

const seasons = ["봄", "여름", "가을", "겨울"];

const categories = [
  "전체",
  "상의",
  "하의",
  "아우터",
  "원피스",
  "신발",
  "가방",
  "액세서리",
];

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

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 7" />
    </svg>
  );
}

function CloseIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      aria-hidden="true"
    >
      <path d="M6 6l12 12M18 6 6 18" />
    </svg>
  );
}

function OutfitCreatePage() {
  const navigate = useNavigate();

  const location = useLocation();

  const initialSelectedClothingIds = Array.isArray(
    location.state?.selectedClothingIds,
  )
    ? location.state.selectedClothingIds
    : [];

  const [clothes, setClothes] = useState([]);

  const [wardrobeLoading, setWardrobeLoading] = useState(true);

  const [name, setName] = useState(location.state?.suggestedName ?? "");

  const [occasion, setOccasion] = useState("");

  const [season, setSeason] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedClothingIds, setSelectedClothingIds] = useState(
    initialSelectedClothingIds,
  );

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadWardrobe() {
      setWardrobeLoading(true);

      try {
        const page = await getClothes({
          page: 0,
          size: 100,
          sort: "createdAt,desc",
        });

        if (!ignore) {
          setClothes(page.content ?? []);
        }
      } catch (error) {
        console.error("내 옷장을 불러오지 못했습니다.", error);

        if (!ignore) {
          setClothes([]);
        }
      } finally {
        if (!ignore) {
          setWardrobeLoading(false);
        }
      }
    }

    loadWardrobe();

    return () => {
      ignore = true;
    };
  }, []);

  const filteredClothes = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    return clothes.filter((item) => {
      const matchesCategory =
        selectedCategory === "전체" || item.categoryLabel === selectedCategory;

      const matchesSearch =
        keyword.length === 0 ||
        [item.name, item.color, item.season, item.categoryLabel]
          .filter(Boolean)
          .join(" ")
          .toLowerCase()
          .includes(keyword);

      return matchesCategory && matchesSearch;
    });
  }, [clothes, searchTerm, selectedCategory]);

  const selectedClothes = selectedClothingIds
    .map((id) => clothes.find((item) => String(item.id) === String(id)))
    .filter(Boolean);

  const isFormValid =
    name.trim().length > 0 &&
    occasion &&
    season &&
    selectedClothingIds.length > 0;

  const toggleClothing = (clothingId) => {
    setSelectedClothingIds((currentIds) => {
      const exists = currentIds.some((id) => String(id) === String(clothingId));

      return exists
        ? currentIds.filter((id) => String(id) !== String(clothingId))
        : [...currentIds, clothingId];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || submitting) {
      return;
    }

    setSubmitting(true);

    let created = null;

    try {
      created = await createCoordination({
        name: name.trim(),

        description: "",

        occasion,

        season,
      });

      /*
       * 생성된 Coordination에
       * 선택한 실제 Clothing을 연결.
       */
      for (const clothingId of selectedClothingIds) {
        await addClothingToCoordination(created.id, clothingId);
      }

      navigate(`/outfits/${created.id}`, {
        replace: true,
      });
    } catch (error) {
      console.error("코디 저장에 실패했습니다.", error);

      window.alert(
        created
          ? "코디는 생성됐지만 일부 옷을 연결하지 못했어요."
          : "코디를 저장하지 못했어요.",
      );
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="outfit-create-page">
      <header className="outfit-create-header">
        <button
          type="button"
          className="outfit-create-header__back"
          onClick={() => navigate(-1)}
          disabled={submitting}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <h1>코디 만들기</h1>

        <button
          type="submit"
          form="outfit-create-form"
          className="outfit-create-header__complete"
          disabled={!isFormValid || submitting}
        >
          {submitting ? "저장 중" : "완료"}
        </button>
      </header>

      <form
        id="outfit-create-form"
        className="outfit-create-form"
        onSubmit={handleSubmit}
      >
        <section className="outfit-create-section">
          <div className="outfit-create-section__heading">
            <span>
              코디 이름
              <em>*</em>
            </span>
          </div>

          <label className="outfit-create-name">
            <input
              type="text"
              value={name}
              disabled={submitting}
              onChange={(event) => setName(event.target.value)}
              placeholder="예: 여름 출근 룩"
              maxLength={30}
            />

            <span>
              {name.length}
              /30
            </span>
          </label>
        </section>

        <section className="outfit-create-section">
          <div className="outfit-create-section__heading">
            <span>
              상황
              <em>*</em>
            </span>
          </div>

          <div className="outfit-create-options">
            {occasions.map((item) => (
              <button
                key={item}
                type="button"
                disabled={submitting}
                className={[
                  "outfit-create-option",

                  occasion === item ? "outfit-create-option--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setOccasion(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="outfit-create-section">
          <div className="outfit-create-section__heading">
            <span>
              계절
              <em>*</em>
            </span>
          </div>

          <div className="outfit-create-season">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                disabled={submitting}
                className={[
                  "outfit-create-season__item",

                  season === item ? "outfit-create-season__item--active" : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSeason(item)}
              >
                {item}
              </button>
            ))}
          </div>
        </section>

        <section className="outfit-create-selected-section">
          <div className="outfit-create-selected-heading">
            <div>
              <h2>선택한 옷</h2>

              <span>{selectedClothingIds.length}개</span>
            </div>

            {selectedClothingIds.length > 0 && (
              <button
                type="button"
                disabled={submitting}
                onClick={() => setSelectedClothingIds([])}
              >
                전체 해제
              </button>
            )}
          </div>

          {selectedClothes.length > 0 ? (
            <div className="outfit-create-selected-list">
              {selectedClothes.map((item) => (
                <div key={item.id} className="outfit-create-selected-item">
                  <div className="outfit-create-selected-item__image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>이미지 없음</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="outfit-create-selected-item__remove"
                    onClick={() => toggleClothing(item.id)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="outfit-create-selected-empty">
              <p>아래 옷장에서 코디에 사용할 옷을 선택해주세요.</p>
            </div>
          )}
        </section>

        <section className="outfit-create-wardrobe">
          <div className="outfit-create-wardrobe__heading">
            <div>
              <span className="outfit-create-wardrobe__eyebrow">WARDROBE</span>

              <h2>내 옷장에서 고르기</h2>
            </div>

            <span>{wardrobeLoading ? "..." : `${clothes.length}벌`}</span>
          </div>

          <div className="outfit-create-search">
            <SearchIcon />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="옷 이름이나 색상 검색"
            />

            {searchTerm && (
              <button
                type="button"
                className="outfit-create-search__clear"
                onClick={() => setSearchTerm("")}
              >
                ×
              </button>
            )}
          </div>

          <nav className="outfit-create-categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={[
                  "outfit-create-category",

                  selectedCategory === category
                    ? "outfit-create-category--active"
                    : "",
                ]
                  .filter(Boolean)
                  .join(" ")}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </button>
            ))}
          </nav>

          {wardrobeLoading ? (
            <div className="outfit-create-empty">
              <p>옷장을 불러오고 있어요.</p>
            </div>
          ) : filteredClothes.length > 0 ? (
            <div className="outfit-create-grid">
              {filteredClothes.map((item) => {
                const selected = selectedClothingIds.some(
                  (id) => String(id) === String(item.id),
                );

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      "outfit-create-clothing",

                      selected ? "outfit-create-clothing--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => toggleClothing(item.id)}
                  >
                    <div className="outfit-create-clothing__image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="outfit-create-clothing__empty">
                          이미지 없음
                        </div>
                      )}

                      <span className="outfit-create-clothing__check">
                        {selected && <CheckIcon />}
                      </span>
                    </div>

                    <div className="outfit-create-clothing__info">
                      <strong>{item.name}</strong>

                      <span>
                        {[item.categoryLabel, item.color]
                          .filter(Boolean)
                          .join(" · ")}
                      </span>
                    </div>
                  </button>
                );
              })}
            </div>
          ) : (
            <div className="outfit-create-empty">
              <p>조건에 맞는 옷이 없어요.</p>
            </div>
          )}
        </section>

        <div className="outfit-create-action">
          <div className="outfit-create-action__summary">
            <strong>{selectedClothingIds.length}</strong>

            <span>개 선택</span>
          </div>

          <button
            type="submit"
            className="outfit-create-action__button"
            disabled={!isFormValid || submitting}
          >
            {submitting ? "저장 중..." : "코디 저장하기"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OutfitCreatePage;
