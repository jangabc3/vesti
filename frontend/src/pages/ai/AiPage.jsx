import { useState } from "react";
import { useNavigate } from "react-router-dom";

import { recommendAiStyling } from "@/api/aiApi";
import { getCoordination } from "@/api/coordinationApi";
import { getStylePosts } from "@/api/stylePostApi";
import BettyMark from "@/components/ai/BettyMark";

import "./AiPage.css";

const exampleMessages = [
  {
    context: "오늘 날씨",
    message: "비 오는 날 성수동 팝업 코디",
  },
  {
    context: "가지고 있는 옷",
    message: "검정 반팔을 활용한 데이트룩",
  },
  {
    context: "원하는 분위기",
    message: "꾸민 듯 안 꾸민 학교 코디",
  },
];

const styleKeywordGroups = [
  ["출근", "회사", "오피스", "깔끔", "미니멀", "셔츠", "슬랙스"],
  ["데이트", "카페", "저녁", "로맨틱", "원피스", "꾸안꾸"],
  ["여행", "편한", "산책", "캐주얼", "스니커즈", "데일리"],
  ["학교", "캠퍼스", "꾸안꾸", "캐주얼", "데일리"],
  ["운동", "애슬레저", "스포티", "트레이닝", "편한"],
  ["성수", "팝업", "스트릿", "힙", "레이어드", "데님"],
  ["비", "장마", "레인", "방수", "바람막이"],
  ["검정", "블랙", "모노톤", "시크"],
  ["여름", "반팔", "린넨", "시원"],
  ["겨울", "코트", "니트", "패딩", "레이어드"],
];

function ArrowUpIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.9"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m7 11 5-5 5 5" />
      <path d="M12 6v12" />
    </svg>
  );
}

function ChevronRightIcon() {
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
      <path d="m9 18 6-6-6-6" />
    </svg>
  );
}

function CameraIcon() {
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
      <path d="M4 8.5h3l1.5-2h7l1.5 2h3v10H4Z" />
      <circle cx="12" cy="13.5" r="3.2" />
    </svg>
  );
}

function BookmarkIcon() {
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
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5Z" />
    </svg>
  );
}

function normalizeText(value) {
  return String(value ?? "")
    .toLowerCase()
    .replace(/[^0-9a-zA-Z가-힣\s]/g, " ")
    .replace(/\s+/g, " ")
    .trim();
}

function buildSearchTerms(message, aiResult) {
  const context = normalizeText(
    [message, aiResult?.title, aiResult?.reason].filter(Boolean).join(" "),
  );
  const directTerms = context
    .split(" ")
    .filter((term) => term.length >= 2)
    .slice(0, 24);
  const expandedTerms = styleKeywordGroups.flatMap((group) =>
    group.some((keyword) => context.includes(keyword)) ? group : [],
  );

  return [...new Set([...directTerms, ...expandedTerms])];
}

function rankStylePosts(posts, message, aiResult) {
  const terms = buildSearchTerms(message, aiResult);

  return posts
    .filter((post) => post?.id != null && post?.image)
    .map((post, index) => {
      const title = normalizeText(post.title);
      const caption = normalizeText(post.caption);
      const location = normalizeText(post.location);
      const score = terms.reduce(
        (total, term) =>
          total +
          (title.includes(term) ? 5 : 0) +
          (caption.includes(term) ? 3 : 0) +
          (location.includes(term) ? 4 : 0),
        0,
      );

      return { post, score, originalIndex: index };
    })
    .sort(
      (first, second) =>
        second.score - first.score ||
        first.originalIndex - second.originalIndex,
    )
    .slice(0, 3)
    .map(({ post }) => post);
}

function CommunityLookCard({ post, onOpen }) {
  const [imageFailed, setImageFailed] = useState(false);

  return (
    <button
      type="button"
      className="ai-community-card"
      onClick={onOpen}
      aria-label={`${post.title} 스타일 자세히 보기`}
    >
      <span className="ai-community-card__photo">
        {!imageFailed ? (
          <img
            src={post.image}
            alt={post.title}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>이미지를 준비 중이에요</span>
        )}
      </span>

      <span className="ai-community-card__meta">
        <span className="ai-community-card__source">
          VESTI · @{post.author?.username || "vesti"}
        </span>
        <span className="ai-community-card__bookmark" aria-hidden="true">
          <BookmarkIcon />
        </span>
      </span>
      <strong>{post.title || "오늘의 스타일"}</strong>
    </button>
  );
}

