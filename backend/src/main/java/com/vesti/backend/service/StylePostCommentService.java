package com.vesti.backend.service;

import java.util.List;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.request.StylePostCommentCreateRequest;
import com.vesti.backend.dto.response.StylePostCommentResponse;
import com.vesti.backend.entity.StylePost;
import com.vesti.backend.entity.StylePostComment;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.StylePostCommentAccessDeniedException;
import com.vesti.backend.exception.StylePostCommentNotFoundException;
import com.vesti.backend.exception.StylePostNotFoundException;
import com.vesti.backend.repository.StylePostCommentRepository;
import com.vesti.backend.repository.StylePostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StylePostCommentService {

    private final StylePostCommentRepository stylePostCommentRepository;

    private final StylePostRepository stylePostRepository;

    private final CurrentUserProvider currentUserProvider;

    // 댓글 목록 조회
    public List<StylePostCommentResponse> getComments(
            Long stylePostId) {

        // 게시물이 실제로 존재하는지 먼저 확인
        getStylePost(stylePostId);

        return stylePostCommentRepository
                .findAllByStylePost_IdOrderByCreatedAtAsc(
                        stylePostId)
                .stream()
                .map(StylePostCommentResponse::new)
                .toList();
    }

    // 댓글 등록
    @Transactional
    public StylePostCommentResponse createComment(
            Long stylePostId,
            StylePostCommentCreateRequest request) {

        StylePost stylePost = getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        StylePostComment comment = StylePostComment.builder()
                .stylePost(stylePost)
                .user(user)
                .content(request.getContent())
                .build();

        StylePostComment savedComment = stylePostCommentRepository.save(comment);

        return new StylePostCommentResponse(
                savedComment);
    }

    // 댓글 삭제
    @Transactional
    public void deleteComment(
            Long commentId) {

        StylePostComment comment = getComment(commentId);

        User currentUser = currentUserProvider.getCurrentUser();

        if (comment.getUser() == null
                || !comment
                        .getUser()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new StylePostCommentAccessDeniedException();
        }

        stylePostCommentRepository.delete(
                comment);
    }

    // 게시물 존재 여부 확인
    private StylePost getStylePost(
            Long stylePostId) {

        return stylePostRepository
                .findById(stylePostId)
                .orElseThrow(
                        StylePostNotFoundException::new);
    }

    // 댓글 존재 여부 확인
    private StylePostComment getComment(
            Long commentId) {

        return stylePostCommentRepository
                .findById(commentId)
                .orElseThrow(
                        StylePostCommentNotFoundException::new);
    }
}