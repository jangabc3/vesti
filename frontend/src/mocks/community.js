const LOCAL_STORAGE_KEY = "vesti-community-style-posts";

const LIKED_STYLE_POSTS_KEY = "vesti-liked-style-posts";

const SAVED_STYLE_POSTS_KEY = "vesti-saved-style-posts";

export const CURRENT_COMMUNITY_USER = {
  username: "vesti_user",

  displayName: "VESTI 사용자",

  avatar:
    "https://images.unsplash.com/photo-1535713875002-d1d0cf377fde?auto=format&fit=crop&w=300&q=88",

  bio: "내 옷장과 일상의 스타일을 기록하고 있어요.",

  followers: 0,
  following: 0,

  styleTags: ["데일리", "캐주얼"],
};

/* ========================================
   기본 Community Mock
======================================== */

const baseStylePosts = [
  {
    id: 1,

    author: {
      username: "mori",
      displayName: "모리",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=88",

      bio: "편안한 실루엣과 뉴트럴 컬러를 좋아해요.",

      followers: 1842,
      following: 183,

      styleTags: ["미니멀", "캐주얼", "뉴트럴"],
    },

    image:
      "https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=90",

    title: "성수에서 가볍게 입은 여름 룩",

    caption:
      "가볍게 입되 너무 평범하지 않도록. 저녁 산책까지 생각해서 실루엣과 컬러를 편하게 맞췄어요.",

    location: "성수",
    timeAgo: "2시간 전",

    tags: ["미니멀", "여름", "데일리"],

    likes: 842,
    comments: 37,

    wornPieces: [
      {
        id: "piece-1",

        category: "TOP",

        name: "Ivory Linen Shirt",

        brand: "COS",
        color: "Ivory",

        referenceImage:
          "https://images.unsplash.com/photo-1603252110481-7ba873bf42ab?auto=format&fit=crop&w=600&q=85",

        matched: {
          name: "코튼 반소매 셔츠",

          brand: "COS",
          color: "아이보리",

          image:
            "https://images.unsplash.com/photo-1620799140408-edc6dcb6d633?auto=format&fit=crop&w=600&q=85",
        },
      },

      {
        id: "piece-2",

        category: "BOTTOM",

        name: "Wide Trousers",

        brand: "MUJI",
        color: "Beige",

        referenceImage:
          "https://images.unsplash.com/photo-1594633312681-425c7b97ccd1?auto=format&fit=crop&w=600&q=85",

        matched: {
          name: "와이드 투턱 슬랙스",

          brand: "MUJI",
          color: "베이지",

          image:
            "https://images.unsplash.com/photo-1594633313593-bab3825d0caf?auto=format&fit=crop&w=600&q=85",
        },
      },

      {
        id: "piece-3",

        category: "SHOES",

        name: "Black Loafers",

        brand: "MARGARET HOWELL",

        color: "Black",

        referenceImage:
          "https://images.unsplash.com/photo-1614252369475-531eba835eb1?auto=format&fit=crop&w=600&q=85",

        matched: null,
      },
    ],
  },

  {
    id: 2,

    author: {
      username: "soop",
      displayName: "숲",

      avatar:
        "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=300&q=88",

      bio: "깨끗한 컬러와 자연스러운 데일리 룩.",

      followers: 932,
      following: 201,

      styleTags: ["화이트", "클린", "데일리"],
    },

    image:
      "https://images.unsplash.com/photo-1496747611176-843222e1e57c?auto=format&fit=crop&w=1000&q=88",

    title: "화이트 톤으로 정리한 데일리 룩",

    caption: "톤을 정리하고 소재감을 다르게 가져간 여름 스타일.",

    location: "한남",
    timeAgo: "4시간 전",

    tags: ["미니멀", "화이트"],

    likes: 1200,
    comments: 64,

    wornPieces: [],
  },

  {
    id: 3,

    author: {
      username: "yuha",
      displayName: "유하",

      avatar:
        "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=300&q=88",

      bio: "블랙과 스트릿 무드를 좋아합니다.",

      followers: 2401,
      following: 95,

      styleTags: ["스트릿", "블랙", "시티"],
    },

    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1000&q=88",

    title: "블랙으로 힘을 준 시티 룩",

    caption: "심플한 블랙 컬러 안에서 실루엣 차이로 포인트를 줬어요.",

    location: "도산",
    timeAgo: "5시간 전",

    tags: ["스트릿", "블랙"],

    likes: 963,
    comments: 42,

    wornPieces: [],
  },

  {
    id: 4,

    author: {
      username: "seoa",
      displayName: "서아",

      avatar:
        "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=300&q=88",

      bio: "편하게 오래 입을 수 있는 옷을 좋아해요.",

      followers: 687,
      following: 311,

      styleTags: ["캐주얼", "주말", "내추럴"],
    },

    image:
      "https://images.unsplash.com/photo-1485968579580-b6d095142e6e?auto=format&fit=crop&w=1000&q=88",

    title: "주말에 입고 싶은 편안한 조합",

    caption: "오래 걸어도 편하고 사진에도 자연스럽게 나오는 주말 룩.",

    location: "연남",
    timeAgo: "어제",

    tags: ["캐주얼", "주말"],

    likes: 687,
    comments: 19,

    wornPieces: [],
  },

  {
    id: 5,

    author: {
      username: "mori",
      displayName: "모리",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=88",

      bio: "편안한 실루엣과 뉴트럴 컬러를 좋아해요.",

      followers: 1842,
      following: 183,

      styleTags: ["미니멀", "캐주얼", "뉴트럴"],
    },

    image:
      "https://images.unsplash.com/photo-1539109136881-3be0616acf4b?auto=format&fit=crop&w=1000&q=88",

    title: "조용한 컬러의 주말 스타일",

    caption: "컬러보다 실루엣에 집중한 편안한 주말 코디.",

    location: "서촌",
    timeAgo: "3일 전",

    tags: ["미니멀", "뉴트럴"],

    likes: 621,
    comments: 21,

    wornPieces: [],
  },

  {
    id: 6,

    author: {
      username: "mori",
      displayName: "모리",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=88",

      bio: "편안한 실루엣과 뉴트럴 컬러를 좋아해요.",

      followers: 1842,
      following: 183,

      styleTags: ["미니멀", "캐주얼", "뉴트럴"],
    },

    image:
      "https://images.unsplash.com/photo-1483985988355-763728e1935b?auto=format&fit=crop&w=1000&q=88",

    title: "출근에도 좋은 뉴트럴 레이어드",

    caption: "자연스러운 베이지 컬러를 중심으로 정리했어요.",

    location: "을지로",
    timeAgo: "5일 전",

    tags: ["출근", "미니멀"],

    likes: 731,
    comments: 28,

    wornPieces: [],
  },

  {
    id: 7,

    author: {
      username: "mori",
      displayName: "모리",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=88",

      bio: "편안한 실루엣과 뉴트럴 컬러를 좋아해요.",

      followers: 1842,
      following: 183,

      styleTags: ["미니멀", "캐주얼", "뉴트럴"],
    },

    image:
      "https://images.unsplash.com/photo-1509631179647-0177331693ae?auto=format&fit=crop&w=1000&q=88",

    title: "블랙을 부드럽게 입는 방법",

    caption: "전체를 무겁게 만들지 않도록 소재 차이를 활용했어요.",

    location: "압구정",
    timeAgo: "1주 전",

    tags: ["블랙", "미니멀"],

    likes: 1012,
    comments: 52,

    wornPieces: [],
  },

  {
    id: 8,

    author: {
      username: "mori",
      displayName: "모리",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=88",

      bio: "편안한 실루엣과 뉴트럴 컬러를 좋아해요.",

      followers: 1842,
      following: 183,

      styleTags: ["미니멀", "캐주얼", "뉴트럴"],
    },

    image:
      "https://images.unsplash.com/photo-1469334031218-e382a71b716b?auto=format&fit=crop&w=1000&q=88",

    title: "한 가지 톤으로 만든 데일리 룩",

    caption: "톤온톤으로 맞추고 액세서리만 작게 포인트를 줬어요.",

    location: "한남",
    timeAgo: "1주 전",

    tags: ["데일리", "뉴트럴"],

    likes: 544,
    comments: 17,

    wornPieces: [],
  },

  {
    id: 9,

    author: {
      username: "mori",
      displayName: "모리",

      avatar:
        "https://images.unsplash.com/photo-1494790108377-be9c29b29330?auto=format&fit=crop&w=300&q=88",

      bio: "편안한 실루엣과 뉴트럴 컬러를 좋아해요.",

      followers: 1842,
      following: 183,

      styleTags: ["미니멀", "캐주얼", "뉴트럴"],
    },

    image:
      "https://images.unsplash.com/photo-1524250502761-1ac6f2e30d43?auto=format&fit=crop&w=1000&q=88",

    title: "가볍게 나가는 날의 캐주얼 룩",

    caption: "꾸민 느낌 없이 비율만 신경 쓴 데일리 스타일.",

    location: "망원",
    timeAgo: "2주 전",

    tags: ["캐주얼", "데일리"],

    likes: 472,
    comments: 13,

    wornPieces: [],
  },
];

