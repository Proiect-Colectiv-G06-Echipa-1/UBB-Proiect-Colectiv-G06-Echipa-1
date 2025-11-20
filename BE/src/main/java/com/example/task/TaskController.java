package com.example.task;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.media.ArraySchema;
import io.swagger.v3.oas.annotations.media.Content;
import io.swagger.v3.oas.annotations.media.Schema;
import io.swagger.v3.oas.annotations.responses.ApiResponse;
import io.swagger.v3.oas.annotations.responses.ApiResponses;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;
import org.springframework.security.core.annotation.AuthenticationPrincipal;
import com.example.User.User;
import jakarta.persistence.EntityNotFoundException;

@RestController
@RequestMapping("/tasks")
@RequiredArgsConstructor
public class TaskController {
    private final TaskService service;

    @Operation(summary = "Get all tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        array = @ArraySchema(schema = @Schema(implementation = TaskDTO.class)))})
    })
    @GetMapping
    public ResponseEntity<List<TaskDTO>> getAll() {
        return ResponseEntity.ok(service.getAll());
    }

    @Operation(summary =  "Get all tasks filtered by status")
        @ApiResponses(value = {
                @ApiResponse(responseCode = "200", description = "Filtered tasks retrieved successfully",
                    content = {
                        @Content(mediaType = "application/json",
                            array = @ArraySchema(schema = @Schema(implementation = TaskDTO.class)))
                    })
        })
    @GetMapping("/filter")
    public ResponseEntity<List<TaskDTO>> getByStatus(@RequestParam TaskStatus status) {
        return ResponseEntity.ok(service.getByStatus(status));
    }

    @Operation(summary = "Get the total number of tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Total count retrieved successfully",
                    content = {
                            @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Long.class))
                    })
    })
    @GetMapping("/count")
    public ResponseEntity<Long> getTotalCount() {
        return ResponseEntity.ok(service.getTotalNumberOfTasks());
    }

    @Operation(summary = "Get all completed tasks assigned to a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Completed tasks retrieved successfully",
                    content = {
                            @Content(mediaType = "application/json",
                                    array = @ArraySchema(schema = @Schema(implementation = TaskDTO.class)))}),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}/completed")
    public ResponseEntity<List<TaskDTO>> getCompletedTasksByUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getCompletedTasksFromUser(userId));
    }

    @Operation(summary = "Get the count of tasks that depend on incomplete tasks")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Count retrieved successfully",
                    content = {
                            @Content(mediaType = "application/json",
                                    schema = @Schema(implementation = Long.class))
                    })
    })
    @GetMapping("/count-blocked")
    public ResponseEntity<Long> getBlockedTaskCount() {
        return ResponseEntity.ok(service.getNumberOfDependentTasks());
    }

    @Operation(summary = "Get a task by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task retrieved successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        schema = @Schema(implementation = TaskDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Task not found"),
    })
    @GetMapping("/{id}")
    public ResponseEntity<TaskDTO> getById(@PathVariable Integer id) {
        return ResponseEntity.ok(service.get(id));
    }

    @Operation(summary = "Create a new task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "201", description = "Task created successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        schema = @Schema(implementation = TaskDTO.class))}),
            @ApiResponse(responseCode = "422", description = "Invalid task provided"),
            @ApiResponse(responseCode = "406", description = "Task depends on non-existing parents")
    })
    @PostMapping
    public ResponseEntity<TaskDTO> add(@RequestBody TaskDTO task) {
        return ResponseEntity.status(HttpStatus.CREATED).body(service.add(task));
    }

    @Operation(summary = "Update an existing task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task updated successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        schema = @Schema(implementation = TaskDTO.class))}),
            @ApiResponse(responseCode = "404", description = "Task not found"),
            @ApiResponse(responseCode = "406", description = "New task depends on non-existing parents"),
            @ApiResponse(responseCode = "409", description = "New task creates circular dependencies"),
            @ApiResponse(responseCode = "422", description = "Invalid task provided")
    })
    @PutMapping("/{id}")
    public ResponseEntity<TaskDTO> update(@PathVariable Integer id, @RequestBody TaskDTO newTask) {
        return ResponseEntity.ok(service.update(id, newTask));
    }

    @Operation(summary = "Delete a task by its id")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "204", description = "Task deleted successfully"),
    })
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> delete(@PathVariable Integer id) {
        service.delete(id);
        return ResponseEntity.noContent().build();
    }
    
    //only for admin use, for now keep it here
    @Operation(summary = "Assign a task to a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task assigned successfully"),
            @ApiResponse(responseCode = "404", description = "Task or user not found")
    })
    @PostMapping("/{taskId}/assign/{userId}")
    public ResponseEntity<Void> assignTaskToUser(@PathVariable Integer taskId, @PathVariable Long userId) {
        service.assignTaskToUser(taskId, userId);
        return ResponseEntity.ok().build();
    }

    //only for admin use, for now keep it here
    @Operation(summary = "Unassign a task from a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task unassigned successfully"),
            @ApiResponse(responseCode = "404", description = "Task or user not found")
    })
    @PostMapping("/{taskId}/unassign/{userId}")
    public ResponseEntity<Void> unassignTaskFromUser(@PathVariable Integer taskId, @PathVariable Long userId) {
        service.unassignTaskFromUser(taskId, userId);
        return ResponseEntity.ok().build();
    }

    @Operation(summary = "Get all tasks assigned to a user")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Tasks retrieved successfully",
                    content = {
                        @Content(mediaType = "application/json",
                        array = @ArraySchema(schema = @Schema(implementation = TaskDTO.class)))}),
            @ApiResponse(responseCode = "404", description = "User not found")
    })
    @GetMapping("/user/{userId}")
    public ResponseEntity<List<TaskDTO>> getTasksAssignedToUser(@PathVariable Long userId) {
        return ResponseEntity.ok(service.getTasksAssignedToUser(userId));
    }

    @Operation(summary = "Assign the current authenticated user to a task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task assigned successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task not found"),
            @ApiResponse(responseCode = "409", description = "Conflict - invalid assignment")

    })
    @PostMapping("/{taskId}/assign")
    public ResponseEntity<Void> assignTaskToUser(@PathVariable Integer taskId,
                                                 @AuthenticationPrincipal User currentUser) {
        try {
            service.assignTaskToUser(taskId, currentUser.getId());
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        }
        return ResponseEntity.ok().build();
    }
    @Operation(summary = "Unassign the current authenticated user from a task")
    @ApiResponses(value = {
            @ApiResponse(responseCode = "200", description = "Task unassigned successfully"),
            @ApiResponse(responseCode = "401", description = "Unauthorized"),
            @ApiResponse(responseCode = "404", description = "Task not found"),
            @ApiResponse(responseCode = "409", description = "Conflict - user not assigned to task")
    })
    @PostMapping("/{taskId}/unassign")
    public ResponseEntity<Void> unassignTaskFromUser(@PathVariable Integer taskId,
                                                   @AuthenticationPrincipal User currentUser) {
        try{ 
            service.unassignTaskFromUser(taskId, currentUser.getId());
        } catch (IllegalStateException e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).build();
        } catch (EntityNotFoundException e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).build();
        }
        return ResponseEntity.ok().build();
    }
}