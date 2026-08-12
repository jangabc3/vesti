import { useState } from "react";

import { useNavigate } from "react-router-dom";

import { recommendAiStyling } from "@/api/aiApi";

import { getCoordination } from "@/api/coordinationApi";

import "./AiPage.css";

const quickPrompts = ["출근", "데이트", "여행", "학교", "운동"];

const quickMessages = {
  출근: "내 옷장에서 출근할 때 깔끔하고 편하게 입을 코디를 추천해줘.",

  데이트: "내 옷장에서 데이트할 때 너무 꾸민 느낌 없이 입을 코디를 추천해줘.",

  여행: "내 옷장에서 많이 걸어도 편한 여행 코디를 추천해줘.",

  학교: "내 옷장에서 학교 갈 때 자연스럽고 센스 있게 입을 코디를 추천해줘.",

  운동: "내 옷장에서 운동 전후로 편하게 입기 좋은 코디를 추천해줘.",
};

function SparkleIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.6"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M12 2.8c.6 3.5 2.7 5.6 6.2 6.2-3.5.6-5.6 2.7-6.2 6.2-.6-3.5-2.7-5.6-6.2-6.2 3.5-.6 5.6-2.7 6.2-6.2Z" />

      <path d="M18.5 15c.25 1.5 1.2 2.45 2.7 2.7-1.5.25-2.45 1.2-2.7 2.7-.25-1.5-1.2-2.45-2.7-2.7 1.5-.25 2.45-1.2 2.7-2.7Z" />
    </svg>
  );
}

