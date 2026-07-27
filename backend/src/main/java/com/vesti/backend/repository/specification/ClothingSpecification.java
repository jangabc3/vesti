package com.vesti.backend.repository.specification;

import org.springframework.data.jpa.domain.Specification;

import com.vesti.backend.entity.Clothing;
import com.vesti.backend.entity.User;

public final class ClothingSpecification {

    private ClothingSpecification() {
    }

    public static Specification<Clothing> belongsTo(
            User user) {

        return (root, query, criteriaBuilder) -> criteriaBuilder.equal(
                root.get("user"),
                user);
    }

    public static Specification<Clothing> hasCategory(
            String category) {

        return (root, query, criteriaBuilder) -> {

            if (category == null || category.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("category"),
                    category);
        };
    }

    public static Specification<Clothing> hasSeason(
            String season) {

        return (root, query, criteriaBuilder) -> {

            if (season == null || season.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("season"),
                    season);
        };
    }

    public static Specification<Clothing> hasColor(
            String color) {

        return (root, query, criteriaBuilder) -> {

            if (color == null || color.isBlank()) {
                return criteriaBuilder.conjunction();
            }

            return criteriaBuilder.equal(
                    root.get("color"),
                    color);
        };
    }
}