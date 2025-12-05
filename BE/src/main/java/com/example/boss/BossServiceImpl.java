package com.example.boss;

import com.example.task.TaskRepository;
import com.example.task.TaskStatus;
import jakarta.persistence.EntityNotFoundException;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class BossServiceImpl implements BossService {
    private final BossRepository bossRepository;
    private final BossMapper bossMapper;
    private final TaskRepository taskRepository;

    @Override
    public BossDTO getBoss() {
        Boss boss = bossRepository.findById(1L).orElseThrow(() -> new EntityNotFoundException("Boss not found"));
        return bossMapper.toDTO(boss);
    }

    @Override
    public BossDTO updateBoss() {
        Boss boss = bossRepository.findById(1L).orElseThrow(() -> new EntityNotFoundException("Boss not found"));

        Integer maxHealth = taskRepository.sumDamageByStatus(null);

        Integer completedDamage = taskRepository.sumDamageByStatus(TaskStatus.COMPLETED);
        Integer currentHealth = maxHealth - completedDamage;

        boss.setMaxHealth(maxHealth);
        boss.setCurrentHealth(currentHealth);
        boss.setDefeated(currentHealth <= 0);

        Boss savedBoss = bossRepository.save(boss);
        return bossMapper.toDTO(savedBoss);
    }
}
