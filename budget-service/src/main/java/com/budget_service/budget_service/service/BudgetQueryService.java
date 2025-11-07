package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.dto.BudgetSearchRequestDTO;
import com.budget_service.budget_service.dto.GetDefaultBudgetsResponseDTO;
import com.budget_service.budget_service.entity.BudgetConfigHistoryEntity;
import com.budget_service.budget_service.entity.BudgetEntity;
import com.budget_service.budget_service.enums.BudgetType;
import com.budget_service.budget_service.mappers.BudgetMapper;
import com.budget_service.budget_service.repository.BudgetConfigHistoryRepository;
import com.budget_service.budget_service.repository.BudgetRepository;
import com.budget_service.budget_service.repository.BudgetSpecification;
import lombok.RequiredArgsConstructor;
import org.springframework.data.domain.Page; 
import org.springframework.data.domain.Pageable; 
import org.springframework.data.jpa.domain.Specification;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.math.BigDecimal;
import java.util.List;
import java.util.Map;
import java.util.UUID;
import java.util.stream.Collectors;

@Service
@RequiredArgsConstructor
@Transactional(readOnly = true)
public class BudgetQueryService {
    private final BudgetRepository budgetRepository;
    private final BudgetConfigHistoryRepository budgetConfigHistoryRepository;
    private final BudgetMapper budgetMapper;

    public Page<BudgetDTO> searchBudgets(BudgetSearchRequestDTO requestDTO, UUID userId, Pageable pageable) {
        Specification<BudgetEntity> spec = BudgetSpecification.createSpecification(requestDTO, userId);

        Page<BudgetEntity> entityPage = budgetRepository.findAll(spec, pageable);

        return entityPage.map(budgetMapper::toDto);
    }


    public BudgetDTO getById(UUID id, UUID userId) {
        Specification<BudgetEntity> spec = (root, query, cb) ->
                cb.and(
                        cb.equal(root.get("id"), id),
                        cb.equal(root.join("category").get("user").get("id"), userId)
                );

        return budgetRepository.findOne(spec)
                .map(budgetMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found or not owned by user"));
    }

    public List<BudgetDTO> findAllByUser(UUID userId) {
        Specification<BudgetEntity> spec = (root, query, cb) ->
                cb.equal(root.join("category").get("user").get("id"), userId);

        return budgetRepository.findAll(spec).stream()
                .map(budgetMapper::toDto)
                .toList();
    }

    public List<BudgetDTO> findByIdsAndUser(List<UUID> ids, UUID userId) {
        if (ids == null || ids.isEmpty()) {
            return List.of();
        }

        Specification<BudgetEntity> spec = (root, query, cb) ->
                cb.and(
                        root.get("id").in(ids),
                        cb.equal(root.join("category").get("user").get("id"), userId)
                );

        return budgetRepository.findAll(spec).stream()
                .map(budgetMapper::toDto)
                .toList();
    }

    public GetDefaultBudgetsResponseDTO getDefaultBudgets(UUID categoryId, UUID userId) {
        List<BudgetConfigHistoryEntity> activeConfigs = budgetConfigHistoryRepository
                .findByCategory_IdAndCategory_User_IdAndIsActiveTrue(categoryId, userId);

        Map<BudgetType, BigDecimal> configMap = activeConfigs.stream()
                .collect(Collectors.toMap(
                        BudgetConfigHistoryEntity::getBudgetType,
                        BudgetConfigHistoryEntity::getAmount
                ));

        GetDefaultBudgetsResponseDTO response = new GetDefaultBudgetsResponseDTO();
        response.setWeeklyAmount(configMap.get(BudgetType.WEEK));
        response.setMonthlyAmount(configMap.get(BudgetType.MONTH));
        response.setYearlyAmount(configMap.get(BudgetType.YEAR));

        return response;
    }
}