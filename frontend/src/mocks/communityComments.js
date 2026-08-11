import { CURRENT_COMMUNITY_USER, getStylePost } from "@/mocks/community";

const COMMENTS_STORAGE_KEY = "vesti-style-comments";

const previewAuthors = [
  {
    username: "seoa",
    displayName: "서아",
    avatar:
      "https://images.unsplash.com/photo-1524504388940-b1c1722653e1?auto=format&fit=crop&w=200&q=85",
  },
  {
    username: "yuha",
    displayName: "유하",
    avatar:
      "https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=200&q=85",
  },
];

const previewContents = [
  "이 코디 분위기 너무 좋아요.",
  "컬러 조합이 깔끔해서 참고하고 싶어요.",
];

function readCommentStore() {
  if (typeof window === "undefined") {
    return {};
  }

  try {
    const stored = window.localStorage.getItem(COMMENTS_STORAGE_KEY);

    if (!stored) {
      return {};
    }

    const parsed = JSON.parse(stored);

    if (!parsed || typeof parsed !== "object" || Array.isArray(parsed)) {
      return {};
    }

    return parsed;
  } catch (error) {
    console.warn("VESTI 댓글 데이터를 불러오지 못했습니다.", error);

    return {};
  }
}

function persistCommentStore(store) {
  if (typeof window === "undefined") {
    return false;
  }

  try {
    window.localStorage.setItem(COMMENTS_STORAGE_KEY, JSON.stringify(store));

    return true;
  } catch (error) {
    console.warn("VESTI 댓글 데이터를 저장하지 못했습니다.", error);

    return false;
  }
}

/* ========================================
   Local Comments
======================================== */

export function getLocalStylePostComments(styleId) {
  const store = readCommentStore();

  const comments = store[String(styleId)];

  if (!Array.isArray(comments)) {
    return [];
  }

  return comments;
}

/* ========================================
   Preview Comments

   기존 Mock 게시물에는 댓글 개수만 있고
   댓글 본문 데이터가 없으므로
   화면 확인용 대표 댓글만 보여준다.
======================================== */

export function getStylePostCommentPreviews(post) {
  if (!post || !post.comments || post.comments <= 0) {
    return [];
  }

  const previewCount = Math.min(post.comments, 2);

  return Array.from(
    {
      length: previewCount,
    },
    (_, index) => ({
      id: `preview-${post.id}-${index + 1}`,

      isMine: false,
      isPreview: true,

      author: previewAuthors[index % previewAuthors.length],

      content: previewContents[index % previewContents.length],

      timeAgo: index === 0 ? "2시간 전" : "5시간 전",
    }),
  );
}

/* ========================================
   Comment Count
======================================== */

export function getStylePostCommentCount(postOrId) {
  const post = typeof postOrId === "object" ? postOrId : getStylePost(postOrId);

  if (!post) {
    return 0;
  }

  const localComments = getLocalStylePostComments(post.id);

  return Number(post.comments ?? 0) + localComments.length;
}

/* ========================================
   Create Comment
======================================== */

export function createLocalStylePostComment(styleId, content) {
  const cleanContent = content.trim();

  if (!cleanContent) {
    return null;
  }

  const store = readCommentStore();

  const key = String(styleId);

  const currentComments = Array.isArray(store[key]) ? store[key] : [];

  const createdAt = new Date();

  const newComment = {
    id: `local-comment-${createdAt.getTime()}`,

    isMine: true,

    author: {
      username: CURRENT_COMMUNITY_USER.username,

      displayName: CURRENT_COMMUNITY_USER.displayName,

      avatar: CURRENT_COMMUNITY_USER.avatar,
    },

    content: cleanContent,

    createdAt: createdAt.toISOString(),

    timeAgo: "방금 전",
  };

  store[key] = [newComment, ...currentComments];

  persistCommentStore(store);

  return newComment;
}

/* ========================================
   Delete Comment
======================================== */

export function deleteLocalStylePostComment(styleId, commentId) {
  const store = readCommentStore();

  const key = String(styleId);

  const currentComments = Array.isArray(store[key]) ? store[key] : [];

  const target = currentComments.find(
    (comment) => String(comment.id) === String(commentId),
  );

  if (!target || target.isMine !== true) {
    return false;
  }

  const nextComments = currentComments.filter(
    (comment) => String(comment.id) !== String(commentId),
  );

  if (nextComments.length > 0) {
    store[key] = nextComments;
  } else {
    delete store[key];
  }

  persistCommentStore(store);

  return true;
}

/* ========================================
   Clear Post Comments
======================================== */

export function clearLocalStylePostComments(styleId) {
  const store = readCommentStore();

  const key = String(styleId);

  if (!Object.prototype.hasOwnProperty.call(store, key)) {
    return false;
  }

  delete store[key];

  persistCommentStore(store);

  return true;
}
