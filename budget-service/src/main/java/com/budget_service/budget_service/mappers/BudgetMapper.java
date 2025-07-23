package com.budget_service.budget_service.mappers;

import com.budget_service.budget_service.dto.BudgetCreateRequestDTO;
import com.budget_service.budget_service.dto.BudgetDTO;
import com.budget_service.budget_service.entity.BudgetEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface BudgetMapper {
    BudgetDTO toDto(BudgetEntity entity);

    BudgetEntity toEntity(BudgetCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(BudgetCreateRequestDTO dto, @MappingTarget BudgetEntity entity);

    BudgetEntity fromCreateRequest(BudgetCreateRequestDTO request);
}
