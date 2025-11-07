package com.expense_service.expense_service.service;

import com.expense_service.expense_service.dto.UserRepDTO;
import com.expense_service.expense_service.entity.UserRepEntity;
import com.expense_service.expense_service.repository.UserRepRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.UUID;

@Service
@RequiredArgsConstructor
public class UserReplicationService {
    private final UserRepRepository userRepRepository;

    @Transactional
    public void createOrUpdateUser(UserRepDTO event) {
        System.out.println("Creating or updating user: {}" + event.getId());

        UserRepEntity user = userRepRepository.findById(event.getId())
                .orElse(UserRepEntity.builder()
                        .id(event.getId())
                        .build());

        user.setIsActive(event.getIsActive());
        user.setIsPremium(event.getIsPremium());

        userRepRepository.save(user);

        System.out.println("User {} successfully replicated" + event.getId());
    }

    @Transactional
    public void deleteUser(UUID userId) {
        System.out.println("Deleting user: {}" + userId);
        userRepRepository.deleteById(userId);
        System.out.println("User {} successfully deleted" + userId);
    }
}
