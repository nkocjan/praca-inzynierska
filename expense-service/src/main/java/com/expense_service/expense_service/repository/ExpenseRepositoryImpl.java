package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.dto.ExpenseSearchRequestDTO;
import com.expense_service.expense_service.entity.ExpenseEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.stereotype.Repository;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ExpenseRepositoryImpl implements ExpenseRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<ExpenseEntity> searchExpenses(ExpenseSearchRequestDTO request, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<ExpenseEntity> cq = cb.createQuery(ExpenseEntity.class);
        Root<ExpenseEntity> root = cq.from(ExpenseEntity.class);

        List<Predicate> predicates = new ArrayList<>();

        if (request.getName() != null) {
            String search = request.getName().replaceAll("\\s+", "").toLowerCase();
            predicates.add(cb.like(
                    cb.function("replace", String.class, cb.lower(root.get("name")), cb.literal(" "), cb.literal("")),
                    "%" + search + "%"
            ));
        }
        if (request.getDescription() != null) {
            predicates.add(cb.like(cb.lower(root.get("description")), "%" + request.getDescription().toLowerCase() + "%"));
        }
        if (request.getIsPlanned() != null) {
            predicates.add(cb.equal(root.get("isPlanned"), request.getIsPlanned()));
        }
        if (request.getAmountFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("amount"), request.getAmountFrom()));
        }
        if (request.getAmountTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("amount"), request.getAmountTo()));
        }
        if (request.getDateFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("date"), request.getDateFrom()));
        }
        if (request.getDateTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("date"), request.getDateTo()));
        }
        if (request.getUserId() != null) {
            predicates.add(cb.equal(root.get("user").get("id"), request.getUserId()));
        }
        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            predicates.add(root.get("category").get("id").in(request.getCategoryIds()));
        }

        cq.where(predicates.toArray(new Predicate[0]));

        TypedQuery<ExpenseEntity> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<ExpenseEntity> resultList = query.getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<ExpenseEntity> countRoot = countQuery.from(ExpenseEntity.class);
        countQuery.select(cb.count(countRoot));
        countQuery.where(predicates.toArray(new Predicate[0]));
        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, total);
    }
}
