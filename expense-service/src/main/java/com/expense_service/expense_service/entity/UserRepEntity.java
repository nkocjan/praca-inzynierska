package com.expense_service.expense_service.entity;

import jakarta.persistence.Entity;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;
import org.hibernate.annotations.Immutable;

import java.util.UUID;

@Entity
@Table(name = "user_rep")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
@Immutable
public class UserRepEntity {
    @Id
    private UUID id;

    private Boolean isActive;
    private Boolean isPremium;
}
