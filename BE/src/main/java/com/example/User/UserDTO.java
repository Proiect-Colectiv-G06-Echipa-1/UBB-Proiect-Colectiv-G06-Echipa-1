package com.example.User;

import com.example.task.TaskDTO;
import java.util.Set;

public record UserDTO(
        Long id, String username, String email, UserRole role, Set<TaskDTO> assignedTasks, Integer energy) {}
