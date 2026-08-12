import { useEffect, useRef, useState } from "react";

import { getMyProfile } from "@/api/authApi";

import {
  createStylePostComment,
  deleteStylePostComment,
  getStylePostComments,
} from "@/api/stylePostCommentApi";

import "./StylePostCommentsSheet.css";

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

function MoreIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <circle cx="5" cy="12" r="1.4" />
      <circle cx="12" cy="12" r="1.4" />
      <circle cx="19" cy="12" r="1.4" />
    </svg>
  );
}

function formatCommentTime(comment) {
  if (!comment.createdAt) {
    return "";
  }

  const createdAt = new Date(comment.createdAt).getTime();

  if (Number.isNaN(createdAt)) {
    return "";
  }

  const diffMs = Math.max(0, Date.now() - createdAt);

  const diffMinutes = Math.floor(diffMs / 60000);

  if (diffMinutes < 1) {
    return "방금 전";
  }

  if (diffMinutes < 60) {
    return `${diffMinutes}분 전`;
  }

  const diffHours = Math.floor(diffMinutes / 60);

  if (diffHours < 24) {
    return `${diffHours}시간 전`;
  }

  const diffDays = Math.floor(diffHours / 24);

  return `${diffDays}일 전`;
}

function getInitials(user) {
  const source = user?.displayName || user?.username || "V";

  return source.trim().charAt(0).toUpperCase();
}

