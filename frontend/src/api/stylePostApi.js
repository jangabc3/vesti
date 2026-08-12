import apiClient from "@/api/apiClient";

/*
 * 백엔드 StylePostResponse를
 * 현재 프론트 Community UI가 사용하는 형태로 변환한다.
 *
 * 지금 프론트는 아직 Mock 기반 구조를 사용하기 때문에
 * API 교체를 한 번에 하지 않고 Adapter를 두어서
 * 기존 UI를 최대한 유지한다.
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
