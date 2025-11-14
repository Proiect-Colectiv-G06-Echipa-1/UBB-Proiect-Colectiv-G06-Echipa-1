package com.example.task;

import org.mapstruct.Mapper;

import java.util.Set;
import java.util.stream.Collectors;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDTO toDTO(Task entity);

    Task toEntity(TaskDTO dto);

    default Set<Integer> mapEntitiesToIds(Set<Task> tasks) {
        return tasks == null ? null : tasks.stream().map(Task::getId).collect(Collectors.toSet());
    }

    default Set<Task> mapIdsToEntities(Set<Integer> taskIds) {
        return taskIds == null ? null : taskIds.stream().map(id -> new Task().setId(id)).collect(Collectors.toSet());
    }
}