/* ========================================
   Local Storage 공통
======================================== */

function readStringSet(storageKey) {
  if (typeof window === "undefined") {
    return new Set();
  }

  try {
    const stored = window.localStorage.getItem(storageKey);

    if (!stored) {
      return new Set();
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return new Set();
    }

    return new Set(parsed.map(String));
  } catch (error) {
    console.warn(`${storageKey} 데이터를 불러오지 못했습니다.`, error);

    return new Set();
  }
}

function persistStringSet(storageKey, values) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(storageKey, JSON.stringify([...values]));

    return true;
  } catch (error) {
    console.warn(`${storageKey} 데이터를 저장하지 못했습니다.`, error);

    return false;
  }
}

/* ========================================
   Local Community Posts
======================================== */

function readLocalStylePosts() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(LOCAL_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed;
  } catch (error) {
    console.warn("VESTI community mock 데이터를 불러오지 못했습니다.", error);

    return [];
  }
}

function persistLocalStylePosts() {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    const myPosts = stylePosts
      .filter((post) => post.isMine === true)
      .slice(0, 8);

    window.localStorage.setItem(LOCAL_STORAGE_KEY, JSON.stringify(myPosts));

    return true;
  } catch (error) {
    console.warn("VESTI community mock 데이터를 저장하지 못했습니다.", error);

    return false;
  }
}

