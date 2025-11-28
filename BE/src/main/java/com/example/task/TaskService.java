package com.example.task;

import java.util.List;
import java.util.Optional;

public interface TaskService {
    TaskDTO add(TaskDTO task);

    TaskDTO update(Integer id, TaskDTO newTask);

    void delete(Integer id);

    TaskDTO get(Integer id);

    List<TaskDTO> getAll();

    List<TaskDTO> getByStatus(TaskStatus status);

    Long getTaskCountByStatus(Optional<TaskStatus> status);

    List<TaskDTO> getTasksAssignedToUserByStatus(Long userID, Optional<TaskStatus> status);

    Long getNumberOfDependentTasks();
    // User-Task assignment methods
    void assignTaskToUser(Integer taskId, Long userId);

    void unassignTaskFromUser(Integer taskId, Long userId);

    List<TaskDTO> getTasksAssignedToUser(Long userId);

    boolean isTaskAssignedToUser(Integer taskId, Long userId);
}
