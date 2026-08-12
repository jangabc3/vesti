import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMyProfile } from "@/api/authApi";

import { getUserStylePosts } from "@/api/stylePostApi";

import { getMyFollowStatus } from "@/api/userFollowApi";

import "./MyPage.css";

function ChevronRightIcon() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function UserIcon() {
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
      <circle cx="12" cy="8" r="3.5" />

      <path d="M5 21a7 7 0 0 1 14 0" />
    </svg>
  );
}

function LockIcon() {
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
      <rect x="5" y="10" width="14" height="10" rx="2" />

      <path d="M8 10V7a4 4 0 0 1 8 0v3" />
    </svg>
  );
}

function InfoIcon() {
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
      <circle cx="12" cy="12" r="9" />

      <path d="M12 11v6" />

      <path d="M12 7.5h.01" />
    </svg>
  );
}

function LogoutIcon() {
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
      <path d="M10 5H6a2 2 0 0 0-2 2v10a2 2 0 0 0 2 2h4" />

      <path d="m15 8 4 4-4 4" />

      <path d="M9 12h10" />
    </svg>
  );
}

function MenuRow({ icon, title, description, value, onClick }) {
  const content = (
    <>
      <div className="my-menu__icon">{icon}</div>

      <div className="my-menu__content">
        <strong>{title}</strong>

        {description && <span>{description}</span>}
      </div>

      {value ? (
        <span className="my-menu__value">{value}</span>
      ) : (
        <ChevronRightIcon />
      )}
    </>
  );

  if (!onClick) {
    return <div className="my-menu my-menu--static">{content}</div>;
  }

  return (
    <button type="button" className="my-menu" onClick={onClick}>
      {content}
    </button>
  );
}

function formatCount(value) {
  const number = Number(value ?? 0);

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return String(number);
}

function getInitials(user) {
  const source = user?.displayName || user?.username || "V";

  return source.trim().charAt(0).toUpperCase();
}

function ProfileAvatar({ user }) {
  const [failed, setFailed] = useState(false);

  if (!user?.profileImageUrl || failed) {
    return (
      <div className="my-profile__avatar">
        <span>{getInitials(user)}</span>
      </div>
    );
  }

  return (
    <div className="my-profile__avatar">
      <img
        src={user.profileImageUrl}
        alt={`${user.displayName} 프로필`}
        onError={() => setFailed(true)}
      />
    </div>
  );
}

