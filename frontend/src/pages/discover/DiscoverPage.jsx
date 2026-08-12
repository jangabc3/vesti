import { useEffect, useMemo, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMyProfile } from "@/api/authApi";

import { getStylePosts, getUserStylePosts } from "@/api/stylePostApi";

import {
  getMyStylePostLikeStatus,
  likeStylePost,
  unlikeStylePost,
} from "@/api/stylePostLikeApi";

import { getStylePostComments } from "@/api/stylePostCommentApi";

import { getFollowing, getMyFollowStatus } from "@/api/userFollowApi";

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
    id: "latest",
    title: "새로 올라온 스타일",
    description: "최근 등록된 VESTI 스타일을 먼저 만나보세요.",
  },
  {
    id: "popular",
    title: "지금 반응 좋은 스타일",
    description: "좋아요와 댓글 반응이 좋은 스타일이에요.",
  },
  {
    id: "discover",
    title: "지금 둘러보기",
    description: "새로운 스타일과 크리에이터를 발견해보세요.",
  },
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
  const number = Number(value ?? 0);

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return number;
}

function getPostTimestamp(post) {
  if (!post?.createdAt) {
    return 0;
  }

  const timestamp = new Date(post.createdAt).getTime();

  return Number.isNaN(timestamp) ? 0 : timestamp;
}

function isPostInRankingPeriod(post, period) {
  const timestamp = getPostTimestamp(post);

  if (!timestamp) {
    return true;
  }

  const periodDays = {
    day: 1,
    week: 7,
    month: 30,
  };

  const days = periodDays[period] ?? 30;

  const boundary = Date.now() - days * 24 * 60 * 60 * 1000;

  return timestamp >= boundary;
}

function getApiMeta(post) {
  const tpoTags = Array.isArray(post?.tpoTags) ? post.tpoTags : [];

  const styleTags = (Array.isArray(post?.tags) ? post.tags : []).filter(
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
      (Array.isArray(post?.wornPieces) ? post.wornPieces : [])
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
  };
}

function getRecommendationScore(post, likeState, commentCounts) {
  const createdAt = getPostTimestamp(post);

  const recencyScore = createdAt ? createdAt / 100000000 : 0;

  const like = likeState[String(post.id)];

  const likeCount = like?.likeCount ?? 0;

  const commentCount = commentCounts[String(post.id)] ?? 0;

  const likedBonus = like?.liked ? 20 : 0;

  return recencyScore + likeCount * 3 + commentCount * 4 + likedBonus;
}

function getRankingScore(post, likeState, commentCounts) {
  const likeCount = likeState[String(post.id)]?.likeCount ?? 0;

  const commentCount = commentCounts[String(post.id)] ?? 0;

  const createdAt = getPostTimestamp(post);

  const ageHours = createdAt
    ? Math.max(0, (Date.now() - createdAt) / (1000 * 60 * 60))
    : 9999;

  const recencyBonus = Math.max(0, 72 - ageHours);

  return likeCount * 5 + commentCount * 7 + recencyBonus * 0.15;
}