function ClosetLookCard({ look, index, onOpen }) {
  const [imageFailed, setImageFailed] = useState(false);
  const clothes = Array.isArray(look.clothes) ? look.clothes : [];
  const representativeItem = clothes.find(
    (item) => item?.image || item?.imageUrl,
  );
  const representativeImage =
    representativeItem?.image || representativeItem?.imageUrl;
  const combination = clothes
    .slice(0, 2)
    .map((item) => item.name)
    .filter(Boolean)
    .join(" · ");

  return (
    <button
      type="button"
      className="ai-wardrobe-card"
      onClick={onOpen}
      aria-label={`${look.name} 코디 자세히 보기`}
    >
      <span className="ai-wardrobe-card__photo">
        {representativeImage && !imageFailed ? (
          <img
            src={representativeImage}
            alt={`${look.name}에 사용하는 ${representativeItem.name}`}
            loading="lazy"
            onError={() => setImageFailed(true)}
          />
        ) : (
          <span>코디 이미지를 준비 중이에요</span>
        )}
      </span>

      <span className="ai-wardrobe-card__copy">
        <small>{index === 0 ? "가장 가까운 조합" : "다른 분위기"}</small>
        <strong>
          <span>{look.name}</span>
          <ChevronRightIcon />
        </strong>
        <span>
          {combination ||
            [look.occasion, look.season].filter(Boolean).join(" · ") ||
            "저장한 옷으로 만든 코디"}
        </span>
      </span>
    </button>
  );
}

function LoadingCommunity() {
  return (
    <section className="ai-loading" aria-live="polite">
      <div className="ai-loading__betty">
        <BettyMark size="small" />
        <div>
          <span>BETTY</span>
          <strong>어울리는 스타일을 찾고 있어요.</strong>
          <p>비슷한 착장과 내 옷을 함께 살펴보는 중이에요.</p>
        </div>
      </div>

      <div className="ai-loading__cards" aria-hidden="true">
        {[0, 1].map((item) => (
          <div key={item} className="ai-loading-card">
            <div />
            <span />
            <span />
          </div>
        ))}
      </div>
    </section>
  );
}