function StylePostCommentsSheet({ post, open, onClose, onCountChange }) {
  const inputRef = useRef(null);

  const [commentText, setCommentText] = useState("");

  const [comments, setComments] = useState([]);

  const [currentUser, setCurrentUser] = useState(null);

  const [loading, setLoading] = useState(false);

  const [submitting, setSubmitting] = useState(false);

  const [deletingId, setDeletingId] = useState(null);

  const [activeCommentMenuId, setActiveCommentMenuId] = useState(null);

  useEffect(() => {
    if (!open || !post) {
      return;
    }

    let ignore = false;

    async function loadComments() {
      setLoading(true);

      setActiveCommentMenuId(null);

      try {
        const [commentData, myProfile] = await Promise.all([
          getStylePostComments(post.id),
          getMyProfile(),
        ]);

        if (ignore) {
          return;
        }

        setComments(commentData);

        setCurrentUser(myProfile);

        onCountChange?.(commentData.length);
      } catch (error) {
        console.error("댓글을 불러오지 못했습니다.", error);

        if (!ignore) {
          setComments([]);
        }
      } finally {
        if (!ignore) {
          setLoading(false);
        }
      }
    }

    loadComments();

    const timer = window.setTimeout(() => {
      inputRef.current?.focus();
    }, 180);

    return () => {
      ignore = true;

      window.clearTimeout(timer);
    };
  }, [open, post, onCountChange]);

  if (!open || !post) {
    return null;
  }

  const totalCount = comments.length;

  const publishComment = async () => {
    const normalized = commentText.trim();

    if (!normalized || submitting) {
      return;
    }

    setSubmitting(true);

    try {
      const created = await createStylePostComment(post.id, normalized);

      const nextComments = [...comments, created];

      setComments(nextComments);

      setCommentText("");

      setActiveCommentMenuId(null);

      onCountChange?.(nextComments.length);

      window.setTimeout(() => {
        inputRef.current?.focus();
      }, 0);
    } catch (error) {
      console.error("댓글 작성에 실패했습니다.", error);

      window.alert("댓글을 등록하지 못했어요.");
    } finally {
      setSubmitting(false);
    }
  };

  const handleDeleteComment = async (commentId) => {
    if (deletingId !== null) {
      return;
    }

    setDeletingId(commentId);

    try {
      await deleteStylePostComment(commentId);

      const nextComments = comments.filter(
        (comment) => String(comment.id) !== String(commentId),
      );

      setComments(nextComments);

      setActiveCommentMenuId(null);

      onCountChange?.(nextComments.length);
    } catch (error) {
      console.error("댓글 삭제에 실패했습니다.", error);

      window.alert("댓글을 삭제하지 못했어요.");
    } finally {
      setDeletingId(null);
    }
  };

  return (
    <div
      className="style-comments-backdrop"
      onMouseDown={(event) => {
        if (event.target === event.currentTarget) {
          onClose();
        }
      }}
    >
      <section
        className="style-comments-sheet"
        role="dialog"
        aria-modal="true"
        aria-label="댓글"
      >
        <header className="style-comments-header">
          <div>
            <h2>댓글</h2>

            <span>{totalCount}</span>
          </div>

          <button type="button" onClick={onClose} aria-label="댓글 닫기">
            <CloseIcon />
          </button>
        </header>

        <div className="style-comments-list">
          {loading ? (
            <div className="style-comments-empty">
              <strong>댓글을 불러오고 있어요.</strong>

              <p>잠시만 기다려주세요.</p>
            </div>
          ) : comments.length > 0 ? (
            comments.map((comment) => {
              const menuOpen = activeCommentMenuId === comment.id;

              const isMine =
                currentUser?.id != null &&
                comment.author?.id != null &&
                String(currentUser.id) === String(comment.author.id);

              return (
                <article key={comment.id} className="style-comment">
                  {comment.author?.avatar ? (
                    <img
                      src={comment.author.avatar}
                      alt={`${comment.author.displayName} 프로필`}
                    />
                  ) : (
                    <div className="style-comments-form__avatar">
                      {getInitials(comment.author)}
                    </div>
                  )}

                  <div className="style-comment__body">
                    <div className="style-comment__meta">
                      <strong>@{comment.author.username}</strong>

                      <span>{formatCommentTime(comment)}</span>
                    </div>

                    <p>{comment.content}</p>
                  </div>

                  {isMine ? (
                    <div className="style-comment__menu">
                      <button
                        type="button"
                        className="style-comment__menu-button"
                        onClick={() =>
                          setActiveCommentMenuId((current) =>
                            current === comment.id ? null : comment.id,
                          )
                        }
                        aria-label="내 댓글 메뉴"
                      >
                        <MoreIcon />
                      </button>

                      {menuOpen && (
                        <div className="style-comment__menu-popup">
                          <button
                            type="button"
                            disabled={deletingId === comment.id}
                            onClick={() => handleDeleteComment(comment.id)}
                          >
                            {deletingId === comment.id
                              ? "삭제 중..."
                              : "댓글 삭제"}
                          </button>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div />
                  )}
                </article>
              );
            })
          ) : (
            <div className="style-comments-empty">
              <strong>첫 댓글을 남겨보세요.</strong>

              <p>이 스타일에 대한 생각이나 궁금한 점을 이야기해보세요.</p>
            </div>
          )}
        </div>

        <footer className="style-comments-form">
          {currentUser?.profileImageUrl ? (
            <img
              src={currentUser.profileImageUrl}
              alt=""
              style={{
                width: "32px",
                height: "32px",
                borderRadius: "50%",
                objectFit: "cover",
              }}
            />
          ) : (
            <div className="style-comments-form__avatar">
              {getInitials(currentUser)}
            </div>
          )}

          <input
            ref={inputRef}
            type="text"
            maxLength={500}
            value={commentText}
            onChange={(event) => setCommentText(event.target.value)}
            onKeyDown={(event) => {
              if (event.key === "Enter") {
                event.preventDefault();

                publishComment();
              }
            }}
            placeholder="댓글을 입력하세요..."
            aria-label="댓글 입력"
          />

          <button
            type="button"
            disabled={!commentText.trim() || submitting}
            onClick={publishComment}
          >
            {submitting ? "등록 중" : "게시"}
          </button>
        </footer>
      </section>
    </div>
  );
}

export default StylePostCommentsSheet;
