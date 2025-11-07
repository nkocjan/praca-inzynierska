package com.expense_service.expense_service.entity;

import jakarta.persistence.*;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Entity
@Table(name = "category_rep")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Immutable
public class CategoryRepEntity {
    @Id
    private UUID id;
    private String name;
    private Boolean isActive;
}