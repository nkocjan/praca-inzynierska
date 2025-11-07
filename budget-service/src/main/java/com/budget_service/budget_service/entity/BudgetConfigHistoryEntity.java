package com.budget_service.budget_service.entity;

import com.budget_service.budget_service.enums.BudgetType;
import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.CreationTimestamp;

import java.math.BigDecimal;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "budget_configs_history")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BudgetConfigHistoryEntity {

    @Id
    @GeneratedValue(strategy = GenerationType.UUID)
    private UUID id;

    @ManyToOne(fetch = FetchType.LAZY)
    @JoinColumn(name = "category_id", nullable = false)
    private CategoryEntity category;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false)
    private BudgetType budgetType;

    @Column(nullable = false)
    private BigDecimal amount;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @Column(nullable = false)
    private Boolean isActive;
}