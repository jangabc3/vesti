package com.vesti.backend.service;

import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageRequest;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import com.vesti.backend.config.CurrentUserProvider;
import com.vesti.backend.dto.response.UserFollowStatusResponse;
import com.vesti.backend.dto.response.UserFollowUserResponse;
import com.vesti.backend.entity.User;
import com.vesti.backend.entity.UserFollow;
import com.vesti.backend.exception.CannotFollowSelfException;
import com.vesti.backend.exception.UserNotFoundException;
import com.vesti.backend.repository.UserFollowRepository;
import com.vesti.backend.repository.UserRepository;

import lombok.RequiredArgsConstructor;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class UserFollowService {

    private final UserFollowRepository userFollowRepository;

    private final UserRepository userRepository;

    private final CurrentUserProvider currentUserProvider;

    // 팔로우
    @Transactional
    public UserFollowStatusResponse follow(
            String username) {

        User currentUser = currentUserProvider.getCurrentUser();

        User targetUser = getUserByUsername(username);

        validateNotSelf(
                currentUser,
                targetUser);

        boolean alreadyFollowing = userFollowRepository
                .existsByFollower_IdAndFollowing_Id(
                        currentUser.getId(),
                        targetUser.getId());

        if (!alreadyFollowing) {

            UserFollow userFollow = UserFollow.builder()
                    .follower(currentUser)
                    .following(targetUser)
                    .build();

            userFollowRepository.save(
                    userFollow);
        }

        return createStatusResponse(
                currentUser,
                targetUser,
                true);
    }

    // 팔로우 취소
    @Transactional
    public UserFollowStatusResponse unfollow(
            String username) {

        User currentUser = currentUserProvider.getCurrentUser();

        User targetUser = getUserByUsername(username);

        validateNotSelf(
                currentUser,
                targetUser);

        userFollowRepository
                .findByFollower_IdAndFollowing_Id(
                        currentUser.getId(),
                        targetUser.getId())
                .ifPresent(
                        userFollowRepository::delete);

        return createStatusResponse(
                currentUser,
                targetUser,
                false);
    }

    // 내가 해당 사용자를 팔로우하는지 확인
    public UserFollowStatusResponse getMyFollowStatus(
            String username) {

        User currentUser = currentUserProvider.getCurrentUser();

        User targetUser = getUserByUsername(username);

        boolean following = !currentUser
                .getId()
                .equals(targetUser.getId())
                && userFollowRepository
                        .existsByFollower_IdAndFollowing_Id(
                                currentUser.getId(),
                                targetUser.getId());

        return createStatusResponse(
                currentUser,
                targetUser,
                following);
    }

    // 특정 사용자의 팔로워 목록
    public Page<UserFollowUserResponse> getFollowers(
            String username,
            Pageable pageable) {

        User targetUser = getUserByUsername(username);

        Pageable sortedPageable = applyDefaultSort(pageable);

        return userFollowRepository
                .findAllByFollowing_Id(
                        targetUser.getId(),
                        sortedPageable)
                .map(userFollow -> new UserFollowUserResponse(
                        userFollow.getFollower()));
    }

    // 특정 사용자의 팔로잉 목록
    public Page<UserFollowUserResponse> getFollowing(
            String username,
            Pageable pageable) {

        User targetUser = getUserByUsername(username);

        Pageable sortedPageable = applyDefaultSort(pageable);

        return userFollowRepository
                .findAllByFollower_Id(
                        targetUser.getId(),
                        sortedPageable)
                .map(userFollow -> new UserFollowUserResponse(
                        userFollow.getFollowing()));
    }

    private UserFollowStatusResponse createStatusResponse(
            User currentUser,
            User targetUser,
            boolean following) {

        long followerCount = userFollowRepository
                .countByFollowing_Id(
                        targetUser.getId());

        long followingCount = userFollowRepository
                .countByFollower_Id(
                        targetUser.getId());

        return new UserFollowStatusResponse(
                targetUser.getId(),
                resolveUsername(targetUser),
                following,
                followerCount,
                followingCount);
    }

    /*
     * username으로 사용자 조회.
     *
     * 신규 사용자는 실제 username이 DB에 저장된다.
     *
     * 기존 사용자는 username이 null일 수 있기 때문에
     * UserResponse에서 사용하던 user{id} fallback도 지원한다.
     *
     * 예:
     * user5 → id 5 사용자
     */
    private User getUserByUsername(
            String username) {

        return userRepository
                .findByUsername(username)
                .orElseGet(() -> findLegacyUser(username));
    }

    private User findLegacyUser(
            String username) {

        if (username == null
                || !username.matches("user\\d+")) {

            throw new UserNotFoundException();
        }

        String idText = username.substring(4);

        Long userId;

        try {

            userId = Long.parseLong(idText);

        } catch (NumberFormatException exception) {

            throw new UserNotFoundException();
        }

        User user = userRepository
                .findById(userId)
                .orElseThrow(
                        UserNotFoundException::new);

        /*
         * 실제 username이 이미 존재하는 사용자라면
         * user{id} fallback으로 접근하지 않는다.
         */
        if (user.getUsername() != null
                && !user.getUsername().isBlank()) {

            throw new UserNotFoundException();
        }

        return user;
    }

    private void validateNotSelf(
            User currentUser,
            User targetUser) {

        if (currentUser
                .getId()
                .equals(targetUser.getId())) {

            throw new CannotFollowSelfException();
        }
    }

    private String resolveUsername(
            User user) {

        if (user.getUsername() != null
                && !user.getUsername().isBlank()) {

            return user.getUsername();
        }

        return "user" + user.getId();
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