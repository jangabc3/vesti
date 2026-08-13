import { useEffect, useMemo, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";

import { getClothes } from "@/api/clothingApi";
import { getStylePost } from "@/api/stylePostApi";
import { getStyleCommerceItems } from "@/mocks/styleCommerce";

import "./StyleMatchPage.css";

const categoryAliases = {
  TOP: "상의",
  BOTTOM: "하의",
  OUTER: "아우터",
  SHOES: "신발",
  BAG: "가방",
  ACCESSORY: "액세서리",
  DRESS: "원피스",
};

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
      <path d="m9 6 6 6-6 6" />
    </svg>
  );
}

function CheckIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="m5 12 4 4L19 7" />
    </svg>
  );
}

function normalizeCategory(value) {
  return categoryAliases[value] ?? value ?? "기타";
}

function ImageBox({ src, alt }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return <span>이미지 준비 중</span>;
  }

  return <img src={src} alt={alt} onError={() => setFailed(true)} />;
}

function buildMatches(referenceItems, clothes) {
  const usedClothingIds = new Set();

  return referenceItems.map((reference) => {
    const category = normalizeCategory(reference.category);
    const match = clothes.find((item) => {
      const itemCategory = normalizeCategory(
        item.categoryLabel || item.category,
      );

      return itemCategory === category && !usedClothingIds.has(String(item.id));
    });

    if (match) {
      usedClothingIds.add(String(match.id));
    }

    return {
      id: reference.id,
      category,
      reference: reference.product,
      match: match ?? null,
    };
  });
}

