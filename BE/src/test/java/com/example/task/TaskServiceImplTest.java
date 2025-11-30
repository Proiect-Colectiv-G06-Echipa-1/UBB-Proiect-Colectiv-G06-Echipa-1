// package com.example.task;
//
// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.Mockito.*;
//
// import java.time.LocalDate;
// import java.util.HashSet;
// import java.util.Optional;
// import java.util.Set;
// import org.junit.jupiter.api.BeforeEach;
// import org.junit.jupiter.api.Test;
// import org.junit.jupiter.api.extension.ExtendWith;
// import org.mockito.InjectMocks;
// import org.mockito.Mock;
// import org.mockito.junit.jupiter.MockitoExtension;
//
// @ExtendWith(MockitoExtension.class)
// class TaskServiceImplTest {
//
//    @Mock
//    private TaskRepository repository;
//
//    @Mock
//    private TaskMapper mapper;
//
//    @Mock
//    private TaskValidator validator;
//
//    @InjectMocks
//    private TaskServiceImpl service;
//
//    private Task task;
//    private TaskDTO taskDTO;
//
//    @BeforeEach
//    void setUp() {
//        task = new Task()
//                .setId(1)
//                .setTitle("Test Task")
//                .setDescription("Test Description")
//                .setStatus(TaskStatus.BACKLOG)
//                .setEnergyCost(50)
//                .setDamage(30)
//                .setProcrastinationDamage(20)
//                .setCreationDate(LocalDate.now())
//                .setParents(new HashSet<>());
//
//        taskDTO = new TaskDTO(
//                1,
//                "Test Task",
//                "Test Description",
//                TaskStatus.BACKLOG,
//                50,
//                30,
//                20,
//                LocalDate.now(),
//                null,
//                new HashSet<>(),
//                new HashSet<>());
//    }
//
//    @Test
//    void update_shouldAllowBackLogToInProgress() {
//        // Given
//        TaskDTO newTaskDTO = new TaskDTO(
//                1,
//                "Test Task",
//                "Test Description",
//                TaskStatus.IN_PROGRESS,
//                50,
//                30,
//                20,
//                LocalDate.now(),
//                null,
//                new HashSet<>(),
//                new HashSet<>());
//        Task newTask = new Task().setId(1).setStatus(TaskStatus.IN_PROGRESS);
//
//        when(repository.findById(1)).thenReturn(Optional.of(task));
//        when(mapper.toDTO(task)).thenReturn(taskDTO);
//        when(mapper.toEntity(taskDTO)).thenReturn(task);
//        when(mapper.toEntity(newTaskDTO)).thenReturn(newTask);
//        when(repository.save(newTask)).thenReturn(newTask);
//        when(mapper.toDTO(newTask)).thenReturn(newTaskDTO);
//
//        // When
//        TaskDTO result = service.update(1, newTaskDTO);
//
//        // Then
//        assertNotNull(result);
//        verify(repository).save(newTask);
//    }
//
//    @Test
//    void update_shouldAllowInProgressToCompleted_whenNoIncompleteDependencies() {
//        // Given
//        task.setStatus(TaskStatus.IN_PROGRESS);
//        TaskDTO newTaskDTO = new TaskDTO(
//                1,
//                "Test Task",
//                "Test Description",
//                TaskStatus.COMPLETED,
//                50,
//                30,
//                20,
//                LocalDate.now(),
//                null,
//                new HashSet<>(),
//                new HashSet<>());
//        Task newTask = new Task().setId(1).setStatus(TaskStatus.COMPLETED).setParents(new HashSet<>());
//
//        when(repository.findById(1)).thenReturn(Optional.of(task));
//        when(mapper.toDTO(task)).thenReturn(taskDTO);
//        when(mapper.toEntity(taskDTO)).thenReturn(task);
//        when(mapper.toEntity(newTaskDTO)).thenReturn(newTask);
//        when(repository.save(newTask)).thenReturn(newTask);
//        when(mapper.toDTO(newTask)).thenReturn(newTaskDTO);
//
//        // When
//        TaskDTO result = service.update(1, newTaskDTO);
//
//        // Then
//        assertNotNull(result);
//        verify(repository).save(newTask);
//    }
//
//    @Test
//    void update_shouldPreventPendingToCompleted() {
//        // Given
//        TaskDTO newTaskDTO = new TaskDTO(
//                1,
//                "Test Task",
//                "Test Description",
//                TaskStatus.COMPLETED,
//                50,
//                30,
//                20,
//                LocalDate.now(),
//                null,
//                new HashSet<>(),
//                new HashSet<>());
//        Task newTask = new Task().setId(1).setStatus(TaskStatus.COMPLETED);
//
//        when(repository.findById(1)).thenReturn(Optional.of(task));
//        when(mapper.toDTO(task)).thenReturn(taskDTO);
//        when(mapper.toEntity(taskDTO)).thenReturn(task);
//        when(mapper.toEntity(newTaskDTO)).thenReturn(newTask);
//
//        // When & Then
//        IllegalStateException exception =
//                assertThrows(IllegalStateException.class, () -> service.update(1, newTaskDTO));
//        assertEquals(
//                "Cannot change status from BACKLOG to COMPLETED directly. Must go through IN_PROGRESS first.",
//                exception.getMessage());
//    }
//
//    @Test
//    void update_shouldPreventCompletedWithIncompleteDependencies() {
//        // Given
//        Task parentTask = new Task().setId(2).setStatus(TaskStatus.BACKLOG);
//        task.setStatus(TaskStatus.IN_PROGRESS);
//        task.getParents().add(parentTask);
//
//        TaskDTO newTaskDTO = new TaskDTO(
//                1,
//                "Test Task",
//                "Test Description",
//                TaskStatus.COMPLETED,
//                50,
//                30,
//                20,
//                LocalDate.now(),
//                null,
//                Set.of(2),
//                new HashSet<>());
//        Task newTask = new Task().setId(1).setStatus(TaskStatus.COMPLETED);
//        newTask.getParents().add(parentTask);
//
//        when(repository.findById(1)).thenReturn(Optional.of(task));
//        when(mapper.toDTO(task)).thenReturn(taskDTO);
//        when(mapper.toEntity(taskDTO)).thenReturn(task);
//        when(mapper.toEntity(newTaskDTO)).thenReturn(newTask);
//
//        // When & Then
//        IllegalStateException exception =
//                assertThrows(IllegalStateException.class, () -> service.update(1, newTaskDTO));
//        assertEquals("Cannot mark task as COMPLETE while it has incomplete dependencies", exception.getMessage());
//    }
//
//    @Test
//    void update_shouldAllowOnHoldStatus() {
//        // Given - This test might need to be adjusted based on final requirements
//        // For now, allowing ON_HOLD as it's in the enum
//        task.setStatus(TaskStatus.IN_PROGRESS);
//        TaskDTO newTaskDTO = new TaskDTO(
//                1,
//                "Test Task",
//                "Test Description",
//                TaskStatus.ON_HOLD,
//                50,
//                30,
//                20,
//                LocalDate.now(),
//                null,
//                new HashSet<>(),
//                new HashSet<>());
//        Task newTask = new Task().setId(1).setStatus(TaskStatus.ON_HOLD);
//
//        when(repository.findById(1)).thenReturn(Optional.of(task));
//        when(mapper.toDTO(task)).thenReturn(taskDTO);
//        when(mapper.toEntity(taskDTO)).thenReturn(task);
//        when(mapper.toEntity(newTaskDTO)).thenReturn(newTask);
//        when(repository.save(newTask)).thenReturn(newTask);
//        when(mapper.toDTO(newTask)).thenReturn(newTaskDTO);
//
//        // When
//        TaskDTO result = service.update(1, newTaskDTO);
//
//        // Then
//        assertNotNull(result);
//        verify(repository).save(newTask);
//    }
// }