function MyPage() {
  const navigate = useNavigate();

  const [currentUser, setCurrentUser] = useState(null);

  const [postCount, setPostCount] = useState(0);

  const [followerCount, setFollowerCount] = useState(0);

  const [followingCount, setFollowingCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMyPage() {
      setLoading(true);

      setLoadError(false);

      try {
        /*
         * 1. 로그인 사용자 조회
         */
        const myProfile = await getMyProfile();

        if (ignore) {
          return;
        }

        setCurrentUser(myProfile);

        /*
         * 2. 내 게시물 + Follow 통계
         */
        const [postResult, followResult] = await Promise.allSettled([
          getUserStylePosts(myProfile.username, {
            page: 0,
            size: 1,
            sort: "createdAt,desc",
          }),

          getMyFollowStatus(myProfile.username),
        ]);

        if (ignore) {
          return;
        }

        if (postResult.status === "fulfilled") {
          setPostCount(
            postResult.value?.totalElements ??
              postResult.value?.content?.length ??
              0,
          );
        } else {
          setPostCount(0);

          console.error(
            "내 게시물 수를 불러오지 못했습니다.",
            postResult.reason,
          );
        }

        if (followResult.status === "fulfilled") {
          setFollowerCount(followResult.value?.followerCount ?? 0);

          setFollowingCount(followResult.value?.followingCount ?? 0);
        } else {
          setFollowerCount(0);

          setFollowingCount(0);

          console.error(
            "팔로우 정보를 불러오지 못했습니다.",
            followResult.reason,
          );
        }
      } catch (error) {
        console.error("마이 페이지 정보를 불러오지 못했습니다.", error);

        if (!ignore) {
          setCurrentUser(null);

          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMyPage();

    return () => {
      ignore = true;
    };
  }, []);

  const handleMyInfo = () => {
    if (!currentUser) {
      return;
    }

    navigate(`/users/${currentUser.username}`);
  };

  const handlePasswordChange = () => {
    window.alert("비밀번호 변경 화면은 다음 계정 설정 단계에서 연결할게요.");
  };

  const handleLogout = () => {
    const confirmed = window.confirm("로그아웃하시겠습니까?");

    if (!confirmed) {
      return;
    }

    /*
     * 아직 LoginPage가 없기 때문에
     * 토큰을 바로 삭제하면 앱의 다른
     * 인증 API가 전부 403이 된다.
     *
     * 로그인 화면 구현 시 실제 로그아웃으로
     * 교체한다.
     */
    window.alert("로그인 화면을 만든 뒤 실제 로그아웃과 연결할게요.");
  };

  if (loading) {
    return (
      <div className="my-page">
        <div className="my-state">
          <strong>내 정보를 불러오고 있어요.</strong>

          <p>로그인 사용자 정보를 확인하는 중입니다.</p>
        </div>
      </div>
    );
  }

  if (loadError || !currentUser) {
    return (
      <div className="my-page">
        <div className="my-state">
          <strong>내 정보를 불러오지 못했어요.</strong>

          <p>백엔드 서버와 로그인 상태를 확인해주세요.</p>

          <button type="button" onClick={() => window.location.reload()}>
            다시 불러오기
          </button>
        </div>
      </div>
    );
  }

  const displayName = currentUser.displayName || currentUser.username;

  const bio = currentUser.bio?.trim();

  return (
    <div className="my-page">
      {/* =================================
          Header
      ================================= */}

      <header className="my-header">
        <span className="my-header__eyebrow">MY</span>

        <h1>마이</h1>

        <p>내 스타일과 계정을 한곳에서 관리하세요.</p>
      </header>

      {/* =================================
          Profile
      ================================= */}

      <section className="my-profile">
        <ProfileAvatar user={currentUser} />

        <div className="my-profile__content">
          <span className="my-profile__label">MY PROFILE</span>

          <h2>{displayName}</h2>

          <p>@{currentUser.username}</p>
        </div>

        <button
          type="button"
          className="my-profile__button"
          onClick={handleMyInfo}
          aria-label="내 프로필 보기"
        >
          <ChevronRightIcon />
        </button>
      </section>

      {/* =================================
          Social
      ================================= */}

      <section className="my-social">
        <button type="button" onClick={handleMyInfo}>
          <strong>{formatCount(postCount)}</strong>

          <span>게시물</span>
        </button>

        <button type="button" onClick={handleMyInfo}>
          <strong>{formatCount(followerCount)}</strong>

          <span>팔로워</span>
        </button>

        <button type="button" onClick={handleMyInfo}>
          <strong>{formatCount(followingCount)}</strong>

          <span>팔로잉</span>
        </button>
      </section>

      {/* =================================
          Bio
      ================================= */}

      {bio && (
        <section className="my-bio">
          <span>ABOUT</span>

          <p>{bio}</p>
        </section>
      )}

      {/* =================================
          VESTI Summary

          실제 Clothing / Coordination /
          CoordinationRecord 연결 전이므로
          가짜 숫자는 표시하지 않는다.
      ================================= */}

      <section className="my-summary">
        <div className="my-section-heading">
          <span>나의 VESTI</span>
        </div>

        <div className="my-summary__grid">
          <button
            type="button"
            className="my-summary__item"
            onClick={() => navigate("/closet")}
          >
            <strong>—</strong>

            <span>등록한 옷</span>
          </button>

          <button
            type="button"
            className="my-summary__item"
            onClick={() => navigate("/outfits")}
          >
            <strong>—</strong>

            <span>저장한 코디</span>
          </button>

          <button
            type="button"
            className="my-summary__item"
            onClick={() => navigate("/history")}
          >
            <strong>—</strong>

            <span>착용 기록</span>
          </button>
        </div>

        <p className="my-summary__notice">
          옷장과 착용 기록은 다음 데이터 연결 단계에서 실제 개수로 표시됩니다.
        </p>
      </section>

      {/* =================================
          Account
      ================================= */}

      <section className="my-section">
        <div className="my-section-heading">
          <span>계정</span>
        </div>

        <div className="my-menu-list">
          <MenuRow
            icon={<UserIcon />}
            title="내 정보"
            description={currentUser.email}
            onClick={handleMyInfo}
          />

          <MenuRow
            icon={<LockIcon />}
            title="비밀번호 변경"
            description="계정 비밀번호를 변경해요."
            onClick={handlePasswordChange}
          />
        </div>
      </section>

      {/* =================================
          Service
      ================================= */}

      <section className="my-section">
        <div className="my-section-heading">
          <span>서비스</span>
        </div>

        <div className="my-menu-list">
          <MenuRow
            icon={<InfoIcon />}
            title="VESTI"
            description="나의 옷장을 더 잘 활용하는 방법"
            value="0.1.0"
          />
        </div>
      </section>

      {/* =================================
          Logout
      ================================= */}

      <section className="my-logout">
        <button type="button" onClick={handleLogout}>
          <LogoutIcon />

          <span>로그아웃</span>
        </button>
      </section>

      <footer className="my-footer">
        <span>VESTI</span>

        <p>Your wardrobe, better used.</p>
      </footer>
    </div>
  );
}

export default MyPage;
