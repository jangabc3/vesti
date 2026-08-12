import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getClothes } from "@/api/clothingApi";

import {
  addClothingToCoordination,
  getCoordination,
  removeClothingFromCoordination,
  updateCoordination,
} from "@/api/coordinationApi";

import "./OutfitEditPage.css";

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

function OutfitEditPage() {
  const navigate = useNavigate();

  const params = useParams();

  const outfitId = params.outfitId ?? params.id ?? params.coordinationId;

  const [outfit, setOutfit] = useState(null);

  const [clothes, setClothes] = useState([]);

  const [originalIds, setOriginalIds] = useState([]);

  const [selectedClothingIds, setSelectedClothingIds] = useState([]);

  const [name, setName] = useState("");

  const [occasion, setOccasion] = useState("");

  const [season, setSeason] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("전체");

  const [searchTerm, setSearchTerm] = useState("");

  const [loading, setLoading] = useState(true);

  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadData() {
      setLoading(true);

      try {
        const [outfitData, clothesPage] = await Promise.all([
          getCoordination(outfitId),

          getClothes({
            page: 0,
            size: 100,
            sort: "createdAt,desc",
          }),
        ]);

        if (ignore) {
          return;
        }

        const ids = (outfitData.clothes ?? []).map((item) => item.id);

        setOutfit(outfitData);

        setClothes(clothesPage.content ?? []);

        setName(outfitData.name ?? "");

        setOccasion(outfitData.occasion ?? "");

        setSeason(outfitData.season ?? "");

        setOriginalIds(ids);

        setSelectedClothingIds(ids);
      } catch (error) {
        console.error("코디 수정 정보를 불러오지 못했습니다.", error);

        if (!ignore) {
          setOutfit(null);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadData();

    return () => {
      ignore = true;
    };
  }, [outfitId]);

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
    setSelectedClothingIds((current) => {
      const exists = current.some((id) => String(id) === String(clothingId));

      return exists
        ? current.filter((id) => String(id) !== String(clothingId))
        : [...current, clothingId];
    });
  };

  const handleSubmit = async (event) => {
    event.preventDefault();

    if (!isFormValid || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      await updateCoordination(outfitId, {
        name: name.trim(),

        description: outfit.description ?? "",

        occasion,

        season,
      });

      const addedIds = selectedClothingIds.filter(
        (id) =>
          !originalIds.some((originalId) => String(originalId) === String(id)),
      );

      const removedIds = originalIds.filter(
        (id) =>
          !selectedClothingIds.some(
            (selectedId) => String(selectedId) === String(id),
          ),
      );

      for (const clothingId of addedIds) {
        await addClothingToCoordination(outfitId, clothingId);
      }

      for (const clothingId of removedIds) {
        await removeClothingFromCoordination(outfitId, clothingId);
      }

      navigate(`/outfits/${outfitId}`, {
        replace: true,
      });
    } catch (error) {
      console.error("코디 수정에 실패했습니다.", error);

      window.alert("변경사항을 저장하지 못했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  if (loading) {
    return (
      <div className="outfit-edit-page">
        <div className="outfit-edit-not-found">
          <h2>코디를 불러오고 있어요.</h2>
        </div>
      </div>
    );
  }

  if (!outfit) {
    return (
      <div className="outfit-edit-page">
        <div className="outfit-edit-not-found">
          <h2>코디를 찾을 수 없어요.</h2>

          <button type="button" onClick={() => navigate("/outfits")}>
            코디 목록으로 돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="outfit-edit-page">
      <header className="outfit-edit-header">
        <button
          type="button"
          className="outfit-edit-header__back"
          onClick={() => navigate(-1)}
          disabled={submitting}
        >
          <BackIcon />
        </button>

        <h1>코디 수정</h1>

        <button
          type="submit"
          form="outfit-edit-form"
          className="outfit-edit-header__complete"
          disabled={!isFormValid || submitting}
        >
          {submitting ? "저장 중" : "저장"}
        </button>
      </header>

      <form
        id="outfit-edit-form"
        className="outfit-edit-form"
        onSubmit={handleSubmit}
      >
        <section className="outfit-edit-section">
          <div className="outfit-edit-section__heading">
            <span>
              코디 이름
              <em>*</em>
            </span>
          </div>

          <label className="outfit-edit-name">
            <input
              type="text"
              value={name}
              maxLength={30}
              onChange={(event) => setName(event.target.value)}
            />

            <span>
              {name.length}
              /30
            </span>
          </label>
        </section>

        <section className="outfit-edit-section">
          <div className="outfit-edit-section__heading">
            <span>
              상황
              <em>*</em>
            </span>
          </div>

          <div className="outfit-edit-options">
            {occasions.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  "outfit-edit-option",

                  occasion === item ? "outfit-edit-option--active" : "",
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

        <section className="outfit-edit-section">
          <div className="outfit-edit-section__heading">
            <span>
              계절
              <em>*</em>
            </span>
          </div>

          <div className="outfit-edit-season">
            {seasons.map((item) => (
              <button
                key={item}
                type="button"
                className={[
                  "outfit-edit-season__item",

                  season === item ? "outfit-edit-season__item--active" : "",
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

        <section className="outfit-edit-selected-section">
          <div className="outfit-edit-selected-heading">
            <div>
              <h2>선택한 옷</h2>

              <span>{selectedClothingIds.length}개</span>
            </div>
          </div>

          {selectedClothes.length > 0 ? (
            <div className="outfit-edit-selected-list">
              {selectedClothes.map((item) => (
                <div key={item.id} className="outfit-edit-selected-item">
                  <div className="outfit-edit-selected-item__image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} />
                    ) : (
                      <span>이미지 없음</span>
                    )}
                  </div>

                  <button
                    type="button"
                    className="outfit-edit-selected-item__remove"
                    onClick={() => toggleClothing(item.id)}
                  >
                    <CloseIcon />
                  </button>
                </div>
              ))}
            </div>
          ) : (
            <div className="outfit-edit-selected-empty">
              <p>코디에 사용할 옷을 선택해주세요.</p>
            </div>
          )}
        </section>

        <section className="outfit-edit-wardrobe">
          <div className="outfit-edit-wardrobe__heading">
            <div>
              <span className="outfit-edit-wardrobe__eyebrow">WARDROBE</span>

              <h2>구성한 옷 변경하기</h2>
            </div>

            <span>{clothes.length}벌</span>
          </div>

          <div className="outfit-edit-search">
            <SearchIcon />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="옷 이름이나 색상 검색"
            />
          </div>

          <nav className="outfit-edit-categories">
            {categories.map((category) => (
              <button
                key={category}
                type="button"
                className={[
                  "outfit-edit-category",

                  selectedCategory === category
                    ? "outfit-edit-category--active"
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

          {filteredClothes.length > 0 ? (
            <div className="outfit-edit-grid">
              {filteredClothes.map((item) => {
                const selected = selectedClothingIds.some(
                  (id) => String(id) === String(item.id),
                );

                return (
                  <button
                    key={item.id}
                    type="button"
                    className={[
                      "outfit-edit-clothing",

                      selected ? "outfit-edit-clothing--selected" : "",
                    ]
                      .filter(Boolean)
                      .join(" ")}
                    onClick={() => toggleClothing(item.id)}
                  >
                    <div className="outfit-edit-clothing__image">
                      {item.image ? (
                        <img src={item.image} alt={item.name} />
                      ) : (
                        <div className="outfit-edit-clothing__empty">
                          이미지 없음
                        </div>
                      )}

                      <span className="outfit-edit-clothing__check">
                        {selected && <CheckIcon />}
                      </span>
                    </div>

                    <div className="outfit-edit-clothing__info">
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
            <div className="outfit-edit-empty">
              <p>조건에 맞는 옷이 없어요.</p>
            </div>
          )}
        </section>

        <div className="outfit-edit-action">
          <div className="outfit-edit-action__summary">
            <strong>{selectedClothingIds.length}</strong>

            <span>개 선택</span>
          </div>

          <button
            type="submit"
            className="outfit-edit-action__button"
            disabled={!isFormValid || submitting}
          >
            {submitting ? "저장 중..." : "변경사항 저장"}
          </button>
        </div>
      </form>
    </div>
  );
}

export default OutfitEditPage;
