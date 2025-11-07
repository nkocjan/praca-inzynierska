package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.entity.CategoryRepEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.UUID;

public interface CategoryRepRepository extends JpaRepository<CategoryRepEntity, UUID> {

    List<CategoryRepEntity> findByIsActiveTrue();
}
