import apiClient from "@/api/apiClient";

import { mapStylePost } from "@/api/stylePostApi";

export async function getMyStylePostSaveStatus(stylePostId) {
  const response = await apiClient.get(
    `/api/style-posts/${stylePostId}/saves/me`,
  );

  return response.data;
}

export async function saveStylePost(stylePostId) {
  const response = await apiClient.post(
    `/api/style-posts/${stylePostId}/saves`,
  );

  return response.data;
}

export async function unsaveStylePost(stylePostId) {
  const response = await apiClient.delete(
    `/api/style-posts/${stylePostId}/saves`,
  );

  return response.data;
}

export async function getMySavedStylePosts({
  page = 0,
  size = 50,
  sort = "createdAt,desc",
} = {}) {
  const response = await apiClient.get("/api/users/me/saved-style-posts", {
    params: {
      page,
      size,
      sort,
    },
  });

  return {
    ...response.data,

    content: Array.isArray(response.data?.content)
      ? response.data.content.map(mapStylePost).filter(Boolean)
      : [],
  };
}
