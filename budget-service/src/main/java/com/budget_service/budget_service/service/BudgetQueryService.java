package com.budget_service.budget_service.service;

import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.mappers.BudgetMapper;
import com.budget_service.budget_service.repository.BudgetRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.UUID;

@Service
@RequiredArgsConstructor
public class BudgetQueryService {
    private final BudgetRepository budgetRepository;
    private final BudgetMapper budgetMapper;

    public BudgetDTO getById(UUID id, UUID userId) {
        return budgetRepository.findById(id)
                .filter(b -> b.getCategory().getUser().getId().equals(userId))
                .map(budgetMapper::toDto)
                .orElseThrow(() -> new IllegalArgumentException("Budget not found or not owned by user"));
    }

    public List<BudgetDTO> findAllByUser(UUID userId) {
        return budgetRepository.findAll().stream()
                .filter(b -> b.getCategory().getUser().getId().equals(userId))
                .map(budgetMapper::toDto)
                .toList();
    }

    public List<BudgetDTO> findByIdsAndUser(List<UUID> ids, UUID userId) {
        return budgetRepository.findAllById(ids).stream()
                .filter(b -> b.getCategory().getUser().getId().equals(userId))
                .map(budgetMapper::toDto)
                .toList();
    }
}
