package com.example.task;

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
}
