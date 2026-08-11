package com.vesti.backend.service;

import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.response.StylePostLikeResponse;
import com.vesti.backend.entity.StylePost;
import com.vesti.backend.entity.StylePostLike;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.StylePostNotFoundException;
import com.vesti.backend.repository.StylePostLikeRepository;
import com.vesti.backend.repository.StylePostRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StylePostLikeService {

    private final StylePostLikeRepository stylePostLikeRepository;

    private final StylePostRepository stylePostRepository;

    private final CurrentUserProvider currentUserProvider;

    // 좋아요 등록
    @Transactional
    public StylePostLikeResponse likeStylePost(
            Long stylePostId) {

        StylePost stylePost = getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        boolean alreadyLiked = stylePostLikeRepository
                .existsByStylePost_IdAndUser_Id(
                        stylePostId,
                        user.getId());

        /*
         * 이미 좋아요를 누른 경우
         * 새로운 행을 만들지 않고 현재 상태만 반환한다.
         */
        if (!alreadyLiked) {

            StylePostLike stylePostLike = StylePostLike.builder()
                    .stylePost(stylePost)
                    .user(user)
                    .build();

            stylePostLikeRepository.save(
                    stylePostLike);
        }

        long likeCount = stylePostLikeRepository
                .countByStylePost_Id(
                        stylePostId);

        return new StylePostLikeResponse(
                stylePostId,
                true,
                likeCount);
    }

    // 좋아요 취소
    @Transactional
    public StylePostLikeResponse unlikeStylePost(
            Long stylePostId) {

        // 존재하지 않는 게시물 좋아요 취소 방지
        getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        stylePostLikeRepository
                .findByStylePost_IdAndUser_Id(
                        stylePostId,
                        user.getId())
                .ifPresent(
                        stylePostLikeRepository::delete);

        long likeCount = stylePostLikeRepository
                .countByStylePost_Id(
                        stylePostId);

        return new StylePostLikeResponse(
                stylePostId,
                false,
                likeCount);
    }

    // 현재 사용자의 좋아요 상태 조회
    public StylePostLikeResponse getMyLikeStatus(
            Long stylePostId) {

        getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        boolean liked = stylePostLikeRepository
                .existsByStylePost_IdAndUser_Id(
                        stylePostId,
                        user.getId());

        long likeCount = stylePostLikeRepository
                .countByStylePost_Id(
                        stylePostId);

        return new StylePostLikeResponse(
                stylePostId,
                liked,
                likeCount);
    }

    private StylePost getStylePost(
            Long stylePostId) {

        return stylePostRepository
                .findById(stylePostId)
                .orElseThrow(
                        StylePostNotFoundException::new);
    }
}