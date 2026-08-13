import { useEffect, useMemo, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

import { getMyProfile } from "@/api/authApi";

import {
  deleteStylePost,
  getStylePost,
  getStylePosts,
  getUserStylePosts,
} from "@/api/stylePostApi";

import {
  getMyStylePostLikeStatus,
  likeStylePost,
  unlikeStylePost,
} from "@/api/stylePostLikeApi";

import {
  getMyStylePostSaveStatus,
  saveStylePost,
  unsaveStylePost,
} from "@/api/stylePostSaveApi";

import { getStylePostComments } from "@/api/stylePostCommentApi";

import StylePostCommentsSheet from "@/components/community/StylePostCommentsSheet";

import {
  getCommerceProductRows,
  getStyleCommerceItems,
} from "@/mocks/styleCommerce";

import "./StylePostDetailPage.css";
import "./StylePostDetailActions.css";

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

function HeartIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20.8 4.7a5.3 5.3 0 0 0-7.5 0L12 6l-1.3-1.3a5.3 5.3 0 0 0-7.5 7.5L12 21l8.8-8.8a5.3 5.3 0 0 0 0-7.5Z" />
    </svg>
  );
}

function CommentIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M20 11.5a7.5 7.5 0 0 1-8 7.5 8.8 8.8 0 0 1-3.3-.7L4 20l1.4-4A7.3 7.3 0 0 1 4 11.5 7.5 7.5 0 0 1 12 4a7.5 7.5 0 0 1 8 7.5Z" />
    </svg>
  );
}

function BookmarkIcon({ filled = false }) {
  return (
    <svg
      viewBox="0 0 24 24"
      fill={filled ? "currentColor" : "none"}
      stroke="currentColor"
      strokeWidth="1.75"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
    >
      <path d="M6 4.5A1.5 1.5 0 0 1 7.5 3h9A1.5 1.5 0 0 1 18 4.5V21l-6-3.8L6 21V4.5Z" />
    </svg>
  );
}

function ShareIcon() {
  return (
    <svg
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.75"
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

function ChevronDownIcon() {
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
      <path d="m7 9 5 5 5-5" />
    </svg>
  );
}

function CloseIcon() {
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
      <path d="m6 6 12 12" />
      <path d="m18 6-12 12" />
    </svg>
  );
}

function EditIcon() {
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
      <path d="M12 20h9" />
      <path d="M16.5 3.5a2.1 2.1 0 0 1 3 3L8 18l-4 1 1-4Z" />
    </svg>
  );
}

function TrashIcon() {
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
      <path d="M4 7h16" />
      <path d="M10 11v6" />
      <path d="M14 11v6" />
      <path d="M6 7l1 14h10l1-14" />
      <path d="M9 7V4h6v3" />
    </svg>
  );
}

function FlagIcon() {
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
      <path d="M5 21V4" />
      <path d="M5 5h11l-2 4 2 4H5" />
    </svg>
  );
}

function EyeOffIcon() {
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
      <path d="m3 3 18 18" />
      <path d="M10.6 10.6a2 2 0 0 0 2.8 2.8" />

      <path d="M9.9 4.2A10.6 10.6 0 0 1 12 4c5.5 0 9 5 9 8a9.8 9.8 0 0 1-2.1 3.8" />

      <path d="M6.6 6.6C4.3 8.1 3 10.3 3 12c0 3 3.5 8 9 8a9.7 9.7 0 0 0 3.4-.6" />
    </svg>
  );
}

function formatCount(value) {
  const number = Number(value ?? 0);

  if (number >= 1000) {
    return `${(number / 1000).toFixed(1)}K`;
  }

  return number;
}

function formatPrice(value) {
  if (!value) {
    return null;
  }

  return `${Number(value).toLocaleString("ko-KR")}원`;
}

function getInitials(user) {
  const source = user?.displayName || user?.username || "V";

  return source.trim().charAt(0).toUpperCase();
}

function StyleImage({ src, alt = "", className = "" }) {
  const [failed, setFailed] = useState(false);

  if (!src || failed) {
    return (
      <div
        className={className}
        aria-label={alt}
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          minHeight: "180px",
          background: "#f3f2f0",
          color: "#aaa59f",
          fontSize: "11px",
          fontWeight: 600,
        }}
      >
        이미지를 준비 중이에요
      </div>
    );
  }

  return (
    <img
      className={className}
      src={src}
      alt={alt}
      onError={() => setFailed(true)}
    />
  );
}

