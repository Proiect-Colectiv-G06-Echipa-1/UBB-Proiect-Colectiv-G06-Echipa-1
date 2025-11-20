package com.example.task;

import java.util.List;

public interface TaskService {
    TaskDTO add(TaskDTO task);
    TaskDTO update(Integer id, TaskDTO newTask);
    void delete(Integer id);
    TaskDTO get(Integer id);
    List<TaskDTO> getAll();
    List<TaskDTO> getByStatus(TaskStatus status);
    Long getTotalNumberOfTasks();
    List<TaskDTO> getCompletedTasksFromUser(Long userID);
    Long getNumberOfDependentTasks();
    // User-Task assignment methods
    void assignTaskToUser(Integer taskId, Long userId);
    void unassignTaskFromUser(Integer taskId, Long userId);
    List<TaskDTO> getTasksAssignedToUser(Long userId);
}
