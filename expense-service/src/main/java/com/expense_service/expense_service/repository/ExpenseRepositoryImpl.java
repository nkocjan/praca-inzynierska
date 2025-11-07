package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.dto.ExpenseSearchRequestDTO;
import com.expense_service.expense_service.dto.GetTotalExpensesAmountRequestDTO;
import com.expense_service.expense_service.entity.CategoryRepEntity;
import com.expense_service.expense_service.entity.ExpenseEntity;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import jakarta.persistence.Tuple;
import jakarta.persistence.TypedQuery;
import jakarta.persistence.criteria.CriteriaBuilder;
import jakarta.persistence.criteria.CriteriaQuery;
import jakarta.persistence.criteria.Predicate;
import jakarta.persistence.criteria.Root;
import org.springframework.data.domain.Page;
import org.springframework.data.domain.PageImpl;
import org.springframework.data.domain.Pageable;
import org.springframework.data.domain.Sort; 
import org.springframework.stereotype.Repository;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.ArrayList;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Repository
public class ExpenseRepositoryImpl implements ExpenseRepositoryCustom {
    @PersistenceContext
    private EntityManager entityManager;

    @Override
    public Page<ExpenseEntity> searchExpenses(ExpenseSearchRequestDTO request, Pageable pageable) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();

        CriteriaQuery<ExpenseEntity> cq = cb.createQuery(ExpenseEntity.class);
        Root<ExpenseEntity> root = cq.from(ExpenseEntity.class);

        List<Predicate> predicates = buildPredicates(request, cb, root);
        cq.where(predicates.toArray(new Predicate[0]));

        if (pageable.getSort().isSorted()) {
            List<jakarta.persistence.criteria.Order> orders = new ArrayList<>();
            for (Sort.Order order : pageable.getSort()) {
                if (order.isAscending()) {
                    orders.add(cb.asc(root.get(order.getProperty())));
                } else {
                    orders.add(cb.desc(root.get(order.getProperty())));
                }
            }
            cq.orderBy(orders);
        }

        TypedQuery<ExpenseEntity> query = entityManager.createQuery(cq);
        query.setFirstResult((int) pageable.getOffset());
        query.setMaxResults(pageable.getPageSize());
        List<ExpenseEntity> resultList = query.getResultList();

        CriteriaQuery<Long> countQuery = cb.createQuery(Long.class);
        Root<ExpenseEntity> countRoot = countQuery.from(ExpenseEntity.class);

        List<Predicate> countPredicates = buildPredicates(request, cb, countRoot);
        countQuery.select(cb.count(countRoot));
        countQuery.where(countPredicates.toArray(new Predicate[0]));

        Long total = entityManager.createQuery(countQuery).getSingleResult();

        return new PageImpl<>(resultList, pageable, total);
    }

    @Override
    public Map<CategoryRepEntity, BigDecimal> getTotalExpensesAmount(GetTotalExpensesAmountRequestDTO request, UUID userId) {
        CriteriaBuilder cb = entityManager.getCriteriaBuilder();
        CriteriaQuery<Tuple> cq = cb.createTupleQuery();
        Root<ExpenseEntity> root = cq.from(ExpenseEntity.class);

        List<Predicate> predicates = new ArrayList<>();

        if (userId != null) {
            predicates.add(cb.equal(root.get("user").get("id"), userId));
        }

        if (request.getCategoryIds() != null && !request.getCategoryIds().isEmpty()) {
            predicates.add(root.get("category").get("id").in(request.getCategoryIds()));
        }

        if (request.getDateFrom() != null) {
            predicates.add(cb.greaterThanOrEqualTo(root.get("date"), request.getDateFrom()));
        }

        if (request.getDateTo() != null) {
            predicates.add(cb.lessThanOrEqualTo(root.get("date"), request.getDateTo()));
        }

        predicates.add(cb.or(
                cb.isFalse(root.get("isPlanned")),
                cb.isNull(root.get("isPlanned"))
        ));

        cq.where(predicates.toArray(new Predicate[0]));

        cq.multiselect(
                root.get("category").alias("category"),
                cb.sum(root.get("amount")).alias("total")
        );

        cq.groupBy(root.get("category"));

        TypedQuery<Tuple> query = entityManager.createQuery(cq);
        List<Tuple> results = query.getResultList();

        return results.stream()
                .collect(Collectors.toMap(
                        tuple -> (CategoryRepEntity) tuple.get("category"),
                        tuple -> (BigDecimal) tuple.get("total")
                ));
    }

    private List<Predicate> buildPredicates(ExpenseSearchRequestDTO request, CriteriaBuilder cb, Root<ExpenseEntity> root) {
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

        return predicates;
    }

    @Override
    public List<ExpenseEntity> findRecentExpenses(UUID userId) {
        String jpql = "SELECT e FROM ExpenseEntity e " +
                "WHERE e.user.id = :userId " +
                "ORDER BY e.date DESC";

        return entityManager.createQuery(jpql, ExpenseEntity.class)
                .setParameter("userId", userId)
                .setMaxResults(5)
                .getResultList();
    }

    @Override
    public Map<CategoryRepEntity, BigDecimal> getGroupedExpenses(UUID userId, LocalDateTime startTime, LocalDateTime endTime) {
        String jpql = "SELECT e.category, SUM(e.amount) FROM ExpenseEntity e " +
                "WHERE e.user.id = :userId AND e.date >= :startTime AND e.date <= :endTime " +
                "GROUP BY e.category, e.category.name, e.category.isActive";

        List<Object[]> results = entityManager.createQuery(jpql, Object[].class)
                .setParameter("userId", userId)
                .setParameter("startTime", startTime)
                .setParameter("endTime", endTime)
                .getResultList();

        return results.stream()
                .collect(Collectors.toMap(
                        row -> (CategoryRepEntity) row[0],
                        row -> (BigDecimal) row[1]
                ));
    }

    @Override
    public List<Object[]> getMonthlyExpensesGroupedByCategory(UUID userId, LocalDateTime startTime) {
        String jpql = "SELECT e.category.id, FUNCTION('TO_CHAR', e.date, 'YYYY-MM'), SUM(e.amount) " +
                "FROM ExpenseEntity e " +
                "WHERE e.user.id = :userId AND e.date >= :startTime " +
                "GROUP BY e.category.id, FUNCTION('TO_CHAR', e.date, 'YYYY-MM')";

        return entityManager.createQuery(jpql, Object[].class)
                .setParameter("userId", userId)
                .setParameter("startTime", startTime)
                .getResultList();
    }

    @Override
    public List<CategoryRepEntity> findDistinctActiveCategoriesByUserId(UUID userId) {
        String jpql = "SELECT DISTINCT e.category FROM ExpenseEntity e " +
                "WHERE e.user.id = :userId AND e.category.isActive = true " +
                "ORDER BY e.category.name ASC";

        return entityManager.createQuery(jpql, CategoryRepEntity.class)
                .setParameter("userId", userId)
                .getResultList();
    }
}