import { useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import {
  CURRENT_COMMUNITY_USER,
  getCommunityUser,
  getLikedStylePostIds,
  getStylePostLikeCount,
  getUserStylePosts,
  toggleStylePostLike,
} from "@/mocks/community";

import {
  getCommunityUserFollowerCount,
  isUserFollowed,
  toggleUserFollow,
} from "@/mocks/communityFollow";

import "./PublicProfilePage.css";

function BackIcon() {
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
      <path d="m15 18-6-6 6-6" />
    </svg>
  );
}

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.4" />

      <circle cx="12" cy="12" r="1.4" />

      <circle cx="19" cy="12" r="1.4" />
    </svg>
  );
}

function ShareIcon() {
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
      <circle cx="18" cy="5" r="2.4" />

      <circle cx="6" cy="12" r="2.4" />

      <circle cx="18" cy="19" r="2.4" />

      <path d="m8.2 10.8 7.5-4.3" />
      <path d="m8.2 13.2 7.5 4.3" />
    </svg>
  );
}

function GridIcon() {
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
      <rect x="4" y="4" width="6" height="6" />

      <rect x="14" y="4" width="6" height="6" />

      <rect x="4" y="14" width="6" height="6" />

      <rect x="14" y="14" width="6" height="6" />
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

function formatCount(value) {
  if (value >= 1000) {
    const formatted = (value / 1000).toFixed(1);

    return `${formatted.replace(".0", "")}K`;
  }

  return String(value);
}

function PublicProfilePage() {
  const navigate = useNavigate();

  const { username } = useParams();

  const user = getCommunityUser(username);

  const posts = useMemo(() => getUserStylePosts(username), [username]);

  const [following, setFollowing] = useState(() => isUserFollowed(username));

  const [likedPostIds, setLikedPostIds] = useState(
    () => new Set(getLikedStylePostIds()),
  );

  if (!user) {
    return (
      <div className="public-profile-not-found">
        <span>VESTI</span>

        <h1>사용자를 찾을 수 없어요.</h1>

        <p>존재하지 않거나 더 이상 볼 수 없는 프로필이에요.</p>

        <button type="button" onClick={() => navigate("/discover")}>
          발견으로 돌아가기
        </button>
      </div>
    );
  }

  const isMine =
    String(user.username) === String(CURRENT_COMMUNITY_USER.username);

  const followerCount = getCommunityUserFollowerCount(user);

  /* ========================================
     Follow
  ======================================== */

  const handleToggleFollow = () => {
    if (isMine) {
      return;
    }

    const result = toggleUserFollow(user.username);

    setFollowing(result.following);
  };

  /* ========================================
     Post Like
  ======================================== */

  const togglePostLike = (postId) => {
    const result = toggleStylePostLike(postId);

    setLikedPostIds((current) => {
      const next = new Set(current);

      const key = String(postId);

      if (result.liked) {
        next.add(key);
      } else {
        next.delete(key);
      }

      return next;
    });
  };

  /* ========================================
     Share
  ======================================== */

  const handleShare = async () => {
    const shareData = {
      title: `${user.displayName} (@${user.username})`,

      text: `${user.displayName}의 VESTI 스타일 프로필`,

      url: window.location.href,
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch {
        // 사용자가 공유창을 닫은 경우
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);

      window.alert("프로필 링크를 복사했어요.");
    } catch {
      window.alert("공유 기능은 추후 연결할게요.");
    }
  };

  return (
    <div className="public-profile-page">
      {/* =================================
          Header
      ================================= */}

      <header className="public-profile-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <strong>@{user.username}</strong>

        <button type="button" aria-label="더보기">
          <MoreIcon />
        </button>
      </header>

      {/* =================================
          Profile
      ================================= */}

      <section className="public-profile-hero">
        <div className="public-profile-identity">
          <img src={user.avatar} alt={`${user.displayName} 프로필`} />

          <div>
            <h1>{user.displayName}</h1>

            <span>@{user.username}</span>
          </div>
        </div>

        <div className="public-profile-stats">
          <div>
            <strong>{posts.length}</strong>

            <span>게시물</span>
          </div>

          <button type="button">
            <strong>{formatCount(followerCount)}</strong>

            <span>팔로워</span>
          </button>

          <button type="button">
            <strong>{formatCount(user.following)}</strong>

            <span>팔로잉</span>
          </button>
        </div>

        {user.bio && <p className="public-profile-bio">{user.bio}</p>}

        {Array.isArray(user.styleTags) && user.styleTags.length > 0 && (
          <div className="public-profile-tags">
            {user.styleTags.map((tag) => (
              <button
                key={tag}
                type="button"
                onClick={() => navigate("/discover")}
              >
                #{tag}
              </button>
            ))}
          </div>
        )}

        <div className="public-profile-actions">
          {!isMine && (
            <button
              type="button"
              className={
                following
                  ? "public-profile-follow public-profile-follow--active"
                  : "public-profile-follow"
              }
              onClick={handleToggleFollow}
            >
              {following ? "팔로잉" : "팔로우"}
            </button>
          )}

          <button
            type="button"
            className="public-profile-share"
            onClick={handleShare}
            aria-label="프로필 공유"
          >
            <ShareIcon />
          </button>
        </div>
      </section>

      {/* =================================
          Posts Tab
      ================================= */}

      <nav className="public-profile-tabs">
        <button
          type="button"
          className="public-profile-tabs__item public-profile-tabs__item--active"
        >
          <GridIcon />

          <span>게시물</span>
        </button>
      </nav>

      {/* =================================
          Posts
      ================================= */}

      {posts.length > 0 ? (
        <section className="public-profile-grid">
          {posts.map((post) => {
            const liked = likedPostIds.has(String(post.id));

            return (
              <article key={post.id} className="public-profile-post">
                <button
                  type="button"
                  className="public-profile-post__photo"
                  onClick={() => navigate(`/styles/${post.id}`)}
                >
                  <img src={post.image} alt={post.title} loading="lazy" />
                </button>

                <button
                  type="button"
                  className={
                    liked
                      ? "public-profile-post__heart public-profile-post__heart--active"
                      : "public-profile-post__heart"
                  }
                  onClick={() => togglePostLike(post.id)}
                >
                  <HeartIcon filled={liked} />
                </button>
              </article>
            );
          })}
        </section>
      ) : (
        <section className="public-profile-empty">
          <strong>아직 올린 스타일이 없어요.</strong>

          <p>새로운 스타일이 올라오면 이곳에서 볼 수 있어요.</p>
        </section>
      )}
    </div>
  );
}

export default PublicProfilePage;
