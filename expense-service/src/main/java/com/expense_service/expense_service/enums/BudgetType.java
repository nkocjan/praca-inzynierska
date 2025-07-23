package com.expense_service.expense_service.enums;

import lombok.Getter;

@Getter
public enum BudgetType {
    WEEK("WEEK", "Weekly Budget", "Tygodniowy Budżet"),
    MONTH("MONTH", "Monthly Budget", "Miesięczny Budżet"),
    YEAR("YEAR", "Yearly Budget", "Roczny Budżet"),;

    private final String code;
    private final String descriptionEn;
    private final String descriptionPl;

    BudgetType(String code, String descriptionEn, String descriptionPl) {
        this.code = code;
        this.descriptionEn = descriptionEn;
        this.descriptionPl = descriptionPl;
    }
}
