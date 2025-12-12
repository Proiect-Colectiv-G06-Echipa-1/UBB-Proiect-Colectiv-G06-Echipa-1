package com.example.User;

import org.mapstruct.Mapper;

import com.example.task.TaskMapper;

@Mapper(componentModel = "spring", uses = TaskMapper.class)
public interface UserMapper {
    UserDTO toDTO(User user);

    User toEntity(UserDTO userDTO);
}
