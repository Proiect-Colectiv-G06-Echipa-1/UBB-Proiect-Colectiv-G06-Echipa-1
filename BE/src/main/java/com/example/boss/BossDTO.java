package com.example.boss;

import java.time.LocalDateTime;

public record BossDTO(
    Long id,
    String name,
    Integer maxHealth,
    Integer currentHealth,
    LocalDateTime createdAt,
    Boolean defeated
) {}