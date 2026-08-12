import apiClient from "@/api/apiClient";

export async function getMyFollowStatus(username) {
  const response = await apiClient.get(`/api/users/${username}/follow/me`);

  return response.data;
}

export async function followUser(username) {
  const response = await apiClient.post(`/api/users/${username}/follow`);

  return response.data;
}

export async function unfollowUser(username) {
  const response = await apiClient.delete(`/api/users/${username}/follow`);

  return response.data;
}

export async function getFollowers(username, { page = 0, size = 20 } = {}) {
  const response = await apiClient.get(`/api/users/${username}/followers`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
}

export async function getFollowing(username, { page = 0, size = 20 } = {}) {
  const response = await apiClient.get(`/api/users/${username}/following`, {
    params: {
      page,
      size,
    },
  });

  return response.data;
}
