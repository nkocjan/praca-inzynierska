package com.user_service.user_service.mappers;

import com.user_service.user_service.dto.UserCreateRequestDTO;
import com.user_service.user_service.dto.UserDTO;
import com.user_service.user_service.dto.UserUpdateRequestDTO;
import com.user_service.user_service.entity.UserEntity;
import org.mapstruct.Mapper;
import org.mapstruct.Mapping;
import org.mapstruct.MappingTarget;

@Mapper(componentModel = "spring")
public interface UserMapper {
    UserDTO toUserDTO(UserEntity userEntity);

    @Mapping(target="isActive", constant = "true")
    @Mapping(target="isPremium", constant = "false")
    UserEntity createUserEntityFromDTO(UserCreateRequestDTO userDTO);

    void updateEntityFromDto(UserUpdateRequestDTO userDTO, @MappingTarget UserEntity entity);
}
