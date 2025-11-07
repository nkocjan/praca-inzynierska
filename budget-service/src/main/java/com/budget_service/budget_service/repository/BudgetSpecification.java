package com.budget_service.budget_service.repository;

import com.budget_service.budget_service.dto.BudgetSearchRequestDTO;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.entity.CategoryEntity;
import jakarta.persistence.criteria.Join;
import jakarta.persistence.criteria.Predicate;
import org.springframework.data.jpa.domain.Specification;

import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.UUID;

public class BudgetSpecification {

    public static Specification<BudgetEntity> createSpecification(BudgetSearchRequestDTO request, UUID userId) {
        return (root, query, cb) -> {
            List<Predicate> predicates = new ArrayList<>();

            Join<BudgetEntity, CategoryEntity> categoryJoin = root.join("category");

            predicates.add(cb.equal(categoryJoin.get("user").get("id"), userId));

            if (request.getName() != null && !request.getName().isBlank()) {
                predicates.add(cb.like(cb.lower(categoryJoin.get("name")), "%" + request.getName().toLowerCase() + "%"));
            }

            if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
                predicates.add(categoryJoin.get("id").in(request.getCategoryIds()));
            }

            if (request.getPeriodDateFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("periodStart"), request.getPeriodDateFrom()));
            }

            if (request.getPeriodDateTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("periodEnd"), request.getPeriodDateTo()));
            }

            if (request.getAmountFrom() != null) {
                predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), request.getAmountFrom()));
            }

            if (request.getAmountTo() != null) {
                predicates.add(cb.lessThanOrEqualTo(root.get("amount"), request.getAmountTo()));
            }

            if(request.getPeriodType() != null) {
                predicates.add(cb.equal(root.get("period"), request.getPeriodType()));
            }

            if (request.getIsArchived() != null) {
                LocalDateTime now = LocalDateTime.now();
                if (request.getIsArchived()) {
                    predicates.add(cb.lessThan(root.get("periodEnd"), now));
                } else {
                    predicates.add(cb.greaterThanOrEqualTo(root.get("periodEnd"), now));
                }
            }


            return cb.and(predicates.toArray(new Predicate[0]));
        };
    }
}