import apiClient from "@/api/apiClient";

export async function getStylePostComments(stylePostId) {
  const response = await apiClient.get(
    `/api/style-posts/${stylePostId}/comments`,
  );

  return Array.isArray(response.data) ? response.data.map(mapComment) : [];
}

export async function createStylePostComment(stylePostId, content) {
  const response = await apiClient.post(
    `/api/style-posts/${stylePostId}/comments`,
    {
      content,
    },
  );

  return mapComment(response.data);
}

export async function deleteStylePostComment(commentId) {
  await apiClient.delete(`/api/style-post-comments/${commentId}`);
}

function mapComment(comment) {
  if (!comment) {
    return null;
  }

  return {
    id: comment.id,

    stylePostId: comment.stylePostId,

    author: {
      id: comment.author?.id ?? null,

      username: comment.author?.username ?? "unknown",

      displayName:
        comment.author?.displayName ??
        comment.author?.username ??
        "VESTI 사용자",

      avatar: comment.author?.profileImageUrl ?? "",

      profileImageUrl: comment.author?.profileImageUrl ?? null,
    },

    content: comment.content ?? "",

    createdAt: comment.createdAt ?? null,

    updatedAt: comment.updatedAt ?? null,
  };
}
