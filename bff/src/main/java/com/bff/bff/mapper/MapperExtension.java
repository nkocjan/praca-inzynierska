package com.bff.bff.mapper;

import com.bff.bff.dto.api.*;
import com.bff.bff.dto.ui.*;
import java.util.List;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface MapperExtension {
    UserUiDTO toUserUiDTO(UserDTO userDTO);

    ExpenseUiDTO toExpenseUiDTO(ExpenseDTO expenseDTO);

    ExpenseSearchRequestDTO toExpenseSearchRequestDTO(ExpenseSearchRequestUiDTO expenseDTO);

    CreateExpenseRequestDTO toCreateExpenseRequestDTO(CreateExpenseRequestUiDTO expenseUiDTO);

    UpdateExpenseRequestDTO toUpdateExpenseRequestDTO(UpdateExpenseRequestUiDTO expenseUiDTO);

    CategoryUiDTO toCategoryUiDTO(CategoryDTO categoryDTO);

    List<CategoryUiDTO> toCategoryListUiDTO(List<CategoryDTO> categoryDTOs);

    CategoryCreateRequestDTO toCategoryCreateRequestDTO(CategoryCreateRequestUiDTO categoryUiDTO);

    BudgetUiDTO toBudgetUiDTO(BudgetDTO budgetDTO);

    BudgetCreateRequestDTO toBudgetCreateRequestDTO(BudgetCreateRequestUiDTO budgetUiDTO);

    UpdateCategoryDTO toUpdateBudgetConfigForCategoryDTO(
            UpdateCategoryUiDTO updateBudgetConfigForCategoryUiDTO);

    DashboardDataResponseUiDTO toDashboardDataResponseUiDTO(
            DashboardDataResponseDTO dashboardDataResponseDTO);

    SetDefaultBudgetsRequestDTO toSetDefaultBudgetsRequestDTO(
            SetDefaultBudgetsRequestUiDTO setDefaultBudgetsRequestUiDTO);

    GetDefaultBudgetsResponseUiDTO toGetDefaultBudgetsResponseUiDTO(
            GetDefaultBudgetsResponseDTO getDefaultBudgetsResponseDTO);
}
