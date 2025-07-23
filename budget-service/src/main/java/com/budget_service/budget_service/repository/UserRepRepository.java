package com.budget_service.budget_service.repository;

import com.budget_service.budget_service.entity.UserRepEntity;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.UUID;

public interface UserRepRepository extends JpaRepository<UserRepEntity, UUID> {
}
