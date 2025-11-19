package com.example.task;

import java.time.LocalDate;
import java.util.Set;

public record TaskDTO(
        Integer id,
        String title,
        String description,
        TaskStatus status,
        Integer energyCost,
        Integer damage,
        Integer procrastinationDamage,
        LocalDate creationDate,
        LocalDate deadline,
        Set<Integer> parents,
        Set<Long> assignees
) {}