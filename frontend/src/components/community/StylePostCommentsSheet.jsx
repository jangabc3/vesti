import { useEffect, useMemo, useState } from "react";

import {
  createLocalStylePostComment,
  deleteLocalStylePostComment,
  getLocalStylePostComments,
  getStylePostCommentCount,
  getStylePostCommentPreviews,
} from "@/mocks/communityComments";

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
      <circle cx="5" cy="12" r="1.3" />

      <circle cx="12" cy="12" r="1.3" />

      <circle cx="19" cy="12" r="1.3" />
    </svg>
  );
}

function StylePostCommentsSheet({ post, open, onClose, onCommentCountChange }) {
  const [localComments, setLocalComments] = useState([]);

  const [commentInput, setCommentInput] = useState("");

  const [activeMenuId, setActiveMenuId] = useState(null);

  const previewComments = useMemo(
    () => getStylePostCommentPreviews(post),
    [post],
  );

  const visibleComments = useMemo(
    () => [...localComments, ...previewComments],
    [localComments, previewComments],
  );

  const totalCommentCount = Number(post?.comments ?? 0) + localComments.length;

  const remainingCommentCount = Math.max(
    0,
    totalCommentCount - visibleComments.length,
  );

  const canSubmit = commentInput.trim().length > 0;

  useEffect(() => {
    if (!open || !post) {
      return;
    }

    const comments = getLocalStylePostComments(post.id);

    setLocalComments(comments);

    setCommentInput("");

    setActiveMenuId(null);

    onCommentCountChange?.(getStylePostCommentCount(post));
  }, [open, post, onCommentCountChange]);

  if (!open || !post) {
    return null;
  }

  const handleSubmit = (event) => {
    event.preventDefault();

    if (!canSubmit) {
      return;
    }

    const newComment = createLocalStylePostComment(post.id, commentInput);

    if (!newComment) {
      return;
    }

    const nextComments = [newComment, ...localComments];

    setLocalComments(nextComments);

    setCommentInput("");

    setActiveMenuId(null);

    onCommentCountChange?.(Number(post.comments ?? 0) + nextComments.length);
  };

  const handleDelete = (commentId) => {
    const deleted = deleteLocalStylePostComment(post.id, commentId);

    if (!deleted) {
      return;
    }

    const nextComments = localComments.filter(
      (comment) => String(comment.id) !== String(commentId),
    );

    setLocalComments(nextComments);

    setActiveMenuId(null);

    onCommentCountChange?.(Number(post.comments ?? 0) + nextComments.length);
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
        {/* Header */}

        <header className="style-comments-header">
          <div>
            <h2>댓글</h2>

            <span>{totalCommentCount}</span>
          </div>

          <button type="button" onClick={onClose} aria-label="댓글 닫기">
            <CloseIcon />
          </button>
        </header>

        {/* Comments */}

        <div className="style-comments-list">
          {visibleComments.length > 0 ? (
            <>
              {visibleComments.map((comment) => (
                <article key={comment.id} className="style-comment">
                  <img src={comment.author.avatar} alt="" />

                  <div className="style-comment__body">
                    <div className="style-comment__meta">
                      <strong>@{comment.author.username}</strong>

                      <span>{comment.timeAgo}</span>
                    </div>

                    <p>{comment.content}</p>
                  </div>

                  {comment.isMine && (
                    <div className="style-comment__menu">
                      <button
                        type="button"
                        className="style-comment__menu-button"
                        onClick={() =>
                          setActiveMenuId((current) =>
                            current === comment.id ? null : comment.id,
                          )
                        }
                        aria-label="댓글 메뉴"
                      >
                        <MoreIcon />
                      </button>

                      {activeMenuId === comment.id && (
                        <div className="style-comment__menu-popup">
                          <button
                            type="button"
                            onClick={() => handleDelete(comment.id)}
                          >
                            댓글 삭제
                          </button>
                        </div>
                      )}
                    </div>
                  )}
                </article>
              ))}

              {remainingCommentCount > 0 && (
                <div className="style-comments-more-count">
                  외 {remainingCommentCount}
                  개의 댓글
                </div>
              )}
            </>
          ) : (
            <div className="style-comments-empty">
              <strong>아직 댓글이 없어요.</strong>

              <p>이 스타일에 첫 번째 댓글을 남겨보세요.</p>
            </div>
          )}
        </div>

        {/* Input */}

        <form className="style-comments-form" onSubmit={handleSubmit}>
          <div className="style-comments-form__avatar">V</div>

          <input
            type="text"
            value={commentInput}
            onChange={(event) => setCommentInput(event.target.value)}
            maxLength={200}
            placeholder="댓글을 입력하세요..."
            aria-label="댓글 입력"
          />

          <button type="submit" disabled={!canSubmit}>
            게시
          </button>
        </form>
      </section>
    </div>
  );
}

export default StylePostCommentsSheet;
