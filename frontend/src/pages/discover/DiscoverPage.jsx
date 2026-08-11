import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import {
  getLikedStylePostIds,
  getStylePostLikeCount,
  stylePosts,
  toggleStylePostLike,
} from "@/mocks/community";

import { getStylePostCommentCount } from "@/mocks/communityComments";

import {
  getCommunityUserFollowerCount,
  getFollowedUsernames,
} from "@/mocks/communityFollow";

import "./DiscoverPage.css";

const discoverTabs = [
  {
    id: "style",
    label: "스타일",
  },
  {
    id: "today",
    label: "투데이",
  },
  {
    id: "ranking",
    label: "랭킹",
  },
  {
    id: "following",
    label: "팔로잉",
  },
];

const defaultFilters = {
  gender: "전체",
  season: "전체",
  style: "전체",
  tpo: "전체",
  category: "전체",
};

const filterGroups = [
  {
    id: "gender",
    label: "성별",
    options: ["전체", "남성", "여성"],
  },
  {
    id: "season",
    label: "계절",
    options: ["전체", "봄", "여름", "가을", "겨울"],
  },
  {
    id: "style",
    label: "스타일",
    options: ["전체", "미니멀", "캐주얼", "스트릿", "데일리", "블랙", "뉴트럴"],
  },
  {
    id: "tpo",
    label: "TPO",
    options: ["전체", "일상", "출근", "데이트", "여행", "모임"],
  },
  {
    id: "category",
    label: "카테고리",
    options: ["전체", "상의", "하의", "아우터", "원피스", "신발"],
  },
];

const rankingPeriods = [
  {
    id: "day",
    label: "최근 1일",
  },
  {
    id: "week",
    label: "최근 7일",
  },
  {
    id: "month",
    label: "최근 30일",
  },
];

const rankingStyles = ["전체", "캐주얼", "스트릿", "미니멀", "데일리"];

const rankingTypes = [
  {
    id: "style",
    label: "스타일",
  },
  {
    id: "creator",
    label: "크리에이터",
  },
];

const todayCollections = [
  {
    id: "minimal",
    title: "#미니멀",
    description: "깔끔하고 담백하게 입는 데일리 스타일",
    filter: "미니멀",
  },
  {
    id: "casual",
    title: "#캐주얼",
    description: "편안하지만 센스 있는 데일리 코디",
    filter: "캐주얼",
  },
  {
    id: "street",
    title: "#스트릿",
    description: "실루엣과 포인트가 살아있는 스타일",
    filter: "스트릿",
  },
];

const discoverMetadata = {
  1: {
    gender: "여성",
    season: "여름",
    style: ["스트릿", "데일리"],
    tpo: ["일상", "데이트"],
    category: ["상의", "아우터"],
    newest: 96,
  },

  2: {
    gender: "여성",
    season: "여름",
    style: ["미니멀", "데일리"],
    tpo: ["데이트", "여행"],
    category: ["원피스"],
    newest: 88,
  },

  3: {
    gender: "여성",
    season: "가을",
    style: ["스트릿", "블랙"],
    tpo: ["일상", "모임"],
    category: ["아우터"],
    newest: 82,
  },

  4: {
    gender: "여성",
    season: "봄",
    style: ["캐주얼", "데일리"],
    tpo: ["일상", "여행"],
    category: ["아우터"],
    newest: 74,
  },

  5: {
    gender: "여성",
    season: "가을",
    style: ["미니멀", "뉴트럴"],
    tpo: ["데이트", "일상"],
    category: ["아우터"],
    newest: 66,
  },

  6: {
    gender: "남성",
    season: "여름",
    style: ["미니멀", "뉴트럴"],
    tpo: ["출근", "일상"],
    category: ["상의", "하의"],
    newest: 55,
  },

  7: {
    gender: "여성",
    season: "겨울",
    style: ["스트릿", "블랙"],
    tpo: ["모임", "데이트"],
    category: ["아우터"],
    newest: 43,
  },

  8: {
    gender: "여성",
    season: "여름",
    style: ["미니멀", "뉴트럴"],
    tpo: ["여행", "일상"],
    category: ["상의"],
    newest: 31,
  },

  9: {
    gender: "여성",
    season: "여름",
    style: ["캐주얼", "데일리"],
    tpo: ["일상", "여행"],
    category: ["상의", "하의"],
    newest: 18,
  },
};

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

function BellIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9Z" />
      <path d="M10 21h4" />
    </svg>
  );
}

function FilterIcon() {
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
      <path d="M4 7h10" />
      <path d="M18 7h2" />
      <circle cx="16" cy="7" r="2" />
      <path d="M4 17h2" />
      <path d="M10 17h10" />
      <circle cx="8" cy="17" r="2" />
      <path d="M4 12h6" />
      <path d="M14 12h6" />
      <circle cx="12" cy="12" r="2" />
    </svg>
  );
}

function ChevronDownIcon() {
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
      <path d="m7 9 5 5 5-5" />
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
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
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
      <path d="M12 5v14" />
      <path d="M5 12h14" />
    </svg>
  );
}

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.8"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.7a5.3 5.3 0 0 0-7.5 0L12 6l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.8a5.3 5.3 0 0 0 0-7.5Z" />
    </svg>
  );
}

function MessageIcon() {
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
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.3-.7L4 20l1.4-4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    </svg>
  );
}

function ArrowIcon() {
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
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function formatCount(value) {
  if (value >= 1000) {
    return `${(value / 1000).toFixed(1)}K`;
  }

  return value;
}

function getMeta(postId) {
  const preset = discoverMetadata[postId];

  if (preset) {
    return preset;
  }

  const post = stylePosts.find((item) => String(item.id) === String(postId));

  if (!post) {
    return {
      gender: "전체",
      season: "전체",
      style: [],
      tpo: [],
      category: [],
      newest: 0,
    };
  }

  const tpoTags = Array.isArray(post.tpoTags) ? post.tpoTags : [];

  const styleTags = (Array.isArray(post.tags) ? post.tags : []).filter(
    (tag) => !tpoTags.includes(tag),
  );

  const categoryMap = {
    TOP: "상의",
    BOTTOM: "하의",
    OUTER: "아우터",
    SHOES: "신발",
    BAG: "가방",
    ACCESSORY: "액세서리",
  };

  const categories = [
    ...new Set(
      (Array.isArray(post.wornPieces) ? post.wornPieces : [])
        .map((piece) => categoryMap[piece.category])
        .filter(Boolean),
    ),
  ];

  return {
    gender: "전체",
    season: "전체",
    style: styleTags,
    tpo: tpoTags,
    category: categories,
    newest: post.isMine ? 100 : 0,
  };
}

function getRankingScore(post, period) {
  const meta = getMeta(post.id);

  const likes = getStylePostLikeCount(post);

  const comments = getStylePostCommentCount(post);

  if (period === "day") {
    return meta.newest * 12 + likes * 0.45 + comments * 8;
  }

  if (period === "week") {
    return meta.newest * 5 + likes * 0.85 + comments * 6;
  }

  return meta.newest * 2 + likes + comments * 5;
}

function getRecommendationScore(post, likedIds, followedUsernames) {
  const meta = getMeta(post.id);

  const likedPosts = stylePosts.filter((item) => likedIds.has(String(item.id)));

  const likedTags = new Set(
    likedPosts.flatMap((item) => (Array.isArray(item.tags) ? item.tags : [])),
  );

  const postTags = Array.isArray(post.tags) ? post.tags : [];

  const matchedTagCount = postTags.filter((tag) => likedTags.has(tag)).length;

  const followedCreator = followedUsernames.has(post.author.username);

  const alreadyLiked = likedIds.has(String(post.id));

  const likes = getStylePostLikeCount(post);

  const comments = getStylePostCommentCount(post);

  return (
    (followedCreator ? 500 : 0) +
    matchedTagCount * 120 +
    meta.newest * 3 +
    likes * 0.12 +
    comments * 2 +
    (alreadyLiked ? 20 : 0)
  );
}

function GalleryCard({ post, liked, onLike, onOpen }) {
  return (
    <article className="discover-gallery-card">
      <button
        type="button"
        className="discover-gallery-card__image"
        onClick={onOpen}
      >
        <img src={post.image} alt={post.title} loading="lazy" />
      </button>

      <button
        type="button"
        className={
          liked
            ? "discover-gallery-card__like discover-gallery-card__like--active"
            : "discover-gallery-card__like"
        }
        onClick={onLike}
        aria-label={liked ? "좋아요 취소" : "좋아요"}
      >
        <HeartIcon filled={liked} />
      </button>
    </article>
  );
}

function TodayCard({ post, navigate, liked, onLike }) {
  return (
    <article className="discover-today-card">
      <div className="discover-today-card__visual">
        <button type="button" onClick={() => navigate(`/styles/${post.id}`)}>
          <img src={post.image} alt={post.title} />
        </button>

        <button
          type="button"
          className={
            liked
              ? "discover-today-card__heart discover-today-card__heart--active"
              : "discover-today-card__heart"
          }
          onClick={onLike}
          aria-label={liked ? "좋아요 취소" : "좋아요"}
        >
          <HeartIcon filled={liked} />
        </button>
      </div>

      <button
        type="button"
        className="discover-today-card__creator"
        onClick={() => navigate(`/users/${post.author.username}`)}
      >
        <img src={post.author.avatar} alt="" />

        <strong>@{post.author.username}</strong>
      </button>

      <p>{post.title}</p>

      <div className="discover-today-card__engagement">
        <span>♡ {formatCount(getStylePostLikeCount(post))}</span>

        <span>댓글 {getStylePostCommentCount(post)}</span>
      </div>
    </article>
  );
}

function CreatorRankingCard({ item, rank, navigate }) {
  const followerCount = getCommunityUserFollowerCount(item.author);

  return (
    <article className="discover-creator-ranking">
      <div className="discover-creator-ranking__rank">
        {String(rank).padStart(2, "0")}
      </div>

      <button
        type="button"
        className="discover-creator-ranking__profile"
        onClick={() => navigate(`/users/${item.author.username}`)}
      >
        <img src={item.author.avatar} alt="" />

        <div>
          <strong>@{item.author.username}</strong>

          <span>팔로워 {formatCount(followerCount)}</span>
        </div>
      </button>

      <div className="discover-creator-ranking__photos">
        {item.posts.slice(0, 3).map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => navigate(`/styles/${post.id}`)}
          >
            <img src={post.image} alt={post.title} />
          </button>
        ))}
      </div>
    </article>
  );
}

