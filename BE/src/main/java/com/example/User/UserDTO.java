package com.example.User;

import com.example.task.Task;

import java.util.Set;

public record UserDTO(Long id, String username, String email, UserRole role, Set<Task> assignedTasks, Integer energy) {}
