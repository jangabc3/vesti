import { CURRENT_COMMUNITY_USER } from "@/mocks/community";

const FOLLOW_STORAGE_KEY = "vesti-followed-users";

/* ========================================
   Storage
======================================== */

function readFollowedUsers() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    const stored = window.localStorage.getItem(FOLLOW_STORAGE_KEY);

    if (!stored) {
      return [];
    }

    const parsed = JSON.parse(stored);

    if (!Array.isArray(parsed)) {
      return [];
    }

    return parsed.map(String);
  } catch (error) {
    console.warn("VESTI 팔로우 정보를 불러오지 못했습니다.", error);

    return [];
  }
}

function persistFollowedUsers(usernames) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(FOLLOW_STORAGE_KEY, JSON.stringify(usernames));

    return true;
  } catch (error) {
    console.warn("VESTI 팔로우 정보를 저장하지 못했습니다.", error);

    return false;
  }
}

/* ========================================
   Read
======================================== */

export function getFollowedUsernames() {
  return readFollowedUsers();
}

export function isUserFollowed(username) {
  if (!username) {
    return false;
  }

  const key = String(username);

  return readFollowedUsers().includes(key);
}

/* ========================================
   Toggle Follow
======================================== */

export function toggleUserFollow(username) {
  if (!username) {
    return {
      following: false,
      usernames: readFollowedUsers(),
    };
  }

  const key = String(username);

  /*
    자기 자신은 팔로우할 수 없다.
  */
  if (key === String(CURRENT_COMMUNITY_USER.username)) {
    return {
      following: false,
      usernames: readFollowedUsers(),
    };
  }

  const current = readFollowedUsers();

  const next = new Set(current);

  let following;

  if (next.has(key)) {
    next.delete(key);

    following = false;
  } else {
    next.add(key);

    following = true;
  }

  const usernames = Array.from(next);

  persistFollowedUsers(usernames);

  return {
    following,
    usernames,
  };
}

/* ========================================
   Follow Count
======================================== */

export function getCommunityUserFollowerCount(user) {
  if (!user) {
    return 0;
  }

  const baseFollowers = Number(user.followers ?? 0);

  /*
    현재 로그인 사용자가 이 사용자를
    팔로우했다면 화면에서 +1 해준다.

    실제 백엔드에서는 서버가 최종 숫자를
    계산해서 내려주게 된다.
  */
  return baseFollowers + (isUserFollowed(user.username) ? 1 : 0);
}
