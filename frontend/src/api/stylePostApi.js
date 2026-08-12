import apiClient from "@/api/apiClient";

/*
 * 백엔드 StylePostResponse를
 * 현재 프론트 Community UI가 사용하는 형태로 변환한다.
 *
 * 기존 Community UI 구조를 최대한 유지하기 위해
 * Adapter 역할을 한다.
 */
export function mapStylePost(post) {
  if (!post) {
    return null;
  }

  return {
    id: post.id,

    author: {
      id: post.author?.id ?? null,

      username: post.author?.username ?? "unknown",

      displayName:
        post.author?.displayName ?? post.author?.username ?? "VESTI 사용자",

      avatar: post.author?.profileImageUrl ?? "",

      profileImageUrl: post.author?.profileImageUrl ?? null,

      bio: "",

      followers: 0,
      following: 0,

      styleTags: [],
    },

    image: post.imageUrl ?? "",

    imageUrl: post.imageUrl ?? "",

    title: post.title ?? "오늘의 스타일",

    caption: post.caption ?? "",

    location: post.location ?? "위치 미등록",

    tags: [],

    tpoTags: [],

    wornPieces: [],

    likes: 0,

    comments: 0,

    createdAt: post.createdAt ?? null,

    updatedAt: post.updatedAt ?? null,

    timeAgo: formatTimeAgo(post.createdAt),
  };
}

export async function getStylePosts({ page = 0, size = 20, sort } = {}) {
  const params = {
    page,
    size,
  };

  if (sort) {
    params.sort = sort;
  }

  const response = await apiClient.get("/api/style-posts", {
    params,
  });

  return {
    ...response.data,

    content: Array.isArray(response.data?.content)
      ? response.data.content.map(mapStylePost).filter(Boolean)
      : [],
  };
}

export async function getStylePost(stylePostId) {
  const response = await apiClient.get(`/api/style-posts/${stylePostId}`);

  return mapStylePost(response.data);
}

export async function getUserStylePosts(
  username,
  { page = 0, size = 20, sort } = {},
) {
  const params = {
    username,
    page,
    size,
  };

  if (sort) {
    params.sort = sort;
  }

  const response = await apiClient.get("/api/style-posts", {
    params,
  });

  return {
    ...response.data,

    content: Array.isArray(response.data?.content)
      ? response.data.content.map(mapStylePost).filter(Boolean)
      : [],
  };
}

export async function createStylePost({ title, caption, imageUrl, location }) {
  const response = await apiClient.post("/api/style-posts", {
    title,
    caption,
    imageUrl,
    location,
  });

  return mapStylePost(response.data);
}

export async function updateStylePost(
  stylePostId,
  { title, caption, imageUrl, location },
) {
  const response = await apiClient.put(`/api/style-posts/${stylePostId}`, {
    title,
    caption,
    imageUrl,
    location,
  });

  return mapStylePost(response.data);
}

export async function deleteStylePost(stylePostId) {
  await apiClient.delete(`/api/style-posts/${stylePostId}`);
}

/*
 * Today의 인기 스타일 정렬에 사용한다.
 *
 * 백엔드:
 * GET /api/style-posts/{stylePostId}/likes/me
 *
 * 응답 예:
 * {
 *   stylePostId: 2,
 *   liked: true,
 *   likeCount: 10
 * }
 */
export async function getStylePostLikeSummary(stylePostId) {
  const response = await apiClient.get(
    `/api/style-posts/${stylePostId}/likes/me`,
  );

  return {
    stylePostId: response.data?.stylePostId ?? stylePostId,

    liked: Boolean(response.data?.liked),

    likeCount: Number(response.data?.likeCount ?? 0),
  };
}

function formatTimeAgo(createdAt) {
  if (!createdAt) {
    return "";
  }

  const createdTime = new Date(createdAt).getTime();

  if (Number.isNaN(createdTime)) {
    return "";
  }

  const diffMilliseconds = Date.now() - createdTime;

  const diffMinutes = Math.floor(diffMilliseconds / 60000);

  if (diffMinutes < 1) {
    return "방금 전";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);

  if (diffDays < 7) {
    return `${diffDays}일 전`;
  }

  const diffWeeks = Math.floor(diffDays / 7);

  if (diffWeeks < 5) {
    return `${diffWeeks}주 전`;
  }

  return new Date(createdAt).toLocaleDateString("ko-KR");
}