function AiPage() {
  const navigate = useNavigate();
  const [message, setMessage] = useState("");
  const [submittedMessage, setSubmittedMessage] = useState("");
  const [aiResult, setAiResult] = useState(null);
  const [communityLooks, setCommunityLooks] = useState([]);
  const [closetLooks, setClosetLooks] = useState([]);
  const [communityUnavailable, setCommunityUnavailable] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");

  const requestRecommendation = async (requestedMessage) => {
    const trimmedMessage = requestedMessage.trim();

    if (!trimmedMessage || loading) return;

    setSubmittedMessage(trimmedMessage);
    setMessage("");
    setAiResult(null);
    setCommunityLooks([]);
    setClosetLooks([]);
    setCommunityUnavailable(false);
    setErrorMessage("");
    setLoading(true);

    try {
      const postsPromise = getStylePosts({
        page: 0,
        size: 30,
        sort: "createdAt,desc",
      }).catch((error) => {
        console.error("커뮤니티 스타일을 불러오지 못했습니다.", error);
        return null;
      });
      const [result, postsPage] = await Promise.all([
        recommendAiStyling(trimmedMessage),
        postsPromise,
      ]);
      const posts = Array.isArray(postsPage?.content) ? postsPage.content : [];
      const recommendedLooks = Array.isArray(result?.recommendedLooks)
        ? result.recommendedLooks.slice(0, 2)
        : [];
      const detailedLooks = await Promise.all(
        recommendedLooks.map(async (look) => {
          try {
            const detail = await getCoordination(look.coordinationId);

            return {
              ...look,
              ...detail,
              coordinationId: detail?.id ?? look.coordinationId,
              reason: look.reason ?? "",
              clothes: Array.isArray(detail?.clothes) ? detail.clothes : [],
            };
          } catch (error) {
            console.error("추천 코디 상세를 불러오지 못했습니다.", error);

            return {
              ...look,
              clothes: [],
            };
          }
        }),
      );

      setAiResult(result);
      setCommunityLooks(rankStylePosts(posts, trimmedMessage, result));
      setClosetLooks(detailedLooks);
      setCommunityUnavailable(postsPage == null);
    } catch (error) {
      console.error("AI 스타일 추천에 실패했습니다.", error);
      const status = error.response?.status;

      if (status === 401) {
        setErrorMessage("로그인 후 베티에게 다시 물어봐주세요.");
      } else if (status === 429) {
        setErrorMessage("지금 요청이 많아요. 잠시 후 다시 시도해주세요.");
      } else {
        setErrorMessage(
          "스타일을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    requestRecommendation(message);
  };

  const handleReset = () => {
    setMessage("");
    setSubmittedMessage("");
    setAiResult(null);
    setCommunityLooks([]);
    setClosetLooks([]);
    setCommunityUnavailable(false);
    setErrorMessage("");
  };

  const openCommunityLook = (post) => {
    navigate(`/styles/${post.id}`, {
      state: {
        source: "ai",
        sourceQuery: submittedMessage,
        bettyTitle: aiResult?.title ?? "베티가 고른 스타일",
        bettyReason: aiResult?.reason ?? "",
      },
    });
  };

  const openClosetLook = (look, index) => {
    navigate(`/ai/looks/${look.coordinationId}`, {
      state: {
        look,
        lookNumber: index + 1,
        sourceQuery: submittedMessage,
        bettyTitle: "내 옷으로 골라본 조합",
        bettyReason: look.reason ?? "",
        missingItems: Array.isArray(aiResult?.missingItems)
          ? aiResult.missingItems
          : [],
      },
    });
  };

  const hasConversation = Boolean(submittedMessage);

  return (
    <div className={`ai-page ${hasConversation ? "ai-page--results" : ""}`}>
      <header className="ai-header">
        <div className="ai-header__identity">
          <BettyMark size="medium" className="ai-header__betty" />
          <div className="ai-header__copy">
            <div className="ai-header__title">
              <strong>코디메이트 베티</strong>
              <span>Beta</span>
            </div>
            <p>원하는 코디를 함께 찾아드릴게요.</p>
          </div>
        </div>

        <button
          type="button"
          className="ai-header__reset"
          onClick={handleReset}
        >
          새 대화
        </button>
      </header>

      {!hasConversation && (
        <main className="ai-home">
          <section
            className="ai-suggestions ai-suggestions--home"
            aria-labelledby="ai-suggestion-title"
          >
            <header className="ai-suggestions__intro">
              <span>지금 많이 찾는 스타일</span>
              <h1 id="ai-suggestion-title">베티에게 바로 물어보세요</h1>
              <p>질문을 누르면 바로 대화를 시작해요.</p>
            </header>

            <div className="ai-suggestions__list">
              {exampleMessages.map((example) => (
                <button
                  key={example.message}
                  type="button"
                  onClick={() => requestRecommendation(example.message)}
                >
                  <span className="ai-suggestions__content">
                    <small>{example.context}</small>
                    <strong>{example.message}</strong>
                  </span>
                  <span className="ai-suggestions__chevron" aria-hidden="true">
                    <ChevronRightIcon />
                  </span>
                </button>
              ))}
            </div>
          </section>
        </main>
      )}

      {hasConversation && (
        <main className="ai-result">
          <section className="ai-conversation">
            <div className="ai-query">
              <span>YOU</span>
              <p>{submittedMessage}</p>
            </div>

            {loading && <LoadingCommunity />}

            {!loading && errorMessage && (
              <div className="ai-error" role="alert">
                <BettyMark size="small" />
                <div>
                  <span>BETTY</span>
                  <strong>잠깐, 추천을 완성하지 못했어요.</strong>
                  <p>{errorMessage}</p>
                  <button
                    type="button"
                    onClick={() => requestRecommendation(submittedMessage)}
                  >
                    다시 시도
                  </button>
                </div>
              </div>
            )}

            {!loading && !errorMessage && aiResult && (
              <div className="ai-betty-answer">
                <div>
                  <span>BETTY</span>
                  <h1>찾으신 분위기와 가까운 스타일이에요</h1>
                  <p>비슷한 착장과 지금 바로 입을 수 있는 조합을 골라봤어요.</p>
                </div>
              </div>
            )}
          </section>

          {!loading && !errorMessage && aiResult && (
            <section
              className="ai-community"
              aria-labelledby="ai-community-title"
            >
              <div className="ai-section-heading ai-section-heading--community">
                <div>
                  <h2 id="ai-community-title">먼저, 이런 스타일은 어때요?</h2>
                  <p>비슷한 분위기의 착장을 모아봤어요.</p>
                </div>
                {communityLooks.length > 0 && (
                  <strong>{communityLooks.length}개의 스타일</strong>
                )}
              </div>

              {communityLooks.length > 0 ? (
                <div className="ai-community__rail">
                  {communityLooks.map((post) => (
                    <CommunityLookCard
                      key={post.id}
                      post={post}
                      onOpen={() => openCommunityLook(post)}
                    />
                  ))}
                </div>
              ) : (
                <div className="ai-community-empty">
                  <strong>
                    {communityUnavailable
                      ? "추천 착장을 불러오지 못했어요."
                      : "아직 보여드릴 착장이 없어요."}
                  </strong>
                  <p>
                    {communityUnavailable
                      ? "내 옷 추천은 정상적으로 도착했어요. 잠시 후 다시 시도해주세요."
                      : "새로운 착장이 등록되면 질문과 가까운 순서로 보여드릴게요."}
                  </p>
                  <button type="button" onClick={() => navigate("/discover")}>
                    발견 둘러보기
                  </button>
                </div>
              )}
            </section>
          )}

          {!loading && !errorMessage && aiResult && (
            <section
              className="ai-closet"
              aria-labelledby="ai-closet-title"
              data-ui-version="wardrobe-cards-v3"
            >
              <div className="ai-closet__heading">
                <h2 id="ai-closet-title">내 옷장에선 이렇게 입어보세요</h2>
                <p>가지고 있는 옷으로 바로 입을 수 있는 조합이에요.</p>
              </div>

              {closetLooks.length > 0 ? (
                <div className="ai-wardrobe-grid">
                  {closetLooks.slice(0, 2).map((look, index) => (
                    <ClosetLookCard
                      key={look.coordinationId}
                      look={look}
                      index={index}
                      onOpen={() => openClosetLook(look, index)}
                    />
                  ))}
                </div>
              ) : (
                <div className="ai-closet__empty">
                  <strong>추천할 내 코디가 아직 없어요.</strong>
                  <p>
                    옷장에서 코디를 만들어두면 질문과 가까운 조합을
                    골라드릴게요.
                  </p>
                  <button
                    type="button"
                    onClick={() => navigate("/outfits/new")}
                  >
                    코디 만들기
                  </button>
                </div>
              )}
            </section>
          )}
        </main>
      )}

      <form className="ai-composer" onSubmit={handleSubmit}>
        <button
          type="button"
          className="ai-composer__photo"
          disabled
          aria-label="사진 첨부 기능 준비 중"
          title="사진으로 물어보기는 준비 중이에요"
        >
          <CameraIcon />
        </button>
        <input
          type="text"
          value={message}
          disabled={loading}
          onChange={(event) => setMessage(event.target.value)}
          placeholder={
            hasConversation
              ? "다른 스타일로 다시 물어보세요"
              : "베티에게 무엇을 입을지 물어보세요"
          }
          aria-label="베티에게 코디 질문하기"
        />
        <button
          type="submit"
          className="ai-composer__send"
          disabled={loading || !message.trim()}
          aria-label="질문 보내기"
        >
          <ArrowUpIcon />
        </button>
      </form>
    </div>
  );
}

export default AiPage;