function GalleryImage({ post }) {
  const [failed, setFailed] = useState(false);

  if (!post?.image || failed) {
    return (
      <div
        style={{
          width: "100%",
          height: "100%",
          minHeight: "170px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f2f0",
          color: "#aaa59f",
          fontSize: "10px",
        }}
      >
        이미지 준비 중
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

function Avatar({ author }) {
  const [failed, setFailed] = useState(false);

  if (!author?.avatar || failed) {
    const source = author?.displayName || author?.username || "V";

    return (
      <span
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          borderRadius: "50%",
          color: "#ffffff",
          background: "#242220",
          fontSize: "9px",
          fontWeight: 800,
        }}
      >
        {source.charAt(0).toUpperCase()}
      </span>
    );
  }

  return <img src={author.avatar} alt="" onError={() => setFailed(true)} />;
}

function GalleryCard({ post, liked, likeDisabled = false, onLike, onOpen }) {
  return (
    <article className="discover-gallery-card">
      <button
        type="button"
        className="discover-gallery-card__image"
        onClick={onOpen}
      >
        <GalleryImage post={post} />
      </button>

      <button
        type="button"
        className={
          liked
            ? "discover-gallery-card__like discover-gallery-card__like--active"
            : "discover-gallery-card__like"
        }
        onClick={onLike}
        disabled={likeDisabled}
        aria-label={liked ? "좋아요 취소" : "좋아요"}
      >
        <HeartIcon filled={liked} />
      </button>
    </article>
  );
}

function TodayCard({
  post,
  navigate,
  liked,
  likeCount,
  commentCount,
  likeDisabled,
  onLike,
}) {
  return (
    <article className="discover-today-card">
      <div className="discover-today-card__visual">
        <button type="button" onClick={() => navigate(`/styles/${post.id}`)}>
          <GalleryImage post={post} />
        </button>

        <button
          type="button"
          disabled={likeDisabled}
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
        <div
          style={{
            width: "24px",
            height: "24px",
            flexShrink: 0,
          }}
        >
          <Avatar author={post.author} />
        </div>

        <strong>@{post.author.username}</strong>
      </button>

      <p>{post.title}</p>

      <div className="discover-today-card__engagement">
        <span>♡ {formatCount(likeCount)}</span>

        <span>댓글 {commentCount}</span>
      </div>
    </article>
  );
}

function CreatorRankingCard({ item, rank, navigate }) {
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
        <div
          style={{
            width: "42px",
            height: "42px",
            flexShrink: 0,
          }}
        >
          <Avatar author={item.author} />
        </div>

        <div>
          <strong>@{item.author.username}</strong>

          <span>팔로워 {formatCount(item.followerCount)}</span>
        </div>
      </button>

      <div className="discover-creator-ranking__photos">
        {item.posts.slice(0, 3).map((post) => (
          <button
            key={post.id}
            type="button"
            onClick={() => navigate(`/styles/${post.id}`)}
          >
            <GalleryImage post={post} />
          </button>
        ))}
      </div>
    </article>
  );
}

