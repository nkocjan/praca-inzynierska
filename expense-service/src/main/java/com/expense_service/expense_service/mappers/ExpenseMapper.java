package com.expense_service.expense_service.mappers;

import com.expense_service.expense_service.dto.CategoryRepDTO;
import com.expense_service.expense_service.dto.CreateExpenseRequestDTO;
import com.expense_service.expense_service.dto.ExpenseDTO;
import com.expense_service.expense_service.entity.CategoryRepEntity;
import com.expense_service.expense_service.entity.ExpenseEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.Named;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(componentModel = "spring", unmappedTargetPolicy = ReportingPolicy.IGNORE)
public interface ExpenseMapper {
    @Mapping(target = "category", source = "category")
    ExpenseDTO toDto(ExpenseEntity entity);

    CategoryRepDTO toCategoryDto(CategoryRepEntity entity);

    List<ExpenseDTO> toDtoList(List<ExpenseEntity> entities);

    @Named("categoryName")
    static String mapCategoryName(CategoryRepEntity category) {
        return category != null ? category.getName() : null;
    }

    @Mapping(target = "category.id", source = "categoryId")
    @Mapping(target = "isPlanned", source = "isPlanned", defaultValue = "false")
    ExpenseEntity fromCreateRequest(CreateExpenseRequestDTO request);

}