function StylePostDetailPage() {
  const navigate = useNavigate();

  const { styleId } = useParams();

  const [post, setPost] = useState(null);

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(true);

  const [loadError, setLoadError] = useState(false);

  const [liked, setLiked] = useState(false);

  const [likeCount, setLikeCount] = useState(0);

  const [likePending, setLikePending] = useState(false);

  const [saved, setSaved] = useState(false);

  const [savePending, setSavePending] = useState(false);

  const [commentsOpen, setCommentsOpen] = useState(false);

  const [productsOpen, setProductsOpen] = useState(false);

  const [productLikedIds, setProductLikedIds] = useState(new Set());

  const [actionsOpen, setActionsOpen] = useState(false);

  const [deleteConfirmOpen, setDeleteConfirmOpen] = useState(false);

  const [deleting, setDeleting] = useState(false);

  const [commentCount, setCommentCount] = useState(0);

  const [creatorPosts, setCreatorPosts] = useState([]);

  const [otherPosts, setOtherPosts] = useState([]);

  const commerceItems = useMemo(() => getStyleCommerceItems(post), [post]);

  const commerceRows = useMemo(
    () => getCommerceProductRows(commerceItems),
    [commerceItems],
  );

  const hasSimilarProducts = commerceItems.some(
    (item) => item.source === "similar",
  );

  useEffect(() => {
    let ignore = false;

    async function loadDetail() {
      setLoading(true);

      setLoadError(false);

      try {
        const [postData, myProfile, likeData, saveData, comments] =
          await Promise.all([
            getStylePost(styleId),

            getMyProfile(),

            getMyStylePostLikeStatus(styleId),

            getMyStylePostSaveStatus(styleId),

            getStylePostComments(styleId),
          ]);

        if (ignore) {
          return;
        }

        setPost(postData);

        setCurrentUser(myProfile);

        setLiked(Boolean(likeData?.liked));

        setLikeCount(likeData?.likeCount ?? 0);

        setSaved(Boolean(saveData?.saved));

        setCommentCount(comments.length);

        try {
          const creatorPage = await getUserStylePosts(
            postData.author.username,
            {
              page: 0,
              size: 7,
              sort: "createdAt,desc",
            },
          );

          if (!ignore) {
            setCreatorPosts(
              (creatorPage.content ?? [])
                .filter((item) => String(item.id) !== String(postData.id))
                .slice(0, 6),
            );
          }
        } catch (error) {
          console.error("작성자의 다른 게시물을 불러오지 못했습니다.", error);

          if (!ignore) {
            setCreatorPosts([]);
          }
        }

        try {
          const allPage = await getStylePosts({
            page: 0,
            size: 12,
            sort: "createdAt,desc",
          });

          if (!ignore) {
            setOtherPosts(
              (allPage.content ?? [])
                .filter(
                  (item) =>
                    String(item.id) !== String(postData.id) &&
                    item.author.username !== postData.author.username,
                )
                .slice(0, 6),
            );
          }
        } catch (error) {
          console.error("다른 스타일을 불러오지 못했습니다.", error);

          if (!ignore) {
            setOtherPosts([]);
          }
        }
      } catch (error) {
        console.error("스타일 게시물 상세 조회에 실패했습니다.", error);

        if (!ignore) {
          setPost(null);

          setLoadError(true);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadDetail();

    return () => {
      ignore = true;
    };
  }, [styleId]);

  const modalOpen =
    productsOpen || commentsOpen || actionsOpen || deleteConfirmOpen;

  useEffect(() => {
    if (!modalOpen) {
      return undefined;
    }

    const previousOverflow = document.body.style.overflow;

    document.body.style.overflow = "hidden";

    return () => {
      document.body.style.overflow = previousOverflow;
    };
  }, [modalOpen]);

  if (loading) {
    return (
      <div className="style-post-not-found">
        <h1>스타일을 불러오고 있어요.</h1>

        <p>실제 VESTI 게시물을 가져오는 중입니다.</p>
      </div>
    );
  }

  if (loadError || !post) {
    return (
      <div className="style-post-not-found">
        <h1>게시물을 찾을 수 없어요.</h1>

        <p>삭제되었거나 존재하지 않는 스타일이에요.</p>

        <button type="button" onClick={() => navigate("/discover")}>
          발견으로 돌아가기
        </button>
      </div>
    );
  }

  const isMine =
    currentUser?.id != null &&
    post.author?.id != null &&
    String(currentUser.id) === String(post.author.id);

  const cleanTitle = post.title?.trim() ?? "";

  const cleanCaption = post.caption?.trim() ?? "";

  const shouldShowTitle =
    Boolean(cleanTitle) &&
    cleanTitle !== cleanCaption &&
    cleanTitle !== "오늘의 스타일";

  const morePosts =
    creatorPosts.length >= 3
      ? creatorPosts
      : [...creatorPosts, ...otherPosts]
          .filter(
            (item, index, array) =>
              array.findIndex(
                (candidate) => String(candidate.id) === String(item.id),
              ) === index,
          )
          .slice(0, 6);

  const handleToggleLike = async () => {
    if (likePending) {
      return;
    }

    setLikePending(true);

    try {
      const result = liked
        ? await unlikeStylePost(post.id)
        : await likeStylePost(post.id);

      setLiked(Boolean(result.liked));

      setLikeCount(result.likeCount ?? 0);
    } catch (error) {
      console.error("좋아요 처리에 실패했습니다.", error);

      window.alert("좋아요 처리에 실패했어요.");
    } finally {
      setLikePending(false);
    }
  };

  const handleToggleSave = async () => {
    if (savePending) {
      return;
    }

    setSavePending(true);

    try {
      const result = saved
        ? await unsaveStylePost(post.id)
        : await saveStylePost(post.id);

      setSaved(Boolean(result.saved));
    } catch (error) {
      console.error("저장 처리에 실패했습니다.", error);

      window.alert("게시물 저장에 실패했어요.");
    } finally {
      setSavePending(false);
    }
  };

  const handleShare = async () => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: post.title,

          text: post.caption,

          url: window.location.href,
        });
      } catch {
        // 사용자가 공유창을 닫은 경우
      }

      return;
    }

    try {
      await navigator.clipboard.writeText(window.location.href);

      window.alert("게시물 링크를 복사했어요.");
    } catch {
      window.alert("공유 기능을 사용할 수 없어요.");
    }
  };

  const toggleProductLike = (productId) => {
    setProductLikedIds((current) => {
      const next = new Set(current);

      if (next.has(productId)) {
        next.delete(productId);
      } else {
        next.add(productId);
      }

      return next;
    });
  };

  const openProduct = () => {
    window.alert("상품 상세 또는 외부 쇼핑 링크는 다음 단계에서 연결할게요.");
  };

  const handleEdit = () => {
    setActionsOpen(false);

    navigate(`/posts/${post.id}/edit`);
  };

  const openDeleteConfirm = () => {
    setActionsOpen(false);

    setDeleteConfirmOpen(true);
  };

  const handleDelete = async () => {
    if (deleting) {
      return;
    }

    setDeleting(true);

    try {
      await deleteStylePost(post.id);

      navigate("/discover", {
        replace: true,
      });
    } catch (error) {
      console.error("게시물 삭제에 실패했습니다.", error);

      setDeleteConfirmOpen(false);

      window.alert("게시물을 삭제하지 못했어요.");
    } finally {
      setDeleting(false);
    }
  };

  const handleReport = () => {
    setActionsOpen(false);

    window.alert("신고 기능은 이후 단계에서 연결할게요.");
  };

  const handleNotInterested = () => {
    setActionsOpen(false);

    window.alert(
      "이 스타일을 추천에서 줄이는 기능은 추천 시스템 단계에서 연결할게요.",
    );
  };

  return (
    <div className="style-post-page">
      <header className="style-post-header">
        <button
          type="button"
          onClick={() => navigate(-1)}
          aria-label="뒤로 가기"
        >
          <BackIcon />
        </button>

        <strong>스타일</strong>

        <button
          type="button"
          onClick={() => setActionsOpen(true)}
          aria-label="게시물 메뉴"
        >
          <MoreIcon />
        </button>
      </header>

      <section className="style-post-creator">
        <button
          type="button"
          className="style-post-creator__profile"
          onClick={() => navigate(`/users/${post.author.username}`)}
        >
          {post.author.avatar ? (
            <img
              src={post.author.avatar}
              alt={`${post.author.displayName} 프로필`}
            />
          ) : (
            <div className="style-post-comment-input__avatar">
              {getInitials(post.author)}
            </div>
          )}

          <div>
            <strong>{post.author.displayName}</strong>

            <span>
              @{post.author.username}
              {post.timeAgo && (
                <>
                  {" · "}
                  {post.timeAgo}
                </>
              )}
            </span>
          </div>
        </button>
      </section>

      <section className="style-post-photo">
        <StyleImage src={post.image} alt={post.title} />
      </section>

      {commerceItems.length > 0 && (
        <section className="style-post-products-preview">
          <div className="style-post-products-preview__rail">
            {commerceItems.slice(0, 3).map((item) => (
              <button
                key={item.id}
                type="button"
                className="style-post-product-preview-card"
                onClick={() => setProductsOpen(true)}
              >
                <StyleImage
                  src={item.product?.image}
                  alt={item.product?.name}
                />

                <div>
                  <span
                    className={
                      item.source === "tagged"
                        ? "style-post-product-preview-card__source"
                        : "style-post-product-preview-card__source style-post-product-preview-card__source--similar"
                    }
                  >
                    {item.source === "tagged" ? "태그한 상품" : "비슷한 상품"}
                  </span>

                  <strong>{item.product?.brand}</strong>
                  <p>{item.product?.name}</p>

                  {item.product?.price && (
                    <b>{formatPrice(item.product.price)}</b>
                  )}
                </div>
              </button>
            ))}
          </div>

          <button
            type="button"
            className="style-post-products-preview__open"
            onClick={() => setProductsOpen(true)}
            aria-label="스타일 상품 모두 보기"
          >
            <ChevronDownIcon />
          </button>
        </section>
      )}

      <section className="style-post-social">
        <div className="style-post-social__left">
          <button
            type="button"
            disabled={likePending}
            className={
              liked
                ? "style-post-social__button style-post-social__button--liked"
                : "style-post-social__button"
            }
            onClick={handleToggleLike}
            aria-label={liked ? "좋아요 취소" : "좋아요"}
          >
            <HeartIcon filled={liked} />
          </button>

          <button
            type="button"
            className="style-post-social__button"
            onClick={() => setCommentsOpen(true)}
            aria-label="댓글"
          >
            <CommentIcon />
          </button>

          <button
            type="button"
            className="style-post-social__button"
            onClick={handleShare}
            aria-label="공유"
          >
            <ShareIcon />
          </button>
        </div>

        <button
          type="button"
          disabled={savePending}
          className={
            saved
              ? "style-post-social__button style-post-social__button--saved"
              : "style-post-social__button"
          }
          onClick={handleToggleSave}
          aria-label={saved ? "저장 취소" : "저장"}
        >
          <BookmarkIcon filled={saved} />
        </button>
      </section>

      <section className="style-post-content">
        <div className="style-post-content__engagement">
          <strong>좋아요 {formatCount(likeCount)}개</strong>

          <button type="button" onClick={() => setCommentsOpen(true)}>
            댓글 {commentCount}개
          </button>
        </div>

        {shouldShowTitle && <h1>{post.title}</h1>}

        {cleanCaption && (
          <p className="style-post-content__caption">{post.caption}</p>
        )}

        {post.tags.length > 0 && (
          <div className="style-post-tags">
            {post.tags.map((tag) => (
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

        <button
          type="button"
          className="style-post-comment-input"
          onClick={() => setCommentsOpen(true)}
        >
          <div className="style-post-comment-input__avatar">
            {getInitials(currentUser)}
          </div>

          <span>댓글을 남겨보세요.</span>
        </button>
      </section>

      <section className="style-post-wardrobe">
        <div>
          <h2>이 스타일을 내 옷으로 입어볼까요?</h2>

          <p>
            내 옷장에 있는 아이템을 활용해 비슷한 조합을 만들어볼 수 있어요.
          </p>
        </div>

        <button
          type="button"
          onClick={() => navigate(`/styles/${post.id}/match`)}
        >
          내 옷으로 입어보기
        </button>
      </section>

      {morePosts.length > 0 && (
        <section className="style-post-more">
          <div className="style-post-section-title">
            <h2>
              {creatorPosts.length > 0
                ? `${post.author.displayName}의 다른 스타일`
                : "다른 스타일"}
            </h2>

            {creatorPosts.length > 0 && (
              <button
                type="button"
                onClick={() => navigate(`/users/${post.author.username}`)}
              >
                프로필 보기
              </button>
            )}
          </div>

          <div className="style-post-more__grid">
            {morePosts.map((item) => (
              <button
                key={item.id}
                type="button"
                onClick={() => navigate(`/styles/${item.id}`)}
              >
                <StyleImage src={item.image} alt={item.title} />
              </button>
            ))}
          </div>
        </section>
      )}

      <StylePostCommentsSheet
        post={post}
        open={commentsOpen}
        onClose={() => setCommentsOpen(false)}
        onCountChange={setCommentCount}
      />

      {productsOpen && (
        <div
          className="style-product-sheet-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setProductsOpen(false);
            }
          }}
        >
          <section className="style-product-sheet">
            <header className="style-product-sheet__header">
              <div>
                <h2>스타일 상품</h2>
                <span>{commerceRows.length}개</span>
              </div>

              <button
                type="button"
                onClick={() => setProductsOpen(false)}
                aria-label="닫기"
              >
                <CloseIcon />
              </button>
            </header>

            {hasSimilarProducts && (
              <div className="style-product-sheet__notice">
                <strong>일부 상품은 비슷한 상품이에요.</strong>
                <p>
                  작성자가 정확한 상품을 태그하지 않은 아이템은 현재 사진의
                  분위기와 카테고리를 기준으로 비슷한 상품을 보여줘요.
                </p>
              </div>
            )}

            <div className="style-product-sheet__list">
              {commerceRows.map((product) => (
                <article key={product.rowId} className="style-product-row">
                  <button
                    type="button"
                    className="style-product-row__main"
                    onClick={openProduct}
                  >
                    <StyleImage src={product.image} alt={product.name} />

                    <div>
                      <span
                        className={
                          product.source === "tagged"
                            ? "style-product-row__source"
                            : "style-product-row__source style-product-row__source--similar"
                        }
                      >
                        {product.sourceLabel}
                        {" · "}
                        {product.category}
                      </span>
                      <strong>{product.brand}</strong>
                      <p>{product.name}</p>
                      {product.price && <b>{formatPrice(product.price)}</b>}
                    </div>
                  </button>

                  <button
                    type="button"
                    className={
                      productLikedIds.has(product.rowId)
                        ? "style-product-row__heart style-product-row__heart--active"
                        : "style-product-row__heart"
                    }
                    onClick={() => toggleProductLike(product.rowId)}
                    aria-label="상품 좋아요"
                  >
                    <HeartIcon filled={productLikedIds.has(product.rowId)} />
                  </button>
                </article>
              ))}
            </div>
          </section>
        </div>
      )}

      {actionsOpen && (
        <div
          className="style-post-actions-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget) {
              setActionsOpen(false);
            }
          }}
        >
          <section className="style-post-actions-sheet">
            <div className="style-post-actions-sheet__handle" />

            {isMine ? (
              <>
                <button
                  type="button"
                  className="style-post-actions-sheet__item"
                  onClick={handleEdit}
                >
                  <EditIcon />

                  <span>게시물 수정</span>
                </button>

                <button
                  type="button"
                  className="style-post-actions-sheet__item style-post-actions-sheet__item--danger"
                  onClick={openDeleteConfirm}
                >
                  <TrashIcon />

                  <span>게시물 삭제</span>
                </button>
              </>
            ) : (
              <>
                <button
                  type="button"
                  className="style-post-actions-sheet__item"
                  onClick={handleNotInterested}
                >
                  <EyeOffIcon />

                  <span>관심 없음</span>
                </button>

                <button
                  type="button"
                  className="style-post-actions-sheet__item style-post-actions-sheet__item--danger"
                  onClick={handleReport}
                >
                  <FlagIcon />

                  <span>신고하기</span>
                </button>
              </>
            )}

            <button
              type="button"
              className="style-post-actions-sheet__cancel"
              onClick={() => setActionsOpen(false)}
            >
              취소
            </button>
          </section>
        </div>
      )}

      {deleteConfirmOpen && (
        <div
          className="style-post-delete-backdrop"
          onMouseDown={(event) => {
            if (event.target === event.currentTarget && !deleting) {
              setDeleteConfirmOpen(false);
            }
          }}
        >
          <section className="style-post-delete-dialog">
            <h2>게시물을 삭제할까요?</h2>

            <p>삭제한 게시물은 다시 복구할 수 없어요.</p>

            <div>
              <button
                type="button"
                disabled={deleting}
                onClick={() => setDeleteConfirmOpen(false)}
              >
                취소
              </button>

              <button
                type="button"
                className="style-post-delete-dialog__delete"
                disabled={deleting}
                onClick={handleDelete}
              >
                {deleting ? "삭제 중" : "삭제"}
              </button>
            </div>
          </section>
        </div>
      )}
    </div>
  );
}

export default StylePostDetailPage;
