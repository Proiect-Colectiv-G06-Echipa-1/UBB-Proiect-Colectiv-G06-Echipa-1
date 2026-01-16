package com.example.task;

import com.example.User.User;
import java.util.Set;
import java.util.stream.Collectors;
import org.mapstruct.Mapper;

@Mapper(componentModel = "spring")
public interface TaskMapper {
    TaskDTO toDTO(Task entity);

    Task toEntity(TaskDTO dto);

    default Set<Integer> mapEntitiesToIds(Set<Task> tasks) {
        return tasks == null ? null : tasks.stream().map(Task::getId).collect(Collectors.toSet());
    }

    default Set<Task> mapIdsToEntities(Set<Integer> taskIds) {
        return taskIds == null
                ? null
                : taskIds.stream().map(id -> new Task().setId(id)).collect(Collectors.toSet());
    }

    default Set<Long> mapUsersToIds(Set<User> users) {
        return users == null ? null : users.stream().map(User::getId).collect(Collectors.toSet());
    }

    default Set<User> mapIdsToUsers(Set<Long> userIds) {
        return userIds == null
                ? null
                : userIds.stream()
                        .map(id -> {
                            User user = new User();
                            user.setId(id);
                            return user;
                        })
                        .collect(Collectors.toSet());
    }
}
