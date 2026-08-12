import apiClient from "@/api/apiClient";

export async function getMyStylePostLikeStatus(stylePostId) {
  const response = await apiClient.get(
    `/api/style-posts/${stylePostId}/likes/me`,
  );

  return response.data;
}

export async function likeStylePost(stylePostId) {
  const response = await apiClient.post(
    `/api/style-posts/${stylePostId}/likes`,
  );

  return response.data;
}

export async function unlikeStylePost(stylePostId) {
  const response = await apiClient.delete(
    `/api/style-posts/${stylePostId}/likes`,
  );

  return response.data;
}