function DiscoverPage() {
  const navigate = useNavigate();

  const [activeTab, setActiveTab] = useState("style");

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState(defaultFilters);

  const [draftFilters, setDraftFilters] = useState(defaultFilters);

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const [activeFilterGroup, setActiveFilterGroup] = useState("gender");

  const [sortMode, setSortMode] = useState("popular");

  const [likedIds, setLikedIds] = useState(
    () => new Set(getLikedStylePostIds()),
  );

  const [followedUsernames, setFollowedUsernames] = useState(
    () => new Set(getFollowedUsernames()),
  );

  const [rankingPeriod, setRankingPeriod] = useState("day");

  const [rankingType, setRankingType] = useState("style");

  const [rankingStyle, setRankingStyle] = useState("전체");

  useEffect(() => {
    if (activeTab !== "following") {
      return;
    }

    setFollowedUsernames(new Set(getFollowedUsernames()));
  }, [activeTab]);

  const selectedFilterCount = Object.values(filters).filter(
    (value) => value !== "전체",
  ).length;

  const searchedPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return [...stylePosts];
    }

    return stylePosts.filter((post) => {
      const text = [
        post.title,
        post.caption,
        post.author.username,
        post.author.displayName,
        ...post.tags,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(keyword);
    });
  }, [searchTerm]);

  const filteredPosts = useMemo(() => {
    let posts = searchedPosts.filter((post) => {
      const meta = getMeta(post.id);

      if (filters.gender !== "전체" && meta.gender !== filters.gender) {
        return false;
      }

      if (filters.season !== "전체" && meta.season !== filters.season) {
        return false;
      }

      if (filters.style !== "전체" && !meta.style.includes(filters.style)) {
        return false;
      }

      if (filters.tpo !== "전체" && !meta.tpo.includes(filters.tpo)) {
        return false;
      }

      if (
        filters.category !== "전체" &&
        !meta.category.includes(filters.category)
      ) {
        return false;
      }

      return true;
    });

    if (activeTab === "following") {
      posts = posts.filter((post) =>
        followedUsernames.has(post.author.username),
      );
    }

    if (sortMode === "popular") {
      posts.sort((a, b) => getStylePostLikeCount(b) - getStylePostLikeCount(a));
    }

    if (sortMode === "latest") {
      posts.sort((a, b) => {
        const aCreatedAt = a.createdAt ? new Date(a.createdAt).getTime() : null;

        const bCreatedAt = b.createdAt ? new Date(b.createdAt).getTime() : null;

        if (aCreatedAt !== null && bCreatedAt !== null) {
          return bCreatedAt - aCreatedAt;
        }

        if (bCreatedAt !== null) {
          return 1;
        }

        if (aCreatedAt !== null) {
          return -1;
        }

        return getMeta(b.id).newest - getMeta(a.id).newest;
      });
    }

    if (sortMode === "recommended") {
      posts.sort(
        (a, b) =>
          getRecommendationScore(b, likedIds, followedUsernames) -
          getRecommendationScore(a, likedIds, followedUsernames),
      );
    }

    return posts;
  }, [
    searchedPosts,
    filters,
    activeTab,
    sortMode,
    likedIds,
    followedUsernames,
  ]);

  const todayData = useMemo(
    () =>
      todayCollections.map((collection) => {
        const matching = searchedPosts.filter((post) => {
          const meta = getMeta(post.id);

          return (
            meta.style.includes(collection.filter) ||
            post.tags.includes(collection.filter)
          );
        });

        const fallback = searchedPosts.filter(
          (post) => !matching.some((item) => item.id === post.id),
        );

        return {
          ...collection,
          posts: [...matching, ...fallback].slice(0, 5),
        };
      }),
    [searchedPosts],
  );

  const rankingPosts = useMemo(() => {
    let posts = [...searchedPosts];

    if (rankingStyle !== "전체") {
      posts = posts.filter((post) => {
        const meta = getMeta(post.id);

        return (
          meta.style.includes(rankingStyle) || post.tags.includes(rankingStyle)
        );
      });
    }

    return posts.sort(
      (a, b) =>
        getRankingScore(b, rankingPeriod) - getRankingScore(a, rankingPeriod),
    );
  }, [searchedPosts, rankingPeriod, rankingStyle, likedIds]);

  const rankingCreators = useMemo(() => {
    const creators = new Map();

    rankingPosts.forEach((post) => {
      const username = post.author.username;

      if (!creators.has(username)) {
        creators.set(username, {
          author: post.author,
          posts: [],
          score: 0,
        });
      }

      const current = creators.get(username);

      current.posts.push(post);

      current.score += getRankingScore(post, rankingPeriod);
    });

    return Array.from(creators.values()).sort((a, b) => b.score - a.score);
  }, [rankingPosts, rankingPeriod]);

  const draftResultCount = useMemo(
    () =>
      stylePosts.filter((post) => {
        const meta = getMeta(post.id);

        if (
          draftFilters.gender !== "전체" &&
          meta.gender !== draftFilters.gender
        ) {
          return false;
        }

        if (
          draftFilters.season !== "전체" &&
          meta.season !== draftFilters.season
        ) {
          return false;
        }

        if (
          draftFilters.style !== "전체" &&
          !meta.style.includes(draftFilters.style)
        ) {
          return false;
        }

        if (
          draftFilters.tpo !== "전체" &&
          !meta.tpo.includes(draftFilters.tpo)
        ) {
          return false;
        }

        if (
          draftFilters.category !== "전체" &&
          !meta.category.includes(draftFilters.category)
        ) {
          return false;
        }

        return true;
      }).length,
    [draftFilters],
  );

  const toggleLike = (id) => {
    const result = toggleStylePostLike(id);

    setLikedIds((current) => {
      const next = new Set(current);

      if (result.liked) {
        next.add(String(id));
      } else {
        next.delete(String(id));
      }

      return next;
    });
  };

  const openPostComments = (postId) => {
    navigate(`/styles/${postId}`, {
      state: {
        openComments: true,
      },
    });
  };

  const openFilterSheet = (groupId = "gender") => {
    setDraftFilters(filters);

    setActiveFilterGroup(groupId);

    setFilterSheetOpen(true);
  };

  const applyFilters = () => {
    setFilters(draftFilters);

    setFilterSheetOpen(false);
  };

  const resetFilters = () => {
    setDraftFilters(defaultFilters);

    setFilters(defaultFilters);
  };

  const openTodayCollection = (collection) => {
    setFilters({
      ...defaultFilters,
      style: collection.filter,
    });

    setActiveTab("style");
  };

  const renderStyleGrid = (posts) => (
    <>
      <section className="discover-filter-area">
        <div className="discover-filter-rail">
          <button
            type="button"
            className={
              selectedFilterCount > 0
                ? "discover-filter-button discover-filter-button--active"
                : "discover-filter-button"
            }
            onClick={() => openFilterSheet("gender")}
          >
            <FilterIcon />

            {selectedFilterCount > 0 && <span>{selectedFilterCount}</span>}
          </button>

          {filterGroups.map((group) => {
            const selected = filters[group.id];

            return (
              <button
                key={group.id}
                type="button"
                className={
                  selected !== "전체"
                    ? "discover-filter-chip discover-filter-chip--selected"
                    : "discover-filter-chip"
                }
                onClick={() => openFilterSheet(group.id)}
              >
                <span>{selected !== "전체" ? selected : group.label}</span>

                <ChevronDownIcon />
              </button>
            );
          })}
        </div>

        {selectedFilterCount > 0 && (
          <div className="discover-filter-selected">
            <div>
              {filterGroups
                .filter((group) => filters[group.id] !== "전체")
                .map((group) => (
                  <span key={group.id}>{filters[group.id]}</span>
                ))}
            </div>

            <button type="button" onClick={resetFilters}>
              초기화
            </button>
          </div>
        )}

        <div className="discover-result-control">
          <span>
            {posts.length}
            개의 스타일
          </span>

          <label>
            <select
              value={sortMode}
              onChange={(event) => setSortMode(event.target.value)}
            >
              <option value="popular">인기순</option>
              <option value="latest">최신순</option>
              <option value="recommended">추천순</option>
            </select>

            <ChevronDownIcon />
          </label>
        </div>
      </section>

      {posts.length > 0 ? (
        <section className="discover-gallery-grid">
          {posts.map((post) => (
            <GalleryCard
              key={post.id}
              post={post}
              liked={likedIds.has(String(post.id))}
              onLike={() => toggleLike(post.id)}
              onOpen={() => navigate(`/styles/${post.id}`)}
            />
          ))}
        </section>
      ) : (
        <section className="discover-empty">
          <strong>조건에 맞는 스타일이 없어요.</strong>

          <p>필터를 조금 줄여서 다시 찾아보세요.</p>

          <button type="button" onClick={resetFilters}>
            필터 초기화
          </button>
        </section>
      )}
    </>
  );

  return (
    <div className="discover-page-v4">
      <header className="discover-main-header">
        <strong>VESTI</strong>

        <div>
          <button type="button" aria-label="알림">
            <BellIcon />
          </button>

          <button
            type="button"
            onClick={() => setSearchOpen((current) => !current)}
            aria-label="검색"
          >
            <SearchIcon />
          </button>
        </div>
      </header>

      {searchOpen && (
        <div className="discover-search-bar">
          <SearchIcon />

          <input
            type="search"
            value={searchTerm}
            onChange={(event) => setSearchTerm(event.target.value)}
            placeholder="스타일, 사용자, 태그 검색"
            autoFocus
          />

          {searchTerm && (
            <button
              type="button"
              onClick={() => setSearchTerm("")}
              aria-label="검색어 지우기"
            >
              <CloseIcon />
            </button>
          )}
        </div>
      )}

      <nav className="discover-top-tabs" aria-label="발견 메뉴">
        {discoverTabs.map((tab) => (
          <button
            key={tab.id}
            type="button"
            className={
              activeTab === tab.id
                ? "discover-top-tabs__item discover-top-tabs__item--active"
                : "discover-top-tabs__item"
            }
            onClick={() => setActiveTab(tab.id)}
          >
            {tab.label}

            {tab.id === "following" && (
              <span className="discover-top-tabs__dot" />
            )}
          </button>
        ))}
      </nav>

      {activeTab === "style" && renderStyleGrid(filteredPosts)}

      {activeTab === "today" && (
        <main className="discover-today">
          <header className="discover-today-header">
            <span>TODAY</span>

            <h1>오늘의 스타일</h1>

            <p>지금 둘러보기 좋은 스타일을 주제별로 모았어요.</p>
          </header>

          {todayData.map((collection) => (
            <section key={collection.id} className="discover-today-section">
              <div className="discover-today-heading">
                <div>
                  <h2>{collection.title}</h2>

                  <p>{collection.description}</p>
                </div>

                <button
                  type="button"
                  onClick={() => openTodayCollection(collection)}
                >
                  더보기
                  <ArrowIcon />
                </button>
              </div>

              <div className="discover-today-rail">
                {collection.posts.map((post) => (
                  <TodayCard
                    key={`${collection.id}-${post.id}`}
                    post={post}
                    navigate={navigate}
                    liked={likedIds.has(String(post.id))}
                    onLike={() => toggleLike(post.id)}
                  />
                ))}
              </div>
            </section>
          ))}
        </main>
      )}

      {activeTab === "ranking" && (
        <main className="discover-ranking">
          <nav className="discover-ranking-type">
            {rankingTypes.map((type) => (
              <button
                key={type.id}
                type="button"
                className={
                  rankingType === type.id
                    ? "discover-ranking-type__item discover-ranking-type__item--active"
                    : "discover-ranking-type__item"
                }
                onClick={() => setRankingType(type.id)}
              >
                {type.label}
              </button>
            ))}
          </nav>

          <div className="discover-ranking-style">
            {rankingStyles.map((style) => (
              <button
                key={style}
                type="button"
                className={
                  rankingStyle === style
                    ? "discover-ranking-style__item discover-ranking-style__item--active"
                    : "discover-ranking-style__item"
                }
                onClick={() => setRankingStyle(style)}
              >
                {style}
              </button>
            ))}
          </div>

          <div className="discover-ranking-period">
            <div>
              <span>현재 기준</span>

              <strong>
                {rankingType === "style" ? "스타일 랭킹" : "크리에이터 랭킹"}
              </strong>
            </div>

            <label>
              <select
                value={rankingPeriod}
                onChange={(event) => setRankingPeriod(event.target.value)}
              >
                {rankingPeriods.map((period) => (
                  <option key={period.id} value={period.id}>
                    {period.label}
                  </option>
                ))}
              </select>

              <ChevronDownIcon />
            </label>
          </div>

          {rankingType === "style" && (
            <section className="discover-ranking-grid">
              {rankingPosts.map((post, index) => (
                <article key={post.id} className="discover-ranking-card">
                  <div className="discover-ranking-card__visual">
                    <button
                      type="button"
                      onClick={() => navigate(`/styles/${post.id}`)}
                      aria-label={`${post.title} 상세 보기`}
                      style={{
                        display: "block",
                        width: "100%",
                        height: "100%",
                        padding: 0,
                        border: 0,
                        background: "transparent",
                        cursor: "pointer",
                      }}
                    >
                      <img src={post.image} alt={post.title} />
                    </button>

                    <span className="discover-ranking-card__number">
                      {index + 1}
                    </span>

                    <button
                      type="button"
                      className={
                        likedIds.has(String(post.id))
                          ? "discover-ranking-card__heart discover-ranking-card__heart--active"
                          : "discover-ranking-card__heart"
                      }
                      onClick={() => toggleLike(post.id)}
                      aria-label={
                        likedIds.has(String(post.id)) ? "좋아요 취소" : "좋아요"
                      }
                    >
                      <HeartIcon filled={likedIds.has(String(post.id))} />
                    </button>
                  </div>

                  <div className="discover-ranking-card__content">
                    <button
                      type="button"
                      className="discover-ranking-card__creator"
                      onClick={() => navigate(`/users/${post.author.username}`)}
                    >
                      <img src={post.author.avatar} alt="" />

                      <strong>@{post.author.username}</strong>
                    </button>

                    <p>
                      {post.tags
                        .slice(0, 3)
                        .map((tag) => `#${tag}`)
                        .join(" ")}
                    </p>

                    <div className="discover-ranking-card__engagement">
                      <span>♡ {formatCount(getStylePostLikeCount(post))}</span>

                      {getStylePostCommentCount(post) > 0 && (
                        <span>댓글 {getStylePostCommentCount(post)}</span>
                      )}
                    </div>
                  </div>
                </article>
              ))}
            </section>
          )}

          {rankingType === "creator" && (
            <section className="discover-creator-ranking-list">
              {rankingCreators.map((item, index) => (
                <CreatorRankingCard
                  key={item.author.username}
                  item={item}
                  rank={index + 1}
                  navigate={navigate}
                />
              ))}
            </section>
          )}
        </main>
      )}

      {activeTab === "following" && (
        <main className="discover-following">
          {filteredPosts.length > 0 ? (
            filteredPosts.map((post) => {
              const commentCount = getStylePostCommentCount(post);

              return (
                <article key={post.id} className="discover-following-post">
                  <div className="discover-following-post__creator">
                    <button
                      type="button"
                      onClick={() => navigate(`/users/${post.author.username}`)}
                    >
                      <img src={post.author.avatar} alt="" />

                      <div>
                        <strong>@{post.author.username}</strong>

                        <span>
                          {post.location}
                          {" · "}
                          {post.timeAgo}
                        </span>
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="discover-following-post__photo"
                    onClick={() => navigate(`/styles/${post.id}`)}
                  >
                    <img src={post.image} alt={post.title} />
                  </button>

                  <div className="discover-following-post__actions">
                    <button
                      type="button"
                      className={
                        likedIds.has(String(post.id))
                          ? "discover-following-post__like discover-following-post__like--active"
                          : "discover-following-post__like"
                      }
                      onClick={() => toggleLike(post.id)}
                      aria-label={
                        likedIds.has(String(post.id)) ? "좋아요 취소" : "좋아요"
                      }
                    >
                      <HeartIcon filled={likedIds.has(String(post.id))} />
                    </button>

                    <button
                      type="button"
                      onClick={() => openPostComments(post.id)}
                      aria-label={`댓글 ${commentCount}개`}
                    >
                      <MessageIcon />
                    </button>
                  </div>

                  <div className="discover-following-post__caption">
                    <div className="discover-following-post__engagement">
                      <strong>
                        좋아요 {formatCount(getStylePostLikeCount(post))}개
                      </strong>

                      <button
                        type="button"
                        onClick={() => openPostComments(post.id)}
                      >
                        댓글 {commentCount}개
                      </button>
                    </div>

                    <p>{post.title}</p>

                    <div>
                      {post.tags.map((tag) => (
                        <span key={tag}>#{tag}</span>
                      ))}
                    </div>
                  </div>
                </article>
              );
            })
          ) : (
            <section className="discover-empty">
              <strong>아직 팔로우한 크리에이터가 없어요.</strong>

              <p>마음에 드는 스타일의 크리에이터를 팔로우해보세요.</p>

              <button type="button" onClick={() => setActiveTab("style")}>
                스타일 둘러보기
              </button>
            </section>
          )}
        </main>
      )}

      <button
        type="button"
        className="discover-create-button"
        onClick={() => navigate("/posts/new")}
        aria-label="스타일 등록"
      >
        <PlusIcon />
      </button>

      {filterSheetOpen && (
        <div
          className="discover-filter-backdrop"
          role="presentation"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setFilterSheetOpen(false);
            }
          }}
        >
          <section className="discover-filter-sheet">
            <header className="discover-filter-sheet__header">
              <h2>필터</h2>

              <button
                type="button"
                onClick={() => setFilterSheetOpen(false)}
                aria-label="필터 닫기"
              >
                <CloseIcon />
              </button>
            </header>

            <nav className="discover-filter-sheet__tabs">
              {filterGroups.map((group) => (
                <button
                  key={group.id}
                  type="button"
                  className={
                    activeFilterGroup === group.id
                      ? "discover-filter-sheet__tab discover-filter-sheet__tab--active"
                      : "discover-filter-sheet__tab"
                  }
                  onClick={() => setActiveFilterGroup(group.id)}
                >
                  {group.label}

                  {draftFilters[group.id] !== "전체" && <span>1</span>}
                </button>
              ))}
            </nav>

            <div className="discover-filter-sheet__summary">
              <span>
                {
                  filterGroups.find((group) => group.id === activeFilterGroup)
                    ?.label
                }
              </span>

              <button
                type="button"
                onClick={() => setDraftFilters(defaultFilters)}
              >
                초기화
              </button>
            </div>

            <div className="discover-filter-options">
              {filterGroups
                .find((group) => group.id === activeFilterGroup)
                ?.options.map((option) => {
                  const selected = draftFilters[activeFilterGroup] === option;

                  return (
                    <button
                      key={option}
                      type="button"
                      className={
                        selected
                          ? "discover-filter-option discover-filter-option--selected"
                          : "discover-filter-option"
                      }
                      onClick={() =>
                        setDraftFilters((current) => ({
                          ...current,
                          [activeFilterGroup]: option,
                        }))
                      }
                    >
                      <span className="discover-filter-option__radio">
                        {selected && <span />}
                      </span>

                      <strong>{option}</strong>
                    </button>
                  );
                })}
            </div>

            <footer className="discover-filter-sheet__footer">
              <button
                type="button"
                className="discover-filter-sheet__apply"
                onClick={applyFilters}
              >
                {draftResultCount}개 스타일 보기
              </button>

              <button
                type="button"
                className="discover-filter-sheet__reset"
                onClick={() => setDraftFilters(defaultFilters)}
              >
                선택 초기화
              </button>
            </footer>
          </section>
        </div>
      )}
    </div>
  );
}

export default DiscoverPage;
