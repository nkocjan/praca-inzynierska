package com.expense_service.expense_service.repository;

import com.expense_service.expense_service.entity.UserRepEntity;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.UUID;

@Repository
public interface UserRepRepository extends JpaRepository<UserRepEntity, UUID> {
}