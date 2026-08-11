package com.vesti.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.request.StylePostCreateRequest;
import com.vesti.backend.dto.request.StylePostUpdateRequest;
import com.vesti.backend.dto.response.StylePostResponse;
import com.vesti.backend.entity.StylePost;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.StylePostAccessDeniedException;
import com.vesti.backend.exception.StylePostNotFoundException;
import com.vesti.backend.repository.StylePostCommentRepository;
import com.vesti.backend.repository.StylePostLikeRepository;
import com.vesti.backend.repository.StylePostRepository;
import com.vesti.backend.repository.StylePostSaveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StylePostService {

    private final StylePostRepository stylePostRepository;

    private final StylePostCommentRepository stylePostCommentRepository;

    private final StylePostLikeRepository stylePostLikeRepository;

    private final StylePostSaveRepository stylePostSaveRepository;

    private final CurrentUserProvider currentUserProvider;

    // 스타일 게시물 등록
    @Transactional
    public StylePostResponse createStylePost(
            StylePostCreateRequest request) {

        User user = currentUserProvider.getCurrentUser();

        StylePost stylePost = StylePost.builder()
                .user(user)
                .title(request.getTitle())
                .caption(request.getCaption())
                .imageUrl(request.getImageUrl())
                .location(request.getLocation())
                .build();

        StylePost savedStylePost = stylePostRepository.save(stylePost);

        return new StylePostResponse(
                savedStylePost);
    }

    // 전체 스타일 게시물 조회
    public Page<StylePostResponse> getStylePosts(
            Pageable pageable) {

        Pageable sortedPageable = applyDefaultSort(pageable);

        Page<StylePost> stylePostPage = stylePostRepository.findAll(
                sortedPageable);

        return stylePostPage.map(
                StylePostResponse::new);
    }

    // 특정 사용자 스타일 게시물 조회
    public Page<StylePostResponse> getStylePostsByUsername(
            String username,
            Pageable pageable) {

        Pageable sortedPageable = applyDefaultSort(pageable);

        Page<StylePost> stylePostPage = stylePostRepository
                .findAllByUser_Username(
                        username,
                        sortedPageable);

        return stylePostPage.map(
                StylePostResponse::new);
    }

    // 스타일 게시물 상세 조회
    public StylePostResponse getStylePostById(
            Long id) {

        StylePost stylePost = getStylePost(id);

        return new StylePostResponse(
                stylePost);
    }

    // 스타일 게시물 수정
    @Transactional
    public StylePostResponse updateStylePost(
            Long id,
            StylePostUpdateRequest request) {

        StylePost stylePost = getMyStylePost(id);

        stylePost.update(
                request.getTitle(),
                request.getCaption(),
                request.getImageUrl(),
                request.getLocation());

        return new StylePostResponse(
                stylePost);
    }

    // 스타일 게시물 삭제
    @Transactional
    public void deleteStylePost(
            Long id) {

        StylePost stylePost = getMyStylePost(id);

        // 댓글 삭제
        stylePostCommentRepository
                .deleteAllByStylePost_Id(id);

        // 좋아요 삭제
        stylePostLikeRepository
                .deleteAllByStylePost_Id(id);

        // 저장 삭제
        stylePostSaveRepository
                .deleteAllByStylePost_Id(id);

        // 게시물 삭제
        stylePostRepository.delete(
                stylePost);
    }

    // 게시물 존재 여부 확인
    private StylePost getStylePost(
            Long id) {

        return stylePostRepository
                .findById(id)
                .orElseThrow(
                        StylePostNotFoundException::new);
    }

    // 현재 로그인 사용자의 게시물인지 확인
    private StylePost getMyStylePost(
            Long id) {

        StylePost stylePost = getStylePost(id);

        User currentUser = currentUserProvider.getCurrentUser();

        if (stylePost.getUser() == null
                || !stylePost
                        .getUser()
                        .getId()
                        .equals(currentUser.getId())) {

            throw new StylePostAccessDeniedException();
        }

        return stylePost;
    }

    // 기본 정렬: 최신 게시물 순
    private Pageable applyDefaultSort(
            Pageable pageable) {

        if (pageable.getSort().isSorted()) {

            return pageable;
        }

        Sort defaultSort = Sort.by(
                Sort.Direction.DESC,
                "createdAt");

        return PageRequest.of(
                pageable.getPageNumber(),
                pageable.getPageSize(),
                defaultSort);
    }
}