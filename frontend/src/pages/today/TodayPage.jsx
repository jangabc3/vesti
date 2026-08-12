import { useEffect, useMemo, useState } from "react";

import { useLocation, useNavigate } from "react-router-dom";

import ToastMessage from "@/components/common/ToastMessage";

import { getCoordination, getCoordinations } from "@/api/coordinationApi";

import {
  createCoordinationRecord,
  getTodayCoordinationRecord,
} from "@/api/coordinationRecordApi";

import { getStylePostLikeSummary, getStylePosts } from "@/api/stylePostApi";

import { todayData } from "@/mocks/today";

import "./TodayPage.css";

const OCCASIONS = ["일상", "출근", "데이트", "운동"];

function BellIcon() {
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
      <path d="M18 8a6 6 0 0 0-12 0c0 7-3 7-3 9h18c0-2-3-2-3-9" />

      <path d="M10 21h4" />
    </svg>
  );
}

function ArrowRightIcon() {
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
      <path d="M5 12h14" />
      <path d="m14 7 5 5-5 5" />
    </svg>
  );
}

function HeartIcon() {
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
      <path d="M20.8 4.7a5.3 5.3 0 0 0-7.5 0L12 6l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.8a5.3 5.3 0 0 0 0-7.5Z" />
    </svg>
  );
}

function formatToday(date) {
  return new Intl.DateTimeFormat("ko-KR", {
    month: "long",
    day: "numeric",
  }).format(date);
}

function getTodayDateValue() {
  const today = new Date();

  const year = today.getFullYear();

  const month = String(today.getMonth() + 1).padStart(2, "0");

  const day = String(today.getDate()).padStart(2, "0");

  return `${year}-${month}-${day}`;
}

function getRecommendedSeasons(temperature) {
  if (temperature >= 28) {
    return ["여름"];
  }

  if (temperature >= 20) {
    return ["봄", "가을"];
  }

  return ["겨울"];
}

function getRecommendationPool(outfits, temperature, occasion) {
  if (!Array.isArray(outfits) || outfits.length === 0) {
    return [];
  }

  const seasons = getRecommendedSeasons(temperature);

  /*
   * 가장 우선:
   * 날씨 + 상황이 모두 맞는 코디
   */
  const exactMatches = outfits.filter(
    (outfit) => seasons.includes(outfit.season) && outfit.occasion === occasion,
  );

  if (exactMatches.length > 0) {
    return exactMatches;
  }

  /*
   * 상황에 맞는 코디
   */
  const occasionMatches = outfits.filter(
    (outfit) => outfit.occasion === occasion,
  );

  if (occasionMatches.length > 0) {
    return occasionMatches;
  }

  /*
   * 계절에 맞는 코디
   */
  const seasonMatches = outfits.filter((outfit) =>
    seasons.includes(outfit.season),
  );

  if (seasonMatches.length > 0) {
    return seasonMatches;
  }

  /*
   * 조건에 맞는 게 없으면
   * 사용자의 실제 코디 전체.
   */
  return outfits;
}

