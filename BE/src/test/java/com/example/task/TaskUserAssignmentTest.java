// package com.example.task;
//
// import static org.junit.jupiter.api.Assertions.*;
// import static org.mockito.ArgumentMatchers.any;
// import static org.mockito.Mockito.*;
//
// import com.example.User.User;
// import com.example.User.UserRepository;
// import jakarta.persistence.EntityNotFoundException;
// import java.time.LocalDate;
// import java.util.HashSet;
// import java.util.List;
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
// class TaskUserAssignmentTest {
//
//    @Mock
//    private TaskRepository taskRepository;
//
//    @Mock
//    private UserRepository userRepository;
//
//    @Mock
//    private TaskMapper taskMapper;
//
//    @Mock
//    private TaskValidator taskValidator;
//
//    @InjectMocks
//    private TaskServiceImpl taskService;
//
//    private Task task;
//    private User user;
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
//                .setParents(new HashSet<>())
//                .setAssignees(new HashSet<>());
//
//        user = new User();
//        user.setId(1L);
//        user.setUsername("testuser");
//        user.setEmail("test@example.com");
//        user.setAssignedTasks(new HashSet<>());
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
//    void assignTaskToUser_shouldAssignTaskAndChangeStatusToInProgress_whenFirstAssignee() {
//        // Given
//        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(taskRepository.save(any(Task.class))).thenReturn(task);
//
//        // When
//        taskService.assignTaskToUser(1, 1L);
//
//        // Then
//        assertTrue(task.getAssignees().contains(user));
//        assertTrue(user.getAssignedTasks().contains(task));
//        assertEquals(TaskStatus.IN_PROGRESS, task.getStatus());
//        verify(taskRepository).save(task);
//    }
//
//    @Test
//    void assignTaskToUser_shouldAssignTaskWithoutChangingStatus_whenAlreadyInProgress() {
//        // Given
//        task.setStatus(TaskStatus.IN_PROGRESS);
//        User existingUser = new User();
//        existingUser.setId(2L);
//        existingUser.setAssignedTasks(new HashSet<>());
//        task.getAssignees().add(existingUser);
//
//        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(taskRepository.save(any(Task.class))).thenReturn(task);
//
//        // When
//        taskService.assignTaskToUser(1, 1L);
//
//        // Then
//        assertTrue(task.getAssignees().contains(user));
//        assertTrue(user.getAssignedTasks().contains(task));
//        assertEquals(TaskStatus.IN_PROGRESS, task.getStatus()); // Should remain IN_PROGRESS
//        verify(taskRepository).save(task);
//    }
//
//    @Test
//    void assignTaskToUser_shouldThrowException_whenTaskNotFound() {
//        // Given
//        when(taskRepository.findById(1)).thenReturn(Optional.empty());
//
//        // When & Then
//        EntityNotFoundException exception =
//                assertThrows(EntityNotFoundException.class, () -> taskService.assignTaskToUser(1, 1L));
//        assertEquals("Task with id 1 not found", exception.getMessage());
//    }
//
//    @Test
//    void assignTaskToUser_shouldThrowException_whenUserNotFound() {
//        // Given
//        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
//        when(userRepository.findById(1L)).thenReturn(Optional.empty());
//
//        // When & Then
//        EntityNotFoundException exception =
//                assertThrows(EntityNotFoundException.class, () -> taskService.assignTaskToUser(1, 1L));
//        assertEquals("User with id 1 not found", exception.getMessage());
//    }
//
//    @Test
//    void unassignTaskFromUser_shouldUnassignTaskAndChangeStatusToBackLog_whenLastAssignee() {
//        // Given
//        task.setStatus(TaskStatus.IN_PROGRESS);
//        task.getAssignees().add(user);
//        user.getAssignedTasks().add(task);
//
//        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(taskRepository.save(any(Task.class))).thenReturn(task);
//
//        // When
//        taskService.unassignTaskFromUser(1, 1L);
//
//        // Then
//        assertFalse(task.getAssignees().contains(user));
//        assertFalse(user.getAssignedTasks().contains(task));
//        assertEquals(TaskStatus.BACKLOG, task.getStatus());
//        verify(taskRepository).save(task);
//    }
//
//    @Test
//    void unassignTaskFromUser_shouldUnassignTaskWithoutChangingStatus_whenOtherAssigneesRemain() {
//        // Given
//        task.setStatus(TaskStatus.IN_PROGRESS);
//        User anotherUser = new User();
//        anotherUser.setId(2L);
//        anotherUser.setAssignedTasks(new HashSet<>());
//
//        task.getAssignees().add(user);
//        task.getAssignees().add(anotherUser);
//        user.getAssignedTasks().add(task);
//        anotherUser.getAssignedTasks().add(task);
//
//        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(taskRepository.save(any(Task.class))).thenReturn(task);
//
//        // When
//        taskService.unassignTaskFromUser(1, 1L);
//
//        // Then
//        assertFalse(task.getAssignees().contains(user));
//        assertFalse(user.getAssignedTasks().contains(task));
//        assertTrue(task.getAssignees().contains(anotherUser));
//        assertEquals(TaskStatus.IN_PROGRESS, task.getStatus()); // Should remain IN_PROGRESS
//        verify(taskRepository).save(task);
//    }
//
//    @Test
//    void unassignTaskFromUser_shouldThrowException_whenTaskNotFound() {
//        // Given
//        when(taskRepository.findById(1)).thenReturn(Optional.empty());
//
//        // When & Then
//        EntityNotFoundException exception =
//                assertThrows(EntityNotFoundException.class, () -> taskService.unassignTaskFromUser(1, 1L));
//        assertEquals("Task with id 1 not found", exception.getMessage());
//    }
//
//    @Test
//    void unassignTaskFromUser_shouldThrowException_whenUserNotFound() {
//        // Given
//        when(taskRepository.findById(1)).thenReturn(Optional.of(task));
//        when(userRepository.findById(1L)).thenReturn(Optional.empty());
//
//        // When & Then
//        EntityNotFoundException exception =
//                assertThrows(EntityNotFoundException.class, () -> taskService.unassignTaskFromUser(1, 1L));
//        assertEquals("User with id 1 not found", exception.getMessage());
//    }
//
//    @Test
//    void getTasksAssignedToUser_shouldReturnAssignedTasks() {
//        // Given
//        Task task2 = new Task()
//                .setId(2)
//                .setTitle("Test Task 2")
//                .setStatus(TaskStatus.IN_PROGRESS)
//                .setAssignees(new HashSet<>());
//
//        user.getAssignedTasks().add(task);
//        user.getAssignedTasks().add(task2);
//
//        TaskDTO taskDTO2 = new TaskDTO(
//                2,
//                "Test Task 2",
//                null,
//                TaskStatus.IN_PROGRESS,
//                0,
//                0,
//                0,
//                LocalDate.now(),
//                null,
//                new HashSet<>(),
//                Set.of(1L));
//
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//        when(taskMapper.toDTO(task)).thenReturn(taskDTO);
//        when(taskMapper.toDTO(task2)).thenReturn(taskDTO2);
//
//        // When
//        List<TaskDTO> result = taskService.getTasksAssignedToUser(1L);
//
//        // Then
//        assertEquals(2, result.size());
//        assertTrue(result.contains(taskDTO));
//        assertTrue(result.contains(taskDTO2));
//    }
//
//    @Test
//    void getTasksAssignedToUser_shouldThrowException_whenUserNotFound() {
//        // Given
//        when(userRepository.findById(1L)).thenReturn(Optional.empty());
//
//        // When & Then
//        EntityNotFoundException exception =
//                assertThrows(EntityNotFoundException.class, () -> taskService.getTasksAssignedToUser(1L));
//        assertEquals("User with id 1 not found", exception.getMessage());
//    }
//
//    @Test
//    void getTasksAssignedToUser_shouldReturnEmptyList_whenUserHasNoAssignedTasks() {
//        // Given
//        when(userRepository.findById(1L)).thenReturn(Optional.of(user));
//
//        // When
//        List<TaskDTO> result = taskService.getTasksAssignedToUser(1L);
//
//        // Then
//        assertTrue(result.isEmpty());
//    }
// }