/* ========================================
   전체 게시물
======================================== */

const localStylePosts = readLocalStylePosts();

export const stylePosts = [...localStylePosts, ...baseStylePosts];

/* ========================================
   Like
======================================== */

export function getLikedStylePostIds() {
  return [...readStringSet(LIKED_STYLE_POSTS_KEY)];
}

export function isStylePostLiked(styleId) {
  return readStringSet(LIKED_STYLE_POSTS_KEY).has(String(styleId));
}

export function getStylePostLikeCount(postOrId) {
  const post = typeof postOrId === "object" ? postOrId : getStylePost(postOrId);

  if (!post) {
    return 0;
  }

  return post.likes + (isStylePostLiked(post.id) ? 1 : 0);
}

export function toggleStylePostLike(styleId) {
  const ids = readStringSet(LIKED_STYLE_POSTS_KEY);

  const key = String(styleId);

  let liked;

  if (ids.has(key)) {
    ids.delete(key);

    liked = false;
  } else {
    ids.add(key);

    liked = true;
  }

  persistStringSet(LIKED_STYLE_POSTS_KEY, ids);

  return {
    liked,

    count: getStylePostLikeCount(styleId),
  };
}

/* ========================================
   Save
======================================== */

export function getSavedStylePostIds() {
  return [...readStringSet(SAVED_STYLE_POSTS_KEY)];
}

export function isStylePostSaved(styleId) {
  return readStringSet(SAVED_STYLE_POSTS_KEY).has(String(styleId));
}

export function toggleStylePostSave(styleId) {
  const ids = readStringSet(SAVED_STYLE_POSTS_KEY);

  const key = String(styleId);

  let saved;

  if (ids.has(key)) {
    ids.delete(key);

    saved = false;
  } else {
    ids.add(key);

    saved = true;
  }

  persistStringSet(SAVED_STYLE_POSTS_KEY, ids);

  return saved;
}

