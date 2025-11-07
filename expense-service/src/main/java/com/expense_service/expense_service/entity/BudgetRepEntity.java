package com.expense_service.expense_service.entity;

import com.expense_service.expense_service.enums.BudgetType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "budget_rep")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Immutable
public class BudgetRepEntity {
    @Id
    private UUID id;
    private UUID categoryId;
    @Enumerated(EnumType.STRING)
    private BudgetType period;
    private BigDecimal amount;
    private LocalDateTime periodEnd;
}
