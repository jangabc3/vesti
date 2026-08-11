package com.vesti.backend.entity;

import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.FetchType;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.GenerationType;
import jakarta.persistence.Id;
import jakarta.persistence.JoinColumn;
import jakarta.persistence.ManyToOne;
import jakarta.persistence.Table;

import lombok.AccessLevel;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Getter;
import lombok.NoArgsConstructor;

@Entity
@Table(name = "style_posts")
@Getter
@Builder
@NoArgsConstructor(access = AccessLevel.PROTECTED)
@AllArgsConstructor
public class StylePost extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    // 게시물 작성자
    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "user_id", nullable = false)
    private User user;

    // 게시물 제목
    @Column(length = 100)
    private String title;

    // 게시물 본문
    @Column(nullable = false, length = 2000)
    private String caption;

    // 대표 스타일 이미지
    @Column(name = "image_url", nullable = false, length = 1000)
    private String imageUrl;

    // 선택적 위치 정보
    @Column(length = 100)
    private String location;

    public void update(
            String title,
            String caption,
            String imageUrl,
            String location) {

        this.title = title;
        this.caption = caption;
        this.imageUrl = imageUrl;
        this.location = location;
    }
}