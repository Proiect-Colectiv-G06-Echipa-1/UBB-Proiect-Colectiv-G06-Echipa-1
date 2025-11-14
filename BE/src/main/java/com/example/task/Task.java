package com.example.task;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotNull;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;
import org.hibernate.annotations.OnDelete;
import org.hibernate.annotations.OnDeleteAction;
import org.hibernate.validator.constraints.Length;

import java.time.LocalDate;
import java.util.HashSet;
import java.util.Set;

@Entity(name = "tasks")
@NoArgsConstructor
@Getter @Setter
@Accessors(chain = true)
public class Task {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Integer id;

    @NotNull
    @Length(min = 1, max = 32)
    private String title;

    @Length(max = 500)
    private String description;

    @NotNull
    @Enumerated(EnumType.STRING)
    private TaskStatus status;

    @NotNull
    @Min(1) @Max(100)
    private Integer energyCost;

    @NotNull
    @Min(1) @Max(100)
    private Integer damage;

    @NotNull
    @Min(1) @Max(100)
    private Integer procrastinationDamage;

    @NotNull
    private LocalDate creationDate;

    private LocalDate lastUpdateDate;

    @ManyToMany
    @JoinTable(
            name = "task_dependencies",
            joinColumns = @JoinColumn(name = "task_id", nullable = false),
            inverseJoinColumns = @JoinColumn(name = "parent_task_id", nullable = false)
    )

    @OnDelete(action = OnDeleteAction.CASCADE)
    private Set<Task> parents = new HashSet<>();
}