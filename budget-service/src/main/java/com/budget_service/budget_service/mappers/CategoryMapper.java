package com.budget_service.budget_service.mappers;

import com.budget_service.budget_service.dto.CategoryCreateRequestDTO;
import com.budget_service.budget_service.dto.CategoryDTO;
import com.budget_service.budget_service.entity.CategoryEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;
import org.mapstruct.ReportingPolicy;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface CategoryMapper {
    CategoryDTO toDto(CategoryEntity entity);

    CategoryEntity toEntity(CategoryCreateRequestDTO dto);

    @Mapping(target = "id", ignore = true)
    void updateEntityFromDto(CategoryCreateRequestDTO dto, @MappingTarget CategoryEntity entity);

    CategoryEntity fromCreateRequest(CategoryCreateRequestDTO request);
}
