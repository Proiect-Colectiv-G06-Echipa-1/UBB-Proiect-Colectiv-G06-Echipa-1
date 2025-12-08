package com.example.boss;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

import java.time.LocalDateTime;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

@ExtendWith(MockitoExtension.class)
class BossServiceImplTest {

    @Mock
    private BossRepository bossRepository;

    @Mock
    private BossMapper bossMapper;

    @Mock
    private com.example.task.TaskRepository taskRepository;

    @InjectMocks
    private BossServiceImpl bossService;

    private Boss boss;
    private BossDTO bossDTO;

    @BeforeEach
    void setUp() {
        boss = new Boss()
                .setId(1L)
                .setName("Project Boss")
                .setMaxHealth(100)
                .setCurrentHealth(50)
                .setCreatedAt(LocalDateTime.now());

        bossDTO = new BossDTO(1L, "Project Boss", 100, 50, LocalDateTime.now());
    }

    @Test
    void getBoss_shouldReturnBossDTO() {
        // Given
        when(bossRepository.findById(1L)).thenReturn(java.util.Optional.of(boss));
        when(bossMapper.toDTO(boss)).thenReturn(bossDTO);

        // When
        BossDTO result = bossService.getBoss();

        // Then
        assertEquals(bossDTO, result);
        verify(bossRepository).findById(1L);
        verify(bossMapper).toDTO(boss);
    }

    @Test
    void updateBoss_shouldUpdateHealthAndReturnDTO() {
        // Given
        when(bossRepository.findById(1L)).thenReturn(java.util.Optional.of(boss));
        when(taskRepository.sumDamageByStatus(null)).thenReturn(100);
        when(taskRepository.sumDamageByStatus(com.example.task.TaskStatus.COMPLETED))
                .thenReturn(50);
        when(bossRepository.save(any(Boss.class))).thenReturn(boss);
        when(bossMapper.toDTO(boss)).thenReturn(bossDTO);

        // When
        BossDTO result = bossService.updateBoss();

        // Then
        assertEquals(bossDTO, result);
        verify(bossRepository).findById(1L);
        verify(taskRepository).sumDamageByStatus(null);
        verify(taskRepository).sumDamageByStatus(com.example.task.TaskStatus.COMPLETED);
        verify(bossRepository).save(boss);
        verify(bossMapper).toDTO(boss);
    }
}
