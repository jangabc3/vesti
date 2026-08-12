import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMySavedStylePosts } from "@/api/stylePostSaveApi";

import { clothes } from "@/mocks/clothes";

import "./ClosetPage.css";

const closetTabs = [
  {
    id: "pieces",
    label: "Pieces",
  },
  {
    id: "looks",
    label: "Looks",
  },
  {
    id: "saved",
    label: "Saved",
  },
];

const categories = [
  "전체",
  "상의",
  "하의",
  "아우터",
  "신발",
  "가방",
  "액세서리",
];

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

function BookmarkIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="currentColor"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5Z" />
    </svg>
  );
}

function SavedEmptyIcon() {
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
      <path d="M15 9h18a3 3 0 0 1 3 3v27L24 31 12 39V12a3 3 0 0 1 3-3Z" />
    </svg>
  );
}

function ClothesEmptyIcon() {
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
      <path d="M17 13c0-4 2.7-7 7-7s7 3 7 7c0 3-1.4 5-4 6.5" />

      <path d="m24 19-14 10v12h28V29L24 19Z" />
    </svg>
  );
}

function SavedPostImage({ post }) {
  const [failed, setFailed] = useState(false);

  if (!post?.image || failed) {
    return (
      <div className="closet-saved-card__image-empty">
        <span>이미지 준비 중</span>
      </div>
    );
  }

  return (
    <img
      src={post.image}
      alt={post.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function CreatorAvatar({ author }) {
  const [failed, setFailed] = useState(false);

  if (!author?.avatar || failed) {
    const source = author?.displayName || author?.username || "V";

    return (
      <span className="closet-saved-card__avatar-fallback">
        {source.charAt(0).toUpperCase()}
      </span>
    );
  }

  return <img src={author.avatar} alt="" onError={() => setFailed(true)} />;
}

function ClosetPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("pieces");

  const [searchTerm, setSearchTerm] = useState("");

  const [selectedCategory, setSelectedCategory] = useState("전체");

  /*
   * 실제 DB Saved 게시물
   */
  const [savedPosts, setSavedPosts] = useState([]);

  const [savedLoading, setSavedLoading] = useState(false);

  const [savedError, setSavedError] = useState(false);

  const filteredClothes = useMemo(() => {
    const normalizedSearchTerm = searchTerm.trim().toLowerCase();

    return clothes.filter((item) => {
      const matchesCategory =
        selectedCategory === "전체" || item.category === selectedCategory;

      const matchesSearch =
        normalizedSearchTerm.length === 0 ||
        item.name?.toLowerCase().includes(normalizedSearchTerm) ||
        item.brand?.toLowerCase().includes(normalizedSearchTerm) ||
        item.color?.toLowerCase().includes(normalizedSearchTerm);

      return matchesCategory && matchesSearch;
    });
  }, [searchTerm, selectedCategory]);

  async function loadSavedPosts() {
    setSavedLoading(true);

    setSavedError(false);

    try {
      const page = await getMySavedStylePosts({
        page: 0,
        size: 50,
        sort: "createdAt,desc",
      });

      setSavedPosts(page.content ?? []);
    } catch (error) {
      console.error("저장한 스타일을 불러오지 못했습니다.", error);

      setSavedPosts([]);

      setSavedError(true);
    } finally {
      setSavedLoading(false);
    }
  }

  /*
   * Saved 탭에 진입하면
   * 항상 서버의 최신 저장 상태를 다시 가져온다.
   */
  useEffect(() => {
    if (activeTab !== "saved") {
      return;
    }

    loadSavedPosts();
  }, [activeTab]);

  const handleCreateClothing = () => {
    navigate("/clothes/new");
  };

  const handleTabChange = (tabId) => {
    /*
     * Looks는 기존 Outfit
     * 화면을 그대로 사용한다.
     */
    if (tabId === "looks") {
      navigate("/outfits");

      return;
    }

    setActiveTab(tabId);
  };

  const headerDescription =
    activeTab === "saved"
      ? savedLoading
        ? "저장한 스타일 불러오는 중"
        : `저장한 스타일 ${savedPosts.length}개`
      : `내 옷 ${clothes.length}벌`;

  return (
    <div className="closet-page">
      {/* =================================
          Header
      ================================= */}

      <header className="closet-header">
        <div className="closet-header__content">
          <span className="closet-header__eyebrow">WARDROBE</span>

          <h1>옷장</h1>

          <p>{headerDescription}</p>
        </div>

        {activeTab === "pieces" && (
          <button
            type="button"
            className="closet-header__add"
            onClick={handleCreateClothing}
            aria-label="옷 등록"
          >
            <PlusIcon />
          </button>
        )}
      </header>

      {/* =================================
          Main Tabs
      ================================= */}

      <nav className="closet-tabs" aria-label="옷장 메뉴">
        {closetTabs.map((tab) => {
          const active = activeTab === tab.id;

          return (
            <button
              key={tab.id}
              type="button"
              className={
                active ? "closet-tab closet-tab--active" : "closet-tab"
              }
              onClick={() => handleTabChange(tab.id)}
              aria-current={active ? "page" : undefined}
            >
              {tab.label}
            </button>
          );
        })}
      </nav>

      {/* =================================
          PIECES
      ================================= */}

      {activeTab === "pieces" && (
        <>
          <div className="closet-search">
            <SearchIcon />

            <input
              type="search"
              value={searchTerm}
              onChange={(event) => setSearchTerm(event.target.value)}
              placeholder="옷 이름이나 브랜드 검색"
              aria-label="옷 검색"
            />

            {searchTerm && (
              <button
                type="button"
                className="closet-search__clear"
                onClick={() => setSearchTerm("")}
                aria-label="검색어 지우기"
              >
                ×
              </button>
            )}
          </div>

          <nav className="closet-categories" aria-label="옷 카테고리">
            {categories.map((category) => {
              const selected = selectedCategory === category;

              return (
                <button
                  key={category}
                  type="button"
                  className={[
                    "closet-category",

                    selected ? "closet-category--active" : "",
                  ]
                    .filter(Boolean)
                    .join(" ")}
                  onClick={() => setSelectedCategory(category)}
                  aria-pressed={selected}
                >
                  {category}
                </button>
              );
            })}
          </nav>

          <div className="closet-result-header">
            <span>
              {selectedCategory === "전체" ? "모든 옷" : selectedCategory}
            </span>

            <span>{filteredClothes.length}</span>
          </div>

          {filteredClothes.length > 0 ? (
            <div className="closet-grid">
              {filteredClothes.map((item) => (
                <button
                  key={item.id}
                  type="button"
                  className="closet-item"
                  onClick={() => navigate(`/clothes/${item.id}`)}
                  aria-label={`${item.name} 상세 보기`}
                >
                  <div className="closet-item__image">
                    {item.image ? (
                      <img src={item.image} alt={item.name} loading="lazy" />
                    ) : (
                      <div className="closet-item__image-empty">
                        <span>이미지 없음</span>
                      </div>
                    )}
                  </div>

                  <div className="closet-item__info">
                    <strong>{item.name}</strong>

                    {item.brand && (
                      <span className="closet-item__brand">{item.brand}</span>
                    )}

                    <span className="closet-item__meta">{item.color}</span>
                  </div>
                </button>
              ))}
            </div>
          ) : (
            <div className="closet-empty">
              <div className="closet-empty__icon">
                <ClothesEmptyIcon />
              </div>

              <h2>
                {searchTerm ? "검색 결과가 없어요" : "아직 등록된 옷이 없어요"}
              </h2>

              <p>
                {searchTerm
                  ? "다른 검색어나 카테고리로 찾아보세요."
                  : "첫 번째 옷을 등록하고 나만의 옷장을 만들어보세요."}
              </p>

              {!searchTerm && (
                <button
                  type="button"
                  className="closet-empty__action"
                  onClick={handleCreateClothing}
                >
                  첫 옷 등록하기
                </button>
              )}
            </div>
          )}
        </>
      )}

      {/* =================================
          SAVED
      ================================= */}

      {activeTab === "saved" && (
        <section className="closet-saved">
          {savedLoading ? (
            <div className="closet-saved-empty">
              <div className="closet-saved-empty__icon">
                <BookmarkIcon />
              </div>

              <h2>저장한 스타일을 불러오고 있어요.</h2>

              <p>잠시만 기다려주세요.</p>
            </div>
          ) : savedError ? (
            <div className="closet-saved-empty">
              <div className="closet-saved-empty__icon">
                <SavedEmptyIcon />
              </div>

              <h2>저장한 스타일을 불러오지 못했어요.</h2>

              <p>백엔드 서버와 로그인 상태를 확인해주세요.</p>

              <button type="button" onClick={loadSavedPosts}>
                다시 불러오기
              </button>
            </div>
          ) : savedPosts.length > 0 ? (
            <>
              <div className="closet-saved__heading">
                <div>
                  <h2>저장한 스타일</h2>

                  <p>다시 보고 싶은 스타일을 모아두었어요.</p>
                </div>

                <span>{savedPosts.length}</span>
              </div>

              <div className="closet-saved-grid">
                {savedPosts.map((post) => (
                  <article key={post.id} className="closet-saved-card">
                    <button
                      type="button"
                      className="closet-saved-card__photo"
                      onClick={() => navigate(`/styles/${post.id}`)}
                    >
                      <SavedPostImage post={post} />

                      <span className="closet-saved-card__bookmark">
                        <BookmarkIcon />
                      </span>
                    </button>

                    <button
                      type="button"
                      className="closet-saved-card__creator"
                      onClick={() => navigate(`/users/${post.author.username}`)}
                    >
                      <CreatorAvatar author={post.author} />

                      <span>@{post.author.username}</span>
                    </button>

                    <button
                      type="button"
                      className="closet-saved-card__title"
                      onClick={() => navigate(`/styles/${post.id}`)}
                    >
                      {post.title}
                    </button>
                  </article>
                ))}
              </div>
            </>
          ) : (
            <div className="closet-saved-empty">
              <div className="closet-saved-empty__icon">
                <SavedEmptyIcon />
              </div>

              <h2>아직 저장한 스타일이 없어요.</h2>

              <p>
                발견에서 마음에 드는 스타일을 저장해두면 여기에서 다시 볼 수
                있어요.
              </p>

              <button type="button" onClick={() => navigate("/discover")}>
                스타일 발견하기
              </button>
            </div>
          )}
        </section>
      )}
    </div>
  );
}

export default ClosetPage;