function ArrowUpIcon() {
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
      <path d="m7 11 5-5 5 5" />
      <path d="M12 6v12" />
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

function ClothingImage({ item }) {
  const [failed, setFailed] = useState(false);

  if (!item?.imageUrl || failed) {
    return (
      <div className="ai-clothing__placeholder">
        <span>이미지 없음</span>
      </div>
    );
  }

  return (
    <img src={item.imageUrl} alt={item.name} onError={() => setFailed(true)} />
  );
}

function LookVisual({ look }) {
  const clothes = Array.isArray(look?.clothes)
    ? look.clothes.filter(Boolean).slice(0, 4)
    : [];

  if (clothes.length === 0) {
    return (
      <div className="ai-look__visual-empty">
        <span>코디 이미지 준비 중</span>
      </div>
    );
  }

  return (
    <div
      className={[
        "ai-look__visual",

        `ai-look__visual--${Math.min(clothes.length, 4)}`,
      ].join(" ")}
    >
      {clothes.map((item) => (
        <div key={item.id}>
          {item.image ? (
            <img src={item.image} alt={item.name} />
          ) : (
            <span>{item.name}</span>
          )}
        </div>
      ))}
    </div>
  );
}

function AiPage() {
  const navigate = useNavigate();

  const [message, setMessage] = useState("");

  const [submittedMessage, setSubmittedMessage] = useState("");

  const [aiResult, setAiResult] = useState(null);

  const [recommendedLooks, setRecommendedLooks] = useState([]);

  const [loading, setLoading] = useState(false);

  const [errorMessage, setErrorMessage] = useState("");

  const requestRecommendation = async (requestedMessage) => {
    const trimmed = requestedMessage.trim();

    if (!trimmed || loading) {
      return;
    }

    setSubmittedMessage(trimmed);

    setErrorMessage("");
    setLoading(true);

    try {
      const result = await recommendAiStyling(trimmed);

      setAiResult(result);

      const looks = Array.isArray(result?.recommendedLooks)
        ? result.recommendedLooks
        : [];

      const detailResults = await Promise.allSettled(
        looks.map((look) => getCoordination(look.coordinationId)),
      );

      const mappedLooks = looks.map((look, index) => {
        const detail =
          detailResults[index]?.status === "fulfilled"
            ? detailResults[index].value
            : null;

        return {
          ...look,

          clothes: detail?.clothes ?? [],

          occasion: detail?.occasion ?? null,

          season: detail?.season ?? null,
        };
      });

      setRecommendedLooks(mappedLooks);
    } catch (error) {
      console.error("AI 스타일 추천에 실패했습니다.", error);

      const status = error.response?.status;

      if (status === 401) {
        setErrorMessage("로그인이 필요해요.");
      } else if (status === 429) {
        setErrorMessage("AI 요청이 많아요. 잠시 후 다시 시도해주세요.");
      } else {
        setErrorMessage(
          "스타일 추천을 불러오지 못했어요. 잠시 후 다시 시도해주세요.",
        );
      }
    } finally {
      setLoading(false);
    }
  };

  const handleQuickPrompt = (prompt) => {
    requestRecommendation(quickMessages[prompt]);
  };

  const handleSubmit = (event) => {
    event.preventDefault();

    requestRecommendation(message);

    setMessage("");
  };

  return (
    <div className="ai-page">
      {/* Header */}

      <header className="ai-header">
        <div>
          <span>VESTI AI</span>

          <h1>AI 스타일리스트</h1>

          <p>내 옷장을 이해하고 지금 입을 스타일을 함께 골라드려요.</p>
        </div>

        <div className="ai-header__symbol">
          <SparkleIcon />
        </div>
      </header>

      {/* Quick Context */}

      <section className="ai-context">
        <span>어떤 상황에 입을까요?</span>

        <div className="ai-context__chips">
          {quickPrompts.map((prompt) => (
            <button
              key={prompt}
              type="button"
              disabled={loading}
              onClick={() => handleQuickPrompt(prompt)}
            >
              {prompt}
            </button>
          ))}
        </div>
      </section>

      {!submittedMessage && !loading && (
        <section className="ai-intro">
          <div className="ai-intro__icon">
            <SparkleIcon />
          </div>

          <h2>무엇을 입을지 물어보세요.</h2>

          <p>지금 등록된 내 옷과 코디를 기준으로 추천해드릴게요.</p>

          <div className="ai-intro__examples">
            <span>“검정 반팔로 코디해줘”</span>

            <span>“데이트 갈 건데 뭐 입지?”</span>

            <span>“여름 출근룩 추천해줘”</span>
          </div>
        </section>
      )}

      {/* Conversation */}

      {submittedMessage && (
        <section className="ai-conversation">
          <div className="ai-conversation__user">
            <span>YOU</span>

            <p>{submittedMessage}</p>
          </div>

          {loading ? (
            <div className="ai-loading">
              <div className="ai-loading__symbol">
                <SparkleIcon />
              </div>

              <div>
                <strong>내 옷장을 살펴보고 있어요.</strong>

                <p>잠시만 기다려주세요.</p>
              </div>
            </div>
          ) : errorMessage ? (
            <div className="ai-error">
              <strong>추천을 만들지 못했어요.</strong>

              <p>{errorMessage}</p>

              <button
                type="button"
                onClick={() => requestRecommendation(submittedMessage)}
              >
                다시 시도
              </button>
            </div>
          ) : (
            aiResult && (
              <div className="ai-conversation__response">
                <div className="ai-conversation__assistant">
                  <div>
                    <SparkleIcon />
                  </div>

                  <span>VESTI</span>
                </div>

                <h2>{aiResult.title}</h2>

                <p>{aiResult.reason}</p>
              </div>
            )
          )}
        </section>
      )}

      {/* Recommended Looks */}

      {!loading && recommendedLooks.length > 0 && (
        <section className="ai-results">
          <div className="ai-results__heading">
            <div>
              <span>YOUR WARDROBE</span>

              <h2>추천 코디</h2>
            </div>

            <span>{recommendedLooks.length} LOOKS</span>
          </div>

          <div className="ai-look-list">
            {recommendedLooks.map((look, index) => (
              <article key={look.coordinationId} className="ai-look">
                <div className="ai-look__top">
                  <span>LOOK {String(index + 1).padStart(2, "0")}</span>

                  <span>내 옷장</span>
                </div>

                <LookVisual look={look} />

                <div className="ai-look__content">
                  <h3>{look.name}</h3>

                  <p className="ai-look__meta">
                    {[look.occasion, look.season].filter(Boolean).join(" · ")}
                  </p>

                  <p className="ai-look__reason">{look.reason}</p>

                  <button
                    type="button"
                    className="ai-look__detail"
                    onClick={() => navigate(`/outfits/${look.coordinationId}`)}
                  >
                    <span>코디 자세히 보기</span>

                    <ArrowRightIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      {/* Used Clothes */}

      {!loading && aiResult?.usedClothes?.length > 0 && (
        <section className="ai-used">
          <div className="ai-section-heading">
            <span>FROM YOUR CLOSET</span>

            <h2>이 옷들을 활용해보세요</h2>
          </div>

          <div className="ai-used__list">
            {aiResult.usedClothes.map((item) => (
              <button
                key={item.clothingId}
                type="button"
                className="ai-clothing"
                onClick={() => navigate(`/clothes/${item.clothingId}`)}
              >
                <div className="ai-clothing__image">
                  <ClothingImage item={item} />
                </div>

                <strong>{item.name}</strong>

                <span>
                  {[item.color, item.category].filter(Boolean).join(" · ")}
                </span>
              </button>
            ))}
          </div>
        </section>
      )}

      {/* Missing Items */}

      {!loading && aiResult?.missingItems?.length > 0 && (
        <section className="ai-missing">
          <div className="ai-section-heading">
            <span>COMPLETE THE LOOK</span>

            <h2>있으면 더 좋은 아이템</h2>
          </div>

          <div className="ai-missing__list">
            {aiResult.missingItems.map((item, index) => (
              <div key={`${item}-${index}`} className="ai-missing__item">
                <span>+</span>

                <strong>{item}</strong>
              </div>
            ))}
          </div>

          <p className="ai-missing__notice">
            아직 내 옷장에 없는 아이템이에요.
          </p>
        </section>
      )}

      {/* Composer */}

      <form className="ai-composer" onSubmit={handleSubmit}>
        <input
          type="text"
          value={message}
          disabled={loading}
          onChange={(event) => setMessage(event.target.value)}
          placeholder="무엇을 입을지 물어보세요."
        />

        <button
          type="submit"
          className="ai-composer__send"
          disabled={loading || !message.trim()}
          aria-label="전송"
        >
          <ArrowUpIcon />
        </button>
      </form>
    </div>
  );
}

export default AiPage;
