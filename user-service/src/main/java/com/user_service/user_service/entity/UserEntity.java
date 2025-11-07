package com.user_service.user_service.entity;


import jakarta.persistence.Column;
import jakarta.persistence.Entity;
import jakarta.persistence.GeneratedValue;
import jakarta.persistence.Id;
import jakarta.persistence.Table;
import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;
import jakarta.validation.constraints.Size;
import lombok.Getter;
import lombok.Setter;
import org.hibernate.annotations.CreationTimestamp;
import org.hibernate.annotations.UpdateTimestamp;

import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "users")
@Getter
@Setter
public class UserEntity {

    @Id
    @GeneratedValue
    private UUID id;

    @NotBlank
    @Size(min = 3)
    @Column(nullable = false)
    private String name;

    @NotBlank
    @Size(min = 3)
    @Column(nullable = false)
    private String surname;

    @NotBlank
    @Size(min = 8)
    @Column(nullable = false)
    private String password;

    @NotBlank
    @Size(min = 3)
    @Column(nullable = false, unique = true)
    private String username;

    @NotBlank
    @Email
    @Column(nullable = false, unique = true)
    private String email;

    @NotBlank
    @Pattern(regexp = "^[0-9]{9,}$")
    @Column(nullable = false, unique = true)
    private String phoneNumber;
    private Boolean isActive;
    private Boolean isPremium;

    @CreationTimestamp
    private LocalDateTime createdAt;

    @UpdateTimestamp
    private LocalDateTime updatedAt;
}