function DiscoverPage() {
  const navigate = useNavigate();

  const [apiStylePosts, setApiStylePosts] = useState([]);

  const [stylePostsLoading, setStylePostsLoading] = useState(true);

  const [stylePostsError, setStylePostsError] = useState(false);

  const [apiLikeState, setApiLikeState] = useState({});

  const [apiCommentCounts, setApiCommentCounts] = useState({});

  const [creatorStats, setCreatorStats] = useState({});

  const [apiLikePendingIds, setApiLikePendingIds] = useState(() => new Set());

  const [followingPosts, setFollowingPosts] = useState([]);

  const [followingLoading, setFollowingLoading] = useState(false);

  const [followingError, setFollowingError] = useState(false);

  const [activeTab, setActiveTab] = useState("style");

  const [searchOpen, setSearchOpen] = useState(false);

  const [searchTerm, setSearchTerm] = useState("");

  const [filters, setFilters] = useState(defaultFilters);

  const [draftFilters, setDraftFilters] = useState(defaultFilters);

  const [filterSheetOpen, setFilterSheetOpen] = useState(false);

  const [activeFilterGroup, setActiveFilterGroup] = useState("gender");

  const [sortMode, setSortMode] = useState("popular");

  const [rankingPeriod, setRankingPeriod] = useState("day");

  const [rankingType, setRankingType] = useState("style");

  const [rankingStyle, setRankingStyle] = useState("전체");

  /*
   * ========================================
   * Discover 공통 실제 DB 데이터
   *
   * Style / Today / Ranking에서 모두 사용한다.
   * ========================================
   */
  useEffect(() => {
    let ignore = false;

    async function loadDiscoverData() {
      setStylePostsLoading(true);

      setStylePostsError(false);

      try {
        const page = await getStylePosts({
          page: 0,
          size: 100,
          sort: "createdAt,desc",
        });

        const posts = page.content ?? [];

        if (ignore) {
          return;
        }

        setApiStylePosts(posts);

        const [likeResults, commentResults] = await Promise.all([
          Promise.allSettled(
            posts.map((post) => getMyStylePostLikeStatus(post.id)),
          ),

          Promise.allSettled(
            posts.map((post) => getStylePostComments(post.id)),
          ),
        ]);

        if (ignore) {
          return;
        }

        const nextLikeState = {};

        const nextCommentCounts = {};

        posts.forEach((post, index) => {
          const likeResult = likeResults[index];

          const commentResult = commentResults[index];

          nextLikeState[String(post.id)] =
            likeResult.status === "fulfilled"
              ? {
                  liked: Boolean(likeResult.value?.liked),

                  likeCount: likeResult.value?.likeCount ?? 0,
                }
              : {
                  liked: false,
                  likeCount: 0,
                };

          nextCommentCounts[String(post.id)] =
            commentResult.status === "fulfilled" &&
            Array.isArray(commentResult.value)
              ? commentResult.value.length
              : 0;
        });

        setApiLikeState(nextLikeState);

        setApiCommentCounts(nextCommentCounts);

        /*
         * Creator Ranking의 팔로워 수
         */
        const usernames = [
          ...new Set(
            posts.map((post) => post.author?.username).filter(Boolean),
          ),
        ];

        const creatorResults = await Promise.allSettled(
          usernames.map((username) => getMyFollowStatus(username)),
        );

        if (ignore) {
          return;
        }

        const nextCreatorStats = {};

        usernames.forEach((username, index) => {
          const result = creatorResults[index];

          nextCreatorStats[username] =
            result.status === "fulfilled"
              ? {
                  followerCount: result.value?.followerCount ?? 0,

                  followingCount: result.value?.followingCount ?? 0,
                }
              : {
                  followerCount: 0,
                  followingCount: 0,
                };
        });

        setCreatorStats(nextCreatorStats);
      } catch (error) {
        console.error("Discover 데이터를 불러오지 못했습니다.", error);

        if (!ignore) {
          setApiStylePosts([]);

          setApiLikeState({});

          setApiCommentCounts({});

          setCreatorStats({});

          setStylePostsError(true);
        }
      } finally {
        if (!ignore) {
          setStylePostsLoading(false);
        }
      }
    }

    loadDiscoverData();

    return () => {
      ignore = true;
    };
  }, []);

  /*
   * ========================================
   * Following
   * ========================================
   */
  useEffect(() => {
    if (activeTab !== "following") {
      return;
    }

    let ignore = false;

    async function loadFollowingFeed() {
      setFollowingLoading(true);

      setFollowingError(false);

      try {
        const myProfile = await getMyProfile();

        const followingPage = await getFollowing(myProfile.username, {
          page: 0,
          size: 100,
        });

        const followedUsers = followingPage.content ?? [];

        if (followedUsers.length === 0) {
          if (!ignore) {
            setFollowingPosts([]);
          }

          return;
        }

        const postResults = await Promise.allSettled(
          followedUsers.map((user) =>
            getUserStylePosts(user.username, {
              page: 0,
              size: 30,
              sort: "createdAt,desc",
            }),
          ),
        );

        const mergedPosts = postResults
          .filter((result) => result.status === "fulfilled")
          .flatMap((result) => result.value?.content ?? []);

        const uniquePosts = Array.from(
          new Map(mergedPosts.map((post) => [String(post.id), post])).values(),
        ).sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));

        if (ignore) {
          return;
        }

        setFollowingPosts(uniquePosts);

        const missingPosts = uniquePosts.filter(
          (post) =>
            !Object.prototype.hasOwnProperty.call(
              apiLikeState,
              String(post.id),
            ),
        );

        if (missingPosts.length > 0) {
          const [likeResults, commentResults] = await Promise.all([
            Promise.allSettled(
              missingPosts.map((post) => getMyStylePostLikeStatus(post.id)),
            ),

            Promise.allSettled(
              missingPosts.map((post) => getStylePostComments(post.id)),
            ),
          ]);

          if (ignore) {
            return;
          }

          setApiLikeState((previous) => {
            const next = {
              ...previous,
            };

            missingPosts.forEach((post, index) => {
              const result = likeResults[index];

              if (result.status === "fulfilled") {
                next[String(post.id)] = {
                  liked: Boolean(result.value?.liked),

                  likeCount: result.value?.likeCount ?? 0,
                };
              }
            });

            return next;
          });

          setApiCommentCounts((previous) => {
            const next = {
              ...previous,
            };

            missingPosts.forEach((post, index) => {
              const result = commentResults[index];

              next[String(post.id)] =
                result.status === "fulfilled" && Array.isArray(result.value)
                  ? result.value.length
                  : 0;
            });

            return next;
          });
        }
      } catch (error) {
        console.error("팔로잉 피드를 불러오지 못했습니다.", error);

        if (!ignore) {
          setFollowingPosts([]);

          setFollowingError(true);
        }
      } finally {
        if (!ignore) {
          setFollowingLoading(false);
        }
      }
    }

    loadFollowingFeed();

    return () => {
      ignore = true;
    };
  }, [activeTab, apiLikeState]);

  const selectedFilterCount = Object.values(filters).filter(
    (value) => value !== "전체",
  ).length;

  /*
   * ========================================
   * 공통 검색
   * ========================================
   */
  const apiSearchedPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return [...apiStylePosts];
    }

    return apiStylePosts.filter((post) => {
      const text = [
        post.title,
        post.caption,
        post.location,
        post.author?.username,
        post.author?.displayName,
        ...(Array.isArray(post.tags) ? post.tags : []),
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(keyword);
    });
  }, [apiStylePosts, searchTerm]);

  /*
   * ========================================
   * Style 탭
   * ========================================
   */
  const apiFilteredPosts = useMemo(() => {
    const posts = apiSearchedPosts.filter((post) => {
      const meta = getApiMeta(post);

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

    if (sortMode === "popular") {
      posts.sort(
        (a, b) =>
          getRankingScore(b, apiLikeState, apiCommentCounts) -
          getRankingScore(a, apiLikeState, apiCommentCounts),
      );
    }

    if (sortMode === "latest") {
      posts.sort((a, b) => getPostTimestamp(b) - getPostTimestamp(a));
    }

    if (sortMode === "recommended") {
      posts.sort(
        (a, b) =>
          getRecommendationScore(b, apiLikeState, apiCommentCounts) -
          getRecommendationScore(a, apiLikeState, apiCommentCounts),
      );
    }

    return posts;
  }, [apiSearchedPosts, filters, sortMode, apiLikeState, apiCommentCounts]);

  /*
   * ========================================
   * Today 탭 - 실제 DB
   * ========================================
   */
  const todayData = useMemo(() => {
    const latest = [...apiSearchedPosts].sort(
      (a, b) => getPostTimestamp(b) - getPostTimestamp(a),
    );

    const popular = [...apiSearchedPosts].sort(
      (a, b) =>
        getRankingScore(b, apiLikeState, apiCommentCounts) -
        getRankingScore(a, apiLikeState, apiCommentCounts),
    );

    const discover = [...apiSearchedPosts].sort(
      (a, b) =>
        getRecommendationScore(b, apiLikeState, apiCommentCounts) -
        getRecommendationScore(a, apiLikeState, apiCommentCounts),
    );

    const map = {
      latest,
      popular,
      discover,
    };

    return todayCollections.map((collection) => ({
      ...collection,

      posts: map[collection.id]?.slice(0, 5) ?? [],
    }));
  }, [apiSearchedPosts, apiLikeState, apiCommentCounts]);

  /*
   * ========================================
   * Ranking 탭 - 실제 DB
   * ========================================
   */
  const rankingPosts = useMemo(() => {
    let posts = apiSearchedPosts.filter((post) =>
      isPostInRankingPeriod(post, rankingPeriod),
    );

    if (rankingStyle !== "전체") {
      posts = posts.filter((post) => {
        const meta = getApiMeta(post);

        return meta.style.includes(rankingStyle);
      });
    }

    return posts.sort(
      (a, b) =>
        getRankingScore(b, apiLikeState, apiCommentCounts) -
        getRankingScore(a, apiLikeState, apiCommentCounts),
    );
  }, [
    apiSearchedPosts,
    rankingPeriod,
    rankingStyle,
    apiLikeState,
    apiCommentCounts,
  ]);

  const rankingCreators = useMemo(() => {
    const creators = new Map();

    rankingPosts.forEach((post) => {
      const username = post.author?.username;

      if (!username) {
        return;
      }

      if (!creators.has(username)) {
        creators.set(username, {
          author: post.author,

          posts: [],

          score: 0,

          followerCount: creatorStats[username]?.followerCount ?? 0,
        });
      }

      const current = creators.get(username);

      current.posts.push(post);

      current.score += getRankingScore(post, apiLikeState, apiCommentCounts);
    });

    return Array.from(creators.values()).sort((a, b) => {
      if (b.score !== a.score) {
        return b.score - a.score;
      }

      return b.followerCount - a.followerCount;
    });
  }, [rankingPosts, apiLikeState, apiCommentCounts, creatorStats]);

  /*
   * ========================================
   * Following 검색
   * ========================================
   */
  const filteredFollowingPosts = useMemo(() => {
    const keyword = searchTerm.trim().toLowerCase();

    if (!keyword) {
      return [...followingPosts];
    }

    return followingPosts.filter((post) => {
      const text = [
        post.title,
        post.caption,
        post.location,
        post.author?.username,
        post.author?.displayName,
      ]
        .filter(Boolean)
        .join(" ")
        .toLowerCase();

      return text.includes(keyword);
    });
  }, [followingPosts, searchTerm]);

  const draftResultCount = useMemo(
    () =>
      apiStylePosts.filter((post) => {
        const meta = getApiMeta(post);

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
    [apiStylePosts, draftFilters],
  );

  /*
   * ========================================
   * 실제 DB Like
   * ========================================
   */
  const toggleApiLike = async (stylePostId) => {
    const key = String(stylePostId);

    if (apiLikePendingIds.has(key)) {
      return;
    }

    const current = apiLikeState[key] ?? {
      liked: false,
      likeCount: 0,
    };

    setApiLikePendingIds((previous) => {
      const next = new Set(previous);

      next.add(key);

      return next;
    });

    try {
      const result = current.liked
        ? await unlikeStylePost(stylePostId)
        : await likeStylePost(stylePostId);

      setApiLikeState((previous) => ({
        ...previous,

        [key]: {
          liked: Boolean(result.liked),

          likeCount: result.likeCount ?? 0,
        },
      }));
    } catch (error) {
      console.error("좋아요 처리에 실패했습니다.", error);
    } finally {
      setApiLikePendingIds((previous) => {
        const next = new Set(previous);

        next.delete(key);

        return next;
      });
    }
  };

  const openPostComments = (postId) => {
    navigate(`/styles/${postId}`);
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
    if (collection.id === "latest") {
      setSortMode("latest");
    } else if (collection.id === "popular") {
      setSortMode("popular");
    } else {
      setSortMode("recommended");
    }

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
          {posts.map((post) => {
            const key = String(post.id);

            const like = apiLikeState[key] ?? {
              liked: false,
              likeCount: 0,
            };

            return (
              <GalleryCard
                key={post.id}
                post={post}
                liked={like.liked}
                likeDisabled={apiLikePendingIds.has(key)}
                onLike={() => toggleApiLike(post.id)}
                onOpen={() => navigate(`/styles/${post.id}`)}
              />
            );
          })}
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
            placeholder="스타일, 사용자 검색"
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

      {/* =================================
          STYLE
      ================================= */}

      {activeTab === "style" &&
        (stylePostsLoading ? (
          <section className="discover-empty">
            <strong>스타일을 불러오고 있어요.</strong>

            <p>실제 VESTI 게시물을 가져오는 중입니다.</p>
          </section>
        ) : stylePostsError ? (
          <section className="discover-empty">
            <strong>스타일을 불러오지 못했어요.</strong>

            <p>백엔드 서버와 로그인 상태를 확인한 뒤 새로고침해주세요.</p>
          </section>
        ) : (
          renderStyleGrid(apiFilteredPosts)
        ))}

      {/* =================================
          TODAY - 실제 DB
      ================================= */}

      {activeTab === "today" && (
        <main className="discover-today">
          <header className="discover-today-header">
            <span>TODAY</span>

            <h1>오늘의 스타일</h1>

            <p>지금 VESTI에서 둘러보기 좋은 스타일을 모았어요.</p>
          </header>

          {stylePostsLoading ? (
            <section className="discover-empty">
              <strong>오늘의 스타일을 불러오고 있어요.</strong>
            </section>
          ) : stylePostsError ? (
            <section className="discover-empty">
              <strong>스타일을 불러오지 못했어요.</strong>
            </section>
          ) : apiStylePosts.length === 0 ? (
            <section className="discover-empty">
              <strong>아직 등록된 스타일이 없어요.</strong>

              <p>첫 스타일이 올라오면 이곳에서 소개할게요.</p>
            </section>
          ) : (
            todayData.map((collection) => (
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
                  {collection.posts.map((post) => {
                    const key = String(post.id);

                    const like = apiLikeState[key] ?? {
                      liked: false,
                      likeCount: 0,
                    };

                    const commentCount = apiCommentCounts[key] ?? 0;

                    return (
                      <TodayCard
                        key={`${collection.id}-${post.id}`}
                        post={post}
                        navigate={navigate}
                        liked={like.liked}
                        likeCount={like.likeCount}
                        commentCount={commentCount}
                        likeDisabled={apiLikePendingIds.has(key)}
                        onLike={() => toggleApiLike(post.id)}
                      />
                    );
                  })}
                </div>
              </section>
            ))
          )}
        </main>
      )}

      {/* =================================
          RANKING - 실제 DB
      ================================= */}

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
              <span>실제 반응 기준</span>

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

          {stylePostsLoading ? (
            <section className="discover-empty">
              <strong>랭킹을 계산하고 있어요.</strong>
            </section>
          ) : rankingType === "style" && rankingPosts.length > 0 ? (
            <section className="discover-ranking-grid">
              {rankingPosts.map((post, index) => {
                const key = String(post.id);

                const like = apiLikeState[key] ?? {
                  liked: false,
                  likeCount: 0,
                };

                const commentCount = apiCommentCounts[key] ?? 0;

                return (
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
                        <GalleryImage post={post} />
                      </button>

                      <span className="discover-ranking-card__number">
                        {index + 1}
                      </span>

                      <button
                        type="button"
                        disabled={apiLikePendingIds.has(key)}
                        className={
                          like.liked
                            ? "discover-ranking-card__heart discover-ranking-card__heart--active"
                            : "discover-ranking-card__heart"
                        }
                        onClick={() => toggleApiLike(post.id)}
                        aria-label={like.liked ? "좋아요 취소" : "좋아요"}
                      >
                        <HeartIcon filled={like.liked} />
                      </button>
                    </div>

                    <div className="discover-ranking-card__content">
                      <button
                        type="button"
                        className="discover-ranking-card__creator"
                        onClick={() =>
                          navigate(`/users/${post.author.username}`)
                        }
                      >
                        <div
                          style={{
                            width: "24px",
                            height: "24px",
                            flexShrink: 0,
                          }}
                        >
                          <Avatar author={post.author} />
                        </div>

                        <strong>@{post.author.username}</strong>
                      </button>

                      {Array.isArray(post.tags) && post.tags.length > 0 && (
                        <p>
                          {post.tags
                            .slice(0, 3)
                            .map((tag) => `#${tag}`)
                            .join(" ")}
                        </p>
                      )}

                      <div className="discover-ranking-card__engagement">
                        <span>♡ {formatCount(like.likeCount)}</span>

                        {commentCount > 0 && <span>댓글 {commentCount}</span>}
                      </div>
                    </div>
                  </article>
                );
              })}
            </section>
          ) : rankingType === "creator" && rankingCreators.length > 0 ? (
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
          ) : (
            <section className="discover-empty">
              <strong>이 조건의 랭킹이 아직 없어요.</strong>

              <p>기간이나 스타일 조건을 바꿔보세요.</p>

              {rankingStyle !== "전체" && (
                <button type="button" onClick={() => setRankingStyle("전체")}>
                  전체 스타일 보기
                </button>
              )}
            </section>
          )}
        </main>
      )}

      {/* =================================
          FOLLOWING
      ================================= */}

      {activeTab === "following" && (
        <main className="discover-following">
          {followingLoading ? (
            <section className="discover-empty">
              <strong>팔로잉 피드를 불러오고 있어요.</strong>

              <p>팔로우한 크리에이터의 최신 스타일을 확인하는 중이에요.</p>
            </section>
          ) : followingError ? (
            <section className="discover-empty">
              <strong>팔로잉 피드를 불러오지 못했어요.</strong>

              <p>서버와 로그인 상태를 확인해주세요.</p>
            </section>
          ) : filteredFollowingPosts.length > 0 ? (
            filteredFollowingPosts.map((post) => {
              const key = String(post.id);

              const like = apiLikeState[key] ?? {
                liked: false,
                likeCount: 0,
              };

              const commentCount = apiCommentCounts[key] ?? 0;

              return (
                <article key={post.id} className="discover-following-post">
                  <div className="discover-following-post__creator">
                    <button
                      type="button"
                      onClick={() => navigate(`/users/${post.author.username}`)}
                    >
                      <div
                        style={{
                          width: "36px",
                          height: "36px",
                          flexShrink: 0,
                        }}
                      >
                        <Avatar author={post.author} />
                      </div>

                      <div>
                        <strong>@{post.author.username}</strong>

                        <span>{post.location || "위치 미등록"}</span>
                      </div>
                    </button>
                  </div>

                  <button
                    type="button"
                    className="discover-following-post__photo"
                    onClick={() => navigate(`/styles/${post.id}`)}
                  >
                    <GalleryImage post={post} />
                  </button>

                  <div className="discover-following-post__actions">
                    <button
                      type="button"
                      disabled={apiLikePendingIds.has(key)}
                      className={
                        like.liked
                          ? "discover-following-post__like discover-following-post__like--active"
                          : "discover-following-post__like"
                      }
                      onClick={() => toggleApiLike(post.id)}
                      aria-label={like.liked ? "좋아요 취소" : "좋아요"}
                    >
                      <HeartIcon filled={like.liked} />
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
                      <strong>좋아요 {formatCount(like.likeCount)}개</strong>

                      <button
                        type="button"
                        onClick={() => openPostComments(post.id)}
                      >
                        댓글 {commentCount}개
                      </button>
                    </div>

                    {post.title && <p>{post.title}</p>}

                    {Array.isArray(post.tags) && post.tags.length > 0 && (
                      <div>
                        {post.tags.map((tag) => (
                          <span key={tag}>#{tag}</span>
                        ))}
                      </div>
                    )}
                  </div>
                </article>
              );
            })
          ) : (
            <section className="discover-empty">
              <strong>팔로잉 피드가 비어 있어요.</strong>

              <p>
                아직 아무도 팔로우하지 않았거나, 팔로우한 사용자가 아직 스타일을
                올리지 않았어요.
              </p>

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
