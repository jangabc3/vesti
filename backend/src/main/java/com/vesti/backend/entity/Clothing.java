package com.vesti.backend.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "clothes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Clothing extends BaseEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "user_id")
    private User user;

    private String name;

    private String category;

    private String color;

    private String season;

    @Column(name = "image_url")
    private String imageUrl;
}