import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";

import { getMyProfile } from "@/api/authApi";
import { getClothes } from "@/api/clothingApi";
import { getCoordinations } from "@/api/coordinationApi";
import { getAllCoordinationRecords } from "@/api/coordinationRecordApi";
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

  const [clothingCount, setClothingCount] = useState(0);

  const [outfitCount, setOutfitCount] = useState(0);

  const [recordCount, setRecordCount] = useState(0);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMyPage() {
      setLoading(true);

      setLoadError(false);

      try {
        const myProfile = await getMyProfile();

        if (ignore) {
          return;
        }

        setCurrentUser(myProfile);

        const results = await Promise.allSettled([
          getUserStylePosts(myProfile.username, {
            page: 0,
            size: 1,
            sort: "createdAt,desc",
          }),

          getMyFollowStatus(myProfile.username),

          getClothes({
            page: 0,
            size: 1,
            sort: "createdAt,desc",
          }),

          getCoordinations(),

          getAllCoordinationRecords(),
        ]);

        if (ignore) {
          return;
        }

        const [
          postResult,
          followResult,
          clothesResult,
          outfitsResult,
          recordsResult,
        ] = results;

        if (postResult.status === "fulfilled") {
          setPostCount(postResult.value?.totalElements ?? 0);
        }

        if (followResult.status === "fulfilled") {
          setFollowerCount(followResult.value?.followerCount ?? 0);

          setFollowingCount(followResult.value?.followingCount ?? 0);
        }

        if (clothesResult.status === "fulfilled") {
          setClothingCount(
            clothesResult.value?.totalElements ??
              clothesResult.value?.content?.length ??
              0,
          );
        }

        if (outfitsResult.status === "fulfilled") {
          setOutfitCount(outfitsResult.value?.length ?? 0);
        }

        if (recordsResult.status === "fulfilled") {
          setRecordCount(recordsResult.value?.length ?? 0);
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

  if (loading) {
    return (
      <div className="my-page">
        <div className="my-state">
          <strong>내 정보를 불러오고 있어요.</strong>
        </div>
      </div>
    );
  }

  if (loadError || !currentUser) {
    return (
      <div className="my-page">
        <div className="my-state">
          <strong>내 정보를 불러오지 못했어요.</strong>
        </div>
      </div>
    );
  }

  return (
    <div className="my-page">
      <header className="my-header">
        <span className="my-header__eyebrow">MY</span>

        <h1>마이</h1>

        <p>내 스타일과 계정을 한곳에서 관리하세요.</p>
      </header>

      <section className="my-profile">
        <ProfileAvatar user={currentUser} />

        <div className="my-profile__content">
          <span className="my-profile__label">MY PROFILE</span>

          <h2>{currentUser.displayName || currentUser.username}</h2>

          <p>@{currentUser.username}</p>
        </div>

        <button
          type="button"
          className="my-profile__button"
          onClick={() => navigate(`/users/${currentUser.username}`)}
          aria-label="내 프로필 보기"
        >
          <ChevronRightIcon />
        </button>
      </section>

      <section className="my-social">
        <button
          type="button"
          onClick={() => navigate(`/users/${currentUser.username}`)}
        >
          <strong>{formatCount(postCount)}</strong>

          <span>게시물</span>
        </button>

        <button type="button">
          <strong>{formatCount(followerCount)}</strong>

          <span>팔로워</span>
        </button>

        <button type="button">
          <strong>{formatCount(followingCount)}</strong>

          <span>팔로잉</span>
        </button>
      </section>

      {currentUser.bio && (
        <section className="my-bio">
          <span>ABOUT</span>

          <p>{currentUser.bio}</p>
        </section>
      )}

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
            <strong>{clothingCount}</strong>

            <span>등록한 옷</span>
          </button>

          <button
            type="button"
            className="my-summary__item"
            onClick={() => navigate("/outfits")}
          >
            <strong>{outfitCount}</strong>

            <span>저장한 코디</span>
          </button>

          <button
            type="button"
            className="my-summary__item"
            onClick={() => navigate("/history")}
          >
            <strong>{recordCount}</strong>

            <span>착용 기록</span>
          </button>
        </div>
      </section>

      <section className="my-section">
        <div className="my-section-heading">
          <span>계정</span>
        </div>

        <div className="my-menu-list">
          <MenuRow
            icon={<UserIcon />}
            title="내 정보"
            description={currentUser.email}
            onClick={() => navigate(`/users/${currentUser.username}`)}
          />

          <MenuRow
            icon={<LockIcon />}
            title="비밀번호 변경"
            description="계정 비밀번호를 변경해요."
            onClick={() =>
              window.alert(
                "비밀번호 변경 화면은 다음 계정 설정 단계에서 연결할게요.",
              )
            }
          />
        </div>
      </section>

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

      <section className="my-logout">
        <button
          type="button"
          onClick={() =>
            window.alert("로그인 화면을 만든 뒤 실제 로그아웃과 연결할게요.")
          }
        >
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
