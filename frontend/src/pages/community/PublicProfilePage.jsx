import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getMyProfile } from "@/api/authApi";

import { getUserStylePosts } from "@/api/stylePostApi";

import {
  getMyStylePostLikeStatus,
  likeStylePost,
  unlikeStylePost,
} from "@/api/stylePostLikeApi";

import { getPublicUser } from "@/api/userApi";

import {
  followUser,
  getMyFollowStatus,
  unfollowUser,
} from "@/api/userFollowApi";

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
  const number = Number(value ?? 0);

  if (number >= 1000) {
    const formatted = (number / 1000).toFixed(1);

    return formatted.replace(".0", "") + "K";
  }

  return String(number);
}

function getInitials(user) {
  const source = user?.displayName || user?.username || "V";

  return source.trim().charAt(0).toUpperCase();
}

function ProfileImage({ user }) {
  const [failed, setFailed] = useState(false);

  if (!user?.profileImageUrl || failed) {
    return (
      <div className="public-profile-identity__fallback" aria-hidden="true">
        {getInitials(user)}
      </div>
    );
  }

  return (
    <img
      src={user.profileImageUrl}
      alt={`${user.displayName} 프로필`}
      onError={() => setFailed(true)}
    />
  );
}

function PostImage({ post }) {
  const [failed, setFailed] = useState(false);

  if (!post?.image || failed) {
    return (
      <div
        aria-label={post?.title ?? ""}
        style={{
          width: "100%",
          height: "100%",
          minHeight: "150px",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          background: "#f3f2f0",
          color: "#aaa59f",
          fontSize: "10px",
        }}
      >
        이미지 준비 중
      </div>
    );
  }

  return (
    <img
      src={post.image}
      alt={post.title}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function PublicProfilePage() {
  const navigate = useNavigate();

  const { username } = useParams();

  const [user, setUser] = useState(null);

  const [posts, setPosts] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [following, setFollowing] = useState(false);

  const [followerCount, setFollowerCount] = useState(0);

  const [followingCount, setFollowingCount] = useState(0);

  const [likeState, setLikeState] = useState({});

  const [likePendingIds, setLikePendingIds] = useState(() => new Set());

  const [followPending, setFollowPending] = useState(false);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadProfile() {
      setLoading(true);
      setLoadError(false);

      try {
        const [userData, myProfile, postPage, followData] = await Promise.all([
          getPublicUser(username),

          getMyProfile(),

          getUserStylePosts(username, {
            page: 0,
            size: 50,
            sort: "createdAt,desc",
          }),

          getMyFollowStatus(username),
        ]);

        if (ignore) {
          return;
        }

        const postData = postPage.content ?? [];

        setUser(userData);

        setCurrentUser(myProfile);

        setPosts(postData);

        setFollowing(Boolean(followData?.following));

        setFollowerCount(followData?.followerCount ?? 0);

        setFollowingCount(followData?.followingCount ?? 0);

        const likeResults = await Promise.allSettled(
          postData.map((post) => getMyStylePostLikeStatus(post.id)),
        );

        if (ignore) {
          return;
        }

        const nextLikeState = {};

        postData.forEach((post, index) => {
          const result = likeResults[index];

          if (result.status === "fulfilled") {
            nextLikeState[String(post.id)] = {
              liked: Boolean(result.value?.liked),

              likeCount: result.value?.likeCount ?? 0,
            };
          } else {
            nextLikeState[String(post.id)] = {
              liked: false,
              likeCount: 0,
            };
          }
        });

        setLikeState(nextLikeState);
      } catch (error) {
        console.error("공개 프로필을 불러오지 못했습니다.", error);

        if (!ignore) {
          setUser(null);
          setPosts([]);
          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadProfile();

    return () => {
      ignore = true;
    };
  }, [username]);

  if (loading) {
    return (
      <div className="public-profile-not-found">
        <span>VESTI</span>

        <h1>프로필을 불러오고 있어요.</h1>

        <p>사용자 정보를 확인하는 중입니다.</p>
      </div>
    );
  }

  if (loadError || !user) {
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
    currentUser?.id != null &&
    user.id != null &&
    String(currentUser.id) === String(user.id);

  const handleToggleFollow = async () => {
    if (isMine || followPending) {
      return;
    }

    setFollowPending(true);

    try {
      const result = following
        ? await unfollowUser(user.username)
        : await followUser(user.username);

      setFollowing(Boolean(result.following));

      setFollowerCount(result.followerCount ?? 0);

      setFollowingCount(result.followingCount ?? 0);
    } catch (error) {
      console.error("팔로우 처리에 실패했습니다.", error);

      window.alert("팔로우 처리에 실패했어요.");
    } finally {
      setFollowPending(false);
    }
  };

  const togglePostLike = async (postId) => {
    const key = String(postId);

    if (likePendingIds.has(key)) {
      return;
    }

    const current = likeState[key] ?? {
      liked: false,
      likeCount: 0,
    };

    setLikePendingIds((previous) => {
      const next = new Set(previous);

      next.add(key);

      return next;
    });

    try {
      const result = current.liked
        ? await unlikeStylePost(postId)
        : await likeStylePost(postId);

      setLikeState((previous) => ({
        ...previous,

        [key]: {
          liked: Boolean(result.liked),

          likeCount: result.likeCount ?? 0,
        },
      }));
    } catch (error) {
      console.error("좋아요 처리에 실패했습니다.", error);

      window.alert("좋아요 처리에 실패했어요.");
    } finally {
      setLikePendingIds((previous) => {
        const next = new Set(previous);

        next.delete(key);

        return next;
      });
    }
  };

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
        // 공유창 취소
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);

      window.alert("프로필 링크를 복사했어요.");
    } catch {
      window.alert("공유 기능을 사용할 수 없어요.");
    }
  };

  return (
    <div className="public-profile-page">
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

      <section className="public-profile-hero">
        <div className="public-profile-identity">
          <ProfileImage user={user} />

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
            <strong>{formatCount(followingCount)}</strong>

            <span>팔로잉</span>
          </button>
        </div>

        {user.bio && <p className="public-profile-bio">{user.bio}</p>}

        <div className="public-profile-actions">
          {!isMine && (
            <button
              type="button"
              disabled={followPending}
              className={
                following
                  ? "public-profile-follow public-profile-follow--active"
                  : "public-profile-follow"
              }
              onClick={handleToggleFollow}
            >
              {followPending ? "처리 중" : following ? "팔로잉" : "팔로우"}
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

      <nav className="public-profile-tabs">
        <button
          type="button"
          className="public-profile-tabs__item public-profile-tabs__item--active"
        >
          <GridIcon />

          <span>게시물</span>
        </button>
      </nav>

      {posts.length > 0 ? (
        <section className="public-profile-grid">
          {posts.map((post) => {
            const key = String(post.id);

            const like = likeState[key] ?? {
              liked: false,
              likeCount: 0,
            };

            return (
              <article key={post.id} className="public-profile-post">
                <button
                  type="button"
                  className="public-profile-post__photo"
                  onClick={() => navigate(`/styles/${post.id}`)}
                >
                  <PostImage post={post} />
                </button>

                <button
                  type="button"
                  disabled={likePendingIds.has(key)}
                  className={
                    like.liked
                      ? "public-profile-post__heart public-profile-post__heart--active"
                      : "public-profile-post__heart"
                  }
                  onClick={() => togglePostLike(post.id)}
                  aria-label={like.liked ? "좋아요 취소" : "좋아요"}
                >
                  <HeartIcon filled={like.liked} />
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