function formatCount(value) {
  const number = Number(value ?? 0);

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1).replace(".0", "")}K`;
  }

  return String(number);
}

function ClothingImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item?.image || failed) {
    return (
      <div className="today-look__clothing-placeholder">
        <span>이미지 없음</span>
      </div>
    );
  }

  return (
    <img src={item.image} alt={item.name} onError={() => setFailed(true)} />
  );
}

function OutfitVisual({ outfit }) {
  const clothes = Array.isArray(outfit?.clothes)
    ? outfit.clothes.filter(Boolean).slice(0, 4)
    : [];

  if (clothes.length === 0) {
    return (
      <div className="today-look__empty-visual">
        <span>아직 구성된 옷이 없어요.</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "today-look__visual",

        `today-look__visual--${Math.min(clothes.length, 4)}`,
      ].join(" ")}
    >
      {clothes.map((item) => (
        <div key={item.id} className="today-look__visual-item">
          <ClothingImage item={item} />
        </div>
      ))}
    </div>
  );
}

function CommunityImage({ post }) {
  const [failed, setFailed] = useState(false);

  if (!post?.image || failed) {
    return (
      <div className="today-community__placeholder">
        <span>이미지 준비 중</span>
      </div>
    );
  }

  return (
    <img
      src={post.image}
      alt={post.title || "VESTI 스타일"}
      loading="lazy"
      onError={() => setFailed(true)}
    />
  );
}

function TodayPage() {
  const navigate = useNavigate();

  const location = useLocation();

  const { weather } = todayData;

  const [selectedOccasion, setSelectedOccasion] = useState("일상");

  const [outfits, setOutfits] = useState([]);

  const [recommendationIndex, setRecommendationIndex] = useState(0);

  const [todayRecord, setTodayRecord] = useState(null);

  const [todayOutfit, setTodayOutfit] = useState(null);

  const [communityPosts, setCommunityPosts] = useState([]);

  const [loading, setLoading] = useState(true);

  const [recording, setRecording] = useState(false);

  const [notification, setNotification] = useState(
    location.state?.message ?? "",
  );

  const today = useMemo(() => new Date(), []);

  useEffect(() => {
    let ignore = false;

    async function loadToday() {
      setLoading(true);

      try {
        /*
         * ================================
         * 실제 Coordination
         * ================================
         */

        const coordinationList = await getCoordinations();

        const detailResults = await Promise.allSettled(
          coordinationList.map((outfit) => getCoordination(outfit.id)),
        );

        if (ignore) {
          return;
        }

        const detailedOutfits = coordinationList
          .map((outfit, index) =>
            detailResults[index]?.status === "fulfilled"
              ? detailResults[index].value
              : outfit,
          )
          .filter(Boolean);

        setOutfits(detailedOutfits);

        /*
         * ================================
         * 오늘 착용 기록
         * ================================
         */

        try {
          const record = await getTodayCoordinationRecord();

          if (ignore) {
            return;
          }

          setTodayRecord(record);

          const outfit = await getCoordination(record.coordinationId);

          if (!ignore) {
            setTodayOutfit(outfit);
          }
        } catch (error) {
          if (error.response?.status === 404) {
            setTodayRecord(null);

            setTodayOutfit(null);
          } else {
            console.error("오늘 착용 기록을 불러오지 못했습니다.", error);
          }
        }

        /*
         * ================================
         * 커뮤니티
         * 최근 게시물 → 실제 좋아요 수 조회
         * → 좋아요 순 정렬 → 최대 4개
         * ================================
         */

        try {
          const page = await getStylePosts({
            page: 0,
            size: 8,
            sort: "createdAt,desc",
          });

          const posts = page.content ?? [];

          const likeResults = await Promise.allSettled(
            posts.map((post) => getStylePostLikeSummary(post.id)),
          );

          if (ignore) {
            return;
          }

          const postsWithLikes = posts.map((post, index) => ({
            ...post,

            likeCount:
              likeResults[index]?.status === "fulfilled"
                ? likeResults[index].value.likeCount
                : 0,
          }));

          postsWithLikes.sort((a, b) => {
            if (b.likeCount !== a.likeCount) {
              return b.likeCount - a.likeCount;
            }

            return (
              new Date(b.createdAt ?? 0).getTime() -
              new Date(a.createdAt ?? 0).getTime()
            );
          });

          setCommunityPosts(postsWithLikes.slice(0, 4));
        } catch (error) {
          console.error("오늘 인기 스타일을 불러오지 못했습니다.", error);

          if (!ignore) {
            setCommunityPosts([]);
          }
        }
      } catch (error) {
        console.error("Today 데이터를 불러오지 못했습니다.", error);
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadToday();

    return () => {
      ignore = true;
    };
  }, []);

  const recommendationPool = useMemo(
    () => getRecommendationPool(outfits, weather.temperature, selectedOccasion),
    [outfits, weather.temperature, selectedOccasion],
  );

  useEffect(() => {
    setRecommendationIndex(0);
  }, [selectedOccasion]);

  const recommendedOutfit =
    todayRecord && todayOutfit
      ? todayOutfit
      : (recommendationPool[
          recommendationIndex % Math.max(recommendationPool.length, 1)
        ] ?? null);

  const showAnotherOutfit = () => {
    if (todayRecord || recommendationPool.length <= 1) {
      return;
    }

    setRecommendationIndex(
      (current) => (current + 1) % recommendationPool.length,
    );
  };

  const handleWearToday = async () => {
    if (!recommendedOutfit) {
      return;
    }

    if (todayRecord) {
      navigate("/history");

      return;
    }

    const confirmed = window.confirm(
      `"${recommendedOutfit.name}" 코디를 오늘 입은 기록으로 추가하시겠습니까?`,
    );

    if (!confirmed) {
      return;
    }

    setRecording(true);

    try {
      const record = await createCoordinationRecord({
        date: getTodayDateValue(),

        coordinationId: recommendedOutfit.id,
      });

      setTodayRecord(record);

      setTodayOutfit(recommendedOutfit);

      setNotification("오늘의 착용 기록이 추가되었습니다.");
    } catch (error) {
      console.error("오늘 착용 기록을 추가하지 못했습니다.", error);

      if (error.response?.status === 409) {
        setNotification("오늘은 이미 착용 기록이 있어요.");

        try {
          const record = await getTodayCoordinationRecord();

          const outfit = await getCoordination(record.coordinationId);

          setTodayRecord(record);

          setTodayOutfit(outfit);
        } catch (reloadError) {
          console.error(
            "오늘 착용 기록을 다시 불러오지 못했습니다.",
            reloadError,
          );
        }
      } else {
        window.alert("착용 기록을 추가하지 못했어요.");
      }
    } finally {
      setRecording(false);
    }
  };

  return (
    <div className="today-page">
      <ToastMessage
        message={notification}
        onClose={() => setNotification("")}
      />

      {/* ================================
          Top
      ================================ */}

      <header className="today-top">
        <div className="today-top__brand-row">
          <strong className="today-top__brand">VESTI</strong>

          <button
            type="button"
            className="today-top__notification"
            aria-label="알림"
          >
            <BellIcon />
          </button>
        </div>

        <div className="today-top__weather">
          <span>
            {formatToday(today)}
            {" · "}
            {weather.location}
          </span>

          <span>
            {weather.temperature}° {weather.condition}
          </span>
        </div>

        <h1>오늘 뭐 입지?</h1>

        <p>내 옷으로 오늘에 맞는 스타일을 골라드릴게요.</p>

        <div className="today-occasion">
          {OCCASIONS.map((occasion) => (
            <button
              key={occasion}
              type="button"
              className={[
                "today-occasion__item",

                selectedOccasion === occasion
                  ? "today-occasion__item--active"
                  : "",
              ]
                .filter(Boolean)
                .join(" ")}
              disabled={Boolean(todayRecord)}
              onClick={() => setSelectedOccasion(occasion)}
            >
              {occasion}
            </button>
          ))}
        </div>
      </header>

      {/* ================================
          Today's Look
      ================================ */}

      <section className="today-look">
        <div className="today-section-heading">
          <div>
            <span className="today-section-heading__eyebrow">
              TODAY&apos;S LOOK
            </span>

            <h2>{todayRecord ? "오늘 입은 코디" : "오늘의 추천"}</h2>
          </div>

          {recommendedOutfit?.season && (
            <span className="today-section-heading__meta">
              {recommendedOutfit.season}
            </span>
          )}
        </div>

        {loading ? (
          <div className="today-look__state">
            <span>오늘의 스타일을 고르고 있어요.</span>
          </div>
        ) : recommendedOutfit ? (
          <article className="today-look__card">
            <button
              type="button"
              className="today-look__image-button"
              onClick={() => navigate(`/outfits/${recommendedOutfit.id}`)}
              aria-label={`${recommendedOutfit.name} 상세 보기`}
            >
              <OutfitVisual outfit={recommendedOutfit} />
            </button>

            <div className="today-look__content">
              <div className="today-look__info">
                <h3>{recommendedOutfit.name}</h3>

                <p>
                  {[recommendedOutfit.occasion, recommendedOutfit.season]
                    .filter(Boolean)
                    .join(" · ")}
                </p>
              </div>

              <div className="today-look__message">
                {todayRecord ? (
                  <>
                    <span className="today-look__record-badge">기록 완료</span>

                    <p>오늘 입은 코디로 저장되어 있어요.</p>
                  </>
                ) : (
                  <p>내 옷으로 바로 입을 수 있어요.</p>
                )}
              </div>

              <button
                type="button"
                className="today-look__primary"
                disabled={recording}
                onClick={handleWearToday}
              >
                {recording
                  ? "기록 중..."
                  : todayRecord
                    ? "착용 기록 보기"
                    : "오늘 입기"}
              </button>

              {!todayRecord && (
                <button
                  type="button"
                  className="today-look__secondary"
                  onClick={showAnotherOutfit}
                  disabled={recommendationPool.length <= 1}
                >
                  <span>다른 스타일 보기</span>

                  <ArrowRightIcon />
                </button>
              )}
            </div>
          </article>
        ) : (
          <div className="today-look__state">
            <strong>아직 추천할 코디가 없어요.</strong>

            <p>내 옷으로 첫 코디를 만들어보세요.</p>

            <button type="button" onClick={() => navigate("/outfits/new")}>
              코디 만들기
            </button>
          </div>
        )}
      </section>

      {/* ================================
          Community
      ================================ */}

      <section className="today-community">
        <div className="today-community__heading">
          <div>
            <span>COMMUNITY</span>

            <h2>오늘 인기 스타일</h2>
          </div>

          <button type="button" onClick={() => navigate("/discover")}>
            더보기
            <ArrowRightIcon />
          </button>
        </div>

        {communityPosts.length > 0 ? (
          <>
            <div className="today-community__grid">
              {communityPosts.map((post) => (
                <article key={post.id} className="today-community__card">
                  <button
                    type="button"
                    className="today-community__image"
                    onClick={() => navigate(`/styles/${post.id}`)}
                  >
                    <CommunityImage post={post} />
                  </button>

                  <div className="today-community__meta">
                    <button
                      type="button"
                      onClick={() => navigate(`/users/${post.author.username}`)}
                    >
                      @{post.author.username}
                    </button>

                    <span>
                      <HeartIcon />

                      {formatCount(post.likeCount)}
                    </span>
                  </div>
                </article>
              ))}
            </div>

            <button
              type="button"
              className="today-community__more"
              onClick={() => navigate("/discover")}
            >
              <span>더 많은 스타일 발견</span>

              <ArrowRightIcon />
            </button>
          </>
        ) : (
          !loading && (
            <div className="today-community__empty">
              <strong>아직 보여줄 스타일이 없어요.</strong>

              <p>발견에서 첫 스타일을 만나보세요.</p>

              <button type="button" onClick={() => navigate("/discover")}>
                스타일 발견하기
              </button>
            </div>
          )
        )}
      </section>
    </div>
  );
}

export default TodayPage;
