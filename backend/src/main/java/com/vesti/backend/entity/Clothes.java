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
public class Clothes {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String category;

    private String color;

    private String season;
}