function StyleMatchPage() {
  const navigate = useNavigate();
  const { styleId } = useParams();

  const [post, setPost] = useState(null);
  const [clothes, setClothes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [loadError, setLoadError] = useState(false);

  useEffect(() => {
    let ignore = false;

    async function loadMatch() {
      setLoading(true);
      setLoadError(false);

      try {
        const [postData, clothesPage] = await Promise.all([
          getStylePost(styleId),
          getClothes({ page: 0, size: 100, sort: "createdAt,desc" }),
        ]);

        if (!ignore) {
          setPost(postData);
          setClothes(clothesPage.content ?? []);
        }
      } catch (error) {
        console.error("내 옷장 스타일 비교에 실패했습니다.", error);

        if (!ignore) {
          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadMatch();

    return () => {
      ignore = true;
    };
  }, [styleId]);

  const referenceItems = useMemo(
    () => getStyleCommerceItems(post).slice(0, 5),
    [post],
  );
  const matches = useMemo(
    () => buildMatches(referenceItems, clothes),
    [referenceItems, clothes],
  );
  const matchedItems = matches.filter((item) => item.match);
  const missingItems = matches.filter((item) => !item.match);
  const selectedClothingIds = matchedItems.map((item) => item.match.id);

  if (loading) {
    return (
      <div className="style-match-not-found">
        <h1>내 옷장을 비교하고 있어요.</h1>
        <p>비슷하게 활용할 수 있는 아이템을 찾는 중이에요.</p>
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="style-match-not-found">
        <h1>스타일을 비교하지 못했어요.</h1>
        <p>게시물과 내 옷장을 다시 불러와주세요.</p>
        <button type="button" onClick={() => navigate(-1)}>
          돌아가기
        </button>
      </div>
    );
  }

  const openOutfitCreator = () => {
    navigate("/outfits/new", {
      state: {
        selectedClothingIds,
        suggestedName: `${post.title || "참고 스타일"} 코디`,
        sourceStyleId: post.id,
      },
    });
  };

  return (
    <div className="style-match-page-v2">
      <header className="style-match-v2-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>
        <strong>내 옷으로 입기</strong>
        <span />
      </header>

      <section className="style-match-reference-v2">
        <span className="style-match-reference-v2__label">REFERENCE LOOK</span>
        <button
          type="button"
          className="style-match-reference-v2__content"
          onClick={() => navigate(`/styles/${post.id}`)}
        >
          <div className="style-match-reference-v2__image">
            <ImageBox src={post.image} alt={post.title} />
          </div>
          <div>
            <strong>{post.title || "VESTI 커뮤니티 스타일"}</strong>
            <p>
              @{post.author?.username || "vesti"} · {post.location}
            </p>
          </div>
          <ChevronRightIcon />
        </button>
      </section>

      <section className="style-match-intro-v2">
        <h1>
          이 스타일을 내 옷으로
          <br />
          얼마나 완성할 수 있을까요?
        </h1>
        <p>
          카테고리를 기준으로 내 옷장에서 활용할 수 있는 옷을 찾았어요. 현재{" "}
          <strong>
            {matchedItems.length}/{matches.length}개
          </strong>
          를 바로 활용할 수 있어요.
        </p>
      </section>

      <section className="style-match-wardrobe">
        <div className="style-match-section-heading">
          <div>
            <h2>내 옷장과 비교</h2>
            <p>비슷한 역할의 옷을 나란히 확인해보세요.</p>
          </div>
          <span>
            {matchedItems.length}/{matches.length} MATCH
          </span>
        </div>

        {matches.map((item) => (
          <section key={item.id} className="style-match-piece">
            <div className="style-match-piece__heading">
              <h2>{item.category}</h2>
              {item.match && (
                <span>
                  <CheckIcon /> 내 옷으로 대체 가능
                </span>
              )}
            </div>

            {item.match ? (
              <div className="style-match-piece__comparison">
                <article className="style-match-piece-card">
                  <span>참고 스타일</span>
                  <div className="style-match-piece-card__image">
                    <ImageBox
                      src={item.reference?.image}
                      alt={item.reference?.name}
                    />
                  </div>
                  <strong>{item.reference?.name}</strong>
                  <p>{item.reference?.brand || item.category}</p>
                </article>

                <article className="style-match-piece-card style-match-piece-card--mine">
                  <span>내 옷장</span>
                  <div className="style-match-piece-card__image">
                    <ImageBox src={item.match.image} alt={item.match.name} />
                  </div>
                  <strong>{item.match.name}</strong>
                  <p>
                    {[item.match.color, item.match.season]
                      .filter(Boolean)
                      .join(" · ") || "내 옷"}
                  </p>
                </article>
              </div>
            ) : (
              <div className="style-match-missing">
                <div className="style-match-missing__reference">
                  <span>내 옷장에 없는 아이템</span>
                  <div>
                    <ImageBox
                      src={item.reference?.image}
                      alt={item.reference?.name}
                    />
                    <div>
                      <strong>{item.reference?.name}</strong>
                      <p>{item.reference?.brand || item.category}</p>
                    </div>
                  </div>
                </div>

                <div className="style-match-missing__message">
                  <strong>
                    {item.category} 아이템은 아직 옷장에서 찾지 못했어요.
                  </strong>
                  <p>
                    지금 가진 옷으로 먼저 코디를 만들고, 필요한 아이템만 따로
                    확인해보세요.
                  </p>
                  <button type="button" onClick={() => navigate("/closet")}>
                    옷장에서 다시 찾아보기
                    <ChevronRightIcon />
                  </button>
                </div>
              </div>
            )}
          </section>
        ))}
      </section>

      {missingItems.length > 0 && (
        <section className="style-match-suggested">
          <div className="style-match-section-heading">
            <div>
              <h2>있으면 더 좋은 아이템</h2>
              <p>현재 부족한 카테고리만 모았어요.</p>
            </div>
            <span>{missingItems.length} ITEMS</span>
          </div>

          <div className="style-match-suggested__list">
            {missingItems.map((item) => (
              <article
                key={`suggested-${item.id}`}
                className="style-match-suggested-piece"
              >
                <div className="style-match-suggested-piece__image">
                  <ImageBox
                    src={item.reference?.image}
                    alt={item.reference?.name}
                  />
                </div>
                <div className="style-match-suggested-piece__info">
                  <span>{item.category} · 비슷한 상품</span>
                  <strong>{item.reference?.name}</strong>
                  <p>{item.reference?.brand}</p>
                  <button
                    type="button"
                    onClick={() =>
                      window.alert("상품 연결은 다음 단계에서 구현할게요.")
                    }
                  >
                    비슷한 상품 보기
                    <ChevronRightIcon />
                  </button>
                </div>
              </article>
            ))}
          </div>
        </section>
      )}

      <section className="style-match-guide">
        <h2>완전히 똑같지 않아도 괜찮아요.</h2>
        <p>
          VESTI는 같은 상품을 사는 것보다, 이미 가진 옷으로 분위기와 조합을
          재해석하는 방법을 먼저 제안해요.
        </p>
      </section>

      <footer className="style-match-bottom">
        <div>
          <strong>
            {matchedItems.length}/{matches.length}
          </strong>
          <span>내 옷장 매치</span>
        </div>
        <button
          type="button"
          disabled={selectedClothingIds.length === 0}
          onClick={openOutfitCreator}
        >
          이 조합으로 코디 만들기
        </button>
      </footer>
    </div>
  );
}

export default StyleMatchPage;
