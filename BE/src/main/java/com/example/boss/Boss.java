package com.example.boss;

import jakarta.persistence.*;
import jakarta.validation.constraints.Max;
import jakarta.validation.constraints.NotNull;
import java.time.LocalDateTime;
import lombok.Getter;
import lombok.NoArgsConstructor;
import lombok.Setter;
import lombok.experimental.Accessors;

@Entity(name = "boss")
@NoArgsConstructor
@Getter
@Setter
@Accessors(chain = true)
public class Boss {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @NotNull
    @Column(length = 100)
    private String name;

    @NotNull
    @Max(100)
    private Integer maxHealth;

    @NotNull
    private Integer currentHealth;

    @NotNull
    private LocalDateTime createdAt;
}