export function getSavedStylePosts() {
  const ids = readStringSet(SAVED_STYLE_POSTS_KEY);

  return stylePosts.filter((post) => ids.has(String(post.id)));
}

/* ========================================
   Create
======================================== */

export function createStylePost({
  image,
  title,
  caption,
  location,
  styleTags = [],
  tpoTags = [],
  wornPieces = [],
}) {
  const createdAt = new Date();

  const uniqueTags = [...new Set([...styleTags, ...tpoTags])];

  const newPost = {
    id: `local-${createdAt.getTime()}`,

    isMine: true,

    createdAt: createdAt.toISOString(),

    author: {
      ...CURRENT_COMMUNITY_USER,

      styleTags:
        styleTags.length > 0 ? styleTags : CURRENT_COMMUNITY_USER.styleTags,
    },

    image,

    title: title || "오늘의 스타일",

    caption: caption || "오늘의 스타일을 공유했어요.",

    location: location || "위치 미등록",

    timeAgo: "방금 전",

    tags: uniqueTags.length > 0 ? uniqueTags : ["데일리"],

    tpoTags,

    likes: 0,
    comments: 0,

    wornPieces,
  };

  stylePosts.unshift(newPost);

  persistLocalStylePosts();

  return newPost;
}

/* ========================================
   Update
======================================== */

export function updateLocalStylePost(
  styleId,
  {
    image,
    title,
    caption,
    location,
    styleTags = [],
    tpoTags = [],
    wornPieces = [],
  },
) {
  const index = stylePosts.findIndex(
    (post) => String(post.id) === String(styleId),
  );

  if (index === -1) {
    return null;
  }

  const currentPost = stylePosts[index];

  if (currentPost.isMine !== true) {
    return null;
  }

  const uniqueTags = [...new Set([...styleTags, ...tpoTags])];

  const updatedPost = {
    ...currentPost,

    image: image ?? currentPost.image,

    title: title || "오늘의 스타일",

    caption: caption || "",

    location: location || "위치 미등록",

    tags: uniqueTags.length > 0 ? uniqueTags : ["데일리"],

    tpoTags,

    wornPieces,

    updatedAt: new Date().toISOString(),

    timeAgo: "방금 수정",
  };

  stylePosts.splice(index, 1, updatedPost);

  persistLocalStylePosts();

  return updatedPost;
}

/* ========================================
   Delete
======================================== */

export function deleteLocalStylePost(styleId) {
  const index = stylePosts.findIndex(
    (post) => String(post.id) === String(styleId),
  );

  if (index === -1) {
    return false;
  }

  const target = stylePosts[index];

  if (target.isMine !== true) {
    return false;
  }

  stylePosts.splice(index, 1);

  const key = String(styleId);

  const likedIds = readStringSet(LIKED_STYLE_POSTS_KEY);

  likedIds.delete(key);

  persistStringSet(LIKED_STYLE_POSTS_KEY, likedIds);

  const savedIds = readStringSet(SAVED_STYLE_POSTS_KEY);

  savedIds.delete(key);

  persistStringSet(SAVED_STYLE_POSTS_KEY, savedIds);

  persistLocalStylePosts();

  return true;
}

/* ========================================
   Queries
======================================== */

export function getStylePost(styleId) {
  return stylePosts.find((post) => String(post.id) === String(styleId));
}

export function getCommunityUser(username) {
  if (username === CURRENT_COMMUNITY_USER.username) {
    const myPosts = getUserStylePosts(username);

    const recentTags = [
      ...new Set(myPosts.flatMap((post) => post.tags ?? [])),
    ].slice(0, 3);

    return {
      ...CURRENT_COMMUNITY_USER,

      styleTags:
        recentTags.length > 0 ? recentTags : CURRENT_COMMUNITY_USER.styleTags,
    };
  }

  const post = stylePosts.find((item) => item.author.username === username);

  return post?.author ?? null;
}

export function getUserStylePosts(username) {
  return stylePosts.filter((post) => post.author.username === username);
}
