package com.vesti.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "users")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class User extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true)
    private String email;

    @Column(nullable = false)
    private String password;

    /*
     * 기존 사용자 데이터와의 호환성을 위해
     * 1차 마이그레이션에서는 nullable 허용.
     *
     * 신규 가입자는 UserService에서
     * 항상 username을 생성해서 저장한다.
     */
    @Column(unique = true, length = 30)
    private String username;

    @Column(name = "display_name", length = 50)
    private String displayName;

    @Column(name = "profile_image_url", length = 1000)
    private String profileImageUrl;

    @Column(length = 300)
    private String bio;

    public void changePassword(String password) {
        this.password = password;
    }

    public void updateProfile(
            String displayName,
            String profileImageUrl,
            String bio) {

        this.displayName = displayName;
        this.profileImageUrl = profileImageUrl;
        this.bio = bio;
    }
}