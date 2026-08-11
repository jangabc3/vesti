package com.vesti.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.response.StylePostResponse;
import com.vesti.backend.dto.response.StylePostSaveResponse;
import com.vesti.backend.entity.StylePost;
import com.vesti.backend.entity.StylePostSave;
import com.vesti.backend.entity.User;
import com.vesti.backend.exception.StylePostNotFoundException;
import com.vesti.backend.repository.StylePostRepository;
import com.vesti.backend.repository.StylePostSaveRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class StylePostSaveService {

    private final StylePostSaveRepository stylePostSaveRepository;

    private final StylePostRepository stylePostRepository;

    private final CurrentUserProvider currentUserProvider;

    // 스타일 게시물 저장
    @Transactional
    public StylePostSaveResponse saveStylePost(
            Long stylePostId) {

        StylePost stylePost = getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        boolean alreadySaved = stylePostSaveRepository
                .existsByStylePost_IdAndUser_Id(
                        stylePostId,
                        user.getId());

        if (!alreadySaved) {

            StylePostSave stylePostSave = StylePostSave.builder()
                    .stylePost(stylePost)
                    .user(user)
                    .build();

            stylePostSaveRepository.save(
                    stylePostSave);
        }

        return new StylePostSaveResponse(
                stylePostId,
                true);
    }

    // 스타일 게시물 저장 취소
    @Transactional
    public StylePostSaveResponse unsaveStylePost(
            Long stylePostId) {

        getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        stylePostSaveRepository
                .findByStylePost_IdAndUser_Id(
                        stylePostId,
                        user.getId())
                .ifPresent(
                        stylePostSaveRepository::delete);

        return new StylePostSaveResponse(
                stylePostId,
                false);
    }

    // 현재 사용자의 저장 상태 조회
    public StylePostSaveResponse getMySaveStatus(
            Long stylePostId) {

        getStylePost(stylePostId);

        User user = currentUserProvider.getCurrentUser();

        boolean saved = stylePostSaveRepository
                .existsByStylePost_IdAndUser_Id(
                        stylePostId,
                        user.getId());

        return new StylePostSaveResponse(
                stylePostId,
                saved);
    }

    // 내가 저장한 스타일 게시물 목록 조회
    public Page<StylePostResponse> getMySavedStylePosts(
            Pageable pageable) {

        User user = currentUserProvider.getCurrentUser();

        Pageable sortedPageable = applyDefaultSort(pageable);

        return stylePostSaveRepository
                .findAllByUser_Id(
                        user.getId(),
                        sortedPageable)
                .map(save -> new StylePostResponse(
                        save.getStylePost()));
    }

    private StylePost getStylePost(
            Long stylePostId) {

        return stylePostRepository
                .findById(stylePostId)
                .orElseThrow(
                        StylePostNotFoundException::new);
    }

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