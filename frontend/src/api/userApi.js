import apiClient from "@/api/apiClient";

export async function getPublicUser(username) {
  const response = await apiClient.get(`/api/users/${username}`);

  return mapPublicUser(response.data);
}

function mapPublicUser(user) {
  if (!user) {
    return null;
  }

  return {
    id: user.id,

    username: user.username ?? "unknown",

    displayName: user.displayName ?? user.username ?? "VESTI 사용자",

    profileImageUrl: user.profileImageUrl ?? null,

    avatar: user.profileImageUrl ?? "",

    bio: user.bio ?? "",
  };
}
