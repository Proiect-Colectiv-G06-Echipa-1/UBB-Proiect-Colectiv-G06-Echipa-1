package com.example.task;

import com.example.User.User;
import com.example.User.UserRepository;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.*;

@Service
@RequiredArgsConstructor
public class TaskServiceImpl implements TaskService {
    private final TaskRepository repository;
    private final TaskMapper mapper;
    private final TaskValidator validator;
    private final UserRepository userRepository;

    @Override
    public TaskDTO add(TaskDTO taskDTO) {
        Task task = mapper.toEntity(taskDTO).setStatus(TaskStatus.PENDING);
        validator.validate(task);
        throwIfParentsDoNotExist(task);
        return mapper.toDTO(repository.save(task));
    }

    @Override
    public TaskDTO update(Integer id, TaskDTO newTaskDTO) {
        Task currentTask = mapper.toEntity(get(id));
        Task newTask = mapper.toEntity(newTaskDTO);
        validator.validate(newTask);
        newTask.setId(id);
        
        // Validate status transition
        validateStatusTransition(currentTask.getStatus(), newTask.getStatus(), newTask);
        
        if (!currentTask.getParents().equals(newTask.getParents())) {
            throwIfParentsDoNotExist(newTask);
            throwIfUpdatingEntityWouldCreateCycles(newTask);
        }
        return mapper.toDTO(repository.save(newTask));
    }

    @Override
    public void delete(Integer id) {
        repository.deleteById(id);
    }

    @Override
    public TaskDTO get(Integer id) {
        return mapper.toDTO(repository
                .findById(id)
                .orElseThrow(() -> new EntityNotFoundException("Task with the provided id not found")));

    }

    @Override
    public List<TaskDTO> getAll() {
        return repository.findAll().stream().map(mapper::toDTO).toList();
    }

    // NOTE(DC): For better exception messages we could use the task's title and id but only if that's required by
    // the frontend. For now, I'm leaving it like this for simplicity
    private void throwIfUpdatingEntityWouldCreateCycles(Task newTask) throws IllegalStateException {
        Set<Integer> visited = new HashSet<>();
        Deque<Task> stack = new ArrayDeque<>(newTask.getParents());

        while (!stack.isEmpty()) {
            Task current = stack.pop();

            if (current.getId().equals(newTask.getId())) {
                throw new IllegalStateException("Cannot update task with id=" + newTask.getId() + " because it would create cycles");
            }

            if (!visited.contains(current.getId())) {
                visited.add(current.getId());
                stack.addAll(repository.getParentsOf(current.getId()));
            }
        }
    }

    // NOTE(DC): Ditto here
    private void throwIfParentsDoNotExist(Task newTask) throws IllegalArgumentException {
        newTask.getParents().forEach(parent -> {
            if (!repository.existsById(parent.getId())) {
                throw new IllegalArgumentException("Parent with id=" + parent.getId() + " does not exist");
            }
        });
    }

    private void validateStatusTransition(TaskStatus currentStatus, TaskStatus newStatus, Task task) {
        // Disallow changing from PENDING to COMPLETED directly (must go through IN_PROGRESS)
        if (currentStatus == TaskStatus.PENDING && newStatus == TaskStatus.COMPLETED) {
            throw new IllegalStateException("Cannot change status from PENDING to COMPLETED directly. Must go through IN_PROGRESS first.");
        }

        // Cannot change to COMPLETE if dependencies are incomplete
        if (newStatus == TaskStatus.COMPLETED) {
            if (hasIncompleteDependencies(task)) {
                throw new IllegalStateException("Cannot mark task as COMPLETE while it has incomplete dependencies");
            }
        }

        // Only allow status changes to PENDING, IN_PROGRESS, or COMPLETED
        // CANCELLED might be allowed for administrative purposes
        if (newStatus != TaskStatus.PENDING && newStatus != TaskStatus.IN_PROGRESS && 
            newStatus != TaskStatus.COMPLETED && newStatus != TaskStatus.CANCELLED) {
            throw new IllegalArgumentException("Invalid status: " + newStatus);
        }
    }

    private boolean hasIncompleteDependencies(Task task) {
        Set<Integer> visited = new HashSet<>();
        Deque<Task> stack = new ArrayDeque<>(task.getParents());

        while (!stack.isEmpty()) {
            Task current = stack.pop();

            if (!visited.contains(current.getId())) {
                visited.add(current.getId());

                // If parent is not completed, we have incomplete dependencies
                if (current.getStatus() != TaskStatus.COMPLETED) {
                    return true;
                }

                // Add grandparents to check
                stack.addAll(repository.getParentsOf(current.getId()));
            }
        }

        return false;
    }

    @Override
    public void assignTaskToUser(Integer taskId, Long userId) {
        Task task = repository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task with id " + taskId + " not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        task.getAssignees().add(user);
        user.getAssignedTasks().add(task);

        // If this is the first assignee, change status to IN_PROGRESS
        if (task.getAssignees().size() == 1 && task.getStatus() == TaskStatus.PENDING) {
            task.setStatus(TaskStatus.IN_PROGRESS);
        }

        repository.save(task);
    }

    @Override
    public void unassignTaskFromUser(Integer taskId, Long userId) {
        Task task = repository.findById(taskId)
                .orElseThrow(() -> new EntityNotFoundException("Task with id " + taskId + " not found"));

        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        task.getAssignees().remove(user);
        user.getAssignedTasks().remove(task);

        // If no assignees left, change status back to PENDING
        if (task.getAssignees().isEmpty() && task.getStatus() == TaskStatus.IN_PROGRESS) {
            task.setStatus(TaskStatus.PENDING);
        }

        repository.save(task);
    }

    @Override
    public List<TaskDTO> getTasksAssignedToUser(Long userId) {
        User user = userRepository.findById(userId)
                .orElseThrow(() -> new EntityNotFoundException("User with id " + userId + " not found"));

        return user.getAssignedTasks().stream()
                .map(mapper::toDTO)
                .toList();
    }
}
